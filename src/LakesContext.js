import React, { createContext, useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const LakesContext = createContext();

const LakesProvider = ({ children }) => {
  const [lakes, setLakes] = useState([]);

  useEffect(() => {
    const lakesCollection = collection(db, 'lakes');
    const unsubscribe = onSnapshot(lakesCollection, (snapshot) => {
      const lakesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLakes(lakesData);
    });

    // Cleanup function to unsubscribe from the Firestore listener
    return () => unsubscribe();
  }, []);

  return (
    <LakesContext.Provider value={{ lakes, setLakes }}>
      {children}
    </LakesContext.Provider>
  );
};

export { LakesContext, LakesProvider };
