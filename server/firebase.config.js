const { initializeApp } = require("firebase/app");
const {
  getStorage,
  uploadBytes,
  ref,
  getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDn7FElsSPg-ikrqsasLZQdSjJNOKz8OeQ",
  authDomain: "blog-cf723.firebaseapp.com",
  projectId: "blog-cf723",
  storageBucket: "blog-cf723.appspot.com",
  messagingSenderId: "353118927100",
  appId: "1:353118927100:web:066b59491674f5da22bf79",
};

const Firebaseapp = initializeApp(firebaseConfig);
const storage = getStorage();
const storageRef = ref(storage);

module.exports = { storage, uploadBytes, ref, getDownloadURL };