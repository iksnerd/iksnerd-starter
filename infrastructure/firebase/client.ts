import {
  initializeApp,
  getApps,
  FirebaseApp,
  FirebaseOptions,
} from "@firebase/app";

import { getAuth, Auth } from "@firebase/auth";
import { getFirestore, Firestore } from "@firebase/firestore";
import { getFunctions, Functions } from "@firebase/functions";
import { getStorage, FirebaseStorage } from "@firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCsmREh7QnUsAuw09kIAAGc0AfWmqkI8Fw",
  authDomain: "iksnerd-starter.firebaseapp.com",
  projectId: "iksnerd-starter",
  storageBucket: "iksnerd-starter.firebasestorage.app",
  messagingSenderId: "362599689470",
  appId: "1:362599689470:web:b392b99e36713417a9c9af",
};

const initializeFirebaseApp = (): FirebaseApp => {
  let app: FirebaseApp;

  const apps = getApps();

  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }

  return app;
};

const app = initializeFirebaseApp();

export type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  functions: Functions;
  storage: FirebaseStorage;
};

export const firebaseClient: FirebaseClient = {
  app,
  auth: getAuth(app),
  firestore: getFirestore(app),
  functions: getFunctions(app),
  storage: getStorage(app),
};

export const projectId = firebaseConfig.projectId;
