const {
  client,
  createWinery,
  createTables,
  createSomm,
  fetchSomms,
  fetchWineries,
  authenticate,
  findUserByToken,
  createReview,
  destroyReviews,
  createComment,
  createWishlist,
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

//for deployment only
const path = require("path");
const { send } = require("process");

// deploy site on netlify on ffront end
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

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

app.get("/api/wineries/reviews", async (req, res, next) => {
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
      SELECT * FROM winery 
WHERE id=$1
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
      DELETE FROM winery
      WHERE id=$1
      `;
    const response = client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//Routes B- USER:

const isLoggedIn = async (req, res, next) => {
  try {
    req.somm = await findUserByToken(req.headers.authorization);
    console.log("req.somm:", req.somm);
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

//took out the isloggedin. will have to fix later.
app.get("/api/somms/me", isLoggedIn, async (req, res, next) => {
  console.log("api/somms/me route hit");
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

//register form? DONE!
app.post("/api/somms/", async (req, res, next) => {
  try {
    res.send(
      await createSomm({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/wineries/", async (req, res, next) => {
  try {
    res.send(
      await createWinery({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        hours: req.body.hours,
        ava_district_id: req.body.ava_district_id,
        img: req.body.img,
        website: req.body.website,
        reservations_required: req.body.reservations_required,
      })
    );
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

// app.get(
//   "/api/wineries/:id/reviews/:somm_review_id/comments",
//   async (req, res, next) => {
//     try {
//       const SQL = `
//     SELECT * FROM somm_comments
//     WHERE somm_review_id= $1
//     `;
//       const response = await client.query(SQL, [req.params.somm_review_id]);
//       res.send(response.rows);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

app.patch("/api/somms/:id", async (req, res, next) => {
  try {
    const SQL = `
    UPDATE somm
    SET is_admin = true
    where id=$1
    RETURNING *`;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(200);
  } catch (error) {}
});

app.get(
  "/api/wineries/:id/reviews/:reviewId/comments",
  async (req, res, next) => {
    try {
      const SQL = `
      SELECT * FROM somm_comments
      WHERE somm_review_id=$1 
      `;
      const response = await client.query(SQL, [req.params.reviewId]);
      res.send(response.rows);
    } catch (error) {
      next(error);
    }
  }
);

// app.patch("/api/somms/:id/reviews/:id");
// const SQL = `
//   `;

//for users to delete their own reviews. and for admin to delete reviews, too.

app.delete(
  "/api/somms/:somm_id/reviews/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      console.log("route hit!");
      if (req.params.somm_id !== req.somm.id) {
        const error = Error("not authorized");
        error.status = 401;
        throw error;
      }
      await destroyReviews({ somm_id: req.params.somm_id, id: req.params.id });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

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

//admin delete
app.delete("/api/reviews/:id", async (req, res, next) => {
  console.log("route hit");
  try {
    const SQL = `
      DELETE from somm_reviews
      where id =$1`;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.status);
  } catch (error) {
    next(error);
  }
});

app.get("/api/somms/:id/wishlist", isLoggedIn, async (req, res, next) => {
  try {
    console.log("get wishlist route hit!");
    // if (req.params.id !== req.somm.id) {
    //   const error = Error("not authorized");
    //   error.status = 401;
    //   throw error;
    // }
    const SQL = `
      SELECT *
      FROM winery
      INNER JOIN somm_wishlist on somm_wishlist.winery_id = winery.id      
       where somm_id=$1`;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/somms/:id/wishlist", isLoggedIn, async (req, res, next) => {
  try {
    res.send(
      await createWishlist({
        somm_id: req.params.id,
        winery_id: req.body.wineId,
      })
    );
  } catch (error) {
    next(error);
  }
});

//to review or post comments?
app.post(
  "/api/wineries/:id/reviews/:somm_review_id/comments/",
  isLoggedIn,
  async (req, res, next) => {
    try {
      res.send(
        await createComment({
          somm_review_id: req.params.somm_review_id,
          comment: req.body.comment,
        })
      );
    } catch (ex) {
      next(ex);
    }
  }
);

//register form? DONE!
app.post("/api/somms/", async (req, res, next) => {
  try {
    res.send(
      await createSomm({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//how to get SOMMS to make an itinerary with multiple wineries?
//needs: winery, time, reservation made (with a checkbox), then a + button to add a new one.
// app.post("/api/somms/:id/favorites", isLoggedIn, async (req, res, next) => {
//   try {
//     if (req.params.id !== req.somm.id) {
//       const error = Error("not authorized");
//       error.status = 401;
//       throw error;
//     }
//     res.status(201).send(
//       await createItinerary({
//         user_id: req.params.id,
//         winery_id: req.body.winery_id,
//       })
//     );
//   } catch (ex) {
//     next(ex);
//   }
// });

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
  // const nam = await createSomm({
  //   first_name: "nam",
  //   last_name: "nguyen",
  //   username: "namnam",
  //   password: "321",
  //   email: "nguyen.k.nam@gmail.com",
  //   is_admin: true,
  // });
  const beky = await createSomm({
    first_name: "bek",
    last_name: "nguyen",
    username: "bek",
    password: "123",
    email: "bekahritter@gmail.com",
    is_admin: true,
  });
  // const dummy = await createSomm({
  //   first_name: "dummy",
  //   last_name: "nguyen",
  //   username: "dummy",
  //   password: "123",
  //   email: "dummyaccount@gmail.com",
  // });

  // console.log(nam);
  // const [wishlist] = await Promise.all([
  //   createVacation({
  //     user_id: beky_id,
  //     winery_id: nyc.id,
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
