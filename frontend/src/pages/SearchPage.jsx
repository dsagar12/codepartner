import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Popup state
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const navigate = useNavigate();

  // 🔥 Auto hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSearch = async (value) => {
    const q = value || query;

    if (!q.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/search?query=${q}`,
        { withCredentials: true }
      );

      setUsers(res.data.users || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/request/send/interested/${id}`,
        {},
        { withCredentials: true }
      );

      // ✅ success
      setToastMsg("Request Sent ✅");
      setShowToast(true);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, requested: true } : u
        )
      );

    } catch (err) {
      if (err.response?.status === 400) {
        // 🔥 Already connected popup
        setToastMsg("Already requested by you ");
        setShowToast(true);

        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, alreadyConnected: true } : u
          )
        );
      }

      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleOpenProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">

      {/* 🔥 Toast Popup */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-info shadow-lg">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* 🔍 Search Bar */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name or skills (React, Node...)"
            className="bg-transparent outline-none w-full text-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}

      {/* 🔍 Results */}
      {!loading && (
        <div className="max-w-2xl mx-auto space-y-3">

          {users.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              Search developers by name or skills
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition"
              >
                {/* Left */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleOpenProfile(user._id)}
                >
                  <img
                    src={user.photoURL || "https://i.pravatar.cc/100"}
                    className="w-12 h-12 rounded-full"
                  />

                  <div>
                    <h3 className="font-medium capitalize">{user.name}</h3>

                    <div className="flex gap-1 flex-wrap mt-1">
                      {user.skills?.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-800 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                {user.alreadyConnected ? (
                  <span className="text-xs text-green-400">
                   Already request is sent
                  </span>
                ) : user.requested ? (
                  <span className="text-xs text-yellow-400">
                    Requested
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect(user._id)}
                    className="btn btn-sm btn-primary"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;