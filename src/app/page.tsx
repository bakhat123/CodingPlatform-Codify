'use client'
import PaymentSection from "./ui/PaymentSection";
import HeroSection from "./ui/HeroSection";
import CardSection from "./ui/CardSection";
import AboutUs from "./ui/AboutUs";

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


