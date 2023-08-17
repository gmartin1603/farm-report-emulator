var admin = require("firebase-admin");

var serviceAccount = require("../private/farm-report-86ac2-firebase-adminsdk-iojy6-b17a0bea38.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
