import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SentRequests = () => {
  const [requests, setRequests] = useState([]);
 const navigate=useNavigate();
  useEffect(() => {
    const fetchSent = async () => {
      try {
        const res = await axios.get("http://localhost:3000/requests/sent", {
          withCredentials: true,
        });
        setRequests(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSent();
  }, []);

  if (requests.length === 0) {
    return <p className="text-center text-gray-500">No sent requests</p>;
  }

  return (
    <div className="grid gap-4">
      {requests.map((req) => (
        <Link
            to={"/profile/"+req.user._id}
          key={req.requestId}
          className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow"
        >
          <img
            src={req.user.photoURL}
            alt="dp"
            className="w-12 h-12 rounded-full"
          />

          <div className="flex-1">
            <h2 className="font-semibold">{req.user.name}</h2>
            <p className="text-sm text-gray-500">{req.user.email}</p>
          </div>

          <span className="badge badge-warning">Pending</span>
        </Link>
      ))}
    </div>
  );
};

export default SentRequests;