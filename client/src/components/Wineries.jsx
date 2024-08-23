import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Wineries({ wineries, setWineries }) {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
  };
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
      <input
        type="text"
        value={searchItem}
        onChange={handleInputChange}
        placeholder="type to search"
      />

      <div className="flex-container">
        {wineries.map((winery) => (
          <Card
            key={winery.id}
            style={{ width: "18rem" }}
            onClick={() => {
              navigate(`/${winery.id}`);
            }}
          >
            <Card.Img
              variant="top"
              src={winery.img}
              alt={winery.name}
              id="winePic"
            />
            <Card.Body>
              <Card.Title>{winery.name}</Card.Title>
              <Card.Text>{winery.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
}
