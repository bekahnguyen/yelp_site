const { getMaxListeners } = require("events");
const {
  client,
  createTables,
  createWinery,
  createSomm,
  fetchSomms,
  fetchWineries,
  authenticate,
  findUserByToken,
  createReview,
  destroyReviews,
  createComment,
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/index.html"))
);

app.use("/assets", express.static(path.join(__dirname, "../client/assets")));

//npm run build

// ROUTES A. wineries:
app.get("/api/wineries", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM winery
    `;
    const response = await client.query(SQL);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/ava_districts", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM ava_district
    `;
    const response = await client.query(SQL);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

//to look at a particular winery and see the details
app.get("/api/wineries/:id", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM winery WHERE id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//want to be able to see certain wineries that have this ava_district_id, or would I filter this later on?
app.get("/api/wineries/ava_district/:id", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM winery WHERE ava_district_id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

//for admin to create new winery
//fix the responses. when i do response.rows there are errors

app.post("/api/winery", (req, res, next) => {
  try {
    const SQL = `
    INSERT into winery(name, hours, ava_district_id, location, img, website)
    VALUES ($1, $2, $3, $4, $5, $6,)
    RETURNING*;
    `;
    const response = client.query(SQL, [
      req.body.name,
      req.body.hours,
      req.body.ava_district_id,
      req.body.location,
      req.body.img,
      req.body.website,
    ]);
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});

//admin to update //
//when first tried, i updated the name and got a lot of errors for not adding any other fields
// changed a lot of fields from not null to be null, hopefully i dont regret that.
app.put("/api/winery/:id", (req, res, next) => {
  try {
    const SQL = `
    UPDATE winery
    SET name=$1, hours=$2, ava_district_id_id=$3, location=$4, img=$5, website=$6
    WHERE id=$7
    RETURNING*;
    `;
    const response = client.query(SQL, [
      req.body.name,
      req.body.hours,
      req.body.ava_district_id_id,
      req.body.location,
      req.body.img,
      req.body.website,
      req.params.id,
    ]);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

//patch if user tells us then include it in query //patch request

//working
app.delete("/api/winery/:id", (req, res, next) => {
  try {
    const SQL = `
    DELETE * FROM winery
    WHERE id=$1
    `;
    const response = client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//Routes B- USER:
//get api/somms/me
const isLoggedIn = async (req, res, next) => {
  console.log("is logged in route is hit!");
  try {
    req.somm = await findUserByToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

app.post("/api/somms/login", async (req, res, next) => {
  console.log("api somm login hit");
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/somms/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

//register form? DONE!
app.post("/api/somms/", async (req, res, next) => {
  try {
    await createSomm({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
  } catch (ex) {
    next(ex);
  }
});

//working!!
app.get("/api/somms", async (req, res, next) => {
  try {
    res.send(await fetchSomms());
  } catch (ex) {
    next(ex);
  }
});

//a list of all of their reviews. also to be broken down per winery?
app.get("/api/somms/:id/reviews", isLoggedIn, async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM somm_reviews WHERE somm_id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

//is this an inner join????
//how to filter reviews based on winery?
app.get("/api/winery/:wineId/reviews", async (req, res, next) => {
  try {
    const SQL = `
    SELECT *
     FROM somm_reviews 
    WHERE winery_id=$1
    `;
    const response = await client.query(SQL, [req.params.wineId]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/reviews", async (req, res, next) => {
  console.log("get wineries route hit");
  try {
    const SQL = `
    SELECT * FROM somm_reviews 
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/reviews/:id", async (req, res, next) => {
  try {
    const SQL = `
    DELETE FROM somm_reviews 
where id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/ava_districts", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM ava_district
    `;
    const response = await client.query(SQL);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

//post a review from a certain somm accessing the winery they reviewed.

app.post("/api/winery/:wineId/reviews", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await createReview({
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
        winery_id: req.params.wineId,
        somm_id: req.somm.id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//to review or post comments?
app.post(
  "/api/wineries/:id/reviews/:review_id/comments/",
  isLoggedIn,
  async (req, res, next) => {
    try {
      res.status(201).send(
        await createComment({
          winery_id: req.params.id,
          somm_review_id: req.body.somm_review_id,
          comment: req.body.comment,
        })
      );
    } catch (ex) {
      next(ex);
    }
  }
);

app.patch("/api/somms/:id/reviews/:id") ??
  //to delete their reviews.

  //for users to delete their own reviews. and for admin to delete reviews, too.
  app.delete("/api/somms/:somm_id/reviews/:id", async (req, res, next) => {
    try {
      await destroyReviews({ somm_id: req.params.somm_id, id: req.params.id });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

//how to get SOMMS to make an itinerary with multiple wineries?
//needs: winery, time, reservation made (with a checkbox), then a + button to add a new one.
app.post("/api/somms/:id/favorites", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.somm.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.status(201).send(
      await createItinerary({
        user_id: req.params.id,
        winery_id: req.body.winery_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//get/post/update/delete api/user/me/user_favorite
//get/post/update/delete api/user/me/user_wishlist
//get/delete/post/update api/user/me/user_reviews
//get all review comments//

//TO DO:

//to delete/edit
//as anADMIN : api/wineries/:id/reviews/:review_id/comments/:comment_id
//api/

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");

  console.log(await fetchSomms()), console.log(await fetchWineries());
  const nam = await createSomm({
    first_name: "nam",
    last_name: "nguyen",
    username: "namnam",
    password: "321",
    email: "nguyen.k.nam@gmail.com",
    is_admin: true,
  });
  const bek = await createSomm({
    first_name: "bek",
    last_name: "nguyen",
    username: "bek",
    password: "123",
    email: "bekahritter@gmail.com",
    is_admin: true,
  });
  const dummy = await createSomm({
    first_name: "dummy",
    last_name: "nguyen",
    username: "dummy",
    password: "123",
    email: "dumdum@dumdum.com",
    is_admin: false,
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

init();
