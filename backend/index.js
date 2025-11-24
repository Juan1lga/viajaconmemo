const functions = require('firebase-functions');
const app = require('./server');

exports.api = functions.region('us-central1').https.onRequest(app);