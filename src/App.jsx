// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  // Navigation active tab handle karne ke liye state
  const [activeTab, setActiveTab] = useState('home');

  // Dummy data (Baad me ise Firebase se link karenge)
  const userData = {
    name: "Santosh Kushwaha",
    todayEarning: 150,
    totalEarning: 4500,
    completedTasks: 12,
    pendingTasks: 3,
    profilePic: "https://via.placeholder.com/150" // Agar actual Google pic nahi mili toh placeholder
  };

  return (
    <div className="app-container">
      
      {/* 1. PREMIUM HEADER */}
      <header className="premium-header">
        <button className="icon-btn">
          <i className="ri-menu-4-fill">☰</i> {/* Grid/Menu Icon */}
        </button>
        <div className="header-title">
          <span style={{ fontWeight: 700, letterSpacing: '1px', color: '#6366f1' }}>NEXUS</span>
        </div>
        <button className="icon-btn" style={{ padding: 0, overflow: 'hidden' }}>
          <img src={userData.profilePic} alt="Profile" className="profile-img" />
        </button>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        
        {activeTab === 'home' && (
          <>
            {/* Welcome Greeting */}
            <div className="welcome-section">
              <h2>Hey, {userData.name}! 👋</h2>
              <p>Welcome back! Ready to complete today's tasks?</p>
            </div>

            {/* DASHBOARD STATS GRID */}
            <div className="stats-grid">
              
              {/* Today Earning Card */}
              <div className="premium-card card-earning">
                <span className="card-label">Today Earning</span>
                <span className="card-value text-green">₹{userData.todayEarning}</span>
              </div>

              {/* Total Earning Card */}
              <div className="premium-card card-total">
                <span className="card-label">Total Earning</span>
                <span className="card-value text-purple">₹{userData.totalEarning}</span>
              </div>

              {/* Completed Tasks Card */}
              <div className="premium-card">
                <span className="card-label">Completed Tasks</span>
                <span className="card-value text-blue">{userData.completedTasks}</span>
              </div>

              {/* Pending Tasks Card */}
              <div className="premium-card">
                <span className="card-label">Pending Tasks</span>
                <span className="card-value text-amber">{userData.pendingTasks}</span>
              </div>

            </div>

            {/* Quick Overview Section */}
            <div className="section-card">
              <h3>🚀 Invite Friend & Earn</h3>
              <p style={{ color: '#8a8f98', fontSize: '13px', lineHeight: '1.5' }}>
                Apne dosto ko refer karein aur har successful signup par ₹50 tak ki real earning seedhe apne wallet me payein!
              </p>
            </div>
          </>
        )}

        {/* Dummy placeholders baaki tabs ke liye */}
        {activeTab === 'tasks' && <div className="welcome-section"><h2>🎯 Available Tasks</h2><p>Tasks screen details yahan aayengi...</p></div>}
        {activeTab === 'activity' && <div className="welcome-section"><h2>📊 My Activity</h2><p>Referral history aur audit logs yahan dikhenge...</p></div>}
        {activeTab === 'wallet' && <div className="welcome-section"><h2>💼 My Wallet</h2><p>Withdrawal requests aur balance statement...</p></div>}

      </main>

      {/* 3. PREMIUM BOTTOM NAVIGATION BAR */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
        >
          <span className="nav-icon">🎯</span>
          <span>Tasks</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`} 
          onClick={() => setActiveTab('activity')}
        >
          <span className="nav-icon">📊</span>
          <span>Activity</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`} 
          onClick={() => setActiveTab('wallet')}
        >
          <span className="nav-icon">💼</span>
          <span>Wallet</span>
        </button>
      </nav>

    </div>
  );
}

export default App;
