/* TODO - add your code to create a functional React component that renders details for a single book. Fetch the book data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function SingleWinery() {
  const { wineId } = useParams();
  const [selectedWinery, setSelectedWinery] = useState([]);

  //why is it showing up at the bottom of the page?
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

  const leaveReview = async () => {
    navigate(`/${wineId}/Reviews`);

    // wineReview={
    //   rating: ,
    //   title:,
    //   comment:,
    // }
    //pop up form that allows them to write their thoughts. then on SUBMIT,
    //posts to that.
    //insert into somm_reviews * Rating, title, comment.
    //on Submit:
  };

  const handleCheckOut = () => {
    console.log("button working");
  };
  //need to import reviews from reviews table and average them out.
  // have option to click picture and go to website.
  // if checkbox is clicked, add winery to somm_been there table that i
  return (
    <>
      <h2> {selectedWinery.name} </h2>

      <div container="singleWineryDetails">
        <img src={selectedWinery.img} />
        <p>Average Review Score:</p>
        <input type="checkbox" /> Visited
        <p>Description: {selectedWinery.description}</p>
        <p>Hours: {selectedWinery.hours}</p>
        <p>Website: {selectedWinery.website}</p>
        <p>Phone: {selectedWinery.phone}</p>
        <button onClick={leaveReview}>Leave a review</button>
        <p>Reservations Required:{selectedWinery.reservation_required}</p>
        <button onClick={handleCheckOut}>Add to your itinerary.</button>
        <button onClick={handleClick}>Back.</button>
      </div>
    </>
  );
}
