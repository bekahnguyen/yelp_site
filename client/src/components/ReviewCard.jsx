import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ReviewCard({ review, somm }) {
  const [reply, setReply] = useState([]);
  const { wineId } = useParams();
  const token = window.localStorage.getItem("token");

  const submitComment = async (id) => {
    !somm.id ? alert("You must be logged in to leave a comment") : null;
    const response = await fetch(
      `/api/wineries/${wineId}/reviews/${id}/comments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      }
    );
    const result = await response.json();
    console.log(result);
  };

  const handleDelete = async (id) => {
    console.log(id);
    const response = await fetch(`/api/somms/${somm.id}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      response.status(204);
    } else {
      console.log(response.status);
    }
  };

  return (
    <div className="reviewBox" key={review.id}>
      {review.date}
      <li> {review.rating}</li>
      <li> {review.title}</li>
      <li>{review.comment}</li>
      <p>Posted by:{review.somm_id}</p>
      <input
        type="text"
        value={reply}
        onChange={(event) => setReply(event.target.value)}
      />
      <button onClick={() => handleDelete(review.id)}>Delete Review</button>
      <button onClick={() => submitComment(review.id)}>Comment</button>
      <button>Heart</button>
      <div>Replies:</div>
    </div>
  );
}
