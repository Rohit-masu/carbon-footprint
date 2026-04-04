# Deployment Guide

## Stack
- **Frontend**: React (Create React App) → deployed on **Vercel**
- **Backend**: Node.js + Apollo GraphQL + MongoDB → deployed on **Render**
- **Database**: MongoDB Atlas (free tier)

---

## 1. MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a DB user with read/write access
3. Whitelist all IPs: `0.0.0.0/0` (required for Render)
4. Copy your connection string:
   ```
   mongodb+srv://<user>:<pass>@cluster.mongodb.net/carbon-footprint?retryWrites=true&w=majority
   ```

---

## 2. Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Set these values:

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Node Version | 18 |

5. Add **Environment Variables** in the Render dashboard:

| Key | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `AQI_API_KEY` | Your OpenWeatherMap key |
| `NODE_ENV` | `production` |

6. Deploy → Render gives you a URL like `https://carbon-footprint-backend.onrender.com`

> ⚠️ Free tier sleeps after 15 min inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping `/graphql` every 5 min to keep it awake.

---

## 3. Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
2. Set **Root Directory** to `client`
3. Framework: **Create React App** (auto-detected)
4. Add **Environment Variables** in Vercel dashboard:

| Key | Value |
|---|---|
| `REACT_APP_OPENWEATHER_KEY` | Your OpenWeatherMap API key |
| `REACT_APP_GRAPHQL_URI` | `https://carbon-footprint-backend.onrender.com/graphql` |

5. Deploy!

---

## 4. Connect Frontend to Backend

In `client/src/App.js`, the Apollo client URI is set to `/graphql` by default.
For production with a separate Render backend, update it:

```js
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
});
```

This is already done. Just make sure `REACT_APP_GRAPHQL_URI` is set in Vercel.

---

## 5. CORS on Render Backend

In `server/server.js`, add CORS **before** Apollo middleware:

```js
const cors = require('cors');
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));
```

Install if needed: `npm install cors` (inside `server/`)

---

## 6. API Keys You Need

| API | Where to get | Cost |
|---|---|---|
| OpenWeatherMap | [openweathermap.org/api](https://openweathermap.org/api) | Free (1000 calls/day) |
| World Bank CO₂ data | No key needed | Free |
| MongoDB Atlas | [mongodb.com/atlas](https://www.mongodb.com/atlas) | Free tier |

---

## Local Development

```bash
# Install root deps
npm install

# Run both client + server concurrently
npm run develop

# Or separately:
cd server && npm install && node server.js   # Backend on :3001
cd client && npm install && npm start         # Frontend on :3000
```

Set up your local `.env` files:
- Copy `server/.env.example` → `server/.env`
- Copy `client/.env.example` → `client/.env`
