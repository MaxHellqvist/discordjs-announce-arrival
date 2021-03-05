import * as firebase from "firebase-admin";

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const admin = firebase.initializeApp({credential: firebase.credential.cert(firebaseConfig as any),   databaseURL: process.env.DATABASE_URL});

const dbVersion = "v1";
const deploymentEnvironment = process.env.DEPLOY_ENVIRONMENT;
const getDbRoot = () => {
    return admin.database().ref(`${dbVersion}/${deploymentEnvironment}/`);
}
export const db = getDbRoot();