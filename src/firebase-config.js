import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBSoePRBnTmLlwB4FWwmxs0u1ARBKtYj-c",
  authDomain: "drophouse-v2.firebaseapp.com",
  projectId: "drophouse-v2",
  storageBucket: "drophouse-v2.appspot.com",
  messagingSenderId: "490765038134",
  appId: "1:490765038134:web:e56c09f7b68ae535f1de97",
  measurementId: "G-LJB15Y67DW"
};

const app = initializeApp(firebaseConfig);

export default app;