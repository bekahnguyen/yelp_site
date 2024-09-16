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
  console.log(itineraries);

  return (
    <>
      {itineraries.map((itinerary) => (
        <>
          <h2>{itinerary.id} </h2>
          <li>{itinerary.notes}</li>
          <li> {itinerary.time}</li>
          <li>{itinerary.winery_stop_1}</li>
          <li>{itinerary.time2}</li>
          <li>{itinerary.winery_stop_2}</li>
          <li>{itinerary.time4}</li>
          <li>{itinerary.winery_stop_4}</li>
          <li>{itinerary.time5}</li>
          <li>{itinerary.restaurant_name}</li>
        </>
      ))}
    </>
  );
}
