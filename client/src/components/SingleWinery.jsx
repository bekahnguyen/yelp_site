/* TODO - add your code to create a functional React component that renders details for a single book. Fetch the book data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SingleWinery() {
  const { wineId } = useParams();
  const [selectedWinery, setSelectedWinery] = useState([]);
  const [goToWinery, setGoToWinery] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (wineId) {
      const fetchSingleWinery = async () => {
        const response = await fetch(`api/wineries/${wineId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (result.error) throw result.error;
        setSelectedWinery(result);
      };
      fetchSingleWinery();
    }
  }, [wineId]);

  const handleClick = () => {
    navigate("/");
  };

  const handleCheckOut = () => {
    console.log("button working");
  };
  //need to import reviews from reviews table and average them out.
  return (
    <>
      <h2>Currently Selected: {selectedWinery.name} </h2>
      <div container="singleWinaryDetails">
        <img src={selectedWinery.img} /> {selectedWinery.name}
        <input type="checkbox" /> Visited
        <p>Description: {selectedWinery.description}</p>
        <p>Hours: {selectedWinery.hours}</p>
        <p>Website: {selectedWinery.website}</p>
        <p>Phone: {selectedWinery.phone}</p>
        <p>Reservations Required:{selectedWinery.reservations_required}</p>
        <button onClick={handleCheckOut}>Add to your itinerary.</button>
        <button onClick={handleClick}>Return to all wineries.</button>
      </div>
    </>
  );
}
