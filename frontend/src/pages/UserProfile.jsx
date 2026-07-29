import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  Code2, 
  Star, 
  GitFork, 
  Users, 
  Calendar, 
  MessageCircle, 
  Trophy, 
  Brain, 
  TrendingUp, 
  Activity 
} from "lucide-react";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
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

  const fetchStats = async (userId) => {
    if (!userId) return;
    setLoadingStats(true);
    try {
      // Fetch LeetCode stats if user has leetcodeLink
      if (user?.leetcodeLink) {
        try {
          const leetcodeRes = await axios.get(`http://localhost:3000/leetcode-stats/${userId}`, {
            withCredentials: true,
          });
          setLeetcodeStats(leetcodeRes.data);
        } catch (err) {
          console.error("Error fetching LeetCode stats:", err);
          setLeetcodeStats(null);
        }
      }
      
      // Fetch GitHub stats if user has githubLink
      if (user?.githubLink) {
        try {
          const githubRes = await axios.get(`http://localhost:3000/github-stats/${userId}`, {
            withCredentials: true,
          });
          setGithubStats(githubRes.data);
        } catch (err) {
          console.error("Error fetching GitHub stats:", err);
          setGithubStats(null);
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (user && (user.leetcodeLink || user.githubLink)) {
      fetchStats(user._id);
    }
  }, [user]);

  const handleConnect = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/request/send/interested/${id}`,
        {},
        { withCredentials: true }
      );
      navigate("/connections");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-base-900 py-10 px-4 flex justify-center">
  <div className="w-full max-w-4xl">

    <div className="bg-base-100 border border-base-300 rounded-2xl shadow-lg overflow-hidden">

      {/* TOP HEADER (adds depth) */}
      <div className="bg-base-200 px-6 bg-black py-6 border-b border-base-300">
        <div className="flex flex-col  md:flex-row items-center md:items-start gap-5">

          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            className="w-24 h-24 rounded-full object-cover border-4 border-base-100 shadow-md"
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-base-content/60">{user.email}</p>

            <p className="text-sm text-base-content/70 mt-2 max-w-lg">
              {user.about || "No bio available"}
            </p>

            {user.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-base-100 border border-base-300 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleConnect(user._id)}
            >
              Connect
            </button>

            <Link to={"/chat/" + user._id} className="btn btn-outline btn-sm">
              Message
            </Link>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="p-6 grid bg-black md:grid-cols-2 gap-6">

        {/* LeetCode */}
        {user.leetcodeLink && (
          <div className="bg-base-200 rounded-xl p-4 border border-base-300">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold">LeetCode</h3>
              <a href={user.leetcodeLink} className="text-xs text-base-content/60">
                View
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Solved</p>
                <p className="font-semibold text-base">
                  {leetcodeStats?.totalSolved || 0}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Ranking</p>
                <p className="font-semibold text-base">
                  {leetcodeStats?.ranking || "N/A"}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Easy</p>
                <p className="font-semibold text-base">
                  {leetcodeStats?.easySolved || 0}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Medium</p>
                <p className="font-semibold text-base">
                  {leetcodeStats?.mediumSolved || 0}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* GitHub */}
        {user.githubLink && (
          <div className="bg-base-200 rounded-xl p-4 border border-base-300">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold">GitHub</h3>
              <a href={user.githubLink} className="text-xs text-base-content/60">
                View
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Repos</p>
                <p className="font-semibold text-base">
                  {githubStats?.public_repos || 0}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Followers</p>
                <p className="font-semibold text-base">
                  {githubStats?.followers || 0}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Stars</p>
                <p className="font-semibold text-base">
                  {githubStats?.totalStars || 0}
                </p>
              </div>

              <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm">
                <p className="text-xs text-base-content/50">Forks</p>
                <p className="font-semibold text-base">
                  {githubStats?.totalForks || 0}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  </div>
</div>
  );
};

export default UserProfile;