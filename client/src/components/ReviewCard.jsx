import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ReviewCard({ review, somm }) {
  const [reply, setReply] = useState([]);
  const { wineId } = useParams();
  const [allReplies, setAllReplies] = useState([]);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const response = await fetch(
      `/api/wineries/${wineId}/reviews/${review.id}/comments/`
    );
    let result = await response.json();
    console.log(result);
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
        body: JSON.stringify({ reply }),
      }
    );
    const result = await response.json();
    console.log(result);
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
      <li>{review.somm_id}</li>
      <p>Posted by:{review.somm_id}</p>
      <input
        type="text"
        value={reply}
        onChange={(event) => setReply(event.target.value)}
      />
      {somm.id === review.somm_id ? (
        <button onClick={() => handleDelete(review.id)}>Delete Review</button>
      ) : null}
      <button onClick={() => submitComment(review.id)}>Comment</button>
      <button>Heart</button>
      <ul>
        <div className="commentBox">
          {allReplies.map((reply) => {
            return <li>{reply.reply}</li>;
          })}
        </div>
      </ul>
    </div>
  );
}
