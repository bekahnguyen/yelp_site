import { useEffect, useState } from "react";

export default function Itinerary(wineries, somm) {
  const [firstStop, setFirstStop] = useState();
  const [savedWineries, setSavedWineries] = useState();
  console.log(wineries);
  console.log(firstStop);

  const handleAdd = () => {};
  const handleClick = (e) => {};

  useEffect(() => {
    getSavedWineries();
  }, []);

  const getSavedWineries = async () => {
    const response = await fetch(`/api/somms/${somm.id}/wishlist`);
    let result = await response.json();
    if (result.error) throw result.error;
    setSavedWineries(result);
    console.log(savedWineries);
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
    </>
  );
}
