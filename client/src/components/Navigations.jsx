/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//show edit or delete button on regular customer page, conditionally render if "is admin?"
//or
//could build whole new page. CMS. dont worry about style

export default function Navigations({ somm }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/">Peruse</Link>
          {somm ? null : <Link to="/Login">Login</Link>}
          <Link to="/Account">Account</Link>
          {somm.is_admin ? <Link to="/AdminHome">Admin</Link> : null}
        </div>
      </nav>
    </>
  );
}
