import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBUo-MMxyf66hss3yDJPEwuUl992n8p95Y",
  authDomain: "hrm-app-46c28.firebaseapp.com",
  projectId: "hrm-app-46c28",
  storageBucket: "hrm-app-46c28.appspot.com",
  messagingSenderId: "780821006420",
  appId: "1:780821006420:web:da7cca92ea9ce9e6d805c1",
  measurementId: "G-85Z9Y7MBNG"
  };

const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
export const auth = getAuth(app)
export default app
