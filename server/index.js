const {
  client,
  createTables,
  createRestaurant,
  createFoodie,
  fetchFoodies,
  fetchRestaurants,
} = require("./db");
const express = require("express");

const app = express();
app.use(express.json());

// ROUTES
app.get("/api/restaurant", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM restaurant
    `;
    const response = await client.query(SQL);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurant/:id", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM restaurant WHERE id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//want to be able to see certain restaurants that have this cuisine, or would I filter this later on?
app.get("/api/restaurant/cuisine/:id", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM restaurant WHERE cusisne id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

//for admin to create new restaurant
app.post("/api/restaurant", (req, res, next) => {
  try {
    const SQL = `
    INSERT into restaurant(name, hours, cuisine_id, location, img, website)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING*;
    `;
    const response = client.query(SQL, [
      req.body.name,
      req.body.hours,
      req.body.cuisine_id,
      req.body.location,
      req.body.img,
      req.body.website,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//admin to update //NOT WORKING ...YET!
app.put("/api/restaurant/:id", (req, res, next) => {
  try {
    const SQL = `
    UPDATE restaurant
    SET name=$1, hours=$2, cuisine_id=$3, location=$4, img=$5, website=$6
    WHERE id=$7
    RETURNING*;
    `;
    const response = client.query(SQL, [
      req.body.name,
      req.body.hours,
      req.body.cuisine_id,
      req.body.location,
      req.body.img,
      req.body.website,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/restaurant/:id", (req, res, next) => {
  try {
    const SQL = `
    DELETE * FROM restaurant
    WHERE id=$1
    `;
    const response = client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});
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
      "Aliyah’s Kitchen and Grill",
      1,
      {
        monday: "12:00pm-8:00pm",
        tuesday: "12:00pm-8:00pm",
        wednesday: "12:00pm-8:00pm",
        thursday: "12:00pm-8:00pm",
        friday: "12:00pm-8:00pm",
        saturday: "12:00pm-8:00pm",
        monday: "12:00pm-8:00pm",
        sunday: "closed",
      },
      "1234 6th street",
      "https://lh3.googleusercontent.com/p/AF1QipPGsIX5gGlrXFHv_B1JVsUAYfp9RX1Kt3cXOfZt=s1360-w1360-h1020",
      "https://www.aliyahskitchen.com"
    ),
    createRestaurant(
      "Q Pot Korean BBQ & Hotpot",
      4,
      {
        monday: "12:00pm-8:00pm",
        tuesday: "12:00pm-8:00pm",
        wednesday: "12:00pm-8:00pm",
        thursday: "12:00pm-8:00pm",
        friday: "12:00pm-8:00pm",
        saturday: "12:00pm-8:00pm",
        monday: "12:00pm-8:00pm",
        sunday: "closed",
      },
      "1610 Capitol Expy, San Jose, CA 95121",
      "https://lh3.googleusercontent.com/p/AF1QipPLrExxYqDO6OB-txUGdph6tRxKeO0i3vHxPCTl=s1360-w1360-h1020",
      "https://www.qpotsanjose.com/"
    ),
    createRestaurant(
      "Pho Kim Long Restaurant",
      2,
      {
        monday: "10:00am-8:00pm",
        tuesday: "10:00am-:00pm",
        wednesday: "closed",
        thursday: "closed",
        friday: "12:00am-12:00pm",
        saturday: "12:00pm-12:00pm",
        sunday: "10:00am=8:00pm",
      },
      "2082 N Capitol Ave, San Jose",
      "www.phokimlongsanjose.com",
      "https://cdn.usarestaurants.info/assets/uploads/388896ccc7e34e8fad3088489c4357cf_-united-states-california-santa-clara-county-san-jose-445599-pho-kim-longhtm.jpg"
    ),
    createRestaurant(
      "Pho Y #1 Noodle House",
      2,
      {
        monday: "10:00am-8:00pm",
        tuesday: "10:00am-:00pm",
        wednesday: "closed",
        thursday: "closed",
        friday: "12:00am-12:00pm",
        saturday: "12:00pm-12:00pm",
        sunday: "10:00am=8:00pm",
      },
      "1660 E Capitol Expy, San Jose, CA 95121",
      "https://order.online/store/pho-y-1-noodle-house-649361",
      "https://lh3.googleusercontent.com/p/AF1QipMyOm0s0t2PB3g9NN0NkMqa9lCIuxbtrBmXjQ2z=s1360-w1360-h1020"
    ),
  ]);
  console.log(await fetchFoodies());
  console.log(await fetchRestaurants());
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
