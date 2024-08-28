import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Itinerary({ wineries, somm }) {
  const [firstStop, setFirstStop] = useState();
  const navigate = useNavigate();
  const [savedWineries, setSavedWineries] = useState([]);
  const token = window.localStorage.getItem("token");

  const handleAdd = () => {};
  const handleClick = (e) => {};

  useEffect(() => {
    getSavedWineries();
  }, []);

  const getSavedWineries = async () => {
    const response = await fetch(`/api/somms/${somm.id}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let result = await response.json();
    console.log(result);

    if (result.error) {
      throw result.error;
    } else {
      setSavedWineries(result);
    }
  };

  //i want the ability for user to rewrite whatever they want
  // must be logged in to view saved wishlist

  return (
    <>
      <h4 onClick={handleClick}> My first time in Paso Robles Itineray</h4>
      <input
        type="text"
        placeholder="Where to?"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <button onClick={handleClick}>Add</button>
      <h3>First Stop:</h3>
      <p id="firstStop"></p>
      <input type="time" />
      Reservation?
      <span>
        {" "}
        <input type="checkbox" />
      </span>
      <button onClick={handleAdd}>Add more stops</button>
      <h4>Saved Spots:</h4>
      {savedWineries.map((saved) => {
        return (
          <p
            onClick={() => {
              navigate(`/${saved.winery_id}`);
            }}
          >
            {saved.name}
          </p>
        );
      })}
    </>
  );
}
