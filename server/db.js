const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/ecommerce_site_db"
);

const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

// need a new table to update winery times depending on the day.
const createWinery = async ({
  name,
  address,
  phone,
  hours,
  ava_district_id,
  img,
  website,
  reservations_required,
}) => {
  const SQL = `  
      INSERT INTO winery(name, address, phone, hours, ava_district_id, img, website, reservations_required) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`;
  const response = await client.query(SQL, [
    name,
    address,
    phone,
    hours,
    ava_district_id,
    img,
    website,
    reservations_required,
  ]);
  return response.rows[0];
};

//somm to represent "user" as user is a designated keyword id rather not use. Somm= sommelier

const createSomm = async ({
  first_name,
  last_name,
  username,
  password,
  email,
  is_admin,
}) => {
  const SQL = `
    INSERT INTO somm(id, first_name, last_name, username, password, email, is_admin)
     VALUES($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    first_name,
    last_name,
    username,
    await bcrypt.hash(password, 5),
    email,
    is_admin,
  ]);
  return response.rows[0];
};

const authenticate = async ({ username, password }) => {
  const SQL = `
  SELECT id, password
  FROM somm
  WHERE username =$1
  `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  console.log("token:", token);
  console.log("authenticated!");
  return { token };
};

const findUserByToken = async (token) => {
  console.log("find user by token, token:", token);
  let id;
  try {
    const tokenNoBearer = token.split(" ")[1];
    console.log("token without bearer:", tokenNoBearer);
    const payload = jwt.verify(tokenNoBearer, JWT);
    id = payload.id;
    console.log(id);
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username, is_admin
    FROM somm
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

// decided to keep hours in the winery table and made days/hours in object format
//originally thought to put hours in a seperate table to refer to winery ID
const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS somm_comments;
  DROP TABLE IF EXISTS somm_reviews;
  DROP TABLE IF EXISTS somm_favorites;
  DROP TABLE IF EXISTS somm_wishlist;
  DROP TABLE IF EXISTS winery;
  DROP TABLE IF EXISTS ava_district;
  DROP TABLE IF EXISTS somm;
            CREATE TABLE ava_district (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255) NOT NULL
    );
    INSERT INTO ava_district (location) VALUES ('Adelaida District');
    INSERT INTO ava_district (location) VALUES ('Creston District');
    INSERT INTO ava_district (location) VALUES ('El Pomar District');
    INSERT INTO ava_district (location) VALUES ('Paso Robles Estrella District');
    INSERT INTO ava_district (location) VALUES ('Paso Robles Geneseo District');
    INSERT INTO ava_district (location) VALUES ('Paso Robles Highlands District');
    INSERT INTO ava_district (location) VALUES ('Paso Robles Willow Creek District');
    INSERT INTO ava_district (location) VALUES ('San Juan Creek');
    INSERT INTO ava_district (location) VALUES ('San Miguel District');
    INSERT INTO ava_district (location) VALUES ('Santa Margarita Ranch');
    INSERT INTO ava_district (location) VALUES ('Templeton Gap District');
  CREATE table somm(
          id UUID PRIMARY KEY,
          first_name VARCHAR (250),
          last_name VARCHAR (250),
          username VARCHAR(50) NOT NULL UNIQUE,
          password text NOT NULL,
          email VARCHAR(250) NOT NULL,
          is_admin BOOLEAN default false
      );  
       CREATE TABLE winery(
          id SERIAL PRIMARY KEY,
          name VARCHAR(250) NOT NULL, 
          address VARCHAR(255),
          phone VARCHAR(255),
          hours VARCHAR,
          description TEXT,
          img text,
          website text,
          reservations_required BOOLEAN default false,
          ava_district_id INTEGER REFERENCES ava_district(id)
      );
      INSERT INTO winery(name, address, phone, hours, description, img, website, reservations_required, ava_district_id)
      VALUES('DAOU','2777 Hidden Mountain Rd, Paso Robles, CA','805-226-5460', '10:00 AM - 5:00 PM','Renowned for its stunning hilltop views and exceptional Bordeaux-style wines.','https://winemaps.com/sites/default/files/styles/large/public/2019-10/readytogo_5.jpg?itok=uspdG2tR','https://www.daouvineyards.com', False, 1),
      ('Halter Ranch', '8910 Adelaida Rd, Paso Robles, CA','805-226-9455','10:00 AM - 5:00 PM', 'Offer a blend of historic charm and sustainable winemaking on its picturesque estate.', 'https://bloximages.chicago2.vip.townnews.com/santamariatimes.com/content/tncms/assets/v3/editorial/4/4e/44e49682-13a4-5944-ba9b-25f6efa9a949/572132e9ac6e1.image.jpg','https://www.halterranch.com', False, 1),
      ('LAventure','2815 Live Oak Rd, Paso Robles, CA','805-227-1588','10:00 AM - 4:00 PM', 'LAventure Winery is celebrated for its innovative, Rhône and Bordeaux-inspired blends crafted by renowned winemaker Stephan Asseo.','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/57/f6/98/winery.jpg?w=1200&h=-1&s=1','https://www.aventurewine.com', False, 7),
      ('Turley', '2900 Vineyard Dr, Templeton, CA','805-434-1030', '10:00 AM - 5:00 PM', 'Turley Wine Cellars is acclaimed for its robust Zinfandels and Petite Syrahs, sourced from historic old vine vineyards across California.', 'https://media-cdn.tripadvisor.com/media/photo-s/17/d9/21/b2/main-entrance-to-the.jpg', 'https://www.turleywinecellars.com', False, 7),
      ('Eberle', '3810 CA-46, Paso Robles, CA','805-238-9607', '10:00 AM - 5:00 PM', 'Eberle Winery in Paso Robles is celebrated for its award-winning wines and pioneering role in the regions winemaking, offering a unique experience with its vineyard tours and underground caves.','https://www.eberlewinery.com/images/about-the-eberle-caves-paso-robles.jpg', 'https://www.eberlewinery.com', False, 11),
      ('Villa Creek','5995 Peachy Canyon Rd, Paso Robles, CA','805-238-7145','11:00 AM - 5:00 PM', 'Villa Creek Vineyard in Paso Robles produces distinctive, biodynamically-farmed wines that reflect the unique terroir of the region, emphasizing sustainability and artisanal craftsmanship.', 'https://media-cdn.tripadvisor.com/media/photo-s/1d/bf/fb/44/ariel-view-of-the-maha.jpg','https://www.villacreek.com', False, 1),
      ('Denner', '5414 Vineyard Dr, Paso Robles, CA','805-239-4287','10:00 AM - 5:00 PM', 'Denner Vineyards in Paso Robles is renowned for its meticulously crafted Rhône and Bordeaux varietals, produced on its stunning hillside estate with a commitment to innovative and sustainable viticulture.', 'https://ak.jogurucdn.com/media/image/p14/place-2017-03-21-12-c5e1b924d092bcade8d9ecc06b6869ba.jpg','https://www.dennervineyards.com', False, 7),
      ('Peachy Canyon','2020 Nacimiento Lake Dr, Paso Robles, CA','805-239-1918','10:00 AM - 5:00 PM', 'Peachy Canyon Winery in Paso Robles is famous for its rich, flavorful Zinfandels and welcoming, family-owned atmosphere, offering a quintessential wine country experience.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/a9/48/23/the-big-chair-at-our.jpg?w=1200&h=-1&s=1','https://www.peachycanyon.com', False, 1),
      ('Sculpterra','5015 Linne Rd, Paso Robles, CA','805-226-8881','10:00 AM - 5:00 PM', 'Sculpterra Winery in Paso Robles uniquely blends art and wine, offering award-winning wines amidst beautiful sculptures and gardens on its picturesque estate.','https://media-cdn.tripadvisor.com/media/photo-s/02/66/f4/1e/sculpterra-winery-sculpture.jpg','https://sculpterra.com/', False, 3),
      ('Epoch', '7505 York Mountain Rd, Templeton, CA','805-237-7575','10:00 AM - 4:00 PM', 'better description of epoch', 'https://www.cooperchase.com/wp-content/uploads/2021/12/epoch-1a-768x444.jpg','https://www.epochwines.com', False, 7),
      ('Brecon','7450 Vineyard Dr, Paso Robles, CA','805-239-2200','11:00 AM - 5:00 PM', 'decription of brecon', 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1b2e430123665.561457900e12d.jpg', 'https://www.breconestate.com',False, 5),
      
('Tooth & Nail', '3090 Anderson Rd, Paso Robles, CA','805-369-6100','10:00 AM - 6:00 PM', 'description of tooth and nail','https://cdn0.weddingwire.com/vendor/480827/3_2/1280/jpg/1515006875-43878b5c0f751864-castle_no_logo__002__High_Def.jpeg','https://cdn0.weddingwire.com/vendor/480827/3_2/1280/jpg/1515006875-43878b5c0f751864-castle_no_logo__002__High_Def.jpeg', False, 7),

      ('Niner', '2400 CA-46, Paso Robles, CA','805-239-2233','10:00 AM - 5:00 PM', 'description of niner', 'https://th.bing.com/th/id/OLC.lzBvUs9Q7E5rmQ480x360?&rs=1&pid=ImgDetMain','https://www.ninerwine.com', False, 7),
      ('Austin Hope & Treana', '1585 Live Oak Rd, Paso Robles, CA','805-238-4112','10:00 AM - 4:00 PM', 'Ausitn Hope Description', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/8b/7f/b1/our-tasting-cellar-feature.jpg?w=1200&h=-1&s=1', 'https://www.hopefamilywines.com', False, 11);
  CREATE TABLE somm_wishlist(
        id UUID PRIMARY KEY,
        somm_id UUID REFERENCES somm(id) NOT NULL,
        winery_id INTEGER REFERENCES winery(id) NOT NULL,
        CONSTRAINT unique_somm_wishlist UNIQUE(somm_id, winery_id)
    );
    CREATE TABLE somm_reviews(
      id UUID PRIMARY KEY,
      title VARCHAR NOT NULL,
      rating integer NOT NULL,
      comment text NOT NULL,
      somm_id UUID REFERENCES somm(id),
      winery_id INTEGER REFERENCES winery(id),
      img text
  );  
    CREATE TABLE somm_comments(
id UUID PRIMARY KEY,
comment TEXT NOT NULL,
somm_review_id UUID REFERENCES somm_reviews(id)
);
CREATE TABLE somm_favorites(
    id UUID PRIMARY KEY,   
    somm_id UUID REFERENCES somm(id) NOT NULL,
    winery_id INTEGER REFERENCES winery(id) NOT NULL,
    body text,
    img text,
    CONSTRAINT unique_somm_favorites UNIQUE(somm_id, winery_id)
); 



  `;
  await client.query(SQL);
};

const createReview = async ({
  somm_id,
  winery_id,
  rating,
  title,
  comment,
  img,
}) => {
  const SQL = `
      INSERT INTO somm_reviews(id, somm_id, winery_id, rating, title, comment, img)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    somm_id,
    winery_id,
    rating,
    title,
    comment,
    img,
  ]);
  return response.rows[0];
};

const createComment = async ({ somm_review_id, comment }) => {
  const SQL = `
      INSERT INTO somm_comments(id, somm_review_id, comment)
      VALUES ($1, $2, $3)
      RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    somm_review_id,
    comment,
  ]);
  return response.rows[0];
};

const destroyReviews = async ({ id, somm_id }) => {
  console.log(id, somm_id);
  const SQL = `
      DELETE FROM somm_reviews
      WHERE id = $1 AND somm_id=$2
  `;
  const response = await client.query(SQL, [id, somm_id]);
  return response.status;
};

const fetchSomms = async () => {
  const SQL = `
    SELECT id, username, email, first_name, last_name
    FROM somm
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchWineries = async () => {
  const SQL = `
    SELECT *
    FROM winery
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//how to create wishlists. to finish tomorrow!!!
const createWishlist = async ({ somm_id, winery_id }) => {
  const SQL = `
    INSERT INTO somm_wishlist(id, somm_id, winery_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), somm_id, winery_id]);
  return response.rows[0];
};

//create itinerary. includes: winery name, time, reservations(yes/no),

module.exports = {
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
};
