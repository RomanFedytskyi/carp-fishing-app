import React, { createContext, useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const LakesContext = createContext();

const LakesProvider = ({ children }) => {
  const [lakes, setLakes] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const lakesCollection = collection(
      db,
      "users",
      currentUser.uid,
      "userLakes"
    );

    const unsubscribe = onSnapshot(lakesCollection, (snapshot) => {
      const lakesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLakes(lakesData);
    });

    // Cleanup function to unsubscribe from the Firestore listener
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <LakesContext.Provider value={{ lakes, setLakes }}>
      {children}
    </LakesContext.Provider>
  );
};

export { LakesContext, LakesProvider };
