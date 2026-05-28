// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Wallet state handling ke liye inputs
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');

  // Dummy App Data (Baad me Python aur Firebase API se match hoga)
  const userData = {
    name: "Santosh Kushwaha",
    todayEarning: 150,
    totalEarning: 4500,
    walletBalance: 1250, // Jo withdrawable hai
    completedTasks: 12,
    pendingTasks: 3,
    profilePic: "https://via.placeholder.com/150"
  };

  const tasksList = [
    { id: 1, title: "Subscribe YouTube Channel", desc: "Channel subscribe karein aur screenshot submit karein", reward: 10 },
    { id: 2, title: "Download Partner App", desc: "App install karke account register karein", reward: 25 },
    { id: 3, title: "Join Telegram Group", desc: "Official community group join karein", reward: 5 },
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if(!withdrawAmount || !upiId) return alert("Please fill all details!");
    if(withdrawAmount > userData.walletBalance) return alert("Insufficient Balance!");
    
    alert(`Withdraw request submitted for ₹${withdrawAmount} via UPI: ${upiId}`);
    // Yahan humara Python backend fetch hit karega baad me
  };

  return (
    <div className="app-container">
      
      {/* HEADER */}
      <header className="premium-header">
        <button className="icon-btn">☰</button>
        <div className="header-title">
          <span style={{ fontWeight: 700, letterSpacing: '1px', color: '#6366f1' }}>NEXUS</span>
        </div>
        <button className="icon-btn" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={userData.profilePic} alt="Profile" className="profile-img" />
        </button>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="main-content">
        
        {/* TAB 1: HOME (DASHBOARD) */}
        {activeTab === 'home' && (
          <>
            <div className="welcome-section">
              <h2>Hey, {userData.name}! 👋</h2>
              <p>Welcome back! Ready to earn today?</p>
            </div>

            <div className="stats-grid">
              <div className="premium-card card-earning"><span className="card-label">Today Earning</span><span className="card-value text-green">₹{userData.todayEarning}</span></div>
              <div className="premium-card card-total"><span className="card-label">Total Earning</span><span className="card-value text-purple">₹{userData.totalEarning}</span></div>
              <div className="premium-card"><span className="card-label">Completed Tasks</span><span className="card-value text-blue">{userData.completedTasks}</span></div>
              <div className="premium-card"><span className="card-label">Pending Tasks</span><span className="card-value text-amber">{userData.pendingTasks}</span></div>
            </div>

            <div className="section-card">
              <h3>🚀 Invite Friend & Earn</h3>
              <p style={{ color: '#8a8f98', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                Apne dosto ko invite karein aur har successful login par real cash kamao.
              </p>
              <button className="neon-btn" style={{ padding: '10px', fontSize: '13px' }}>Copy Invite Link</button>
            </div>
          </>
        )}

        {/* TAB 2: TASKS SCREEN */}
        {activeTab === 'tasks' && (
          <>
            <div className="welcome-section">
              <h2>🎯 Available Tasks</h2>
              <p>Complete simple tasks to earn real cash instantly.</p>
            </div>

            {tasksList.map(task => (
              <div className="task-card" key={task.id}>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.desc}</p>
                </div>
                <div className="task-reward">+₹{task.reward}</div>
              </div>
            ))}
          </>
        )}

        {/* TAB 3: MY ACTIVITY */}
        {activeTab === 'activity' && (
          <>
            <div className="welcome-section">
              <h2>📊 My Activity</h2>
              <p>Track your referral audit logs and recent earnings.</p>
            </div>
            
            <div className="section-card">
              <p style={{color: '#8a8f98', fontSize: '13px', textAlign: 'center', padding: '20px 0'}}>
                No recent activities found. Refer friends to see logs here!
              </p>
            </div>
          </>
        )}

        {/* TAB 4: MY WALLET (WITHDRAWAL) */}
        {activeTab === 'wallet' && (
          <>
            {/* Balance Display */}
            <div className="wallet-balance-box">
              <span className="card-label" style={{color: 'rgba(255,255,255,0.6)'}}>Withdrawable Balance</span>
              <h1 style={{fontSize: '36px', fontWeight: '700', marginTop: '5px'}} className="text-green">₹{userData.walletBalance}</h1>
            </div>

            {/* Withdraw Form */}
            <div className="section-card">
              <h3 style={{marginBottom: '15px'}}>💸 Request Cash Out</h3>
              <form onSubmit={handleWithdrawSubmit}>
                
                <div className="premium-input-group">
                  <label>Amount (₹)</label>
                  <input 
                    type="number" 
                    className="premium-input" 
                    placeholder="Enter amount (e.g. 500)" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>

                <div className="premium-input-group">
                  <label>UPI ID</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="example@paytm / @ybl" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <button type="submit" className="neon-btn">Submit Withdraw Request</button>
              </form>
            </div>
          </>
        )}

      </main>

      {/* BOTTOM NAVIGATION */}
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
