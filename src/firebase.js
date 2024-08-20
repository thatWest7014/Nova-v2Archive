const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, update, remove } = require('firebase/database');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFa5h21SXxWQFDyeS2HgujroL8iRplRFg",
  authDomain: "qhdg-multi.firebaseapp.com",
  databaseURL: "https://qhdg-multi-default-rtdb.firebaseio.com",
  projectId: "qhdg-multi",
  storageBucket: "qhdg-multi.appspot.com",
  messagingSenderId: "306512628988",
  appId: "1:306512628988:web:4fed3952c72db88a3b9b79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db, ref, set, get, update, remove };
