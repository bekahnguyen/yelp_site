import { useState, useEffect } from "react";
import Wineries from "../Wineries";

export default function AdminWineries({ somm, setWineryList }) {
  // create a new winery

  const getWineryList = async () => {
    const allWineries = await getWineries();
    console.log("wineryList:", allWineries);
    setWineryList(allWineries);
  };

  useEffect(() => {
    getWineryList();
  }, []);

  const getWineries = async () => {
    try {
      const response = await fetch("/api/wineries");
      const result = await response.json();
      if (result.error) throw result.error;
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.log("Oh no, couldn't get wineries");
    }
  };

  return <> Edit or Add</>;
}
