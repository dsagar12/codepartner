import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import {
  Sparkles,
  Briefcase,
  FileText,
  User,
  LogOut,
  ArrowRight,
  Clock,
  FileEdit,
  CheckCircle
} from "lucide-react";

const API = "http://localhost:3000";

function Home() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    connections: 0,
    matches: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch User + Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/profile`, {
          withCredentials: true,
        });

        setUserData(res.data);

        setStats({
          connections: res.data.connections?.length || 0,
          matches: res.data.matches?.length || 0,
        });

      } catch (e) {
        if (e.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await axios.post(`${API}/logout`, {}, { withCredentials: true });
    navigate("/login");
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-base-300 rounded-full mb-4"></div>
          <div className="h-4 bg-base-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <>
     
      <div className="min-h-screen bg-base-200 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Header with greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Good {getTimeOfDay()}, {userData?.name || "User"}!
              </h1>
              <p className="mt-2 text-base-content/70">
                Here's what's happening with your developer network today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-base-100 border border-base-300 rounded-lg shadow-sm hover:bg-base-200 transition"
              >
                <LogOut className="w-5 h-5 text-base-content/70 mr-2" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Profile and quick actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-base-100 rounded-xl shadow-sm p-6"
              >
                <Link to={"/profile"} className="flex items-center space-x-4">
                  <img
                    src={userData?.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userData?.name || "User")}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-base-100 shadow"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-base-content">{userData?.name || "Anonymous User"}</h2>
                    <p className="text-base-content/70">{userData?.email || "developer@example.com"}</p>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-xs text-base-content/70">Active now</span>
                    </div>
                  </div>
                </Link>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-xs text-primary">Connections</p>
                    <p className="text-lg font-semibold text-base-content">{stats.connections}</p>
                    <p className="text-xs text-base-content/70">Total network</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <p className="text-xs text-secondary">Matches</p>
                    <p className="text-lg font-semibold text-base-content">{stats.matches}</p>
                    <p className="text-xs text-base-content/70">Mutual connections</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-base-100 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-medium text-base-content mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/feed")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-base-content">Discover Developers</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-base-content/50" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/connections")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-info/10 rounded-lg mr-3">
                        <Briefcase className="w-5 h-5 text-info" />
                      </div>
                      <span className="text-base-content">Your Connections</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-base-content/50" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/requests")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-success/10 rounded-lg mr-3">
                        <FileText className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-base-content">Connection Requests</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-base-content/50" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/chats")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-warning/10 rounded-lg mr-3">
                        <FileEdit className="w-5 h-5 text-warning" />
                      </div>
                      <span className="text-base-content">Messages</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-base-content/50" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigate("/profile")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-secondary/10 rounded-lg mr-3">
                        <User className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-base-content">Edit Profile</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-base-content/50" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Middle column - Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dashboard cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Swipe & Match Card */}
                <div 
                  onClick={() => navigate("/feed")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Swipe & Match</h3>
                      <p className="text-indigo-100 text-sm mb-4">
                        Discover developers with swipe interaction
                      </p>
                    </div>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium"
                  >
                    Start Swiping
                  </motion.button>
                </div>

                {/* Chat Card */}
                <div 
                  onClick={() => navigate("/chats")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Real-Time Chat</h3>
                      <p className="text-blue-100 text-sm mb-4">
                        Chat instantly with your matches
                      </p>
                    </div>
                    <FileEdit className="w-6 h-6" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium"
                  >
                    Open Chat
                  </motion.button>
                </div>

                {/* Connections Card */}
                <div 
                  onClick={() => navigate("/connections")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Connections</h3>
                      <p className="text-green-100 text-sm mb-4">
                        Manage your developer network
                      </p>
                    </div>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium"
                  >
                    View Network
                  </motion.button>
                </div>

                {/* Requests Card */}
                <div 
                  onClick={() => navigate("/requests")}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Requests</h3>
                      <p className="text-orange-100 text-sm mb-4">
                        Accept or reject connection requests
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-medium"
                  >
                    Check Requests
                  </motion.button>
                </div>
              </motion.div>

              {/* Recent Activity / Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-base-100 rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-base-content">Your Activity</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border border-base-200 rounded-lg hover:bg-base-200 cursor-pointer transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base-content">Connection Stats</h4>
                        <p className="text-sm text-base-content/70 mt-1">
                          You have {stats.connections} connections and {stats.matches} mutual matches
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-base-200 rounded-lg hover:bg-base-200 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base-content">Profile Completion</h4>
                        <p className="text-sm text-base-content/70 mt-1">
                          {userData?.about ? "✓ Your profile has a bio" : "Add a bio to complete your profile"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-base-200 rounded-lg hover:bg-base-200 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base-content">Quick Tip</h4>
                        <p className="text-sm text-base-content/70 mt-1">
                          Connect with more developers to expand your network!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;