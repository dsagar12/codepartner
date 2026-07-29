import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/requests/received",
        { withCredentials: true }
      );
      setRequests(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (status, requestId) => {
    try {
      await axios.post(
        `http://localhost:3000/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      setRequests((prev) =>
        prev.filter((req) => req.requestId !== requestId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen text-white p-6">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">Invitations</h2>
        <span className="text-sm text-gray-400">
          {requests.length} pending
        </span>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto divide-y divide-gray-800 bg-gray-900 rounded-xl border border-gray-800">

        {requests.length === 0 ? (
          <p className="p-6 text-center text-gray-400">
            No pending invitations
          </p>
        ) : (
          requests.map((item) => (
            <div
              key={item.requestId}
              className="flex items-center justify-between p-4 hover:bg-gray-800 transition cursor-pointer"
              onClick={() => navigate(`/profile/${item.user._id}`)}
            >
              {/* Left */}
              <div className="flex items-center gap-3">

                <img
                  src={item.user.photoURL || "https://i.pravatar.cc/100"}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <h3 className="font-medium capitalize">
                    {item.user.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item.user.email}
                  </p>
                </div>
              </div>

              {/* Right Buttons */}
              <div
                className="flex gap-2"
                onClick={(e) => e.stopPropagation()} // 🔥 important
              >
                <button
                  onClick={() =>
                    handleReview("accepted", item.requestId)
                  }
                  className="btn btn-success btn-xs"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    handleReview("rejected", item.requestId)
                  }
                  className="btn btn-error btn-xs"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;