// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5XvH5EYlKZO8OLw98WdgI5a24857L5XE",
  authDomain: "hack-the-6ix-d3107.firebaseapp.com",
  projectId: "hack-the-6ix-d3107",
  storageBucket: "hack-the-6ix-d3107.appspot.com",
  messagingSenderId: "274613441985",
  appId: "1:274613441985:web:d849dfdfe6da1f26140b40",
  measurementId: "G-THR20MM3KN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
