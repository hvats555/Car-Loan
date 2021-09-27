// firebase hosting default is set to public -> make it build
import { initializeApp } from "firebase/app";
import { getFirestore, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApp = initializeApp({
  apiKey: "AIzaSyANiihfO4QcJjQMNoVoJfnxFW_u-gQDxEE",
  authDomain: "cars-development-1f062.firebaseapp.com",
  projectId: "cars-development-1f062",
  storageBucket: "cars-development-1f062.appspot.com",
  messagingSenderId: "527911356370",
  appId: "1:527911356370:web:4fa2eface3de63cdde2a0b"
});

const db = getFirestore(firebaseApp);
export const auth = getAuth();

export default db;

