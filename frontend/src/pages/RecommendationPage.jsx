import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecommendationsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/recommendations",
        { withCredentials: true }
      );
      setUsers(res.data.users || []);
    } catch (error) {
     if (error.response?.status === 401) {
        navigate("/login"); // ✅ direct redirect
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleOpenProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleConnect = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/request/send/interested/${id}`,
        {},
        { withCredentials: true }
      );

      // remove from list after sending request
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">People You May Know</h2>
        <span className="text-sm text-base-content/50">
          {users.length} suggestions
        </span>
      </div>

      {/* List */}
      <div className="bg-base-100 rounded-xl border border-base-200 divide-y">

        {users.length === 0 ? (
          <p className="p-6 text-center text-base-content/50">
            No recommendations available
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 hover:bg-base-200 transition"
            >
              {/* Left */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleOpenProfile(user._id)}
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={
                        user.photoURL ||
                        "https://via.placeholder.com/100"
                      }
                      alt="user"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium capitalize">
                    {user.name}
                  </h3>

                  {/* Skills preview */}
                  <p className="text-xs text-base-content/50">
                    {user.skills?.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              {/* Right */}
              <button
                onClick={() => handleConnect(user._id)}
                className="btn btn-sm btn-primary"
              >
                Connect
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default RecommendationsPage;