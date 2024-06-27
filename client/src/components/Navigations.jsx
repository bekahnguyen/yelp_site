import { useState } from "react";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//show edit or delete button on regular customer page, conditionally render if "is admin?"
//or
//could build whole new page. CMS. dont worry about style

export default function Navigations({ somm, setSomm }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logging youout");
    window.localStorage.removeItem("token");
    setSomm({});
    alert("Logged out!");
  };

  const handleSubmit = (event) => {
    navigate(event);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/">Peruse</Link>
          <Link to="/Account">Account</Link>
          {!somm ? (
            <Link to="/Login">Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout.</button>
          )}
          {somm.is_admin ? (
            <>
              {" "}
              <select
                onChange={(event) => handleSubmit(event.target.value)}
                defaultValue=""
              >
                <option value=" disabled">ADMIN:</option>
                <option value="/AllUsers">Users</option>
                <option value="/AdminReviews">Reviews</option>
                <option value="/AdminWineries">Wineries</option>
              </select>
            </>
          ) : null}
        </div>
      </nav>
    </>
  );
}
