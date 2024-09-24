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
        <div id="itinerary" key={itinerary.id}>
          <>
            <i>{itinerary.notes}</i>
            <h1>{itinerary.eatfirst}</h1>
            <h4>{itinerary.lunch_spot}</h4>
            <h1> {itinerary.time}</h1>
            <h4>{itinerary.w_stop_1}</h4>
            <i>{itinerary.w_stop_1_description}</i>
            <h1>{itinerary.time2}</h1>
            <h4>{itinerary.w_stop_2}</h4>
            <i>{itinerary.w_stop_2_description}</i>
            <h1>{itinerary.time3}</h1>
            <h4>{itinerary.w_stop_3}</h4>
            <i>{itinerary.w_stop_3_description}</i>
            <h1>{itinerary.time4}</h1>
            <h4>{itinerary.w_stop_4}</h4>
            <i>{itinerary.w_stop_4_description}</i>
            <h1>{itinerary.time5}</h1>
            <h4>{itinerary.restaurant_name}</h4>
            <i>{itinerary.restaurant_description}</i>
          </>
        </div>
      ))}
    </>
  );
}
