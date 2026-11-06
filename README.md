# Job Application Tracker

A local, single-user tracker for job applications. The React app talks to an Express API, which stores applications in MongoDB. There is no login.

## Prerequisites

- Node.js 18 or newer
- MongoDB running on `mongodb://127.0.0.1:27017`

## Setup

1. Start MongoDB.
2. Install the API dependencies:

   ```bash
   cd server
   npm install
   ```

3. Install the UI dependencies:

   ```bash
   cd client
   npm install
   ```

4. Copy the environment file:

   ```bash
   cd server
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env`.

5. Start the API and the UI in two terminals:

   ```bash
   cd server
   npm run dev
   ```

   ```bash
   cd client
   npm run dev
   ```

The API listens on port 5000. The UI listens on port 5173 and proxies `/api` to the API.

## Deploy

The hosted app is one Render web service. It serves the built page and the API. Applications are stored in MongoDB Atlas, so they stay available when your computer is off. There is no login: anyone with the address can view and change your applications. Do not share that address.

Render's free web service sleeps after 15 minutes without visitors. The first open after that takes about a minute.

### MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas) and a free M0 cluster.
2. Create a database user. If the password contains `@`, `:`, or `/`, encode those characters in the connection string.
3. Under Network Access, allow `0.0.0.0/0` so Render can connect.
4. Copy the connection string and set the database name to `job-tracker`. It looks like `mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/job-tracker?retryWrites=true&w=majority`.

### Render

1. Put this project in a GitHub repository.
2. In the [Render dashboard](https://dashboard.render.com), create a new **Web Service** and connect that repository. Choose the **Free** plan.
3. Set the build command to `npm run build` and the start command to `npm start`.
4. Add an environment variable named `MONGODB_URI` with the Atlas connection string. Render sets `NODE_ENV` to `production` for Node services.
5. Deploy. Open the `onrender.com` address Render gives you.

`render.yaml` in this project records those build and start commands. Local development is unchanged: keep using `npm run dev` in `server` and `client`.

## What you can track

Each application has a company, role, status, priority, dates, location, salary, source, job link, and notes. Status moves through Saved, Applied, Interview, Offer, and Rejected. The list sorts overdue follow-ups first, then today's, then future follow-ups, then everything else by newest date applied.
