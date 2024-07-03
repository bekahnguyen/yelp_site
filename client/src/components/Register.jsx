/* TODO - add your code to create a functional React component that renders a registration form */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setSomm, somm }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  // Make the Register Form look prettier!!!//

  // !?!?!?????
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/somms/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });
    const result = await response.json();
    setSomm(result);
    alert("successfully registered!");
    if (somm) {
      navigate("/Login");
    }
  };

  //navigate to log in after button is pushed

  return (
    <>
      <div id="containerR">
        <form id="registerForm">
          <p>Please fill in this form to create an account.</p>
          <label>
            {" "}
            <input
              required={true}
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </label>
          <label>
            <input
              required={true}
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </label>
          <label>
            <input
              required={true}
              type="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </label>
          <label>
            <input
              required={true}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </label>
          <label>
            <input
              required={true}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </label>

          <button id="registerbtn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
