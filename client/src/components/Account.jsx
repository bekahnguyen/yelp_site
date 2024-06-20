/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import { useEffect, useState } from "react";
import Reviews from "./Reviews";

// get reviews user has posted:

export default function Account({ somm }) {
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    reviewList();
  }, []);
  const reviewList = async () => {
    const token = window.localStorage.getItem("token");
    const response = await fetch(`/api/somms/${somm.id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    console.log(result);
    setMyReviews(result);
  };

  //make past reviews open in new tab to the side
  return (
    <>
      <p>Welcome back, {somm.username}!</p>
      <p>Current itinerary:</p>
      Nothing at the moment! Let's get started!
      <form>
        <input type="text" placeholder="Winery Name:"></input>
        <input type="text" placeholder="Time:"></input>
        <input type="checkbox" placeholder="Reservation made?"></input>
      </form>
      <p> Past Reviews:</p>
      {myReviews.map((myReview) => {
        return (
          <>
            <div className="myReviewBox" key={myReview.id}>
              <p>Winery: {myReview.winery_id}</p>
              <p>Title: {myReview.title}</p>
              <p>Rating:{myReview.rating}</p>

              <p>Comment: {myReview.comment}</p>
            </div>
          </>
        );
      })}
    </>
  );
}
