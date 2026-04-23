import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

export interface SuspectRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  offence: string;
  arrestDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  officerInCharge: string;
  createdAt?: any;
}

interface AuditLog {
  id: string;
  action: 'CREATE' | 'DELETE' | 'UPDATE' | 'LOGIN';
  entityId: string;
  entityName: string;
  officerEmail: string;
  timestamp: string;
}

interface DataContextType {
  records: SuspectRecord[];
  auditLogs: AuditLog[];
  addRecord: (record: Omit<SuspectRecord, 'id'>) => Promise<void>;
  deleteRecord: (id: string, name: string) => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<SuspectRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync Suspects
    const qSuspects = query(collection(db, "suspects"), orderBy("arrestDate", "desc"));
    const unsubscribeSuspects = onSnapshot(qSuspects, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuspectRecord));
        setRecords(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("FIRESTORE_ERROR: SUSPECTS_FETCH_FAILED. This usually happens if Firestore Rules are not set to allow access. Please check the console instructions.", error);
        setIsLoading(false);
      }
    );

    // Sync Audit Logs (Limit to last 50 for performance)
    const qLogs = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
    const unsubscribeLogs = onSnapshot(qLogs, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
        setAuditLogs(data);
      },
      (error) => {
        console.error("FIRESTORE_ERROR: AUDIT_LOGS_FETCH_FAILED. Check rules.", error);
      }
    );


    return () => {
      unsubscribeSuspects();
      unsubscribeLogs();
    };
  }, []);

  const addRecord = async (record: Omit<SuspectRecord, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "suspects"), {
        ...record,
        createdAt: new Date().toISOString()
      });

      // Automated Audit Logging
      await addDoc(collection(db, "audit_logs"), {
        action: 'CREATE',
        entityId: docRef.id,
        entityName: record.name,
        officerEmail: auth.currentUser?.email || 'System',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const deleteRecord = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, "suspects", id));

      // Automated Audit Logging
      await addDoc(collection(db, "audit_logs"), {
        action: 'DELETE',
        entityId: id,
        entityName: name,
        officerEmail: auth.currentUser?.email || 'System',
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e;
    }
  };

  return (
    <DataContext.Provider value={{ records, auditLogs, addRecord, deleteRecord, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};


export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
