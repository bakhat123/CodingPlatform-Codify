"use client";
import React from "react";
import HeaderItem from "./subui/HeaderItem";
import { ActiveTab } from "@/types/profile";

interface HeaderProps {
  onTabChange: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
  isOwner: boolean;
}

const Header: React.FC<HeaderProps> = ({ onTabChange, activeTab, isOwner }) => {
  return (
    <div className="w-[754px] h-[40px] mt-[144px] ml-[20px] border-b border-[#212023] flex flex-row items-end">
      <HeaderItem
        title="Achievements"
        isActive={activeTab === "Achievements"}
        onClick={() => onTabChange("Achievements")}
      />
      {isOwner && (
        <>
          <HeaderItem
            title="Assets"
            isActive={activeTab === "Assets"}
            onClick={() => onTabChange("Assets")}
          />
          <HeaderItem
            title="History"
            isActive={activeTab === "History"}
            onClick={() => onTabChange("History")}
          />
          <HeaderItem
            title="Progress"
            isActive={activeTab === "Progress"}
            onClick={() => onTabChange("Progress")}
          />
          <HeaderItem
            title="Information"
            isActive={activeTab === "Information"}
            onClick={() => onTabChange("Information")}
          />
        </>
      )}
    </div>
  );
};

export default Header;
