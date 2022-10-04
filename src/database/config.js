// database/firebaseDb.js
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"



const firebaseConfig = {
    apiKey: "AIzaSyCkqNdcPNioVnTOTjoXNHFmZ_KJBir7G7E",
  authDomain: "authentication-project-5cf48.firebaseapp.com",
  databaseURL: "https://authentication-project-5cf48-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "authentication-project-5cf48",
  storageBucket: "authentication-project-5cf48.appspot.com",
  messagingSenderId: "371021755965",
  appId: "1:371021755965:web:dea0f0d916f67cccae5c54"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, firebase } 