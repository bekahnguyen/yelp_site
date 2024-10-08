const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/paso_appy_db"
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
    const payload = jwt.verify(tokenNoBearer, JWT);
    id = payload.id;
    console.log("id:", id);
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
  console.log("id:", id);
  const response = await client.query(SQL, [id]);
  console.log("response:", response);
  if (!response.rows.length) {
    const error = Error("not authorized?");
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
  DROP TABLE IF EXISTS somm;
  DROP TABLE if EXISTS itinerary;
  DROP TABLE IF EXISTS enhancement;
  DROP TABLE IF EXISTS winery cascade;
  DROP TABLE IF EXISTS ava_district CASCADE;
  DROP TABLE IF EXISTS attributes CASCADE;
  DROP TABLE IF EXISTS winery_attributes ;
  DROP TABLE IF EXISTS restaurant;
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
      ('Halter Ranch', '8910 Adelaida Rd, Paso Robles, CA','805-226-9455','10:00 AM - 5:00 PM', 'A blend of historic charm and sustainable winemaking on a picturesque estate.', 'https://bloximages.chicago2.vip.townnews.com/santamariatimes.com/content/tncms/assets/v3/editorial/4/4e/44e49682-13a4-5944-ba9b-25f6efa9a949/572132e9ac6e1.image.jpg','https://www.halterranch.com', False, 1),
  ('Opolo', '7110 Vineyard Dr, Paso Robles, CA', '805-238-9593', '10:00 AM - 5:00 PM', 'Opolo Vineyards known for producing a diverse range of high-quality wines, including Zinfandel, Cabernet Sauvignon, and blends, with a focus on bold, fruit-forward flavors.', 'https://assets.simpleviewinc.com/simpleview/image/fetch/c_limit,h_1200,q_75,w_1200/https://assets.simpleviewinc.com/simpleview/image/upload/crm/slocal/Opolo_food_wine_9B9FB8EC-5056-A36A-0BF39B6A8C8E82E8-9b9fb70e5056a36_9b9fc0b1-5056-a36a-0bde3399705c8c98.jpg', 'opolo.com', False, 7 ),
      ('LAventure','2815 Live Oak Rd, Paso Robles, CA','805-227-1588','10:00 AM - 4:00 PM', 'LAventure Winery is celebrated for its innovative, Rhône and Bordeaux-inspired blends crafted by winemaker Stephan Asseo.','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/57/f6/98/winery.jpg?w=1200&h=-1&s=1','https://www.aventurewine.com', False, 7),
      ('Turley', '2900 Vineyard Dr, Templeton, CA','805-434-1030', '10:00 AM - 5:00 PM', 'Turley Wine Cellars is acclaimed for its robust Zinfandels and Petite Syrahs, sourced from historic old vine vineyards across California.', 'https://media-cdn.tripadvisor.com/media/photo-s/17/d9/21/b2/main-entrance-to-the.jpg', 'https://www.turleywinecellars.com', False, 7),
      ('Eberle', '3810 CA-46, Paso Robles, CA','805-238-9607', '10:00 AM - 5:00 PM', 'Eberle Winery is celebrated for its award-winning wines and pioneering role in the regions winemaking, offering a unique experience with its vineyard tours and underground caves.','https://www.eberlewinery.com/images/about-the-eberle-caves-paso-robles.jpg', 'https://www.eberlewinery.com', False, 11),
      ('Villa Creek','5995 Peachy Canyon Rd, Paso Robles, CA','805-238-7145','11:00 AM - 5:00 PM', 'Villa Creek Vineyard in Paso Robles produces distinctive, biodynamically-farmed wines that reflect the unique terroir of the region, emphasizing sustainability and artisanal craftsmanship.', 'https://media-cdn.tripadvisor.com/media/photo-s/1d/bf/fb/44/ariel-view-of-the-maha.jpg','https://www.villacreek.com', False, 1),
      ('Denner', '5414 Vineyard Dr, Paso Robles, CA','805-239-4287','10:00 AM - 5:00 PM', 'Featuring meticulously crafted Rhône and Bordeaux varietals, produced on its stunning hillside estate with a commitment to innovative and sustainable viticulture.', 'https://ak.jogurucdn.com/media/image/p14/place-2017-03-21-12-c5e1b924d092bcade8d9ecc06b6869ba.jpg','https://www.dennervineyards.com', False, 7),
      ('Peachy Canyon','2020 Nacimiento Lake Dr, Paso Robles, CA','805-239-1918','10:00 AM - 5:00 PM', 'Peachy Canyon Winery in Paso Robles is famous for its rich, flavorful Zinfandels and welcoming, family-owned atmosphere, offering a quintessential wine country experience.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/a9/48/23/the-big-chair-at-our.jpg?w=1200&h=-1&s=1','https://www.peachycanyon.com', False, 1),
      ('Sculpterra','5015 Linne Rd, Paso Robles, CA','805-226-8881','10:00 AM - 5:00 PM', 'Sculpterra Winery in Paso Robles uniquely blends art and wine, offering award-winning wines amidst beautiful sculptures and gardens on its picturesque estate.','https://media-cdn.tripadvisor.com/media/photo-s/02/66/f4/1e/sculpterra-winery-sculpture.jpg','https://sculpterra.com/', False, 3),
      ('Epoch', '7505 York Mountain Rd, Templeton, CA','805-237-7575','10:00 AM - 4:00 PM', 'Epoch in Paso Robles is a renowned winery celebrated for its high-quality, Rhone and Zinfandel varietals, produced from historic and diverse vineyards.', 'https://www.cooperchase.com/wp-content/uploads/2021/12/epoch-1a-768x444.jpg','https://www.epochwines.com', False, 7),
      ('Brecon','7450 Vineyard Dr, Paso Robles, CA','805-239-2200','11:00 AM - 5:00 PM', 'Brecon Estate in Paso Robles is a boutique winery known for its award-winning, small-batch wines crafted with a focus on innovative blends and sustainable practices.', 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1b2e430123665.561457900e12d.jpg', 'https://www.breconestate.com',False, 5),
      ('Linne Calodo','3030 Vineyard Dr, Paso Robles, CA', '805-227-0797', '10:00Am -5:00 PM', 'Known for producing innovative, small-batch Rhône-style blends and Zinfandels that emphasize the unique terroir of the region.', 'https://pults.com/wp-content/uploads/2012/10/Linne_Calodo_Winery_Main_Entrance1.jpg','linnecalodo.com', True, 7),
      ('Alta Colina', '2825 Adelaida Rd, Paso Robles, CA', '805-227-4191', '10:00 AM- 4:00 PM', 'Alta Colina is a family-owned winery in Paso Robles, California, known for producing high-quality Rhône-style wines from organically farmed, estate-grown grapes.', 'https://media-cdn.tripadvisor.com/media/photo-s/10/8d/cd/68/alta-colina-vineyard.jpg', 'altacolina.com', False, 1  ),
('Tooth & Nail', '3090 Anderson Rd, Paso Robles, CA','805-369-6100','10:00 AM - 6:00 PM', 'Tooth & Nail Winery in Paso Robles is a unique winery famed for its bold, artfully blended wines and its castle-like tasting room offering an immersive and eclectic experience.','https://cdn0.weddingwire.com/vendor/480827/3_2/1280/jpg/1515006875-43878b5c0f751864-castle_no_logo__002__High_Def.jpeg','www.toothandnailwine.com', False, 7),
('Adelaida', '5805 Adelaida Rd, Paso Robles, CA', '805-239-8980', '10:00 Am - 4:00 PM WED-MON', 'A family-owned winery sustainably farmed estate vineyards and premium wines.', 'https://www.adelaida.com/assets/images/contentblock/photos/Adelaidapanophotoshopped.jpg', 'www.adelaida.com', False, 1  ),
('Booker', '2640 Anderson Rd, Paso Robles, CA', '805-237-7367', '10:00 AM- 4:00 PM', 'High-quality, limited-production wines made from estate-grown Rhône varietals, with a focus on sustainable farming and minimalist winemaking practices.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1e/79/a6/6e/main-tasting-room.jpg?w=1200&h=-1&s=1', 'www.bookerwines.com', True, 7),

      ('Niner', '2400 CA-46, Paso Robles, CA','805-239-2233','10:00 AM - 5:00 PM', 'Niner Wine Estates in Paso Robles is a family-owned winery known for its estate-grown wines, stunning Heart Hill Vineyard, and commitment to sustainable farming practices.', 'https://th.bing.com/th/id/OLC.lzBvUs9Q7E5rmQ480x360?&rs=1&pid=ImgDetMain','https://www.ninerwine.com', False, 7),
      ('Austin Hope & Treana', '1585 Live Oak Rd, Paso Robles, CA','805-238-4112','10:00 AM - 4:00 PM', 'Austin Hope Winery in Paso Robles is renowned for its premium Cabernet Sauvignon and commitment to crafting bold, expressive wines that reflect the regions terroir.', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/8b/7f/b1/our-tasting-cellar-feature.jpg?w=1200&h=-1&s=1', 'https://www.hopefamilywines.com', False, 11),
      ('J Dusi', '1401 W Highway 46, Paso Robles, CA, 93446', '805-226-2034', '11:00 AM - 4:00 PM', 'A family-owned winery known for its Zinfandel wines and its rich winemaking heritage dating back to the 1920s.', 'https://www.jdusiwines.com/images/headers/j-dusi-wines-tasting-room-westside-paso-robles-winery.jpg', 'https://www.jdusiwines.com/', False, 7),
      ('Jack Creek', '5265 Jack Creek Rd, Templeton, CA, 93465', '805-226-8283', '10:00 AM - 5:00 PM, MON-SAT', 'Jack Creek Cellars is a boutique winery specializing in small-batch, estate-grown wines with a focus on quality and sustainability.', 'https://s3-media0.fl.yelpcdn.com/bphoto/YxPWqzREPHAt6I9---Xh8A/l.jpg','https://www.jackcreekcellars.com/', False, 11),
      ('Wineward', '1380 Live Oak Road, Paso Robles, CA, 93446', '805-237-1425', '10:30 AM - 5:00 PM', 'A family owned vineyard dedicated to crafting small-lot wines that emphasize sustainability and the unique character of their estate-grown grapes.', 'https://media-cdn.tripadvisor.com/media/photo-s/18/92/9f/5f/our-tasting-room.jpg', 'www.windwardvineyard.com', False, 11),
      ('Monochrome', '3075 Blue Rock Rd, Paso Robles, CA, 93446', '805-674-2160', '11:00 AM - 4:00 PM WED- SAT', 'Complex, creative, completely unique white wines.', 'https://th.bing.com/th/id/OIP.nJVxr4V-RASpbUTQZLVsPAHaFj?rs=1&pid=ImgDetMain', 'https://monochromewines.com/', True, 1 );
      ;
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
somm_review_id UUID REFERENCES somm_reviews(id),
somm_id UUID REFERENCES somm(id)
);
CREATE TABLE somm_favorites(
    id UUID PRIMARY KEY,   
    somm_id UUID REFERENCES somm(id) NOT NULL,
    winery_id INTEGER REFERENCES winery(id) NOT NULL,
    body text,
    img text,
    CONSTRAINT unique_somm_favorites UNIQUE(somm_id, winery_id)
); 
CREATE TABLE attributes(
id INTEGER PRIMARY KEY,
name VARCHAR
);

CREATE TABLE winery_attributes(
id INTEGER PRIMARY KEY,
winery_id INTEGER references winery(id) NOT NULL,
attributes_id INTEGER REFERENCES attributes(id) NOT NULL);

CREATE TABLE restaurant(
id SERIAL PRIMARY KEY,
name VARCHAR, 
description VARCHAR, 
address VARCHAR,
hours VARCHAR,
phone VARCHAR);
 
INSERT INTO restaurant(name, description, address, hours, phone)
VALUES
('Les Petites Canailles', 'Fine Dining Modern French', '1215 Spring Street, Paso Robles, CA 93446', '2:00 PM- 10:00PM TR-M', '805-296-3754'),
('Il Cortile', 'Northern Italian Cuisine', '608 12th St, Paso Robles, CA, 93446', '5:00 PM- 10:00 PM Wed-Sun', '805-226,0300' ),
('The Catch', 'Casual Seafood Cuisine', '836 11th St, Paso Robles, CA, 93446', '4:00 PM- 9:00 PM', '805-239-3332' ),
('Thomas Hill Organics', 'Farm to Table Seasonal Cuisine', '1313 Park St, Paso Robles, CA, 93446', '11:00 AM- 3:00 PM, 5:00 PM- 9:30 PM Thurs- Tues', '805-226-5888'),
('Goshi', 'Quaint, low-key restaurant with quality sushi', '722 Pine Street, Paso Robles, CA, 93446', '11:30 AM - 1:30 PM, 5:00 PM- 8:00 PM TUES-SAT', '805-227-4860' ),
('McPhees Grill', 'Steakhouse, Seafood, and Pasta Cuisine', '416 S Main St, Templeton, CA 93465', '5:00 PM- 9:00 PM Wed-Sun','805-434-3204');

CREATE TABLE enhancement(
id SERIAL PRIMARY KEY,
name VARCHAR,
description VARCHAR,
address VARCHAR,
hours VARCHAR,
phone VARCHAR
);

INSERT INTO enhancement(name, description, address, hours, phone) 
VALUES
('Sensorio Field of Lights', '58,000 Fiber Optic LED Light Art Display', '4380 E Highway 46, Paso Robles, CA, 93446', '10:00 AM- 5:00 PM M-F', '805-226-4287' ),
('River Oak Hot Springs', 'Natural Paso Robles Hot Springs Spa', '800 Clubhouse Dr, Paso Robles, CA, 93446', '9:00 AM- 9:00 PM', '805-238-4600'),
('Pasolivo Olive Oil Ranch', 'Award Winning Artisanal Olive Oil', '8530 Vineyard Drive, Paso Robles, CA, 93446', '11:00 AM- 5:00 PM', '805-227-0186');

CREATE TABLE itinerary(
id SERIAL PRIMARY KEY,
notes VARCHAR,
eatFirst TIME,
lunch_id INTEGER references restaurant(id),
time TIME,
winery_id INTEGER references winery(id) NOT NULL,
time2 TIME,
winery_id_2 INTEGER references winery(id) NOT NULL,
time3 TIME,
winery_id_3 INTEGER references winery(id),
timeL TIME,
lunch VARCHAR,
time4 TIME,
winery_id_4 INTEGER references winery(id),
time5 TIME,
restaurant_id INTEGER references restaurant(id)
);

INSERT INTO itinerary(notes, eatFirst, lunch_id, time, winery_id, time2, winery_id_2, time3, winery_id_3, timeL, lunch, time4, winery_id_4, time5, restaurant_id)
VALUES ('When you want premium west side wines and do not mind the high price points', null, null, '11:00', 8, '12:00', 13, null, null, null, null, '1:30', 17, '8:00', 1 ),
('When you are staying at Allegretto', null, null, '11:00', 12, '12:00', 11, '1:00', 18, null, null, '2:00', 20, '7:00', 1 ),
('When you are looking for Paso staples and incredible views', null, null, '11:00', 2, '12:00',  16, '1:00', 1, null, null, '2:45',  14, '7:00', 5),
('When you want delicious wines and a pit stop for lunch', null, null, '11:00', 12, '12:00', 3, '1:30', 8, null, null, '2:30', 13, null, null ),
('When you want the best cabs', null, null, '11:00', 16, '12:30', 1, '2:30',  2, null, null, null, null, null, null  ),
('When you want the best Pinots', '12:30', 4, '2:00', 21, '4:00', 22, null, null, null, null, null, null,'7:30', 2),
('When...', null, null, '12:00', 18, '1:15', 17, null, null, null, null, null, null, '7:30', 2  );


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
  console.log("route hit");
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
  createWishlist,
  createSomm,
  fetchSomms,
  fetchWineries,
  authenticate,
  findUserByToken,
  createReview,
  destroyReviews,
  createComment,
};
