/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import { useEffect, useState } from "react";

// get reviews user has posted:

export default function Account({ somm }) {
  const reviewList = async () => {
    const token = window.localStorage.getItem("token");
    console.log(token);
    const response = await fetch(`/api/somms/${somm.id}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result;
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
      <button onClick={reviewList}>Click!</button>
    </>
  );
}
