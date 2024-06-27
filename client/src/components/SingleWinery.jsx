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

    //pop up form that allows them to write their thoughts. then on SUBMIT,
    //posts to that.
    //insert into somm_reviews * Rating, title, comment.
    //on Submit:
  };

  //need to import reviews from reviews table and average them out.
  // have option to click picture and go to website.
  // if checkbox is clicked, add winery to somm_been

  //<button onClick={handleCheckOut}>Add to your itinerary.</button>
  return (
    <>
      <h2> {selectedWinery.name}</h2>
      <h5>
        <span>
          {" "}
          <input type="checkbox" /> Visited{" "}
        </span>
      </h5>

      <div id="container">
        <div id="wineryDetails">
          <img id="singleWineryPic" src={selectedWinery.img} />
          <p>Average Review Score:</p>
          <button onClick={leaveReview}>Reviews</button>
          <p>Description: {selectedWinery.description}</p>
          <p>Hours: {selectedWinery.hours}</p>
          <p>Website: {selectedWinery.website}</p>
          <p>Phone: {selectedWinery.phone}</p>

          {selectedWinery.reservations_required ? (
            <h6>Reservations required.</h6>
          ) : null}
          <button onClick={handleClick}>Back.</button>
        </div>
      </div>
    </>
  );
}
