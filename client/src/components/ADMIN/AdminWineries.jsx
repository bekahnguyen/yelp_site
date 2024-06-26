import { useState, useEffect } from "react";
import Wineries from "../Wineries";
import { useNavigate } from "react-router-dom";

export default function AdminWineries({ somm }) {
  const [newWinery, setNewWinery] = useState([]);
  const [name, setWineryName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [ava_district_id, setAVADistrictId] = useState("");
  const [img, setImg] = useState("");
  const [website, setWebsite] = useState("");
  const [reservations_required, setReservations] = useState("");

  const handleSubmit = async (event) => {
    console.log("handle submit hit");
    event.preventDefault();
    const response = await fetch(`/api/wineries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        phone,
        hours,
        ava_district_id,
        img,
        website,
        reservations_required,
      }),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);
    setNewWinery(result.rows);
    console.log(newWinery);
    alert("successfully created!");
  };

  return (
    <div>
      {!somm.is_admin ? (
        404
      ) : (
        <>
          <p> hello, admin</p>

          <form>
            <input
              type="text"
              placeholder="Winery name"
              onChange={(e) => setWineryName(e.target.value)}
            />
            <input
              type="text"
              placeholder="address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="phone"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="hours"
              onChange={(e) => setHours(e.target.value)}
            />
            <input
              type="text"
              placeholder="ava district id"
              onChange={(e) => setAVADistrictId(e.target.value)}
            />
            <input
              type="text"
              placeholder="img"
              onChange={(e) => setImg(e.target.value)}
            />
            <input
              type="text"
              placeholder="website"
              onChange={(e) => setWebsite(e.target.value)}
            />
            <input
              type="text"
              placeholder="reservations required t/f"
              onChange={(e) => setReservations(e.target.value)}
            />
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
}
