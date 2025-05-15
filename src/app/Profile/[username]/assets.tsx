"use client";
import React, { useState, useEffect } from "react";
import Card from '../components/AssetCard';
import { toast } from "react-toastify";

interface AssetsProps {
  username: string;
  onAssetChange: (type: 'pfp' | 'background', assetPath: string) => void;
}

const Assets = ({ username, onAssetChange }: AssetsProps) => {
  const [assets, setAssets] = useState({
    pfps: [] as string[],
    backgrounds: [] as string[]
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`/api/users/${username}/assets`);
        if (!res.ok) throw new Error('Failed to fetch assets');
        const data = await res.json();
        setAssets(data.assets);
      } catch (error) {
        console.error("Fetch assets error:", error);
        toast.error("Failed to load assets");
      }
    };
    fetchAssets();
  }, [username]);

  const handleUse = async (assetPath: string, type: 'pfp' | 'background') => {
    try {
      const res = await fetch(`/api/users/${username}/sidebar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: assetPath })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update assets');
      }

      // Optimistic update - immediately reflect changes
      onAssetChange(type, assetPath);
      toast.success(`${type === 'pfp' ? 'Profile picture' : 'Background'} updated!`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="ml-[18px] mt-[25px] w-full mb-[20px]">
      <div className="font-tektur font-semibold text-[30px] text-white ml-3">Profile</div>
      <div className="flex flex-wrap gap-4 ml-2 mt-4">
        {assets.pfps.map((pfp, index) => (
          <Card 
            key={`pfp-${index}`} 
            assetPath={pfp} 
            type="pfp" 
            onUse={() => handleUse(pfp, 'pfp')} 
          />
        ))}
      </div>

      <div className="font-tektur font-semibold text-[30px] text-white ml-3 mt-6">Background</div>
      <div className="flex flex-wrap gap-4 ml-2 mt-4">
        {assets.backgrounds.map((bg, index) => (
          <Card
            key={`bg-${index}`}
            assetPath={bg}
            type="background"
            onUse={() => handleUse(bg, 'background')}
          />
        ))}
      </div>
    </div>
  );
};

export default Assets;
