import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Firebase Configuration Injection
const firebaseConfig = {
  apiKey: "AIzaSyB9wfUyckilfi9k1utVJPBoUTg9i62GFGM",
  authDomain: "nexus-94a75.firebaseapp.com",
  projectId: "nexus-94a75",
  storageBucket: "nexus-94a75.firebasestorage.app",
  messagingSenderId: "817223121489",
  appId: "1:817223121489:web:bf808da433ba87cbb95670",
  measurementId: "G-KGDL0VWS01"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 2. Real-time User Data Profile Stream Listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                // Inject profiles values securely into your clean HTML elements
                if(document.getElementById('welcome-name')) document.getElementById('welcome-name').innerText = userData.fullName || 'User';
                if(document.getElementById('my-ref-code')) document.getElementById('my-ref-code').innerText = userData.referralId || '--';
                if(document.getElementById('stat-today')) document.getElementById('stat-today').innerText = "₹" + (userData.todayEarning ?? 0);
                
                // Handling your multiple total earning element targets
                const totalElements = document.querySelectorAll('#stat-total');
                totalElements.forEach(el => el.innerText = "₹" + (userData.totalEarning ?? 0));
                
                if(document.getElementById('stat-done')) document.getElementById('stat-done').innerText = userData.completed ?? 0;
                if(document.getElementById('stat-pending')) document.getElementById('stat-pending').innerText = userData.pending ?? 0;
                if(document.getElementById('wallet-balance')) document.getElementById('wallet-balance').innerText = "₹" + (userData.walletBalance ?? 0);
                
                // Drawer menu metrics text sync
                if(document.getElementById('menu-name')) document.getElementById('menu-name').innerText = userData.fullName || 'User';
                if(document.getElementById('menu-email')) document.getElementById('menu-email').innerText = userData.email || '---';
            }
        } catch (error) {
            console.error("Error connecting data network node streams:", error);
        }
    } else {
        // Safe security kick -> Direct back to auth block if user state token drops
        window.location.href = "login.html";
    }
});

// 3. Layout Tab Routing Controller Engine (Binds directly to HTML onclick global layer)
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const activeTab = document.getElementById('tab-' + tabId);
    if(activeTab) activeTab.classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) activeBtn.classList.add('active');
    
    toggleDrawer(false);
};

// 4. Sliding Profile Drawer Animators (Tailwind Adaptive Fixes)
function toggleDrawer(open) {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    if (drawer && overlay) {
        if (open) {
            overlay.classList.add('opacity-100');
            overlay.classList.remove('pointer-events-none');
            drawer.classList.remove('-translate-x-full');
        } else {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('pointer-events-none');
            drawer.classList.add('-translate-x-full');
        }
    }
}

// 5. Functional Action Event Wireframes
if(document.getElementById('menu-open-btn')) {
    document.getElementById('menu-open-btn').addEventListener('click', () => toggleDrawer(true));
}
if(document.getElementById('menu-overlay')) {
    document.getElementById('menu-overlay').addEventListener('click', () => toggleDrawer(false));
}

// Referral Link Array Copier Replicator
if(document.getElementById('copy-link-btn')) {
    document.getElementById('copy-link-btn').addEventListener('click', () => {
        const refElement = document.getElementById('my-ref-code');
        const currentRef = refElement ? refElement.innerText : '--';
        const copyTarget = window.location.origin + window.location.pathname + "?ref=" + currentRef;
        navigator.clipboard.writeText(copyTarget).then(() => {
            alert("Referral Link Array Copied 🚀");
        });
    });
}

// Disconnect Sign Out Workflow Trigger
if(document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = "login.html";
        });
    });
}
