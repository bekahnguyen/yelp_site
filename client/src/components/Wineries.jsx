/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */
import { useState, useEffect } from "react";
import SingleWinery from "./SingleWinery";
import { Link, useParams } from "react-router-dom";

export default function Wineries() {
  const [wineries, setWineries] = useState([]);
  const [filteredWineries, setFilteredWineries] = useState([]);

  const getWineryList = async () => {
    const wineryList = await getWineries();
    setWineries(wineryList);
  };

  useEffect(() => {
    getWineryList();
  }, []);

  const getWineries = async () => {
    try {
      const response = await fetch("/api/wineries");
      const result = await response.json();
      if (result.error) throw result.error;
      return result.rows;
    } catch (error) {
      console.log("Oh no, couldn't get wineries");
    }
  };

  const onInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredWineries = wineries.filter((winery) =>
      winery.name.toLowerCase().includes(searchTerm)
    );

    setFilteredWineries(filteredWineries);
  };

  return (
    <>
      <div id="container">
        {wineries.map((winery) => (
          <div key={winery.id} className="wineCard">
            <h3>{winery.name}</h3>
            <img className="winePic" src={winery.img} alt={winery.name} />
            <br />
            <Link to={`/${winery.id}`}>More Details!</Link>
          </div>
        ))}

        <div className="searchbar">
          <label>
            Search for a Winery:
            <input onChange={onInputChange} />
          </label>
        </div>

        <input onChange={onInputChange} />
      </div>
    </>
  );
}
