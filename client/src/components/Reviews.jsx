import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Reviews({ somm }) {
  const { wineId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewComment, setReviewComment] = useState("");
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
    navigate(`/${wineId}`);
  };

  //see all reviews for winery.

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

  const submitComment = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `/api/winery/${wineId}/reviews/:review_id/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewComment }),
      }
    );
    const result = await response.json();
    console.log(result);
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/somms/${somm.id}/reviews/${review.id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      response.status(204);
    } else {
      console.error(error);
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
        {reviews.map((review) => {
          return (
            <>
              <div className="reviewBox" key={review.id}>
                {review.date}
                <li> {review.rating}</li>
                <li> {review.title}</li>
                <li>{review.comment}</li>
                <p>Posted by:{review.somm_id}</p>

                <input
                  type="text"
                  onChange={(event) => setReviewComment(event.target.value)}
                />
                <button onClick={handleDelete}>Delete Review</button>
                <button onClick={submitComment}>Comment</button>
                <button>Heart</button>
                <div>Replies:</div>
              </div>
            </>
          );
        })}
      </ul>
    </>
  );
}
