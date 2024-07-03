import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Wineries({ wineries, setWineries }) {
  const navigate = useNavigate();
  // const [filteredWineries, setFilteredWineries] = useState([]);

  useEffect(() => {
    const getWineryList = async () => {
      const wineryList = await getWineries();
      setWineries(wineryList);
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

  // const onInputChange = (event) => {
  //   const searchTerm = event.target.value.toLowerCase();
  //   const filter = wineries.filter((winery) => {
  //     winery.name.toLowerCase().includes(searchTerm);
  //   });
  //   setFilteredWineries(filter);
  // };

  return (
    <>
      <div class="flex-container">
        {wineries.map((winery) => (
          <div
            key={winery.id}
            className="wineCard"
            onClick={() => {
              navigate(`/${winery.id}`);
            }}
          >
            <h4 id="wineCard">{winery.name}</h4>
            <img
              title="Visit!"
              className="winePic"
              src={winery.img}
              alt={winery.name}
            />
            <br />
          </div>
        ))}
      </div>
    </>
  );
}
