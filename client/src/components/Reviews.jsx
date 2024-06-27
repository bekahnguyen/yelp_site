import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import { Link } from "react-router-dom";

export default function Reviews({ somm }) {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
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
    console.log(typeof rating);
    alert("Thank you for your review!");
    navigate(`/${wineId}`);
  };

  console.log("reviews", reviews); //see all reviews for winery.
  const averageRating = reviews.map((review) => {
    console.log(review.rating);
  });

  const seesReview = async () => {
    try {
      const response = await fetch(`/api/winery/${wineId}/reviews`);
      let result = await response.json();
      if (result.error) throw result.error;
      console.log(result);
      setReviews(result);
    } catch (error) {
      console.log("Oh no, couldn't get reviews");
      return reviews;
    }
  };

  useEffect(() => {
    seesReview();
  }, []);

  return (
    <>
      <p>Winery Reviews HERE:</p>
      What'd you think, of {wineId.name} {somm.username}?
      <form id="reviewForm">
        <label htmlFor="Rating">Rating:</label>
        <input
          value={rating}
          type="range"
          id="Rating"
          name="Rating"
          min="0"
          max="5"
          default="5"
          onChange={(event) => setRating(Number(event.target.value))}
        />

        <label htmlFor="Title">Title:</label>
        <input
          value={title}
          placeholder="Title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <label htmlFor="Comments"> Comments: </label>
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          type="textarea"
          id="Comment"
          name="Comment"
        />

        <button type="submit" onClick={submitReview}>
          Submit
        </button>
      </form>
      <ul id="reviews">
        {reviews.map((review) => (
          <ReviewCard
            review={review}
            setReviews={setReviews}
            somm={somm}
            key={review.id}
          />
        ))}
      </ul>
    </>
  );
}
