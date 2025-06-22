import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDbt76_Zwf7Pnx-cBDVxe6oDWnv32v9xqo',
  authDomain: 'jeju-guide.firebaseapp.com',
  projectId: 'jeju-guide',
  storageBucket: 'jeju-guide.appspot.com',
  messagingSenderId: '350907878366',
  appId: '1:350907878366:web:2f3fcda2d82f9ab4602b4f',
  measurementId: 'G-2F62EPJ668',
};

const app = initializeApp(firebaseConfig);

export const authService = getAuth(app);
export const dbService = getFirestore(app);
export const storageService = getStorage(app);

// For backward compatibility
export const firebaseInstance = { auth: authService };
