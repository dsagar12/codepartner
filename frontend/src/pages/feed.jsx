import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import SwipeCard from "./SwipeCard";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:3000";

export default function Feed() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [cur, setCur] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get(`${API}/feed`, { withCredentials: true });
      setUsers(data ?? []);
      setLoaded(true);
    } catch (e) {
  if (e.response?.status === 401) {
    navigate("/login");
  }
}
  };

  const loadData=useEffect(()=>{
    fetchFeed();
  },[]);

  const handleAction = useCallback(async (status, userId) => {
    try {
      await axios.post(
        `${API}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      setCur((p) => p + 1);
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!loaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <button
          onClick={fetchFeed}
          className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
        >
          Load Feed
        </button>
      </div>
    );
  }

  if (!users.length || cur >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400 bg-gray-950">
        <span className="text-5xl">🎉</span>
        <p className="text-sm">You've seen everyone!</p>
        <button
          onClick={() => { setCur(0); }}
          className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-full text-sm transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  const visible = users.slice(cur, cur + 3).filter(Boolean);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <p className="text-xs text-gray-500 mb-3">{users.length - cur} developers left</p>
      <div className="relative w-80 h-[540px]">
        {visible.map((user, i) => (
          <SwipeCard
            key={user._id}
            user={user}
            index={i}
            isTop={i === 0}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
}