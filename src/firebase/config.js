
// Firebase configuration for Daily Mission Compass
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDalBjXY37we6Nl4ilWgmCBmurd1SNq_QA",
  authDomain: "explorewithtm-1042.firebaseapp.com",
  projectId: "explorewithtm-1042",
  storageBucket: "explorewithtm-1042.appspot.com",
  messagingSenderId: "30909668910",
  appId: "1:30909668910:web:3fa627f17c9d332b9289bf",
  measurementId: "G-44G2HL9XSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
