import firebase from "firebase/compat/app";
//auth
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBkFEqbANlyHLvy_4ZV2wqaB_is-Ic1O7g",
	authDomain: "clone-7aa59.firebaseapp.com",
	projectId: "clone-7aa59",
	storageBucket: "clone-7aa59.appspot.com",
	messagingSenderId: "723166482319",
	appId: "1:723166482319:web:16c1fdb52879b1df9f85fa",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();
