import React, { useEffect, useState } from "react";

/* ── helpers ── */
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

const ProfileCard = ({ data, isPreview = false, onEdit }) => {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => setImgErr(false), [data?.photoURL]);  

  const showAvatar = !imgErr && data?.photoURL;

  return (
    <div
      className={`card bg-base-100 shadow-xl w-full max-w-sm border border-base-200 ${
        isPreview
          ? "ring-2 ring-primary/20 ring-offset-2 ring-offset-base-200"
          : ""
      }`}
    >
     
    <figure className="relative h-60 bg-base-200 rounded-t-2xl flex items-center justify-center">
  <img
    src={data.photoURL}
    alt="profile"
    className="max-h-full max-w-full object-contain"
    onError={() => setImgErr(true)}
  />
</figure>

      <div className="card-body p-5 gap-4">
        {/* ── name + status ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="card-title text-lg font-semibold tracking-tight truncate capitalize">
              {data?.name || (
                <span className="text-base-content/30 font-normal italic">
                  No name yet
                </span>
              )}
            </h2>
            <p className="text-sm text-base-content/50 truncate">
              {data?.email}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-base-content/40 font-medium">
              Active
            </span>
          </div>
        </div>

        <div className="divider my-0" />

        {/* ── about ── */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mb-1.5">
            About
          </p>
          <p className="text-sm text-base-content/70 leading-relaxed">
            {data?.about || (
              <span className="italic text-base-content/30">
                No bio added yet.
              </span>
            )}
          </p>
        </div>

        {/* ── skills ── */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-base-content/40 mb-2">
            Skills
          </p>
          {data?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  className={`badge badge-outline badge-sm ${
                    BADGE_VARIANTS[i % BADGE_VARIANTS.length]
                  } font-medium`}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-base-content/30">
              No skills listed.
            </p>
          )}
        </div>

        <div className="divider my-0" />

        {/* ── footer meta ── */}
        <div className="flex items-center justify-between text-xs text-base-content/40">
          <span>Joined {formatDate(data?.createdAt)}</span>
          <span>Updated {formatDate(data?.updatedAt)}</span>
        </div>

        {/* ── edit button */}
        {!isPreview && onEdit && (
          <button
            onClick={onEdit}
            className="btn btn-primary btn-sm w-full mt-1 gap-2"
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
        )}
      </div>
    </div>
  );
};

export default ProfileCard;