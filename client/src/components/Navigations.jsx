/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navigations() {
  return (
    <>
      //change to hamburger menu? put in top right?
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/">Peruse</Link>
          <Link to="/Login">Login</Link>
          <Link to="/Account">Account</Link>
        </div>
      </nav>
    </>
  );
}