import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Reviews({ somm }) {
  const { wineId } = useParams();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const submitReview = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/winery/${wineId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, rating, comment }),
    });
    const result = await response.json();
    console.log(result);
  };

  //see all reviews for winery.

  //to FIX
  // const seesReview = async () => {
  //   const response = await `api/winery${wineId}/Reviews`, {
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //     });
  //   }

  //   const result = await response.json();
  //   console.log(result);
  // };
  // seesReview();

  //ask John how he did this
  // wineReview={
  //   rating:
  //   title:
  //   comment:
  // }

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
          onChange={(event) => setRating(Number(event.target.value))}
        />
        console.log(rating)
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
    </>
  );
}
