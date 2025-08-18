import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LeftHero from "./components/LeftHero";
import SplineRobot from "./components/SplineRobot";
import SplineCube from "./components/SplineCube";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="hero-container">
        <section className="hero-left">
          <div className="cube-background">
            <SplineCube />
          </div>
          <div className="hero-content">
            <LeftHero />
          </div>
        </section>
        <aside className="hero-right">
          <SplineRobot />
        </aside>
      </main>
    </div>
  );
}