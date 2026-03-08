import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnm1Xjj1MfanCtjSB9gvyr45VAvgElmCg",
  authDomain: "aistudy-f4861.firebaseapp.com",
  projectId: "aistudy-f4861",
  storageBucket: "aistudy-f4861.firebasestorage.app",
  messagingSenderId: "518771370655",
  appId: "1:518771370655:web:df9a7b8402d1126ac7d0aa",
  measurementId: "G-QEZM2W10QX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;