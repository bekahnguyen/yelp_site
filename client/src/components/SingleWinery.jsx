import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { seesReview } from "../API/api";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function SingleWinery({ somm }) {
  const { wineId } = useParams();
  const token = window.localStorage.getItem("token");
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
  });

  let total;
  if (reviews.length >= 1) {
    total = totalScore.reduce((a, b) => {
      return a + b;
    });
  }

  let averageScore = total / reviews.length;

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

  const handleItinerary = async (id) => {
    console.log("token one:", token);
    const response = await fetch(`api/somms/${somm.id}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ wineId }),
    });
    const json = await response.json();
    console.log(json);
  };

  //need to import reviews from reviews table and average them out.
  // have option to click picture and go to website.
  // if checkbox is clicked, add winery to somm_been

  //<button onClick={handleCheckOut}>Add to your itinerary.</button>
  return (
    <>
      <h1 id="wineHeading"> </h1>{" "}
      <div id="singleContainer">
        <Card>
          <Card.Header>
            Featuring<h5>{selectedWinery.name}</h5>{" "}
          </Card.Header>
          <Card.Img variant="top" id="winePic" src={selectedWinery.img} />
          <Card.Body>
            <Card.Title>Average Rating: {averageScore}</Card.Title>
            <Card.Text>
              Description: {selectedWinery.description}
              <br /> Hours: {selectedWinery.hours}
              <br /> Website: {selectedWinery.website}
              <br />
              Phone: {selectedWinery.phone}
              <br />
              District: {selectedWinery.ava_district_id}
              {selectedWinery.reservations_required ? (
                <h6>Reservations required.</h6>
              ) : null}
            </Card.Text>
            <Button variant="primary" onClick={leaveReview}>
              Notes
            </Button>{" "}
            {somm.id ? (
              <button onClick={() => handleItinerary(selectedWinery.id)}>
                Save for later!
              </button>
            ) : null}
            <Button variant="secondary" onClick={handleClick}>
              Back.
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
