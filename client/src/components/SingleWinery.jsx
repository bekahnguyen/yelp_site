import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { seesReview } from "../API/api";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

export default function SingleWinery() {
  const { wineId } = useParams();
  const [selectedWinery, setSelectedWinery] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Added see review function to API page to import,
  //so I don't have to pass reviews around between componants (like I did with wineries)
  useEffect(() => {
    const getReviews = async () => {
      const review = await seesReview(`${wineId}`);
      setReviews(review);
    };
    getReviews();
  }, []);

  let totalScore = [];
  reviews.map((review) => {
    totalScore.push(review.rating);
    console.log(totalScore);
  });

  let total;
  if (reviews.length >= 1) {
    total = totalScore.reduce((a, b) => {
      return a + b;
    });
  }
  console.log(total);
  console.log(reviews.length);

  let averageScore = total / reviews.length;
  console.log(averageScore);

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
      <h1 id="wineHeading"> {selectedWinery.name}</h1>{" "}
      <div id="singleContainer">
        <Image src={selectedWinery.img} rounded />

        <section className="wineryText">
          <p>
            Average Rating:
            <p
              onClick={() => {
                navigate(`/${wineId}/Reviews`);
              }}
            >
              {averageScore}
            </p>{" "}
          </p>
          <p>Description: {selectedWinery.description}</p>
          <p>Hours: {selectedWinery.hours}</p>
          <p>Website: {selectedWinery.website}</p>
          <p>Phone: {selectedWinery.phone}</p>

          {selectedWinery.reservations_required ? (
            <h6>Reservations required.</h6>
          ) : null}
          <button onClick={leaveReview}>Notes</button>
          <button onClick={handleClick}>Back.</button>
        </section>
      </div>
    </>
  );
}
