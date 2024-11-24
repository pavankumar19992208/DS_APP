// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCFt9HlfVIVhr_UZ2AOwI-AjgFofgY57aw",
    authDomain: "p2ptechworks-dafcf.firebaseapp.com",
    projectId: "p2ptechworks-dafcf",
    storageBucket: "p2ptechworks-dafcf.appspot.com",
    messagingSenderId: "757644545529",
    appId: "1:757644545529:web:922c4df7338d70539b0128",
    measurementId: "G-5FQ7V156BQ"
  };
  

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };