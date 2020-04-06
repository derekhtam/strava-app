import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBERcuTDJSuVJZxOynRJh_3oZJQ8veScJA",
  authDomain: "strava-3dcc8.firebaseapp.com",
  databaseURL: "https://strava-3dcc8.firebaseio.com",
  projectId: "strava-3dcc8",
  storageBucket: "strava-3dcc8.appspot.com",
  messagingSenderId: "561434670560",
  appId: "1:561434670560:web:fb57e3e4d0c662c45d2785",
  measurementId: "G-9W5CLRS4F5"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  signIntoFirebase(token) {
    return this.auth.signInWithCustomToken(token).catch(function(error) {
      // Handle Errors here.
      var errorMessage = error.message;
      console.error("Error Message: ", errorMessage);
      // ...
    });
  }

  logout() {
    return this.auth.signOut();
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }
}

export default new Firebase();
