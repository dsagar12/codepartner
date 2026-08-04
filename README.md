# devConnect — Developer Networking Platform

devConnect is a full-stack social platform designed for developers to discover, connect, and collaborate with like-minded engineers. It combines a swipe-based discovery feed, skill-based recommendations, real-time messaging, and integration with LeetCode and GitHub to showcase coding proficiency.

![devConnect Dashboard](https://via.placeholder.com/800x400?text=devConnect+Dashboard)

##  Features

-  **Authentication** – Sign up / Login with JWT stored in secure HTTP-only cookies.
-  **Profile Management** – Edit photo, bio, skills, and link your LeetCode & GitHub accounts.
-  **Coding Stats** – Fetch your LeetCode solved problems and GitHub repository stats directly in your profile.
-  **Search by Skills** – Find developers based on their tech stack.
-  **Connection Requests** – Send, accept, or reject connection requests; view sent and received requests.
-  **Recommendations** – Get suggestions based on mutual skills.
-  **Swipe Feed** – Tinder-like swipe cards to show interest or ignore other developers.
-  **Real-time Chat** – Instant messaging with typing indicators, powered by Socket.IO.
-  **Responsive UI** – Built with Tailwind CSS and DaisyUI for a clean, modern look.

##  Tech Stack

### Frontend
- React (with Hooks)
- React Router – Navigation
- Redux Toolkit – State management (user slice)
- Tailwind CSS + DaisyUI – Styling
- Framer Motion – Animations
- Axios – HTTP client
- Socket.IO-client – Real-time messaging

### Backend
- Node.js + Express
- MongoDB + Mongoose – Database & ODM
- JSON Web Tokens (JWT) – Authentication
- bcrypt – Password hashing
- Socket.IO – WebSocket server
- dotenv – Environment configuration
- CORS – Cross-origin resource sharing

##  Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or Atlas URI)
- npm or yarn

##  Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/devConnect.git
cd devConnect
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm start
```

The server will run at `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file if needed (default API base is `http://localhost:3000`).

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

##  Environment Variables

### Backend (`.env`)

| Variable     | Description                          |
|--------------|---------------------------------------|
| `PORT`       | Port for the server (default: 3000)   |
| `MONGO_URI`  | MongoDB connection string             |
| `JWT_SECRET` | Secret key for signing JWT tokens     |

> **Note:** The frontend expects the backend to be running on `http://localhost:3000`. If you change the port, update the base URL in the frontend Axios configuration.

##  Usage

1. **Sign Up** – Create an account with your name, email, password, and optional LeetCode/GitHub usernames.
2. **Build Profile** – Add your skills, a bio, and a profile picture (URL).
3. **Discover** – Use the Feed to swipe through developer cards.
4. **Connect** – Send connection requests; accept or reject incoming ones in the Connections tab.
5. **Search** – Find developers by name or skills.
6. **Chat** – Click the chat icon on any connection to start a real-time conversation.
7. **View Stats** – Your LeetCode and GitHub stats appear automatically on your profile (if linked).

##  API Endpoints (Key Routes)

### Auth
- `POST /signup` – Register a new user
- `POST /login` – Log in and receive a JWT cookie
- `POST /logout` – Clear the authentication cookie

### Profile
- `GET /profile` – Get current logged-in user
- `PATCH /edit` – Update profile fields (name, about, photoURL, skills, leetcodeLink, githubLink)
- `GET /user/:id` – Get any user by ID (public view)

### Connections
- `GET /list` – List all accepted connections
- `GET /requests/received` – Incoming pending requests
- `GET /requests/sent` – Outgoing pending requests
- `POST /request/send/:status/:toUserId` – Send interest (status: `interested` or `ignored`)
- `POST /request/review/:status/:requestId` – Accept or reject a request (status: `accepted` or `rejected`)

### Discovery
- `GET /feed` – Get a paginated list of users not yet interacted with
- `GET /recommendations` – Users with overlapping skills (sorted by match strength)
- `GET /search?query=...` – Search users by name or skill

### Stats
- `GET /leetcode-stats/:userId` – Fetch LeetCode solved counts and ranking
- `GET /github-stats/:userId` – Fetch GitHub repo info, stars, forks, etc.

### Chat
- `GET /messages/:userId` – Retrieve chat history between current user and another user
- `POST /messages/read/:userId` – Mark messages as read

**Socket.IO events:**
- `joinChat` – Join a room (userId + otherId)
- `sendMessage` – Emit a new message
- `typing` / `stopTyping` – Indicate typing status
- `receiveMessage` – Broadcast incoming messages

##  Testing (Optional)

You can test APIs with tools like Postman or Insomnia. Remember to include the cookie token sent after login for authenticated endpoints.

##  Security

- Passwords are hashed with bcrypt.
- JWT tokens are stored in httpOnly cookies to prevent XSS attacks.
- Input validation on all models (email, password strength, URLs).
- CORS is configured to allow only the frontend origin.

##  Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.



## Acknowledgments

- [DaisyUI](https://daisyui.com/) – Component library
- LeetCode API – For stats (unofficial endpoints)
- GitHub API – For repository data
- [Socket.IO](https://socket.io/) – Real-time communication

---

Made with ❤️ by the devConnect team.
