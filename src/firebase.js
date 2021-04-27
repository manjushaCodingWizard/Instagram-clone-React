import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAZToKQs3oxOFhi44bW-DpB46_3zKXwX2c",
  authDomain: "instagram-clone-react-87688.firebaseapp.com",
  projectId: "instagram-clone-react-87688",
  storageBucket: "instagram-clone-react-87688.appspot.com",
  messagingSenderId: "410976429866",
  appId: "1:410976429866:web:ee7aa413b222ca5f976053",
  measurementId: "G-32QHBL7RKL"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};
//export default db;