import React from "react";
import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      {/* Left side: logo and text */}
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <span style={styles.title}>ResilientSenegal</span>
      </div>

      {/* Right side: navigation links */}
      <div style={styles.linksContainer}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/documentation" style={styles.link}>Documentation</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 48px",
    backgroundColor: "#F0F4F9",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    height: "Auto",
    width: "80px",
    objectFit: "contain",
  },
  title: {
    fontWeight: "bold",
    fontSize: "28px",
    color: "#333",
  },
  linksContainer: {
    display: "flex",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "black",
    fontWeight: 500,
  },
};

export default Navbar;
