import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import React from "react";

export default function Wineries({ wineries, setWineries }) {
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

  return (
    <>
      <div id="container">
        {wineries.map((winery) => (
          <div key={winery.id} className="wineCard">
            <h4>{winery.name}</h4>
            <img className="winePic" src={winery.img} alt={winery.name} />
            <br />
            <Link to={`/${winery.id}`}>More Details!</Link>
          </div>
        ))}
      </div>
    </>
  );
}
