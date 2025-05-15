"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../ui/Sidebar";
import Header from "../ui/Header";
import Assets from "./assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Achievements from "./achievements";
import History from "./history";
import Progress from "./progress";
import Information from "./information";
import { ActiveTab } from "@/types/profile";
import { useSession } from "next-auth/react";

interface UserData {
  username: string;
  email: string;
  error?: string;
}

const ProfilyPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const username = params?.username as string;
  const [assets, setAssets] = useState({
    pfp: "/default-pfp.png",
    background: "/default-bg.jpg"
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("Achievements");
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = session?.user?.name === username;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, assetsRes] = await Promise.all([
          fetch(`/api/users/${username}`),
          fetch(`/api/users/${username}/sidebar`)
        ]);

        const userDataFromAPI: UserData = await userRes.json();
        const assetsData = await assetsRes.json();

        if (!userRes.ok) throw new Error(userDataFromAPI.error || "Failed to fetch user");
        if (!assetsRes.ok) throw new Error(assetsData.error || "Failed to fetch assets");

        setAssets({
          pfp: assetsData.pfpUrl || "/default-pfp.png",
          background: assetsData.backgroundUrl || "/default-bg.jpg"
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  const handleAssetChange = (type: "pfp" | "background", assetPath: string) => {
    const extension = type === "pfp" ? "png" : "jpg";
    setAssets((prev) => ({
      ...prev,
      [type]: assetPath
        ? `/assets/images/Store/${assetPath}.${extension}`
        : type === "pfp"
        ? "/default-pfp.png"
        : "/default-bg.jpg"
    }));
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-[#121113] relative">
      {isLoading ? (
        <div className="absolute inset-0 bg-[#121113] bg-opacity-90 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <span className="text-white text-lg font-tektur">Loading profile...</span>
          </div>
        </div>
      ) : (
        <>
          <Sidebar
            username={username}
            initialPfp={assets.pfp}
            initialBackground={assets.background}
            key={`sidebar-${assets.pfp}-${assets.background}`}
          />

          <div className="flex-1 flex flex-col">
            <Header
              onTabChange={handleTabChange}
              activeTab={activeTab}
              isOwner={isOwner}
            />
            <main className="p-4 flex-1">
              {activeTab === "Achievements" && <Achievements username={username} />}
              {activeTab === "Assets" && isOwner && <Assets username={username} onAssetChange={handleAssetChange} />}
              {activeTab === "History" && isOwner && <History />}
              {activeTab === "Progress" && isOwner && <Progress />}
              {activeTab === "Information" && isOwner && <Information username={username} />}
            </main>
          </div>
        </>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ProfilyPage;
