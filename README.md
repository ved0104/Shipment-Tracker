Shipment Tracker Application
============================

Overview
--------

This project consists of a **Backend** (Node.js + Express) and **Frontend** (React) to track the shipment and calculate its Estimated Time of Arrival (ETA). The backend exposes APIs to fetch shipment details, including the ETA, while the frontend displays the information in a user-friendly interface.

Technologies Used
-----------------

-   **Frontend:** React, Axios
-   **Backend:** Node.js, Express, MongoDB
-   **Database:** MongoDB

Setup Instructions
------------------

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Backend Setup

1.  **Clone the repository:**

    bash

    `git clone <repository-url>
    cd <repository-name>/backend`

2.  **Install dependencies:** Navigate to the backend folder and run:

    bash

    `npm install`

3.  **Set up environment variables:** Create a `.env` file in the backend directory with the following variables:

    env

    `PORT=5000
    MONGODB_URI=<your-mongodb-uri>   # MongoDB connection URI`

    Example for local MongoDB:

    env

    `MONGODB_URI=mongodb://localhost:27017/shipment_tracker`

4.  **Start the backend server:** Run the following command to start the backend server:

    bash

    `npm start`

    The backend should now be running at `http://localhost:5000`.

* * * * *

### Frontend Setup

1.  **Clone the repository (if you haven't already):**

    bash

    `git clone <repository-url>
    cd <repository-name>/frontend`

2.  **Install dependencies:** Navigate to the frontend folder and run:

    bash

    `npm install`

3.  **Set up environment variables:** If your frontend communicates with an API that requires an environment variable (e.g., backend URL), create a `.env` file in the frontend directory:

    env

    `REACT_APP_API_URL=http://localhost:5000/api`

4.  **Start the frontend server:** Run the following command to start the frontend server:

    bash

    `npm start`

    The frontend should now be running at `http://localhost:3000`.
