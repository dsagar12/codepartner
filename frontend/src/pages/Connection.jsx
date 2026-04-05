import React, { useState } from "react";
import AcceptedConnections from "../components/AcceptedConnections";
import IncomingRequests from "../components/IncomingRequests";
import SentRequests from "../components/SentRequests";

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState("connections");

  return (
    <div className="min-h-screen bg-base-200 p-6 ml-9">

      {/* 🔥 Tabs */}
      <div className="flex gap-4 mb-6 border-b border-base-300 pb-2">

        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === "connections"
              ? "bg-primary text-white"
              : "bg-base-100 hover:bg-base-300"
          }`}
        >
          My Network
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === "requests"
              ? "bg-primary text-white"
              : "bg-base-100 hover:bg-base-300"
          }`}
        >
          Invitations
        </button>

        <button
          onClick={() => setActiveTab("sent")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
            activeTab === "sent"
              ? "bg-primary text-white"
              : "bg-base-100 hover:bg-base-300"
          }`}
        >
          Sent
        </button>

      </div>

      {/* 🔥 Content */}
      {activeTab === "connections" && <AcceptedConnections />}
      {activeTab === "requests" && <IncomingRequests />}
      {activeTab === "sent" && <SentRequests />}
    </div>
  );
};

export default ConnectionsPage;