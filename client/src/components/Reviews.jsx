import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Reviews({ somm }) {
  const { wineId } = useParams();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
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
    console.log(result);
  };

  //see all reviews for winery.

  //to FIX
  const seesReview = async () => {
    try {
      const response = await fetch(`/api/winery/${wineId}/reviews`);
      const result = await response.json();
      if (result.error) throw result.error;
      return result.rows;
    } catch (error) {
      console.log("Oh no, couldn't get reviews");
    }
  };

  useEffect(() => {
    seesReview();
  }, []);

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
