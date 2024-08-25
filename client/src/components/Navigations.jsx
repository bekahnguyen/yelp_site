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
    window.localStorage.removeItem("token");
    setSomm({});
    alert("Logged out!");
  };

  const handleSubmit = (event) => {
    navigate(event);
  };

  return (
    <>
      <nav id="navbar">
        <div id="">
          <ul>
            <li
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home{" "}
            </li>{" "}
            <li></li>
            {somm.id ? (
              <li
                onClick={() => {
                  navigate(`/Account`);
                }}
              >
                {" "}
                Account
              </li>
            ) : (
              <li
                onClick={() => {
                  navigate(`/Login`);
                }}
              >
                Login
              </li>
            )}
            {somm.is_admin ? (
              <>
                {" "}
                <li>
                  <select
                    id="adminButton"
                    onChange={(event) => handleSubmit(event.target.value)}
                    defaultValue=""
                  >
                    <option value="/">ADMIN:</option>
                    <option value="/AllUsers">Users</option>
                    <option value="/AdminReviews">Reviews</option>
                    <option value="/AdminWineries">Wineries</option>
                  </select>
                </li>
              </>
            ) : null}
            <li>
              <select
                id="itinerary"
                onChange={(event) => handleSubmit(event.target.value)}
                defaultValue=""
              >
                <option value="/">Itineraries</option>
                <option value="/itinerary">Create Your Own</option>
                <option value="/browse-itineraries">Browse</option>
              </select>
            </li>
            <li>
              <button id="logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
