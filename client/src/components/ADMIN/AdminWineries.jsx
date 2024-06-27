import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminWineries({ somm, setWineries, wineries }) {
  const [name, setWineryName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [ava_district_id, setAVADistrictId] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [reservations_required, setReservations] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (event) => {
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
        description,
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
    await setWineries(...wineries, result);
    console.log(wineries);
    alert("successfully created!");
    navigate("/");
  };

  const editWinery = async (id) => {
    console.log(id);
    const response = await fetch("/api/");
  };

  const deleteWinery = async (id) => {
    console.log(id);
    const response = await fetch(`/api/winery/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log(response.status);
      setWineries(...wineries);
    }
  };

  return (
    <div>
      {!somm.is_admin ? (
        404
      ) : (
        <>
          <p> hello, admin</p>
          <form>
            <label>Add new winery:</label>
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
              placeholder="description"
              onChange={(e) => setDescription(e.target.value)}
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
          {wineries.map((winery) => {
            return (
              <>
                <ul id="adminWinery" key={winery.id}>
                  <>
                    <li> {winery.name}</li>
                    <li> {winery.address}</li>
                    <li>{winery.hours}</li>
                    <li> {winery.ava_district_id}</li>
                    <li> {winery.img}</li>
                    <li> {winery.website}</li>
                    <li>{website.reservations_required}</li>
                    <button onClick={() => editWinery(winery.id)}>Edit</button>
                    <button onClick={() => deleteWinery(winery.id)}>
                      {" "}
                      Delete
                    </button>
                  </>
                </ul>
                ;
              </>
            );
          })}
        </>
      )}
    </div>
  );
}
