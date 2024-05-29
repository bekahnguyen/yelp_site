const {
  client,
  createTables,
  createRestaurant,
  createFoodie,
} = require("./db");
const express = require("express");

const app = express();
app.use(express.json());

// ROUTES
app.get("/api/restaurant", async (req, res, next) => {
  try {
    res.send("ok");
  } catch (error) {
    next(error);
  }
});
// get api/restaurants
//get api/restaurants/:id
//get api/restaurants/cuisine
//get api/user/me
//get/post/update/delete api/user/me/user_favorite
//get/post/update/delete api/user/me/user_wishlist
//get/delete/post/update api/user/me/user_reviews
//api/

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");
  const [beky, nammo, char, jam, ella, jefes, phokimlong] = await Promise.all([
    createFoodie("beky", "foodie", "bekahritter@gmail.com", false),
    createFoodie("nam", "eatsalot", "nnguyen@nguyening.com", false),
    createFoodie("charlie", "givemepizza", "char@nguyening.com", true),
    createFoodie("jamey", "fruitboy", "jamjam@nguyening.com", true),
    createFoodie("ella", "eatsnothing", "ell@nguyening.com", true),
    createRestaurant(
      "Jefes",
      1,
      "1234 6th street",
      "tacotuesday.com/picture",
      "tacos.com"
    ),
    createRestaurant(
      "Pho Kim Long Restaurant",
      2,
      { monday: "7:00-5:00", tuesday: "6:00-6:00pm" },
      "2082 N Capitol Ave, San Jose",
      "www.phokimlongsanjose.com",
      "https://cdn.usarestaurants.info/assets/uploads/388896ccc7e34e8fad3088489c4357cf_-united-states-california-santa-clara-county-san-jose-445599-pho-kim-longhtm.jpg"
    ),
  ]);
  console.log(beky, nammo, char, jam, ella, jefes, phokimlong);
  // console.log(await fetchUsers());
  // console.log(await fetchPlaces());
  // const [wishlist] = await Promise.all([
  //   createVacation({
  //     user_id: beky_id,
  //     restaurant_id: nyc.id,
  //     departure_date: "03/03/2023",
  //   }),
  //   createVacation({
  //     user_id: lucy_id,
  //     place_id: london_id,
  //     depature_date: "05/05/2025",
  //   }),
  // ]);

  // console.log(await fetchVacations());
  // await destroyVacations({ id: vacation_id, user_id: vacation.user_id });
  // console.log(await fetchVacations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
