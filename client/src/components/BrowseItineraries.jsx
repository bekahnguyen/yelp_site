import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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
  //to put on a carasol'

  return (
    <>
      {itineraries.map((itinerary) => (
        <div key={itinerary.id}>
          <>
            <h2>West side Quality Itinerary </h2>
            <i>{itinerary.notes}</i>
            <h3> {itinerary.time}</h3>
            <h4>{itinerary.w_stop_1}</h4>
            <i>{itinerary.w_stop_1_description}</i>
            <h3>{itinerary.time2}</h3>
            <h4>{itinerary.w_stop_2}</h4>
            <i>{itinerary.w_stop_2_description}</i>
            <h3>{itinerary.time3}</h3>
            <h4>{itinerary.w_stop_3}</h4>
            <i>{itinerary.w_stop_3_description}</i>
            <h3>{itinerary.time4}</h3>
            <h4>{itinerary.w_stop_4}</h4>
            <i>{itinerary.w_stop_4_description}</i>
            <h3>{itinerary.time5}</h3>
            <h4>{itinerary.restaurant_name}</h4>
            <i>{itinerary.restaurant_description}</i>
          </>
        </div>
      ))}
    </>
  );
}
