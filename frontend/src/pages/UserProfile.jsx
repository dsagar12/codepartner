import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/${id}`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleConnect = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/request/send/interested/${id}`,
        {},
        { withCredentials: true }
      );

      // remove from list after sending request
      setUser((prev) => prev.filter((u) => u._id !== id));
      navigate("/connections");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    
    <div className="min-h-screen bg-base-200 py-10 px-4 flex justify-center">
      
      <div className="w-full max-w-3xl">

        {/* 🔥 Profile Card */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          
          {/* Cover */}
          <div className="h-48 w-full bg-gradient-to-r from-primary via-secondary to-accent rounded-t-2xl relative">
            
            {/* Avatar */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-50px]">
              <div className="avatar">
                <div className="w-28 h-28 rounded-full ring ring-base-100 ring-offset-base-200 ring-offset-2 overflow-hidden shadow-lg">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="card-body items-center text-center mt-10">
            
            {/* Name */}
            <h2 className="text-2xl font-bold capitalize">
              {user.name}
            </h2>

            {/* Email */}
            <p className="text-sm text-base-content/60">
              {user.email}
            </p>

            {/* About */}
            <p className="mt-3 text-sm text-base-content/70 max-w-md">
              {user.about || "No bio available"}
            </p>

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="badge badge-outline badge-primary px-3 py-2 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* 🔥 Actions */}
            <div className="flex gap-3 mt-6">
              <button className="btn btn-primary btn-sm" onClick={() => handleConnect(user._id)}>
                Connect
              </button>
              <Link to={"/chat/"+user._id} className="btn btn-outline btn-sm">
                Message
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;