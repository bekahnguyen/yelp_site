import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminReviews({ somm }) {
  const [allReviews, setAllReviews] = useState([]);
  const { wineId } = useParams;

  const getReviews = async () => {
    try {
      const response = await fetch(`/api/wineries/reviews`);
      let result = await response.json();
      if (result.error) throw result.error;
      console.log(result);
      setAllReviews(result);
    } catch (error) {
      console.log("Oh no, couldn't get reviews");
      return reviews;
    }
  };

  const deleteReview = async (id) => {
    console.log(id);
    const response = await fetch(`/api/somms/${somm.id}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      getReviews();
      response.status(204);
    } else {
      console.log(response.status);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      {allReviews.map((review) => {
        return (
          <div>
            <li>DATE: {review.created_at}</li>
            <li>POSTED BY SOMM:{review.somm_id}</li>
            <li>{review.title}</li>
            <li>{review.comment}</li>
            <button
              onClick={() => {
                deleteReview(review.id);
              }}
            >
              {" "}
              Delete.
            </button>
          </div>
        );
      })}
    </>
  );
}
