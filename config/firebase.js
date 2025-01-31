// config/firebase.js
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'cryptodb-5de67',
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  
    clientEmail: 'firebase-adminsdk-fbsvc@cryptodb-5de67.iam.gserviceaccount.com',
  }),
});

const db = admin.firestore();

module.exports = db;
