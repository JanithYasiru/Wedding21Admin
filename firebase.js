import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// YOUR FIREBASE CONFIG


const firebaseConfig = {
    apiKey: "AIzaSyA_RTGG4VV_MuS3UDyBMqpQ5palZXj8Vbw",
    authDomain: "senuriandjanithwedding21.firebaseapp.com",
    databaseURL: "https://senuriandjanithwedding21-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "senuriandjanithwedding21",
    storageBucket: "senuriandjanithwedding21.firebasestorage.app",
    messagingSenderId: "952364242139",
    appId: "1:952364242139:web:e2c84fb7122bbf31eb68fe",
    measurementId: "G-BFE6VENKK4"
  };





const app = initializeApp(firebaseConfig);



const db = getFirestore(app);



export {db};
