const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/ecommerce_site_db"
);
//import uuid
const { v4: uuidv4 } = require("uuid");

// need a new table to update restaurant times depending on the day.
const createRestaurant = async (
  name,
  cuisine_id,
  hours,
  location,
  img,
  website
) => {
  const SQL = `  
      INSERT INTO restaurant(name, cuisine_id, hours, location, img, website) 
      VALUES($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
  const response = await client.query(SQL, [
    name,
    cuisine_id,
    hours,
    location,
    img,
    website,
  ]);
  return response.rows[0];
};

//changing "foodie" to represent "user" as user is a designated keyword id rather not use..r

const createFoodie = async (username, password, email, is_admin) => {
  const SQL = `
    INSERT INTO foodie(id, username, password, email, is_admin)
     VALUES($1, $2, $3, $4, $5) 
     RETURNING *
  `;
  const response = await client.query(SQL, [
    uuidv4(),
    username,
    password,
    email,
    is_admin,
  ]);
  return response.rows[0];
};

// decided to keep hours in the restaurant table and made days/hours in object format
//originally thought to put hours in a seperate table to refer to restaurant ID
const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS restaurant_hours;
  DROP TABLE IF EXISTS foodie_reviews;
  DROP TABLE IF EXISTS foodie_favorites;
  DROP TABLE IF EXISTS foodie_wishlist;
  DROP TABLE IF EXISTS restaurant;
  DROP TABLE IF EXISTS cuisine;
      DROP TABLE IF EXISTS foodie;
      CREATE TABLE cuisine(
        id INTEGER PRIMARY KEY,
        name VARCHAR
      );
      INSERT into cuisine(id, name) VALUES(1,'Mexican');
      INSERT into cuisine(id, name) VALUES(2,'Vietnamese');
      INSERT into cuisine(id, name) VALUES(3,'Italian');
      INSERT into cuisine(id, name) VALUES(4,'Korean');
      INSERT into cuisine(id, name) VALUES(5,'BBQ');
      INSERT into cuisine(id, name) VALUES(6, 'Indian');
      CREATE table foodie(
          id UUID PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(50) NOT NULL,
          email TEXT NOT NULL,
          is_admin BOOLEAN default false
      );
       CREATE TABLE restaurant(
          id SERIAL PRIMARY KEY,
          name VARCHAR(250) NOT NULL, 
          hours VARCHAR(250) NOT NULL,
          cuisine_id INTEGER REFERENCES cuisine(id) NOT NULL,
          location VARCHAR(250),
          img text,
          website text
      );
      CREATE TABLE foodie_wishlist(
        id UUID PRIMARY KEY,
        foodie_id UUID REFERENCES foodie(id) NOT NULL,
        restaurant_id INTEGER REFERENCES restaurant(id) NOT NULL
    );  
    CREATE TABLE foodie_reviews(
      id UUID PRIMARY KEY,
      title VARCHAR,
      body text,
      foodie_id UUID REFERENCES foodie(id) NOT NULL,
      restaurant_id INTEGER REFERENCES restaurant(id) NOT NULL,
      img text
  );  
  CREATE TABLE foodie_favorites(
    id UUID PRIMARY KEY,   
    foodie_id UUID REFERENCES foodie(id) NOT NULL,
    restaurant_id INTEGER REFERENCES restaurant(id) NOT NULL,
    body text,
    img text
);    

  `;
  await client.query(SQL);
};

const fetchFoodies = async () => {
  const SQL = `
    SELECT id, username 
    FROM foodie
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
    SELECT *
    FROM restaurant
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//how to create wishlists. to finish tomorrow!!!
const createWishlist = async ({ user_id, skill_id }) => {
  const SQL = `
    INSERT INTO user_skills(id, user_id, skill_id) VALUES ($1, $2, $3) RETURNING * 
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, skill_id]);
  return response.rows[0];
};

module.exports = {
  client,
  createRestaurant,
  createTables,
  createFoodie,
  fetchFoodies,
  fetchRestaurants,
};
