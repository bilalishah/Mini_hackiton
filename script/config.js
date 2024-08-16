import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-KtWQ2pQ9lv3IECdxVzPAolUF1Thrj68",
  authDomain: "blogging-app-ali.firebaseapp.com",
  projectId: "blogging-app-ali",
  storageBucket: "blogging-app-ali.appspot.com",
  messagingSenderId: "286636422437",
  appId: "1:286636422437:web:537f8a153f1e4726e196cc",
  measurementId: "G-SPK1DEWVNF" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);