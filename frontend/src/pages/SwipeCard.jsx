import { useEffect, useRef } from "react";
import { href } from "react-router-dom";

const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.31 3.435 9.815 8.205 11.405.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
);

const LeetcodeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.823-.662l-4.218-4.221c-.467-.467-.662-1.11-.662-1.82s.195-1.352.662-1.819l4.217-4.223c.466-.464 1.111-.664 1.823-.664s1.357.2 1.823.664l2.697 2.609c.48.487 1.264.482 1.733-.011.463-.484.464-1.259.006-1.746l-2.704-2.612c-.842-.843-1.98-1.321-3.155-1.321s-2.313.478-3.155 1.321l-4.216 4.22c-.842.843-1.342 1.991-1.342 3.173s.5 2.331 1.342 3.173l4.216 4.22c.842.843 1.98 1.321 3.155 1.321s2.313-.478 3.155-1.321l2.704-2.609c.458-.487.457-1.262-.006-1.746-.469-.493-1.253-.498-1.733-.011zm3.954-9.187l-2.032-2.032c-.467-.467-1.111-.664-1.823-.664-.712 0-1.357.197-1.823.664l-4.217 4.22c-.464.467-.664 1.111-.664 1.82 0 .712.2 1.357.664 1.82l4.217 4.22c.466.467 1.111.664 1.823.664.712 0 1.356-.197 1.823-.664l2.032-2.032c.48-.487.48-1.262.012-1.746-.467-.484-1.243-.49-1.723-.012l-2.032 2.032-.006.006c-.082.083-.231.12-.356.12-.127 0-.276-.037-.358-.12l-4.217-4.22c-.083-.083-.12-.232-.12-.358 0-.125.037-.275.12-.357l4.217-4.22c.082-.083.231-.12.358-.12.125 0 .274.037.356.12l.006.006 2.032 2.032c.48.48 1.256.475 1.723-.012.468-.484.468-1.258-.012-1.745z" />
  </svg>
);

const GFGIcon = () => (
  <svg width="15" height="13" viewBox="0 0 60 40" fill="#2f8d46">
    <text y="32" fontSize="36" fontWeight="900" fontFamily="Arial,sans-serif">G</text>
  </svg>
);

export default function SwipeCard({ user, index, isTop, onAction }) {
  const cardRef = useRef(null);
  const drag = useRef({ active: false, sx: 0, sy: 0, cx: 0, lx: 0, vel: 0 });

  if (!user) return null;

  useEffect(() => {
    if (!isTop) return;
    const el = cardRef.current;
    if (!el) return;
    const d = drag.current;
    const ls = el.querySelector(".like-stamp");
    const ns = el.querySelector(".nope-stamp");

    const start = (x, y) => {
      d.active = true;
      d.sx = x; d.sy = y;
      d.lx = x; d.vel = 0; d.cx = 0;
      el.style.transition = "none";
    };

    const move = (x, y) => {
      if (!d.active) return;
      d.vel = x - d.lx;
      d.lx = x;
      d.cx = x - d.sx;
      const cy = (y - d.sy) * 0.25;
      el.style.transform = `translate(${d.cx}px, ${cy}px) rotate(${d.cx * 0.065}deg)`;
      const t = Math.min(Math.abs(d.cx) / 90, 1);
      if (ls) ls.style.opacity = d.cx > 0 ? t : 0;
      if (ns) ns.style.opacity = d.cx < 0 ? t : 0;
    };

    const end = () => {
      if (!d.active) return;
      d.active = false;
      if (d.cx > 100 || d.vel > 9) {
        el.style.transition = "transform .45s cubic-bezier(.4,0,.2,1), opacity .45s ease";
        el.style.transform = "translate(110%, -4%) rotate(22deg)";
        el.style.opacity = "0";
        setTimeout(() => onAction("interested", user._id), 420);
      } else if (d.cx < -100 || d.vel < -9) {
        el.style.transition = "transform .45s cubic-bezier(.4,0,.2,1), opacity .45s ease";
        el.style.transform = "translate(-110%, -4%) rotate(-22deg)";
        el.style.opacity = "0";
        setTimeout(() => onAction("ignored", user._id), 420);
      } else {
        el.style.transition = "transform .4s cubic-bezier(.175,.885,.32,1.275)";
        el.style.transform = "none";
        if (ls) ls.style.opacity = 0;
        if (ns) ns.style.opacity = 0;
      }
      d.cx = 0;
    };

    const onMD = (e) => {
      if (e.target.closest("a, button")) return;
      e.preventDefault();
      start(e.clientX, e.clientY);
    };
    const onMM = (e) => move(e.clientX, e.clientY);
    const onTS = (e) => {
      if (e.target.closest("a, button")) return;
      start(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTM = (e) => move(e.touches[0].clientX, e.touches[0].clientY);

    el.addEventListener("mousedown", onMD);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", end);
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchmove", onTM, { passive: true });
    el.addEventListener("touchend", end);

    return () => {
      el.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", end);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchmove", onTM);
      el.removeEventListener("touchend", end);
    };
  }, [isTop, user._id, onAction]);

 // Only UI part changed (logic same)

return (
  <div
    ref={cardRef}
    className="absolute inset-0 rounded-3xl overflow-hidden bg-base-100 shadow-2xl flex flex-col border border-base-300"
    style={{
      zIndex: 10 - index,
      transform: `scale(${1 - index * 0.04}) translateY(${index * -14}px)`,
      pointerEvents: isTop ? "auto" : "none",
      opacity: 1 - index * 0.15,
      cursor: isTop ? "grab" : "default",
      willChange: "transform",
    }}
  >
    {/* 🔥 Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 pointer-events-none"></div>

    {/* 🔥 Stamps */}
    <div className="like-stamp absolute top-6 left-4 text-green-500 border-2 border-green-500 px-3 py-1 rounded-lg text-xs font-bold tracking-widest opacity-0 z-20 bg-black/40 backdrop-blur-sm">
      INTEREST
    </div>

    <div className="nope-stamp absolute top-6 right-4 text-red-500 border-2 border-red-500 px-3 py-1 rounded-lg text-xs font-bold tracking-widest opacity-0 z-20 bg-black/40 backdrop-blur-sm">
      IGNORE
    </div>

    {/* 🔥 Image */}
    <div className="w-full h-[65%] relative">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-7xl bg-base-200">
          {user.name?.[0] ?? "?"}
        </div>
      )}
    </div>

    {/* 🔥 Content */}
    <div className="absolute bottom-0 w-full p-4 z-20 text-white">

      {/* Name */}
      <h2 className="text-2xl font-bold">
        {user.name}
      </h2>

      {/* Info */}
      <p className="text-xs opacity-80 mb-2">
        {[user.age, user.gender, user.location].filter(Boolean).join(" • ")}
      </p>

      {/* About */}
      <p className="text-sm opacity-90 line-clamp-2 mb-3">
        {user.about || "Passionate developer 🚀"}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {user.skills?.slice(0, 4).map((s, i) => (
          <span
            key={i}
            className="badge badge-outline badge-sm text-white border-white/40"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-2 flex-wrap mb-3">
        {user.github && (
          <a
            href={`https://github.com/${user.github}`}
            target="_blank"
            rel="noreferrer"
            onMouseDown={(e) => e.stopPropagation()}
            className="btn btn-xs btn-outline"
          >
            GitHub
          </a>
        )}

        {user.leetcode && (
          <a
            href={`https://leetcode.com/${user.leetcode}`}
            target="_blank"
            rel="noreferrer"
            onMouseDown={(e) => e.stopPropagation()}
            className="btn btn-xs btn-outline"
          >
            LeetCode
          </a>
        )}
      </div>

      {/* 🔥 Buttons */}
      {isTop && (
        <div className="flex justify-center gap-6 mt-2">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onAction("ignored", user._id)}
            className="btn btn-circle btn-outline border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            ✕
          </button>

          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onAction("interested", user._id)}
            className="btn btn-circle bg-primary text-white hover:scale-110 shadow-lg"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  </div>
);
}