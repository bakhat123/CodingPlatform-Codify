// src/data/cardsData.ts

export interface Card {
  id: number;
  title: string;
  detail: string;
  color: string;
  icon: string;
  background: string;
}

export const cards: Card[] = [
  {
    id: 1,
    title: "AboutUs",
    detail:
      "We are a forward-thinking company committed to revolutionizing industries through innovative technology. Our journey began with a simple idea to improve everyday lives, and we’ve evolved into a leader in providing groundbreaking solutions.",
    color: "89,230,255", 
    icon: '/assets/images/cards/icon-1.svg',
    background: '/assets/images/cards/card1_bg.png',
  },
  {
    id: 2,
    title: "LeaderBoard",
    detail:
      "The Leaderboard tracks achievements across various challenges, providing recognition to top performers. This feature fosters a competitive environment where users can showcase their skills and gain recognition for their efforts.",
    color: "253,207,126",
    icon: '/assets/images/cards/icon-2.svg',
    background: '/assets/images/cards/card2_bg.png',
  },
  {
    id: 3,
    title: "Store",
    detail:
      "Our online store is designed to offer a wide range of products, from exclusive items to essentials. We prioritize quality, convenience, and customer satisfaction, ensuring every shopping experience is seamless.",
    color: "245,47,242",
    icon: '/assets/images/cards/icon-3.svg',
    background: '/assets/images/cards/card3_bg.png',
  },
  {
    id: 4,
    title: "Tournament",
    detail:
      "The Tournament feature offers users the chance to compete in various events. Whether you're a beginner or a seasoned competitor, there's always a challenge to conquer. ",
    color: "130,202,83",
    icon: '/assets/images/cards/icon-4.svg',
    background: '/assets/images/cards/card4_bg.png',
  },
  {
    id: 5,
    title: "Profile",
    detail:
      "Your profile is where you can manage all aspects of your account, from personal details to activity history. It allows you to track progress, update information, and personalize your experience.",
    color: "244,80,105",
    icon: '/assets/images/cards/icon-5.svg',
    background: '/assets/images/cards/card5_bg.png',
  },
  {
    id: 6,
    title: "BuyCoins",
    detail:
      "BuyCoins lets you enhance your experience by purchasing in-game currency. This allows access to premium content, exclusive features, and various rewards. ",
    color: "111,80,213",
    icon: '/assets/images/cards/icon-6.svg',
    background: '/assets/images/cards/card6_bg.png',
  },
];
