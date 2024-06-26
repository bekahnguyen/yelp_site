import { useState, useEffect } from "react";
import AdminWineries from "./ADMIN/AdminWineries";
import { Link, useParams } from "react-router-dom";

export default function Wineries({ somm, wineries, setWineries }) {
  const [filteredWineries, setFilteredWineries] = useState([]);

  useEffect(() => {
    const getWineryList = async () => {
      const wineryList = await getWineries();
      setWineries(wineryList);
      setFilteredWineries(wineries);
    };
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
      <div className="searchbar">
        <label>
          Search for a Winery:
          <input onChange={onInputChange} />
        </label>
      </div>

      <div id="container">
        {wineries.map((winery) => (
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
