import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const STACKS = [
  "React",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "Flutter",
  "ML/AI",
  "Solidity",
];
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF4D6D"
    strokeWidth="2.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-5" />
  </svg>
);

const features = {
  login: [
    {
      title: "Stack-based matching",
      desc: "Find devs who use the same tools as you",
    },
    {
      title: "Hackathon teams",
      desc: "Form squads for upcoming events in minutes",
    },
    {
      title: "Direct messaging",
      desc: "Chat, plan, and collaborate — all in one place",
    },
  ],
  signup: [
    { title: "Resume your matches", desc: "Pick up conversations you started" },
    { title: "Check team invites", desc: "See who wants to build with you" },
    {
      title: "Upcoming hackathons",
      desc: "Browse events and register your team",
    },
  ],
};

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const widths = ["0%", "28%", "55%", "78%", "100%"];
  const colors = ["#888", "#FF4D6D", "#EF9F27", "#4361EE", "#2DC653"];
  return { width: widths[s], color: colors[s] };
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [password, setPassword] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  
  // New state for LeetCode and GitHub
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  
  const switchTo = (m) => {
    if (m === mode) return;
    setOverlayVisible(false);
    setTimeout(() => {
      setMode(m);
      setOverlayVisible(true);
    }, 200);
  };

  const toggleStack = (s) =>
    setSelectedStacks((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const strength = getStrength(password);
  const isLogin = mode === "login";
  const ovData = isLogin
    ? {
        eyebrow: "for developers, by developers",
        heading: ["Swipe. Match.", "Ship together."],
        body: "devConnect is the fastest way to find teammates who speak your language — literally.",
        btnLabel: "Create free account",
        btnMode: "signup",
        arrowDir: "right",
      }
    : {
        eyebrow: "welcome back",
        heading: ["Your team", "is waiting."],
        body: "Jump back in. Your matches, messages, and upcoming hackathons are right where you left them.",
        btnLabel: "Sign in instead",
        btnMode: "login",
        arrowDir: "left",
      };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        {
          email: email2,
          password: password2,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      alert("Login success ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Login failed" + err.message);
    }
  };

  const handleSignup = async () => {
    try {
      // Construct full URLs from usernames
      const leetcodeLink = leetcodeUsername ? `https://leetcode.com/u/${leetcodeUsername}/` : "";
      const githubLink = githubUsername ? `https://github.com/${githubUsername}` : "";
      
      const res = await axios.post(
        "http://localhost:3000/signup",
        {
          name: name,
          email: email,
          password: password,
          skills: selectedStacks,
          leetcodeLink: leetcodeLink,
          githubLink: githubLink,
        },
        { withCredentials: true },
      );

      alert("Signup success ✅");
      switchTo("login"); // auto switch 🔥
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        {/* LOGIN FORM */}
        <div
          style={{
            ...styles.formPanel,
            left: 0,
            transform: isLogin ? "translateX(0)" : "translateX(-130%)",
            opacity: isLogin ? 1 : 0,
            pointerEvents: isLogin ? "all" : "none",
          }}
        >
          <div style={styles.logo}>
            dev<span style={{ color: "#FF4D6D" }}>Connect</span>
            <span style={{ color: "var(--color-text-tertiary)" }}> / auth</span>
          </div>
          <h1 style={styles.title}>
            Welcome back,
            <br />
            builder.
          </h1>
          <p style={styles.sub}>Sign in to find your next hackathon team</p>

          <Field label="Email">
            <input
              style={styles.input}
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              type="email"
              placeholder=""
            />
          </Field>
          <Field label="Password">
            <input
              style={styles.input}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              type="password"
              placeholder=""
            />
          </Field>

          <div
            style={{
              width: "100%",
              textAlign: "right",
              marginBottom: "0.9rem",
            }}
          >
            <a style={styles.forgotLink}>Forgot password?</a>
          </div>

          <button
            style={{ ...styles.btnMain, background: "#FF4D6D" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E63054")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FF4D6D")}
            onClick={handleLogin}
          >
            <SignInIcon /> Sign in
          </button>

          <p style={styles.footer}>
            No account?{" "}
            <span style={styles.footerLink} onClick={() => switchTo("signup")}>
              Join devConnect
            </span>
          </p>
        </div>

        {/* SIGNUP FORM */}
        <div
          style={{
            ...styles.formPanel,
            left: "50%",
            transform: isLogin ? "translateX(130%)" : "translateX(0)",
            opacity: isLogin ? 0 : 1,
            pointerEvents: isLogin ? "none" : "all",
          }}
        >
          <h1 style={styles.title}>
            Find your
            <br />
            dream team.
          </h1>
          <p style={styles.sub}>
            Match with devs by tech stack, build together
          </p>

          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <Field label="First name" style={{ flex: 1 }}>
              <input
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder=""
              />
            </Field>
          </div>

          <Field label="Email">
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password">
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={styles.strengthBar}>
              <div
                style={{
                  ...styles.strengthFill,
                  width: strength.width,
                  background: strength.color,
                }}
              />
            </div>
          </Field>

          {/* LeetCode Username Field */}
          <Field label="LeetCode username (optional)">
            <input
              style={styles.input}
              type="text"
              value={leetcodeUsername}
              onChange={(e) => setLeetcodeUsername(e.target.value)}
              placeholder="your-leetcode-username"
            />
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              e.g., leetcode.com/u/your-username
            </div>
          </Field>

          {/* GitHub Username Field */}
          <Field label="GitHub username (optional)">
            <input
              style={styles.input}
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="your-github-username"
            />
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              e.g., github.com/your-username
            </div>
          </Field>

          <div style={{ width: "100%", marginBottom: "0.7rem" }}>
            <label
              style={{
                ...styles.fieldLabel,
                display: "block",
                marginBottom: 7,
              }}
            >
              Your stack
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {STACKS.map((s) => (
                <div
                  key={s}
                  onClick={() => toggleStack(s)}
                  style={{
                    ...styles.tag,
                    background: selectedStacks.includes(s)
                      ? "#FF4D6D"
                      : "var(--color-background-secondary)",
                    color: selectedStacks.includes(s)
                      ? "#fff"
                      : "var(--color-text-secondary)",
                    borderColor: selectedStacks.includes(s)
                      ? "#FF4D6D"
                      : "var(--color-border-secondary)",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <button
            style={{ ...styles.btnMain, background: "#4361EE" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3451D4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4361EE")}
            onClick={handleSignup}
          >
            <UserPlusIcon /> Create account
          </button>

          <p style={styles.footer}>
            Already a member?{" "}
            <span
              style={{ ...styles.footerLink, color: "#4361EE" }}
              onClick={() => switchTo("login")}
            >
              Sign in
            </span>
          </p>
        </div>

        {/* OVERLAY PANEL */}
        <div
          style={{
            ...styles.overlay,
            left: isLogin ? "50%" : "0%",
          }}
        >
          <div style={styles.overlayBg} />
          <div
            style={{
              ...styles.overlayContent,
              opacity: overlayVisible ? 1 : 0,
              transform: overlayVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div style={styles.eyebrow}>
              <div style={styles.eyebrowDot} />
              {ovData.eyebrow}
            </div>

            <h2 style={styles.ovHeading}>
              {ovData.heading[0]}
              <br />
              <span style={{ color: "#FF4D6D" }}>{ovData.heading[1]}</span>
            </h2>

            <p style={styles.ovBody}>{ovData.body}</p>

            <ul style={styles.featureList}>
              {features[mode].map((f) => (
                <li key={f.title} style={styles.featureItem}>
                  <div style={styles.featureIcon}>
                    <CheckIcon />
                  </div>
                  <div>
                    <div style={styles.featureTitle}>{f.title}</div>
                    <div style={styles.featureDesc}>{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>

            <button
              style={styles.ovBtn}
              onClick={() => switchTo(ovData.btnMode)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              {ovData.arrowDir === "left" && <ArrowLeftIcon />}
              {ovData.btnLabel}
              {ovData.arrowDir === "right" && <ArrowRightIcon />}
            </button>
          </div>

          {/* Bottom bar */}
          <div style={styles.overlayBottom}>
            <span style={styles.ovBrand}>
              dev<span style={{ color: "rgba(255,77,109,0.5)" }}>Connect</span>
            </span>
            <div style={{ display: "flex", gap: 5 }}>
              <div
                style={{ ...styles.navDot, width: 28, background: "#FF4D6D" }}
              />
              <div style={styles.navDot} />
              <div style={styles.navDot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ width: "100%", marginBottom: "0.65rem", ...style }}>
      <label style={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function SignInIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem 1rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "#0a0a0f",
  },
  card: {
    position: "relative",
    width: 880,
    maxWidth: "100%",
    height: 680, // Increased height to accommodate new fields
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    background: "#0f0f15",
    boxShadow:
      "0 20px 40px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)",
  },
  formPanel: {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2.75rem 2.5rem",
    transition:
      "transform 0.7s cubic-bezier(0.77,0,0.175,1), opacity 0.5s ease",
    zIndex: 2,
    background: "#0f0f15",
    overflowY: "auto", // Make scrollable if content overflows
  },
  logo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: 27,
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: -0.6,
    lineHeight: 1.15,
    marginBottom: "0.3rem",
  },
  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    marginBottom: "1.4rem",
    lineHeight: 1.5,
  },
  fieldLabel: {
    display: "block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#ffffff",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  strengthBar: {
    width: "100%",
    height: 4,
    borderRadius: 4,
    background: "rgba(255,255,255,0.1)",
    marginTop: 6,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s, background 0.3s",
  },
  tag: {
    padding: "4px 10px",
    borderRadius: 20,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.15s",
  },
  btnMain: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    marginTop: "0.2rem",
    transition: "transform 0.15s, background 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  forgotLink: {
    fontSize: 12,
    color: "#FF4D6D",
    cursor: "pointer",
    fontWeight: 600,
    textDecoration: "none",
    opacity: 0.8,
    transition: "opacity 0.2s",
  },
  footer: {
    marginTop: "0.9rem",
    fontSize: 12.5,
    color: "rgba(255,255,255,0.4)",
    width: "100%",
    textAlign: "center",
  },
  footerLink: {
    color: "#FF4D6D",
    fontWeight: 700,
    cursor: "pointer",
  },
  overlay: {
    position: "absolute",
    top: 0,
    width: "50%",
    height: "100%",
    zIndex: 5,
    transition: "left 0.7s cubic-bezier(0.77,0,0.175,1)",
    overflow: "hidden",
    borderRadius: 24,
  },
  overlayBg: {
    position: "absolute",
    inset: 0,
    borderRadius: 24,
    background: "linear-gradient(145deg, #0a0a12 0%, #05050a 100%)",
  },
  overlayContent: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2.75rem 2.5rem 5rem",
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,77,109,0.8)",
    marginBottom: "1.1rem",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#FF4D6D",
    flexShrink: 0,
  },
  ovHeading: {
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: -0.8,
    lineHeight: 1.2,
    marginBottom: "0.9rem",
  },
  ovBody: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    marginBottom: "1.75rem",
    maxWidth: 240,
  },
  featureList: {
    listStyle: "none",
    marginBottom: "2rem",
    padding: 0,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: "0.7rem",
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    background: "rgba(255,77,109,0.12)",
    border: "0.5px solid rgba(255,77,109,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.5,
  },
  ovBtn: {
    padding: "10px 22px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s, transform 0.15s",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  overlayBottom: {
    position: "absolute",
    bottom: "2.5rem",
    left: "2.5rem",
    right: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },
  ovBrand: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "0.08em",
  },
  navDot: {
    width: 18,
    height: 3,
    borderRadius: 3,
    background: "rgba(255,255,255,0.15)",
  },
};