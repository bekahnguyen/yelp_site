import { useState, useEffect } from "react";

export default function AdminWineries({ somm }) {
  const [wineries, setWineries] = useState([]);
  return (
    <>
      {!somm.is_admin ? (
        <h1> Sorry, you're UNAUTHORIZED.</h1>
      ) : (
        <p>HI, Admin!</p>
      )}
    </>
  );
}
