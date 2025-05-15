"use client";
import React from "react";

interface FollowerModalProps {
  followers: string[];
  onClose: () => void;
  onFollowerClick: (username: string) => void;
}

const FollowerModal = ({ followers, onClose, onFollowerClick }: FollowerModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div 
        className="bg-[#0E0C15] border border-[#2A2931] rounded-xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
        style={{
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-xl font-semibold font-tektur">Followers</h3>
          <button 
            onClick={onClose}
            className="text-[#908F92] hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Follower List */}
        <div className="space-y-3">
          {followers.length > 0 ? (
            followers.map((username) => (
              <div 
                key={username}
                className="flex items-center p-3 hover:bg-[#1E1D25] rounded-lg cursor-pointer transition-colors"
                onClick={() => onFollowerClick(username)}
              >
                {/* Profile Picture Placeholder */}
                <div className="w-10 h-10 rounded-full bg-[#252937] flex items-center justify-center mr-3">
                  <span className="text-[#B3FFED] text-sm font-medium">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Username */}
                <span className="text-white font-medium">{username}</span>
              </div>
            ))
          ) : (
            <p className="text-[#908F92] text-center py-4">No followers yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerModal;