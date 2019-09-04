import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

import key from "./key.json"

const firebaseConfig = key

const app = firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export { app, db, firebase }
