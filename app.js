// app.js - Layout Interaction Controllers

// 1. TAB SELECTION ROUTER
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const activeTab = document.getElementById('tab-' + tabId);
    if(activeTab) activeTab.classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) activeBtn.classList.add('active');
    
    toggleDrawer(false);
};

// 2. SLIDING DRAWER UI CONTROLLER
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

// Event Bindings for Drawer Engine
document.getElementById('menu-open-btn').addEventListener('click', () => toggleDrawer(true));
document.getElementById('menu-overlay').addEventListener('click', () => toggleDrawer(false));

// External Live Support Web Hook Redirect
document.getElementById('menu-support-btn').addEventListener('click', () => {
    window.open('https://t.me/your_support', '_blank');
});

// 3. SECURE CLIPBOARD ARRAY HANDLER
document.getElementById('copy-link-btn').addEventListener('click', () => {
    const copyTarget = window.location.origin + window.location.pathname + "?ref=NEX777K";
    navigator.clipboard.writeText(copyTarget).then(() => {
        alert("Referral Link Array Copied 🚀");
    }).catch(() => {
        alert("Failed to access hardware clipboard device.");
    });
});

// 4. TRANSACTIONA DISPATCHER REDEMPTION
document.getElementById('withdraw-submit-btn').addEventListener('click', () => {
    const amt = document.getElementById('withdraw-amount').value;
    const upi = document.getElementById('withdraw-upi').value;
    if(!amt || !upi) return alert("Please fill all target string fields!");
    alert(`Request routing executed: ₹${amt} -> ${upi}`);
});
