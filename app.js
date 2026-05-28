// app.js - Structural System Code Only

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const activeTab = document.getElementById('tab-' + tabId);
    if(activeTab) activeTab.classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) activeBtn.classList.add('active');
    
    toggleDrawer(false);
};

function toggleDrawer(open) {
    const drawer = document.getElementById('menu-drawer');
    const overlay = document.getElementById('menu-overlay');
    if (drawer && overlay) {
        if (open) {
            overlay.classList.add('open');
            drawer.classList.add('open');
        } else {
            overlay.classList.remove('open');
            drawer.classList.remove('open');
        }
    }
}

document.getElementById('menu-open-btn').addEventListener('click', () => toggleDrawer(true));
document.getElementById('menu-overlay').addEventListener('click', () => toggleDrawer(false));

document.getElementById('copy-link-btn').addEventListener('click', () => {
    const refElement = document.getElementById('my-ref-code');
    const currentRef = refElement ? refElement.innerText : '--';
    const copyTarget = window.location.origin + window.location.pathname + "?ref=" + currentRef;
    navigator.clipboard.writeText(copyTarget).then(() => {
        alert("Referral Link Array Copied 🚀");
    });
});
