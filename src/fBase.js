import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbt76_Zwf7Pnx-cBDVxe6oDWnv32v9xqo",
  authDomain: "jeju-guide.firebaseapp.com",
  projectId: "jeju-guide",
  storageBucket: "jeju-guide.appspot.com",
  messagingSenderId: "350907878366",
  appId: "1:350907878366:web:2f3fcda2d82f9ab4602b4f",
  measurementId: "G-2F62EPJ668"
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();