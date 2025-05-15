'use client'
import PaymentSection from "./ui/PaymentSection";
import HeroSection from "./ui/HeroSection";
import CardSection from "./ui/CardSection";
// import AboutUs from "./ui/AboutUs"; // Removed unused import if it was present

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <CardSection />
      {/* <AboutUs /> */}
      <PaymentSection />
    </div>
  );
}


