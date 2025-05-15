"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FollowerModal from "./subui/FollowerModal";

interface SidebarProps {
  username: string;
  initialPfp: string;
  initialBackground: string;
}

const Sidebar = ({ username, initialPfp, initialBackground }: SidebarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [assets, setAssets] = useState({
    pfp: initialPfp,
    background: initialBackground
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("No bio yet...");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [profileData, setProfileData] = useState({
    participated: 0,
    top3Finishes: 0,
    linkedinLink: "",
    twitterLink: "",
    websiteLink: ""
  });
  const [loading, setLoading] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);

  useEffect(() => {
    setAssets({
      pfp: initialPfp,
      background: initialBackground
    });
    fetchProfileData();
    fetchUserRank();
  }, [initialPfp, initialBackground, username]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/profile/${username}`);
      if (response.ok) {
        const data = await response.json();
        setBio(data.bio || "No bio yet...");
        
        const followersList = Array.isArray(data.followers) ? data.followers : [];
        setFollowers(followersList);
        setFollowerCount(followersList.length);
        
        const currentUsername = session?.user?.name;
        if (currentUsername) {
          setIsFollowing(followersList.includes(currentUsername));
        }

        setProfileData({
          participated: data.tournamentStats?.participated || 0,
          top3Finishes: data.tournamentStats?.top3Finishes || 0,
          linkedinLink: data.linkedinLink || "",
          twitterLink: data.twitterLink || "",
          websiteLink: data.websiteLink || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await fetch(`/api/leaderboard?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setUserRank(data.userRank || null);
      }
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.name) {
      alert("Please log in to follow users");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${username}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          followerUsername: session.user.name,
          targetUsername: username 
        })
      });

      if (response.ok) {
        const result = await response.json();
        setIsFollowing(result.isFollowing);
        setFollowerCount(result.newFollowerCount);
        
        // Update the followers list after following/unfollowing
        fetchProfileData();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to follow user");
      }
    } catch (error) {
      console.error("Error following user:", error);
      alert("An error occurred while trying to follow");
    } finally {
      setLoading(false);
    }
  };

  const handleBioKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBioSave();
    }
  };

  const handleBioSave = async () => {
    if (!session?.user?.name || session.user.name !== username) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${username}/bio`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio })
      });

      if (response.ok) {
        setIsEditingBio(false);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update bio");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("An error occurred while saving bio");
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate to a follower's profile
  const handleFollowerClick = (followerUsername: string) => {
    setShowFollowersModal(false);
    router.push(`/Profile/${followerUsername}`);
  };

  const isOwner = session?.user?.name === username;

  return (
    <div className="w-[320px] h-[482px] mt-[144px] ml-[66px] mb-[40px] flex flex-col items-center">
      {/* Background Image */}
      <div className="w-full h-[107px] rounded-[12px] relative overflow-hidden">
        <Image
          src={assets.background}
          alt="Profile background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Profile Picture */}
      <div className="w-24 h-24 rounded-full border-2 border-black -mt-12 z-10 relative overflow-hidden">
        <Image
          src={assets.pfp}
          alt="Profile picture"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Username */}
      <div className="text-white text-[28px] font-semibold mt-1 font-tektur">
        {username}
      </div>

      {/* Followers and Rank */}
      <div className="w-full h-[20px] font-tektur text-[12px] flex">
        <div 
          className="text-[#908F92] flex flex-row ml-5 cursor-pointer hover:text-white transition-colors"
          onClick={() => setShowFollowersModal(true)}
        >
          <Image
            src="/assets/images/Profile/SideBar/followerIcon.svg"
            alt="Icon"
            width={30}
            height={17}
            className="w-[30px] h-[17px] object-cover mr-1"
            quality={100}
          />
          Followers<span className="text-white ml-1">{followerCount}</span>
        </div>
        <div className="text-[#908F92] flex flex-row ml-[50px]">
          <Image
            src="/assets/images/Profile/SideBar/RankIcon.svg"
            alt="Icon"
            width={19}
            height={15}
            className="w-[22px] h-[15px] object-cover mr-2"
            quality={100}
          />
          Rank<span className="text-white ml-1">#{userRank || '-'}</span>
        </div>
      </div>

      {/* Bio Section - Fixed Width Box */}
      <div className="w-[294px] min-h-[80px] mt-2 bg-[#161618] rounded-[5px] p-2">
        {isEditingBio ? (
          <textarea
            ref={textareaRef}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onKeyDown={handleBioKeyDown}
            className="w-full h-full bg-transparent text-[#9A999E] font-tektur font-light text-[12px] resize-none focus:outline-none"
            maxLength={200}
            autoFocus
            placeholder="Enter your bio..."
          />
        ) : (
          <div className="text-[#9A999E] font-tektur font-light text-[12px] h-full w-full leading-[16px]">
            {bio || "No bio yet..."}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full h-[26px] mt-6 font-tektur flex font-medium text-[12px] ml-2">
        {!isOwner ? (
          <button 
            className={`h-[26px] w-[90px] rounded-[5px] flex items-center justify-center ${
              isFollowing ? 'bg-[#161618] text-[#B3FFED]' : 'bg-[#B3FFED] text-black'
            }`}
            onClick={handleFollow}
            disabled={loading}
          >
            {loading ? (
              'Loading...'
            ) : (
              <>
                <Image
                  src="/assets/images/Profile/SideBar/ProfileIcon.svg"
                  alt="Icon"
                  width={20}
                  height={19}
                  className="w-[20px] h-[19px] object-cover mr-1"
                  quality={100}
                />
                {isFollowing ? 'Unfollow' : 'Follow'}
              </>
            )}
          </button>
        ) : (
          <button 
            className="h-[26px] w-[90px] bg-[#161618] rounded-[5px] flex items-center justify-center text-[#B3FFED]"
            onClick={() => {
              setIsEditingBio(!isEditingBio);
              setTimeout(() => textareaRef.current?.focus(), 0);
            }}
            disabled={loading}
          >
            <Image
              src="/assets/images/Profile/SideBar/PenIcon.svg"
              alt="Icon"
              width={20}
              height={19}
              className="w-[20px] h-[19px] object-cover mr-1"
              quality={100}
            />
            {isEditingBio ? 'Cancel' : 'Edit Bio'}
          </button>
        )}

        {/* Social Media Icons */}
        <button className="h-[26px] w-[50px] bg-[#161618] rounded-[5px] flex items-center justify-center ml-2">
          <Image
            src="/assets/images/Profile/SideBar/GlobeIcon.svg"
            alt="Icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px] object-cover"
            quality={100}
          />
        </button>
        <button className="h-[26px] w-[50px] bg-[#161618] rounded-[5px] flex items-center justify-center ml-2">
          <Image
            src="/assets/images/Profile/SideBar/TwitterIcon.svg"
            alt="Icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px] object-cover"
            quality={100}
          />
        </button>
      </div>

      {/* Tournament Stats */}
      <div className="w-[294px] h-[68px] bg-[#161618] mt-5 rounded-[10px] flex items-center">
        <Image
          src="/assets/images/Profile/SideBar/crown.svg"
          alt="Icon"
          width={37}
          height={36}
          className="w-[37px] h-[36px] object-cover ml-2 mr-3"
          quality={100}
        />
        <div className="text-[12px] font-light font-tektur text-[#9A999E] leading-[18px]">
          No. of tournaments participated: <span className="ml-3 text-white">{profileData.participated}</span>
          <br />
          Ranked in Top 3: <span className="ml-3 text-[#B3FFED]">{profileData.top3Finishes}</span>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowerModal 
          followers={followers}
          onClose={() => setShowFollowersModal(false)}
          onFollowerClick={handleFollowerClick}
        />
      )}
    </div>
  );
};

export default Sidebar;