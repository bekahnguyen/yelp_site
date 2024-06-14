import { useParams } from "react-router-dom";

export default function Reviews({ somm }) {
  const { wineId } = useParams();

  const submitReview = async (event) => {
    event.preventDefault();
    const response = await (`api/winery${wineId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wineReview }),
    });
    const result = await response.json();
    console.log(result);
  };

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
      <form id="">
        <label htmlFor="Rating">Rating</label>
        <input type="range" id="Rating" name="Rating" min="0" max="5" />
        <label htmlFor="Title">Title</label>
        <input type="text" id="Title" name="Title" />
        <label htmlFor="Comments"> Comments </label>
        <input type="textarea" id="Comments" name="Comments" />
        <button type="submit" onClick={submitReview}>
          Submit
        </button>
      </form>
    </>
  );
}
