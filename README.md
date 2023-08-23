<div align="center">
  <img src="https://ik.imagekit.io/tjiw3sd2q/logo.jpg?tr=w-200,h-200,q-50"/>
</div>

# 👋 Welcome! folks, to ShopMaikusobu

ShopMaikusobu is a full-stack e-commerce and social web application that enables users to discover, buy, and manage products online, as well as chat and connect with other customers who share their interests. It is built with React, Express, MongoDB, and RTK Query.

## 📋 Table of Contents

- 🏠 [ShopMaikusobu](#shopmaikusobu)
  - ✨ [Features](#features)
  - 🖨️ [Technologies](#technologies)
  - ⬇️ [Installation](#installation)
  - 🌐 [Demo](#demo)
  - 📜 [License](#license)
  - 🚍 [Resources](#resources)
  - 🤲 [Contributors](#contributors)

## ✨ Features <a name="features"></a>

- Users can view a list of products with details such as name, price, description, and rating.
- Users can view a list of customers's review and rating on the product they have purchased.
- Users can explore a variety of products and discover other customers who have shared their opinions and experiences. They can initiate a chat with them and exchange insights and tips about the products they are interested in.
- Users can add products to their shopping cart, change the quantity, or remove them from the cart.
- Users can checkout and pay for their orders using a secure payment system.
- Users can create an account, log in, log out, change their password and verify their email address.
- Users can create a strong and secure password using a password generator that randomly generates a combination of letters, numbers, and symbols.
- Users can pay for their orders using a credit generator that creates a virtual credit card number that is valid for one-time use only. This protects their personal and financial information from fraud and theft.
- Users can update their profile information, such as avatar, payment method and shipping address.
- Users can view their order history and track the status of their orders.
- Users can rate and review the products they purchased using a star rating system and a text box. They can also edit or delete their reviews at any time (ongoing).
- Users can chat with other users who have reviewed the products they are interested in. This allows them to exchange opinions, feedback, and tips about the products.
- Users can also contact the shop owner or the customer service team through a contact form that verifies their identity and sends them a confirmation email.
- Users can receive notifications and updates about their orders, products, and chats via email (ongoing).
- The application handles user authentication and authorization using JWT tokens

## 🖨️ Technologies <a name="technologies"></a>

<div align="center">
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/187896150-cc1dcb12-d490-445c-8e4d-1275cd2388d6.png" alt="Redux" title="Redux"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/182884177-d48a8579-2cd0-447a-b9a6-ffc7cb02560e.png" alt="mongoDB" title="mongoDB"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/187070862-03888f18-2e63-4332-95fb-3ba4f2708e59.png" alt="websocket" title="websocket"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" alt="CSS" title="CSS"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/192107858-fe19f043-c502-4009-8c47-476fc89718ad.png" alt="REST" title="REST"/></code>
</div>

- React: A JavaScript library for building user interfaces.
- Express: A web framework for Node.js that provides features for web and mobile applications.
- MongoDB: A document-based database that stores data in JSON-like format.
- RTK Query: A data fetching and caching library for React applications that simplifies data fetching and caching logic.
- Node.js: A cross-platform runtime environment and library for running JavaScript applications outside the browser. It is used for creating server-side and networking web applications1
- Socket.io: A library that enables low-latency, bidirectional and event-based communication between a client and a server. It is built on top of the WebSocket protocol and provides additional features like fallback to HTTP long-polling or automatic reconnection2
- Cluster: A module that allows Node.js to create multiple processes that can share the same server port. It is useful for improving the performance and scalability of Node.js applications.
- Mantine Ui: Mantine UI is a set of responsive components for building web applications with React. It is free and open source, and supports both light and dark themes

## ⬇️ Installation <a name="installation"></a>

To run the application locally, you need to have Node.js and MongoDB installed on your machine. Then follow these steps:

1. Clone the repository from GitHub: `git clone https://github.com/maikusobu/ShopMaikusobu.git`
2. Navigate to the project folder: `cd shopmaikusobu`
3. Navigate to the server folder: `cd server`
4. Install the dependencies of server: `npm install`
5. Populate the database: `npm run populate`
6. Complete build before run the server: `npm run build-template`
7. Run the server: `npm run dev`
8. The server will be listened on `http://localhost:3000`
9. Navigate back to the root folder: `cd ..`
10. Navigate to the client folder: `cd client`
11. Install the dependencies of the client: `npm install --force`
12. Run build the client: `npm run build`
13. Start the client: `npm run dev`
14. Open your browser and go to `http://localhost:5173`

## 🌐 Demo <a name="demo"></a>

You can also view a live demo of the application here: https://shopmaikusobu.vercel.app/

<div>
<img src="https://ik.imagekit.io/tjiw3sd2q/image.png?updatedAt=1691386726212"/>
</div>

## 📜 License <a name="license"></a>

- This project is licensed under the MIT License
- Owner: [<img src="https://github.com/maikusobu.png" width="60px;"/>](https://github.com/maikusobu/ShopMaikusobu) <br/>
  <Strong><a href="https://github.com/maikusobu">Maikusobu</a></Strong>

## 🚍 Resources <a name="resources"></a>

Here are some external resources or references that are related to this project:

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Mantine UI Documentation](https://mantine.dev/pages/basics/)
- [Socket.io Documentation](https://socket.io/docs/v4/)

## 🤲 Contributors <a name="contributors"></a>

Here are the contributors of this project:

<div>
	<a href="https://github.com/maikusobu"><img src="https://github.com/maikusobu.png" width="60px;"/> </a>
    <a href="https://github.com/Nhat-Original"><img src="https://github.com/Nhat-Original.png" width="60px;"/> </a>
</div>
