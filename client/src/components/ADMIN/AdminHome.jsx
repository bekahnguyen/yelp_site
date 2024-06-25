import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminHome({ somm }) {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    navigate(event);
  };
  return (
    <>
      <h1>Hi, {somm.username}</h1>Take me to...{" "}
      <form>
        <select onChange={(event) => handleSubmit(event.target.value)}>
          <option value=""></option>
          <option value="/AllUsers"> Users</option>
          <option value="/AdminReviews">Reviews</option>
          <option value="/AdminWineries">Wineries</option>
          <option value="/AdminComments">Bodacious Bananas</option>
        </select>
      </form>
    </>
  );
}
