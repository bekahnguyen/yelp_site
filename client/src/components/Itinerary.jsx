import { useState } from "react";

export default function Itinerary(wineries) {
  const [firstStop, setFirstStop] = useState();
  console.log(wineries);
  console.log(firstStop);

  const handleAdd = () => {};
  const handleClick = (e) => {};

  //i want the ability for user to rewrite whatever they want

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
