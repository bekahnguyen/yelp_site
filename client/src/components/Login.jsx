import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Login({ somm, setSomm }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //how to fix login so that if someone is logged in they see a new page?

  useEffect(() => {
    attemptLoginWithToken();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/somms/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      attemptLoginWithToken();
    }
  };

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    const response = await fetch("/api/somms/me", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      setSomm(json);
      somm.is_admin ? navigate("/AdminHome") : navigate("/");
    } else {
      window.localStorage.removeItem("token");
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setSomm({});
  };

  // review API and find the endpoint to log in. Get tokens. Possibly receive tokens as prop? Make sure people can't log in if no info

  //isLoggedin? : add Account Details to search Bar.

  return (
    <>
      <div id="reviewPage">
        <h2> Please Sign in Below.</h2>

        <form className="loginForm">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <br />{" "}
          <Button variant="outline-success" onClick={handleSubmit}>
            Submit
          </Button>{" "}
        </form>
        <div className="createAccount">
          Don't have an account?
          <Link to="/Register">Create one now!</Link>
        </div>
      </div>
    </>
  );
}
