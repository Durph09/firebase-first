
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyC-nDIOkEzhi7PO18g9xLZipV9gYnQXswE",
  authDomain: "fir-course-1cdaa.firebaseapp.com",
  projectId: "fir-course-1cdaa",
  storageBucket: "fir-course-1cdaa.appspot.com",
  messagingSenderId: "1054780988363",
  appId: "1:1054780988363:web:637442c32fe456bf91344e",
  measurementId: "G-T025QEL0FP"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider;
export const db = getFirestore(app)
export const storage = getStorage(app);
