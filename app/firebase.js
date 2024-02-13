// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwl26yOISKuekJwzwOTyxzSxtJVAA7beU",
  authDomain: "mainlandmotors-8f47d.firebaseapp.com",
  projectId: "mainlandmotors-8f47d",
  storageBucket: "mainlandmotors-8f47d.appspot.com",
  messagingSenderId: "1098784303302",
  appId: "1:1098784303302:web:133b7ef24eece39fa40fc7",
  measurementId: "G-BCNEYMFF3W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

export { app, storage };
