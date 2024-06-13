import { useEffect, useState } from "react";
import { Route, Routes, Link, useParams } from "react-router-dom";
import Wineries from "./components/Wineries";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import SingleWinery from "./components/SingleWinery";
import Navigations from "./components/Navigations";
let { wineryId } = useParams;

function App({}) {
  const [token, setToken] = useState("");
  const [somm, setSomm] = useState({});

  useEffect(() => {
    attemptLoginWithToken();
    console.log("Logged in!", token);
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setSomm(json);
      } else {
        window.localStorage.removeItem("token");
      }
    }
  };

  return (
    <>
      <Navigations />

      <div id="main-routes">
        <Routes>
          <Route path="/" element={<Wineries />}></Route>
          <Route
            path="/Account"
            element={<Account token={token} somm={somm} />}
          ></Route>
          <Route
            path="/Register"
            element={<Register token={token} setToken={setToken} />}
          ></Route>
          <Route
            path="/Login"
            element={
              <Login
                setToken={setToken}
                token={token}
                setSomm={setSomm}
                somm={somm}
              />
            }
          ></Route>
          <Route
            path="/:wineId"
            element={<SingleWinery token={token} />}
          ></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
