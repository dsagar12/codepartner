import React from "react";
import Feed from "../pages/feed";
import {
  Home,
  User,
  Search,
  Users,
  MessageCircle,
  FolderGit2,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  console.log(user);

  return (
    <div className="">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300 fixed top-0 left-0 z-50">
            {/* LEFT: Drawer Button */}
            <div className="flex-none">
              <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-1 px-4 text-xl font-bold cursor-pointer">
              dev<span className="text-pink-500">Connect</span>
              <span className="text-gray-400"> / feed</span>
            </div>

            {/* RIGHT: Avatar */}
            <div className="flex-none mr-5">
              <Link to={"/profile"} className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="user"
                  />
                </div>
              </Link>
            </div>
          </nav>
          {/* Page content here */}
          <div className=" pt-16">
           
          </div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible fixed top-0 left-0 h-full z-50 mt-16">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow gap-3 mt-3">
              {/* Home */}
              <li>
                <Link
                  to="/"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Home"
                >
                  <Home size={20} />
                  <span className="is-drawer-close:hidden">Home</span>
                </Link>
              </li>

              {/* Profile */}
              <li>
                <Link
                  to="/profile"
                  data-tip="Profile"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <User size={20} />
                  <span className="is-drawer-close:hidden">Profile</span>
                </Link>
              </li>

              {/* Explore */}
              <li>
                <Link
                  to="/search"
                  data-tip="Explore"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <Search size={20} />
                  <span className="is-drawer-close:hidden">Search By Skills</span>
                </Link>
              </li>

              {/* Connections */}
              <li>
                <Link
                  to="/connections"
                  data-tip="Connections"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <Users size={20} />
                  <span className="is-drawer-close:hidden">Connections</span>
                </Link>
              </li>

              {/* Messages */}
              <li>
                <button
                  data-tip="Messages"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <MessageCircle size={20} />
                  <span className="is-drawer-close:hidden">Messages</span>
                </button>
              </li>

              {/* Projects */}
              <li>
                <button
                  data-tip="Projects"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <FolderGit2 size={20} />
                  <span className="is-drawer-close:hidden">Projects</span>
                </button>
              </li>

              {/* Saved */}
              <li>
                <button
                  data-tip="Saved"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <Bookmark size={20} />
                  <span className="is-drawer-close:hidden">Saved</span>
                </button>
              </li>

              {/* Settings */}
              <li>
                <button
                  data-tip="Settings"
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                >
                  <Settings size={20} />
                  <span className="is-drawer-close:hidden">Settings</span>
                </button>
              </li>

              {/* Logout */}
              <li>
                <Link
                to="/logout"
                  
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right text-red-500" 
                 
                >
                  <LogOut size={20} />
                  <span className="is-drawer-close:hidden">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
