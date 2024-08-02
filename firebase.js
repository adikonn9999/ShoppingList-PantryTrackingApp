import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyCsV2vqlvGGrDRWGvCvBSdc8MKN-lbZ-P4",

  authDomain: "pantrytracker-78a7f.firebaseapp.com",

  projectId: "pantrytracker-78a7f",

  storageBucket: "pantrytracker-78a7f.appspot.com",

  messagingSenderId: "189110109510",

  appId: "1:189110109510:web:308b0112b181c536305147",

  measurementId: "G-XR35SVPN7H"

};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
