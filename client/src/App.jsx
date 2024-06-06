//client/src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import HikeGallery from "./pages/HikeGallery";
import HikeNew from "./pages/HikeNew";
import HikeDetail from "./pages/HikeDetail";
import HikeEdit from "./pages/HikeEdit";
import Login from "./pages/Login";
import Register from "./pages/Register";

import TestEnv from "./TestEnv"; // Import TestEnv component

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        {/* <Link to={`/test-env`}>TestEnv</Link>
        <span className="nav-space"></span> */}
        <Link to={`/`}>Home</Link>
        <span className="nav-space"></span>
        <Link to={`/hikes`}>Hikes Gallery</Link>
        <span className="nav-space"></span>
        <Link to={`/hikes/new`}>Create Hike</Link>
        <span className="nav-space"></span>
        <Link to={`/login`}>Login</Link>
        <span className="nav-space"></span>
        <Link to={`/register`}>Register</Link>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/test-env" element={<TestEnv />} /> */}
          <Route path="/hikes" element={<HikeGallery />} />
          <Route path="/hikes/new" element={<HikeNew />} />
          <Route path="/hikes/:id" element={<HikeDetail />} />
          <Route path="/hikes/:id/edit" element={<HikeEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <footer>
        <p>© 2024 GoHike</p>
      </footer>
    </div>
  );
}

export default App;
