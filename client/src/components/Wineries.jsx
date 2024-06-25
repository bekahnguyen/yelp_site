/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */
import { Link } from "react-router-dom";
export default function Wineries({ wineryList }) {
  console.log(wineryList);
  return (
    <>
      <div id="container">
        {wineryList.map((winery) => (
          <div key={winery.id} className="wineCard">
            <h3>{winery.name}</h3>
            <img className="winePic" src={winery.img} alt={winery.name} />
            <br />
            <Link to={`/${winery.id}`}>More Details!</Link>
          </div>
        ))}
      </div>
    </>
  );
}
