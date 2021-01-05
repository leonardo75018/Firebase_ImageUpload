import firebase from "firebase/app"
import "firebase/storage"
import "firebase/firestore"
import "firebase/auth"




const firebaseConfig = {
    apiKey: "AIzaSyBgxm566O6z8y9Fzl4cq2g_8H_pJbxRI-k",
    authDomain: "image-e4479.firebaseapp.com",
    projectId: "image-e4479",
    storageBucket: "image-e4479.appspot.com",
    messagingSenderId: "495305305112",
    appId: "1:495305305112:web:32e5ffbc654b484070a76d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()



export { db, auth, firebase }