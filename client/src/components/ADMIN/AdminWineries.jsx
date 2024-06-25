import { useState, useEffect } from "react";
import Wineries from "../Wineries";

export default function AdminWineries({ somm }) {
  const [wineList, setWineList] = useState([]);

  const getWineryList = async () => {
    const wineryList = await getWineries();
    setWineList(wineryList);
  };

  useEffect(() => {
    getWineryList();
  }, []);

  const getWineries = async () => {
    try {
      const response = await fetch("/api/wineries");
      const result = await response.json();
      if (result.error) throw result.error;
      console.log(result);
      return result.rows;
    } catch (error) {
      console.log("Oh no, couldn't get wineries");
    }
  };

  return (
    <>
      <div id="container">
        {wineList.map((winery) => (
          <Wineries winery={winery} key={winery.id} somm={somm} />
        ))}
      </div>
    </>
  );
}
