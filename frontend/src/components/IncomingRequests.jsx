import React, { useEffect, useState } from "react";
import axios from "axios";

const IncomingRequests = () => {
  const [requests, setRequests] = useState([]);

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

      // ✅ remove accepted/rejected card instantly
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
    <div>
      <h2 className="text-xl font-semibold mb-4">Invitations</h2>

      {requests.length === 0 ? (
        <p className="text-base-content/50">No pending invitations</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
          {requests.map((item) => (
            <div key={item.requestId} className="card bg-base-100 shadow">
              
              <div className="p-3">
                <h3 className="font-semibold">
                  {item.user.name}
                </h3>

                <p className="text-xs text-base-content/60">
                  {item.user.email}
                </p>

                <div className="flex gap-2 mt-3">
                  
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

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default IncomingRequests;