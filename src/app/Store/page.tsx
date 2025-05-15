"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useDiamonds } from "@/context/DiamondsContext";
import SideSelector from "./ui/SideSelector";
import SlidingCard from "./ui/SlidingCard";
import ItemCard from "./ui/ItemCard";
import SkeletonLoader from "./skeleton";
import "sweetalert2/dist/sweetalert2.min.css";

const Page = () => {
  const { data: session, status } = useSession();
  const { diamonds, setDiamonds } = useDiamonds();
  const [storeItems, setStoreItems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All Items");
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFiltersApply = (filter: string) => {
    setSelectedFilter(filter);
    console.log("Applied Filter:", filter);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both store items and user assets in parallel
        const [storeRes, assetsRes] = await Promise.all([
          fetch("/api/store"),
          status === "authenticated" 
            ? fetch(`/api/users/${session?.user?.name}/assets`)
            : Promise.resolve(null)
        ]);

        // Handle store items response
        if (!storeRes.ok) throw new Error("Failed to fetch store items");
        const storeData = await storeRes.json();
        setStoreItems(storeData);

        // Handle user assets response if authenticated
        if (assetsRes) {
          const assetsData = await assetsRes.json();
          if (assetsRes.ok && assetsData.assets) {
            const { pfps, backgrounds } = assetsData.assets;
            setPurchasedItems([...pfps, ...backgrounds]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  const filteredStore = storeItems.filter((item) => {
    if (selectedFilter === "All Items") return true;
    if (["Pfp", "Background", "Diamond"].includes(selectedFilter)) {
      return item.type === selectedFilter;
    }
    if (["Recent", "Most Popular", "Owned"].includes(selectedFilter)) {
      return item.features?.includes(selectedFilter);
    }
    return false;
  });

  const handlePurchase = async (itemId: string, itemName: string, price: string) => {
    const itemPrice = parseFloat(price);

    if (status === "unauthenticated") {
      Swal.fire({
        icon: "error",
        title: "User not logged in",
        text: "Please log in to make a purchase.",
        background: "#333",
        color: "#fff",
        iconColor: "red",
        confirmButtonColor: "#ff4d4d",
      });
      return;
    }

    if (diamonds < itemPrice) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Diamonds",
        text: "You don't have enough diamonds to purchase this item.",
        background: "#333",
        color: "#fff",
        iconColor: "red",
        confirmButtonColor: "#ff4d4d",
      });
      return;
    }

    try {
      const requestBody = {
        username: session?.user?.name,
        itemId,
        diamonds: itemPrice,
      };

      const res = await fetch("/api/purchaseItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok && data.message === "Item purchased successfully") {
        Swal.fire({
          icon: "success",
          title: "Purchase Successful!",
          text: `You successfully purchased ${itemName}`,
          background: "#333",
          color: "#fff",
          iconColor: "green",
          confirmButtonColor: "#4CAF50",
        });

        setPurchasedItems((prev) => [...prev, itemName]);
        setDiamonds(diamonds - itemPrice);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to purchase item",
          text: data.error || "Something went wrong, please try again.",
          background: "#333",
          color: "#fff",
          iconColor: "red",
          confirmButtonColor: "#ff4d4d",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error during purchase",
        text: "An error occurred while making the purchase.",
        background: "#333",
        color: "#fff",
        iconColor: "red",
        confirmButtonColor: "#ff4d4d",
      });
      console.error("Error during purchase:", error);
    }
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="relative w-screen min-h-screen flex mt-5">
      <div className="w-[88.7857vh] min-h-screen flex justify-center items-start">
        <SideSelector onApplyFilters={handleFiltersApply} />
      </div>

      <div className="w-full h-full flex flex-col">
        <div className="w-full h-[62vh] flex justify-start items-center">
          <SlidingCard />
        </div>

        <div className="w-full grid grid-cols-3 gap-[5.1286vh] px-[9.9286vh] mb-[7.14vh] gap-y-[0vh]">
          {filteredStore.length > 0 ? (
            filteredStore.map((item) => (
              <ItemCard
                key={item._id}
                name={item.name}
                type={item.type}
                features={item.features}
                price={item.price}
                onPurchase={() => handlePurchase(item._id, item.name, item.price)}
                isPurchased={purchasedItems.includes(item.name)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center text-white text-2xl mt-10">
              No items found in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;