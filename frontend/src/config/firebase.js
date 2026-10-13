// Optional Firebase push notifications
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messaging = null;

if (firebaseConfig.apiKey) {
  // Initialize Firebase only if keys exist
  import('firebase/app')
    .then(({ initializeApp }) => {
      const app = initializeApp(firebaseConfig);
      import('firebase/messaging')
        .then(({ getMessaging }) => {
          messaging = getMessaging(app);
        });
    });
}

export default messaging;