// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot, collection, getDocs, addDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REPLACE WITH REAL ACCOUNT FIREBASE CONFIG BLOCK
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let localUserRecord = null;

// 1. CLEAN AUTO STATE SYNCHRONIZATION (No Popups)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Safe Switch Layers
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app-wrapper').classList.remove('hidden');

        // Setup Firestore Data Listener Node
        onSnapshot(doc(db, "users", user.uid), (snap) => {
            if (snap.exists()) {
                localUserRecord = snap.data();
                renderMetrics(user, localUserRecord);
            } else {
                provisionNewProfile(user);
            }
        });
        syncAvailableTasks();
    } else {
        // Show clean Auth layer if unauthenticated
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app-wrapper').classList.add('hidden');
    }
});

// TRIGGER SYSTEM GATE LOGIN ON INTENT BUTTON CLICK ONLY
document.getElementById('google-login-btn').addEventListener('click', async () => {
    try { 
        await signInWithPopup(auth, provider); 
    } catch (e) { 
        alert("Authentication Process Faulted. Retry."); 
    }
});

// TAB LAYOUT ACTION SWITCHER
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('btn-' + tabId).classList.add('active');
    toggleDrawer(false);
};

// SLIDING PANEL MECHANICS
function toggleDrawer(open) {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    if (open) {
        overlay.classList.add('open');
        drawer.classList.add('open');
    } else {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
    }
}
document.getElementById('menu-open-btn').addEventListener('click', () => toggleDrawer(true));
document.getElementById('menu-overlay').addEventListener('click', () => toggleDrawer(false));

// GENERATE NEW ENROLLED USER PROFILES
async function provisionNewProfile(user) {
    const urlParams = new URLSearchParams(window.location.search);
    const sponsorRef = urlParams.get('ref') || null;
    const trackingCode = user.displayName.substring(0,3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, name: user.displayName, email: user.email, profilePic: user.photoURL,
        referralCode: trackingCode, referredBy: sponsorRef,
        walletBalance: 0, todayEarning: 0, totalEarning: 0, completedTasks: 0, pendingTasks: 0
    });
}

// FORMAT METRICS INTERFACE DATA
function renderMetrics(authObj, dbObj) {
    document.getElementById('header-avatar').src = authObj.photoURL;
    document.getElementById('menu-avatar').src = authObj.photoURL;
    document.getElementById('menu-name').innerText = authObj.displayName;
    document.getElementById('menu-email').innerText = authObj.email;
    document.getElementById('welcome-name').innerText = authObj.displayName.split(' ')[0];
    document.getElementById('my-ref-code').innerText = dbObj.referralCode;
    
    document.getElementById('stat-today').innerText = "₹" + dbObj.todayEarning;
    document.getElementById('stat-total').innerText = "₹" + dbObj.totalEarning;
    document.getElementById('stat-done').innerText = dbObj.completedTasks;
    document.getElementById('stat-pending').innerText = dbObj.pendingTasks;
    document.getElementById('wallet-balance').innerText = "₹" + dbObj.walletBalance;
}

// SYNC LIVE JOBS STREAM DATA
async function syncAvailableTasks() {
    const snap = await getDocs(collection(db, "tasks"));
    const container = document.getElementById('tasks-list');
    container.innerHTML = "";
    snap.forEach(doc => {
        const item = doc.data();
        container.innerHTML += `
            <div onclick="window.open('${item.link}', '_blank')" class="task-row">
                <div>
                    <h4 class="text-xs font-semibold mb-0.5"><i class="fa-solid fa-arrow-up-right-from-square text-indigo-400 mr-1.5 text-[10px]"></i> ${item.title}</h4>
                    <p class="text-[10px] text-gray-500">${item.desc}</p>
                </div>
                <div class="task-reward">+₹${item.reward}</div>
            </div>`;
    });
}

// WITHDRAW REQUEST DISPATCHER
document.getElementById('withdraw-submit-btn').addEventListener('click', async () => {
    const amt = parseInt(document.getElementById('withdraw-amount').value);
    const upi = document.getElementById('withdraw-upi').value;

    if (!amt || !upi) return alert("Please fill all details!");
    if (amt > localUserRecord.walletBalance) return alert("Insufficient account funds.");

    await addDoc(collection(db, "withdraw_requests"), {
        uid: auth.currentUser.uid, name: auth.currentUser.displayName,
        amount: amt, upiId: upi, status: "PENDING", createdAt: serverTimestamp()
    });

    alert("Redemption Request Route Successful!");
    document.getElementById('withdraw-amount').value = "";
    document.getElementById('withdraw-upi').value = "";
});

// DISCONNECT DISPATCH
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));

// REGISTER REFERRAL LINK LINKAGE RUNNER
document.getElementById('copy-link-btn').addEventListener('click', () => {
    const link = window.location.origin + window.location.pathname + "?ref=" + localUserRecord.referralCode;
    navigator.clipboard.writeText(link);
    alert("Referral Endpoint Copied onto Local Clipboard Buffer.");
});
