import React from 'react'
import './Home.css'

function Home() {
  return (
    <div className="page home-page">
      <div className="hero">
        <h1>Welcome to Spienx</h1>
        <p className="subtitle">Your Multi-Page React Application</p>
      </div>
      
      <div className="content-section">
        <div className="card">
          <h2>🚀 Getting Started</h2>
          <p>
            This is a modern multi-page React application built with React Router and Redux.
            Navigate through the pages using the navigation bar above.
          </p>
        </div>
        
        <div className="card">
          <h2>📦 Repository Management</h2>
          <p>
            Manage your Git repositories with our integrated gRPC-Web API. 
            View, create, sync, and monitor your repositories all in one place.
          </p>
          <ul>
            <li>List and search repositories</li>
            <li>Create new repositories</li>
            <li>Sync with remote sources</li>
            <li>View branches and commits</li>
          </ul>
        </div>
        
        <div className="card">
          <h2>⚡ Features</h2>
          <ul>
            <li>React 18 with modern hooks</li>
            <li>React Router for seamless navigation</li>
            <li>Redux Toolkit for state management</li>
            <li>gRPC-Web API integration</li>
            <li>Vite for fast development</li>
            <li>Responsive design</li>
            <li>Clean and modular structure</li>
          </ul>
        </div>
        
        <div className="card">
          <h2>📚 Learn More</h2>
          <p>
            Visit the <a href="/repositories">Repositories</a> page to manage your Git repositories,
            <a href="/about"> About</a> page to learn more about this application,
            or go to <a href="/contact">Contact</a> to get in touch.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
