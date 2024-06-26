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
import AdminReviews from "./components/ADMIN/AdminReviews";
import AdminHome from "./components/ADMIN/AdminHome";
import AllUsers from "./components/ADMIN/AllUsers";

function App() {
  const [somm, setSomm] = useState({});
  const [wineries, setWineries] = useState([]);

  return (
    <>
      <h1 id="mainPageHeader">Paso App</h1>
      Hi, {somm.username}
      <Navigations somm={somm} setSomm={setSomm} />
      <div id="main-routes">
        <Routes>
          <Route
            path="/"
            element={
              <Wineries
                somm={somm}
                wineries={wineries}
                setWineries={setWineries}
              />
            }
          ></Route>
          <Route
            path="/Account"
            element={<Account somm={somm} setSomm={setSomm} />}
          ></Route>
          <Route
            path="/Register"
            element={<Register setSomm={setSomm} somm={somm} />}
          ></Route>
          <Route
            path="/Login"
            element={<Login setSomm={setSomm} somm={somm} />}
          ></Route>
          <Route
            path="/:wineId/Reviews"
            element={<Reviews somm={somm} />}
          ></Route>
          <Route path="/AdminHome" element={<AdminHome somm={somm} />}></Route>
          <Route
            path="/AdminReviews"
            element={<AdminReviews somm={somm} />}
          ></Route>
          <Route
            path="/AdminWineries"
            element={
              <AdminWineries
                somm={somm}
                wineries={wineries}
                setWineries={setWineries}
              />
            }
          ></Route>
          <Route path="/AllUsers" element={<AllUsers somm={somm} />}></Route>

          <Route path="/:wineId" element={<SingleWinery />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
