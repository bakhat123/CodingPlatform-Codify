'use client'
import PaymentSection from "./ui/PaymentSection";
import HeroSection from "./ui/HeroSection";
import CardSection from "./ui/CardSection";


export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <CardSection />
      <PaymentSection />
    </div>
  );
}


