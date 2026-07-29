import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import { Code2,  Star, GitFork, Users, Calendar, MessageCircle, Trophy, Brain, TrendingUp, Activity } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const BADGE_VARIANTS = [
  "badge-neutral",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error",
];

function SkillTag({ label, index, onRemove }) {
  return (
    <span
      className={`badge badge-outline badge-sm ${BADGE_VARIANTS[index % BADGE_VARIANTS.length]} gap-1 font-medium pr-1`}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-2.5 h-2.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </span>
  );
}

function Toast({ type, message, onClose }) {
  useEffect(() => {
    if (!type) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [type]);

  if (!type) return null;

  const cfg = {
    success: { alert: "alert-success", icon: "M5 13l4 4L19 7" },
    error: { alert: "alert-error", icon: "M6 18L18 6M6 6l12 12" },
  }[type];

  return (
    <div className="toast toast-center toast-bottom z-[9999]">
      <div className={`alert ${cfg.alert} shadow-lg max-w-sm`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={cfg.icon} />
        </svg>
        <div>
          <p className="font-semibold text-sm">{message}</p>
        </div>
        <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [draft, setDraft] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();

  /* fetch */
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (e) {
      if(e.response?.status==401){
        navigate("/login");
      }
    }
  };

  const fetchStats = async (userId) => {
    if (!userId) return;
    setLoadingStats(true);
    try {
      // Fetch LeetCode stats
      if (userData?.leetcodeLink) {
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
      
      // Fetch GitHub stats
      if (userData?.githubLink) {
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
    if (!userData) fetchUser();
  }, [userData]);

  useEffect(() => {
    if (userData && (userData.leetcodeLink || userData.githubLink)) {
      fetchStats(userData._id);
    }
  }, [userData]);

  /* open edit */
  const openEdit = () => {
    setDraft({
      name: userData?.name ?? "",
      about: userData?.about ?? "",
      photoURL: userData?.photoURL ?? "",
      skills: [...(userData?.skills ?? [])],
      leetcodeLink: userData?.leetcodeLink ?? "",
      githubLink: userData?.githubLink ?? "",
    });
    setSkillInput("");
    setEditing(true);
  };

  /* skill helpers */
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !draft.skills.includes(s))
      setDraft((d) => ({ ...d, skills: [...d.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (i) =>
    setDraft((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));

  /* save */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(
        "http://localhost:3000/edit",
        {
          name: draft.name,
          about: draft.about,
          photoURL: draft.photoURL,
          skills: draft.skills,
          leetcodeLink: draft.leetcodeLink,
          githubLink: draft.githubLink,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      setEditing(false);
      setToast({ type: "success", message: "Profile updated successfully!" });
      // Refresh stats after update
      if (res.data.leetcodeLink || res.data.githubLink) {
        fetchStats(res.data._id);
      }
    } catch {
      setToast({ type: "error", message: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  /* loader */
  if (!userData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200">
        <span className="loading loading-ring loading-lg text-primary" />
        <p className="text-xs tracking-widest uppercase text-base-content/30">
          Loading profile
        </p>
      </div>
    );

  /* live preview merges saved + draft */
  const preview = { ...userData, ...draft };

  return (
    <div className="min-h-screen bg-base-200 font-sans ">
      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />

      {editing ? (
        /* EDIT MODE — split screen */
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Form */}
          <div className="flex flex-col bg-base-100 border-r border-base-200">
            <div className="sticky top-0 z-10 bg-base-100 border-b border-base-200 px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-base font-semibold tracking-tight text-base-content">
                  Edit Profile
                </h1>
                <p className="text-xs text-base-content/40 mt-0.5">
                  Changes appear live in the preview
                </p>
              </div>
              <button
                onClick={() => setEditing(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-7">
              {/* avatar mini strip */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-base-200 border border-base-300">
                <div className="avatar">
                  <div className="w-14 rounded-xl bg-neutral ring-2 ring-base-300">
                    {draft.photoURL ? (
                      <img
                        src={draft.photoURL}
                        alt="avatar"
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-neutral-content text-xl font-bold">
                        {getInitials(draft.name)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize truncate max-w-[180px]">
                    {draft.name || "Your Name"}
                  </p>
                  <p className="text-xs text-base-content/40">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Name */}
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[10px] font-semibold tracking-widest uppercase text-base-content/40">
                    Display Name
                  </span>
                </div>
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  placeholder="e.g. Arjun Sharma"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
              </label>

              {/* Photo URL */}
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[10px] font-semibold tracking-widest uppercase text-base-content/40">
                    Photo URL
                  </span>
                </div>
                <input
                  type="url"
                  value={draft.photoURL}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, photoURL: e.target.value }))
                  }
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
                <div className="label pt-1">
                  <span className="label-text-alt text-base-content/35">
                    Paste a direct image URL to update your avatar
                  </span>
                </div>
              </label>

              {/* Bio */}
              <label className="form-control">
                <div className="label pb-1 justify-between">
                  <span className="label-text text-[10px] font-semibold tracking-widest uppercase text-base-content/40">
                    Bio
                  </span>
                  <span
                    className={`label-text-alt ${draft.about.length > 280 ? "text-error" : "text-base-content/30"}`}
                  >
                    {draft.about.length}/300
                  </span>
                </div>
                <textarea
                  value={draft.about}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      about: e.target.value.slice(0, 300),
                    }))
                  }
                  placeholder="Tell others about yourself…"
                  className="textarea textarea-bordered textarea-sm w-full h-28 leading-relaxed focus:textarea-primary"
                />
              </label>

              {/* LeetCode Link */}
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[10px] font-semibold tracking-widest uppercase text-base-content/40 flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    LeetCode Profile URL
                  </span>
                </div>
                <input
                  type="url"
                  value={draft.leetcodeLink}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, leetcodeLink: e.target.value }))
                  }
                  placeholder="https://leetcode.com/u/username/"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
                <div className="label pt-1">
                  <span className="label-text-alt text-info">
                    
                     Add your LeetCode profile to show solved problems
                  </span>
                </div>
              </label>

              {/* GitHub Link */}
              <label className="form-control">
                <div className="label pb-1">
                  <span className="label-text text-[10px] font-semibold tracking-widest uppercase text-base-content/40 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    GitHub Profile URL
                  </span>
                </div>
                <input
                  type="url"
                  value={draft.githubLink}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, githubLink: e.target.value }))
                  }
                  placeholder="https://github.com/username"
                  className="input input-bordered input-sm w-full focus:input-primary"
                />
                <div className="label pt-1">
                  <span className="label-text-alt text-info">
                    💡 Add your GitHub profile to show repos, stars, and commits
                  </span>
                </div>
              </label>

              {/* Skills */}
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mb-2">
                  Skills
                </p>
                <div className="join w-full">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="Type skill and press Enter or click +"
                    className="input input-bordered input-sm join-item flex-1 focus:input-primary"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn btn-sm join-item btn-neutral px-4"
                  >
                    + Add
                  </button>
                </div>
                {draft.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-lg bg-base-200 border border-base-300">
                    {draft.skills.map((s, i) => (
                      <SkillTag
                        key={i}
                        label={s}
                        index={i}
                        onRemove={() => removeSkill(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* sticky bottom actions */}
            <div className="sticky bottom-0 bg-base-100 border-t border-base-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="btn btn-ghost btn-sm flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm flex-[2] gap-2"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="flex flex-col items-center justify-center gap-6 bg-base-200 px-6 py-12 min-h-screen lg:min-h-0">
            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary mb-1">
                Live Preview
              </p>
              <p className="text-xs text-base-content/40">
                This is how others will see your profile
              </p>
            </div>

            <ProfileCard data={preview} isPreview />

            <div className="flex items-center gap-2 text-xs text-base-content/30">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Updates instantly as you type
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE */
        <div className="min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* left col: card */}
            <div className="lg:col-span-1 flex justify-center">
              <ProfileCard data={userData} onEdit={openEdit} />
            </div>

            {/* right col: detail panels */}
            <div className="lg:col-span-2 space-y-5">
              {/* welcome banner */}
              <div className="card bg-primary text-primary-content shadow-sm">
                <div className="card-body py-5 px-6">
                  <h2 className="card-title text-lg font-bold">
                    Welcome back, {userData.name?.split(" ")[0] || "there"} 👋
                  </h2>
                  <p className="text-sm opacity-80">
                    Keep your profile up to date so others know who you are and
                    what you bring to the table.
                  </p>
                  <div className="card-actions mt-1">
                    <button
                      onClick={openEdit}
                      className="btn btn-sm bg-white/20 hover:bg-white/30 border-none text-white gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

            {/* LeetCode Stats Section */}
{userData.leetcodeLink && (
  <div className="bg-base-200 rounded-lg border border-base-300 p-5">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-base-content">
        LeetCode Progress
      </h3>
      <a
        href={userData.leetcodeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-base-content/60 hover:text-base-content"
      >
        View Profile
      </a>
    </div>

    {loadingStats ? (
      <div className="text-center text-sm text-base-content/60 py-6">
        Loading data
      </div>
    ) : leetcodeStats && !leetcodeStats.error ? (
      <div className="grid grid-cols-2  md:grid-cols-3 gap-4 text-sm">
       <div className="bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs text-black  mb-1 ">Ranking</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.ranking || "N/A"}
  </p>
</div>

<div className="bg-white/70 text-black  backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs mb-1 text-black ">Solved</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.totalSolved || 0} / {leetcodeStats.totalQuestions || 0}
  </p>
</div>

<div className="bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs text-gray-900 mb-1">Acceptance</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.acceptanceRate || 0}%
  </p>
</div>

<div className="bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs text-gray-900 mb-1">Easy</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.easySolved || 0} / {leetcodeStats.totalEasy || 0}
  </p>
</div>

<div className="bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs text-gray-900 mb-1">Medium</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.mediumSolved || 0} / {leetcodeStats.totalMedium || 0}
  </p>
</div>

<div className="bg-white/70 backdrop-blur-sm p-3 rounded-md border border-gray-200 shadow-sm">
  <p className="text-xs text-gray-900 mb-1">Hard</p>
  <p className="text-base font-semibold text-gray-800">
    {leetcodeStats.hardSolved || 0} / {leetcodeStats.totalHard || 0}
  </p>
</div>
      </div>
    ) : (
      <div className="text-center text-sm text-base-content/60 py-4">
        Unable to load data
      </div>
    )}
  </div>
)}

{/* GitHub Stats Section */}
{userData.githubLink && (
  <div className="bg-base-200 rounded-lg border border-base-300 p-5">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-base-content">
        GitHub Activity
      </h3>
      <a
        href={userData.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-base-content/60 hover:text-base-content"
      >
        View Profile
      </a>
    </div>

    {loadingStats ? (
      <div className="text-center text-sm text-base-content/60 py-6">
        Loading data
      </div>
    ) : githubStats && !githubStats.error ? (
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-base-100 p-3 rounded-md border">
            <p className="text-base-content/60">Repositories</p>
            <p className="font-semibold">{githubStats.public_repos || 0}</p>
          </div>

          <div className="bg-base-100 p-3 rounded-md border">
            <p className="text-base-content/60">Stars</p>
            <p className="font-semibold">{githubStats.totalStars || 0}</p>
          </div>

          <div className="bg-base-100 p-3 rounded-md border">
            <p className="text-base-content/60">Forks</p>
            <p className="font-semibold">{githubStats.totalForks || 0}</p>
          </div>

          <div className="bg-base-100 p-3 rounded-md border">
            <p className="text-base-content/60">Followers</p>
            <p className="font-semibold">{githubStats.followers || 0}</p>
          </div>
        </div>

        {githubStats.bio && (
          <div className="bg-base-100 border rounded-md p-3 text-base-content/70">
            {githubStats.bio}
          </div>
        )}

        <div className="text-xs text-base-content/60 text-center">
          Joined on{" "}
          {new Date(githubStats.created_at).toLocaleDateString()}
        </div>
      </div>
    ) : (
      <div className="text-center text-sm text-base-content/60 py-4">
        Unable to load data
      </div>
    )}
  </div>
)}

     

              {/* skills detail */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body py-5 px-6 gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm tracking-tight">
                      Skills
                    </h3>
                    <span className="badge badge-ghost badge-sm">
                      {userData.skills?.length ?? 0}
                    </span>
                  </div>
                  {userData.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userData.skills.map((s, i) => (
                        <span
                          key={i}
                          className={`badge badge-outline ${BADGE_VARIANTS[i % BADGE_VARIANTS.length]} font-medium`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-3 text-sm text-base-content/40">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      No skills yet.
                      <button
                        onClick={openEdit}
                        className="link link-primary text-xs"
                      >
                        Add some →
                      </button>
                    </div>
                  )}
                </div>
              </div>
                    
              {/* account info */}
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body py-5 px-6 gap-4">
                  <h3 className="font-semibold text-sm tracking-tight">
                    Account Information
                  </h3>
                  <div className="divide-y divide-base-200">
                    {[
                      { label: "Email", value: userData.email },
                      {
                        label: "Member Since",
                        value: formatDate(userData.createdAt),
                      },
                      {
                        label: "Last Updated",
                        value: formatDate(userData.updatedAt),
                      },
                     
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-2.5 gap-4"
                      >
                        <span className="text-xs text-base-content/40 font-medium shrink-0">
                          {label}
                        </span>
                        <span className="text-xs text-base-content/70 font-mono truncate text-right">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}