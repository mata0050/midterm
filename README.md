<h1 align="center">
  <br>
<img src="./public/images/feature-photo.jpeg" alt="A person holding paper baggs with with food made ready for pick-up" width="200">
  <br>
  FOODSKIP
</h1>
<h3 align="center">Easy and reliable food pick-up ordering service</h3>
<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-yellow">
  <img src="https://img.shields.io/badge/Express-4.17.1-green">
  <img src ="https://img.shields.io/badge/jQuery-3.0.0-blue">
  <img src="https://img.shields.io/badge/Twilio-blueviolet">
</p>
<p align="center">
<img src="./public/video/foodskip.gif" width="500"></p>

## Getting Started

Follow these steps after setting up a local PostgreSQL database:

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`

- Check the db folder to see what gets created and seeded in the SDB

7. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

8. Visit `http://localhost:8080/`

## Dependencies

- node 10.x or above
- npm 5.x or above
- pg 6.x
- express
- cookie-session
- pg-native
- pg-promise
- sass
- twilio
