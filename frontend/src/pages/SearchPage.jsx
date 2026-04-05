import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/search?skill=${query}`,
        { withCredentials: true }
      );

      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">

      {/* 🔥 Search Bar */}
      <div className="max-w-xl mx-auto mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by skills (e.g. React, Node)"
          className="input input-bordered w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
          onClick={handleSearch}
          className="btn btn-primary"
        >
          Search
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* 🔍 Results */}
      {!loading && (
        <div className="bg-base-100 rounded-xl border border-base-200 divide-y max-w-2xl mx-auto">

          {users.length === 0 ? (
            <p className="p-6 text-center text-base-content/50">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 hover:bg-base-200 transition cursor-pointer"
                onClick={() => handleOpenProfile(user._id)}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
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

                    {/* Skills */}
                    <p className="text-xs text-base-content/50">
                      {user.skills?.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProfile(user._id);
                  }}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  View
                </button>
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
};

export default SearchPage;