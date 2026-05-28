// src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth, db, loginWithGoogle, logoutUser } from './config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [tasksList, setTasksList] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(true);

  // 1. Auth Aur Live User Data State Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Live data listening from Firestore
        const unsubscribeDoc = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
        });
        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. Python Server Se Tasks Load Karna
  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/tasks')
        .then(res => res.json())
        .then(data => {
          setTasksList(data);
          setLoadingTasks(false);
        })
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, [user]);

  // 3. Login Trigger
  const handleLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    try {
      await loginWithGoogle(refCode);
    } catch (err) {
      alert("Login Failed!");
    }
  };

  // 4. Withdraw Form Submission
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || !upiId) return alert("All fields are required!");
    if (withdrawAmount > userData?.walletBalance) return alert("Insufficient Balance!");

    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: withdrawAmount, upiId: upiId })
      });

      const result = await response.json();
      if (response.ok) {
        alert("Success! Request sent to Admin Panel.");
        setWithdrawAmount('');
        setUpiId('');
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  // Copy Referral Link Function
  const copyInviteLink = () => {
    if (!userData) return;
    const link = `${window.location.origin}?ref=${userData.referralCode}`;
    navigator.clipboard.writeText(link);
    alert("Invite Link Copied to Clipboard! 🚀");
  };

  // --- SCREEN 1: LOGIN VIEW (Agar user logged in nahi hai) ---
  if (!user || !userData) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '32px', color: '#6366f1', fontWeight: '800', marginBottom: '10px' }}>NEXUS</h1>
          <p style={{ color: '#8a8f98', fontSize: '14px', marginBottom: '40px' }}>Refer, Complete Tasks & Earn Real Cash</p>
          <button className="neon-btn" onClick={handleLogin}>⚡ Sign In With Google</button>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: MAIN DASHBOARD VIEW ---
  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="premium-header">
        <button className="icon-btn" onClick={logoutUser}>🚪</button> {/* Logout on menu click */}
        <div className="header-title"><span style={{ fontWeight: 700, letterSpacing: '1px', color: '#6366f1' }}>NEXUS</span></div>
        <button className="icon-btn" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={userData.profilePic} alt="Profile" className="profile-img" />
        </button>
      </header>

      {/* MAIN LAYOUT */}
      <main className="main-content">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <div className="welcome-section">
              <h2>Hey, {userData.name}! 👋</h2>
              <p>Your Referral Code: <strong style={{color: '#6366f1'}}>{userData.referralCode}</strong></p>
            </div>

            <div className="stats-grid">
              <div className="premium-card card-earning"><span className="card-label">Today Earning</span><span className="card-value text-green">₹{userData.todayEarning}</span></div>
              <div className="premium-card card-total"><span className="card-label">Total Earning</span><span className="card-value text-purple">₹{userData.totalEarning}</span></div>
              <div className="premium-card"><span className="card-label">Completed Tasks</span><span className="card-value text-blue">{userData.completedTasks}</span></div>
              <div className="premium-card"><span className="card-label">Pending Tasks</span><span className="card-value text-amber">{userData.pendingTasks}</span></div>
            </div>

            <div className="section-card">
              <h3>🚀 Invite Friend & Earn</h3>
              <p style={{ color: '#8a8f98', fontSize: '13px', marginBottom: '15px' }}>Share your link and earn real cash rewards instantly.</p>
              <button className="neon-btn" onClick={copyInviteLink} style={{ padding: '10px', fontSize: '13px' }}>Copy Invite Link</button>
            </div>
          </>
        )}

        {/* TASKS TAB */}
        {activeTab === 'tasks' && (
          <>
            <div className="welcome-section"><h2>🎯 Available Tasks</h2><p>Complete tasks to load wallet balance.</p></div>
            {loadingTasks ? <p style={{color: '#8a8f98'}}>Loading tasks...</p> : 
              tasksList.map(task => (
                <div className="task-card" key={task.id} onClick={() => window.open(task.link, '_blank')}>
                  <div className="task-info"><h4>{task.title}</h4><p>{task.desc}</p></div>
                  <div className="task-reward">+₹{task.reward}</div>
                </div>
            ))}
          </>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <>
            <div className="welcome-section"><h2>📊 My Activity</h2><p>Your history log.</p></div>
            <div className="section-card" style={{textAlign: 'center', color: '#8a8f98'}}>Account is active and verified securely.</div>
          </>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <>
            <div className="wallet-balance-box">
              <span className="card-label" style={{color: 'rgba(255,255,255,0.6)'}}>Withdrawable Balance</span>
              <h1 style={{fontSize: '36px', fontWeight: '700', marginTop: '5px'}} className="text-green">₹{userData.walletBalance}</h1>
            </div>

            <div className="section-card">
              <h3 style={{marginBottom: '15px'}}>💸 Request Cash Out</h3>
              <form onSubmit={handleWithdrawSubmit}>
                <div className="premium-input-group"><label>Amount (₹)</label><input type="number" className="premium-input" placeholder="Min ₹100" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}/></div>
                <div className="premium-input-group"><label>UPI ID</label><input type="text" className="premium-input" placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)}/></div>
                <button type="submit" className="neon-btn">Submit Withdraw Request</button>
              </form>
            </div>
          </>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><span className="nav-icon">🏠</span><span>Home</span></button>
        <button className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}><span className="nav-icon">🎯</span><span>Tasks</span></button>
        <button className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}><span className="nav-icon">📊</span><span>Activity</span></button>
        <button className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}><span className="nav-icon">💼</span><span>Wallet</span></button>
      </nav>
    </div>
  );
}

export default App;
