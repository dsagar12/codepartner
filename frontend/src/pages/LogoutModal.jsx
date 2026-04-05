import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LogoutModal = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
      await axios.post("http://localhost:3000/logout",{},{
        withCredentials:true,
      })
      navigate("/");
    }catch(err){
      console.error("Logout failed:", err);
    }
  }
  return (
    <dialog
      id="logout_modal"
      className="modal modal-open bg-black/40 backdrop-blur-sm"
    >
      <div className="modal-box rounded-3xl text-center relative bg-white border border-neutral-200 shadow-xl">
        {/* Close Button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100">
            ✕
          </button>
        </form>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
            className="w-20 opacity-90"
            alt="logout"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Are you logging out?
        </h2>

        {/* Description */}
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
          You can always log back in at any time. If you just want to switch
          accounts, you can{" "}
          <span className="underline cursor-pointer text-neutral-900 hover:text-neutral-600">
            add another account
          </span>
          .
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="w-full py-3 rounded-full bg-primary text-white font-semibold hover:bg-neutral-700 transition"
            onClick={()=>{
              document.querySelector("dialog").close();
            }}
          >
            Cancel
          </button>
          <button
            className="w-full py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LogoutModal;
