import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Itinerary({ wineries, somm }) {
  const navigate = useNavigate();
  const [savedWineries, setSavedWineries] = useState([]);
  const [itinerary, setItinerary] = useState({
    stop: "",
    time: "",
    reservation: false,
  });

  const token = window.localStorage.getItem("token");

  const handleStopChange = (e) => {
    itinerary.stop = e.target.value;
    console.log(itinerary);
  };
  const handleTimeChange = (e) => {
    itinerary.time = e.target.value;
    console.log(itinerary);
  };
  const handleReservationChange = (e) => {
    itinerary.reservation = e.target.value;
    console.log(itinerary);
  };

  console.log(itinerary);
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
              value={Itinerary.stop}
              placeholder="Where to?"
              onChange={handleStopChange}
            />
            <input type="time" name="time" onChange={handleTimeChange} />
            Reservation?{" "}
            <input type="checkbox" onChange={handleReservationChange} />
            <button type="submit">+</button>
          </div>

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
