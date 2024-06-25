import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminReviews({ somm }) {
  const [allReviews, setAllReviews] = useState([]);
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

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
    {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        getReviews();
      } else {
        console.log("Something is not working");
      }
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const backHome = () => {
    navigate("/AdminHome");
  };

  return (
    <>
      {!somm.is_admin ? (
        <h1> 401</h1>
      ) : (
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
      )}
    </>
  );
}
