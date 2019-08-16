import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAX2aaruoCEKwu0GlQCRQ9ILCgUa3ubXMk",
  authDomain: "biomexit.firebaseapp.com",
  databaseURL: "https://biomexit.firebaseio.com",
  projectId: "biomexit",
  storageBucket: "biomexit.appspot.com",
  messagingSenderId: "856819992418",
  appId: "1:856819992418:web:0340ad2c2a298988"
}

const app = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { app, db, firebase }
