/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
import { useState } from "react";
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
    navigate("/");
  };

  const handleSubmit = (event) => {
    navigate(event);
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/">Peruse</Link>
          {somm ? null : <Link to="/Login">Login</Link>}
          <Link to="/Account">Account</Link>
          {somm.is_admin ? (
            <select
              class="form-select form-select-sm"
              aria-label=".form-select-sm example"
              onChange={(event) => handleSubmit(event.target.value)}
            >
              <option selected>ADMIN:</option>
              <option value="/AllUsers">Users</option>
              <option value="/AdminReviews">Reviews</option>
              <option value="/AdminWineries">Wineries</option>
            </select>
          ) : null}
          <button onClick={handleLogout}>Logout.</button>
        </div>
      </nav>
    </>
  );
}
