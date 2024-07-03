import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function ReviewCard({ review, setReviews, somm }) {
  const [comment, setComment] = useState([]);
  const { wineId } = useParams();
  const [allReplies, setAllReplies] = useState([]);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const response = await fetch(
      `/api/wineries/${wineId}/reviews/${review.id}/comments`
    );
    let result = await response.json();
    if (result.error) throw result.error;
    setAllReplies(result);
  };

  const submitComment = async (id) => {
    console.log(token);
    const response = await fetch(
      `/api/wineries/${wineId}/reviews/${id}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      }
    );
    const result = await response.json();
    getComments();
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/somms/${somm.id}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      alert("Successfully deleted review");
      setReviews((currentReviews) => {
        return currentReviews.filter((review) => {
          return review.id != id;
        });
      });
      // setRevi...review);
    } else {
      console.log(response.status);
    }
  };

  return (
    <>
      <div key={review.id}>
        <Card>
          <Card.Header>{review.rating}</Card.Header>

          <Card.Body>
            <Card.Title>{review.title}</Card.Title>
            <Card.Text>
              {review.comment}
              <br /> Posted by {review.id}
            </Card.Text>
            <input
              type="text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            {somm.id === review.somm_id ? (
              <button onClick={() => handleDelete(review.id)}>
                Delete Review
              </button>
            ) : null}

            {somm.id != review.somm_id ? (
              <button onClick={() => submitComment(review.id)}>Comment</button>
            ) : null}
            <button>Heart</button>
          </Card.Body>
        </Card>
        <ul>
          <div>
            {allReplies.map((reply) => {
              return <li key={reply.id}>{reply.comment}</li>;
            })}
          </div>
        </ul>
      </div>
    </>
  );
}
