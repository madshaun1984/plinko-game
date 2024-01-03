/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { initializeApp } from 'firebase/app'
import { useDeviceLanguage, getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: 'plinko-game-76aba',
  storageBucket: 'plinko-game-76aba.appspot.com',
  databaseURL:
    'https://plinko-game-76aba-default-rtdb.europe-west1.firebasedatabase.app',
  messagingSenderId: '437283032710',
  appId: import.meta.env.VITE_FIREBASE_APP_ID!,
  measurementId: 'G-LR8HTM5502'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const database = getDatabase(app)

useDeviceLanguage(auth)
