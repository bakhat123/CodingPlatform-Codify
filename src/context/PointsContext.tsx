// context/PointsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface PointsContextType {
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Provider component
export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchPoints = async () => {
      if (status === "authenticated" && session?.user?.name) {
        try {
          const res = await fetch(`/api/users/${session?.user?.name}/points`);
          const pointsData = await res.json();
          if (pointsData.points) {
            setPoints(pointsData.points); // Update points state
          }
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      } else {
        setPoints(0); // If unauthenticated, set points to 0
      }
    };

    fetchPoints();
  }, [session, status]);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

// Custom hook to access the Points context
export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};
