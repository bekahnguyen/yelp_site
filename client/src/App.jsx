import { useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import Wineries from "./components/Wineries";
import Account from "./components/Account";
import Register from "./components/Register";
import Login from "./components/Login";
import Reviews from "./components/Reviews";
import SingleWinery from "./components/SingleWinery";
import Navigations from "./components/Navigations";
import AdminWineries from "./components/ADMIN/AdminWineries";

function App() {
  const [somm, setSomm] = useState({});

  return (
    <>
      <h1 id="mainPageHeader">Paso App</h1>
      <Navigations />
      <div id="main-routes">
        <Routes>
          <Route path="/" element={<Wineries />}></Route>
          <Route
            path="/Account"
            element={<Account somm={somm} setSomm={setSomm} />}
          ></Route>
          <Route
            path="/Register"
            element={<Register setSomm={setSomm} />}
          ></Route>
          <Route
            path="/Login"
            element={<Login setSomm={setSomm} somm={somm} />}
          ></Route>
          <Route
            path="/:wineId/Reviews"
            element={<Reviews somm={somm} />}
          ></Route>
          <Route path="/AdminWineries" element={<AdminWineries />}></Route>
          <Route path="/:wineId" element={<SingleWinery />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
