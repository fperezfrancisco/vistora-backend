const admin = require("firebase-admin");

//const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID, // <-- add this line
  });
}

const db = admin.firestore();

module.exports = admin;
module.exports.db = db;
