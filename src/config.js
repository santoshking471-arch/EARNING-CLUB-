// src/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, runTransaction } from "firebase/firestore";

// Apne actual credentials se badlein
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Referral Code Generator
const generateReferralCode = (name) => {
  const prefix = name ? name.substring(0, 3).toUpperCase() : "REF";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
};

// Google Login + Referral Logic
export const loginWithGoogle = async (incomingReferralCode = null) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Agar User pehli baar aaya hai (Sign Up)
    if (!userSnap.exists()) {
      const myNewReferralCode = generateReferralCode(user.displayName);

      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        referralCode: myNewReferralCode,
        referredBy: incomingReferralCode || null,
        walletBalance: 0, 
        todayEarning: 0,
        totalEarning: 0,
        completedTasks: 0,
        pendingTasks: 0,
        createdAt: new Date()
      });

      // AGAR KISI KE LINK SE AAYA HAI: Toh us sponsor ko reward do
      if (incomingReferralCode) {
        // Puraani id dhoondhein jiska yeh code hai aur use ₹50 reward dein
        // Note: Real production me is transaction ko safe rakhne ke liye aap Firestore rules ya functions use kar sakte hain.
        console.log("Referred by: ", incomingReferralCode);
      }
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);
