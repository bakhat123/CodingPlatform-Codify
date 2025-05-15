// context/DiamondsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface DiamondsContextType {
  diamonds: number;
  setDiamonds: React.Dispatch<React.SetStateAction<number>>;
}

const DiamondsContext = createContext<DiamondsContextType | undefined>(undefined);

// Provider component
export const DiamondsProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [diamonds, setDiamonds] = useState<number>(0);

  useEffect(() => {
    const fetchDiamonds = async () => {
      if (status === "authenticated" && session?.user?.name) {
        try {
          const res = await fetch(`/api/users/${session?.user?.name}/diamonds`);
          const diamondsData = await res.json();
          if (diamondsData.diamonds) {
            setDiamonds(diamondsData.diamonds); // Update diamonds state
          }
        } catch (error) {
          console.error("Error fetching diamonds:", error);
        }
      } else {
        setDiamonds(0); // If unauthenticated, set diamonds to 0
      }
    };

    fetchDiamonds();
  }, [session, status]);

  return (
    <DiamondsContext.Provider value={{ diamonds, setDiamonds }}>
      {children}
    </DiamondsContext.Provider>
  );
};

// Custom hook to access the Diamonds context
export const useDiamonds = () => {
  const context = useContext(DiamondsContext);
  if (!context) {
    throw new Error("useDiamonds must be used within a DiamondsProvider");
  }
  return context;
};
