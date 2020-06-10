const firebase = require('firebase');
const config = {
    apiKey: "AIzaSyBUr1AYOJvBj-zYrAx55dGF24tp943ZAn8",
    authDomain: "blickapi.firebaseapp.com",
    databaseURL: "https://blickapi.firebaseio.com",
    projectId: "blickapi",
    storageBucket: "blickapi.appspot.com",
    messagingSenderId: "528868562930",
    appId: "1:528868562930:web:f14a37136306c0f917fd6b",
    measurementId: "G-JSWTQHXN0T"
};
const fire = firebase.initializeApp(config);
export default fire;