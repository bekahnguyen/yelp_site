import { useEffect, useState } from "react";

export default function BrowseItineraries() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const browse = async () => {
      const browseList = await browseItineraries();
      setItineraries(browseList);
    };
    browse();
  }, []);

  const browseItineraries = async () => {
    const response = await fetch("/api/winery/itineraries");
    let result = await response.json();
    if (result.error) throw result.error;
    console.log(result);
    return result;
  };

  return (
    <>
      {itineraries.map((itinerary) => {
        <li>{itinerary}</li>;
      })}
    </>
  );
}
