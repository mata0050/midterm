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

## Description

A food pick-up service ordering app built with Node.js, Express and JQuery, using PostgreSQL for development database. The app serves as an intermediary between the restaurant and client and integrates Twilio API for SMS notifications.

## Key Features

User:

- Browse menu and orders
- Order food
- SMS notifications

Restaurant:

- CRUD for restaurant menu
- Update order status
- SMS notifications

## Project Screenshots

<p align="center">
  <img src ="./public/images/order-summary.png" width="600"></p>
 <p align="center">
  <img src="./public/images/tiramisu.png" width="300">
  <img src="./public/images/new-menu-item.png" width="300">
  </p>
 <p align="center">
  <img src ="./public/images/user-orders.png" width="500"></p>

## Getting Started

Follow these steps after setting up a local PostgreSQL database:

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`

6. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

7. Visit `http://localhost:8080/`

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

## Future Improvements

- Registration and login
- User profile page
- Cancelling order
