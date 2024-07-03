import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Reviews({ somm }) {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const token = window.localStorage.getItem("token");

  const submitReview = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/winery/${wineId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, rating, comment }),
    });
    const result = await response.json();
    alert("Thank you for your review!");
    navigate(`/${wineId}`);
  };

  async function seesReview() {
    try {
      const response = await fetch(`/api/winery/${wineId}/reviews`);
      let result = await response.json();
      if (result.error) throw result.error;
      setReviews(result);
    } catch (error) {
      console.log("Oh no, couldn't get reviews");
      return reviews;
    }
  }

  useEffect(() => {
    seesReview();
  }, []);

  return (
    <>
      <div id="reviewPage">
        <h1 id="reviewHeaders">Thoughts?</h1>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Rating</Form.Label>
            <input
              value={rating}
              type="range"
              min="0"
              max="10"
              id="Rating"
              name="Rating"
              default="3"
              onChange={(event) => setRating(Number(event.target.value))}
            />
            <Form.Control
              type="text"
              placeholder="Title"
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              placeholder="Comments"
              rows={3}
              onChange={(event) => setComment(event.target.value)}
            />
            <br />
            <button onClick={submitReview}>Submit</button>
          </Form.Group>
        </Form>
        <br />
        <hr />
        <br />
        <h5 id="reviewHeaders">Reviews:</h5>

        {reviews.map((review) => (
          <ReviewCard
            review={review}
            setReviews={setReviews}
            somm={somm}
            key={review.id}
          />
        ))}

        <button
          id="reviewPage"
          onClick={() => {
            navigate(`/${wineId}`);
          }}
        >
          Back
        </button>
      </div>
    </>
  );
}
