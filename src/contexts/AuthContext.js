import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentFirm, setCurrentFirm] = useState();
  const [admin, setAdmin] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserData(user) {
    const ref = doc(db, "/user", user.uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists) {
      setCurrentFirm(docSnap.data().firm_id);
      setAdmin(docSnap.data().admin);
    }

    return currentFirm;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      getUserData(user);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  const value = {
    currentUser,
    currentFirm,
    admin,
    login,
    logout,
    resetPassword,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
