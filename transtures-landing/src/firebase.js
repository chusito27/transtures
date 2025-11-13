import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDsDaI5TdYKqFdyJAfkBTB3XDNWagxiU14",
  authDomain: "project-3530729558457771227.firebaseapp.com",
  databaseURL: "https://project-3530729558457771227.firebaseio.com",
  projectId: "project-3530729558457771227",
  storageBucket: "project-3530729558457771227.firebasestorage.app",
  messagingSenderId: "963951832054",
  appId: "1:963951832054:web:ff51fea82608bf0e65f5d7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
