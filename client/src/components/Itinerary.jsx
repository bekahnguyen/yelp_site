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

  // prefer winery to open to the sied instead of going to a new tab. To do.

  return (
    <>
      <div id="itinerarySheet">
        <div>
          <h4 onClick={handleClick}> My first time in Paso Robles Itinerary</h4>
          <div id="flexRow">
            <input
              type="text"
              placeholder="Where to?"
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <input type="time" />
            Reservation? <input type="checkbox" />
          </div>
          <button onClick={handleAdd}>+</button>
        </div>
        <div>
          <h4>Wishlist:</h4>
          {savedWineries.map((saved) => {
            return (
              <p
                onDoubleClick={() => {
                  navigate(`/${saved.winery_id}`);
                }}
              >
                {saved.name}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
