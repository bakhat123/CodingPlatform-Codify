export interface Store {
    id: number;
    name: string;
    type: string;
    features: string[];
    number: string;
    price: string;
    currency: string;
}

export const store: Store[] = [
    {
        id: 1,
        name: "Sekiro",
        type: "Pfp",
        features: ["Pfp","Most Popular","Diamond","All Items"],
        number: "1",
        price: "5",
        currency: "Diamond"
    },
    {
        id: 2,
        name: "HollowKnight",
        type: "Pfp",
        features: ["Pfp","Gold","Recent","All Items"],
        number: "2",
        price: "90",
        currency: "GoldCoin"

    },
    {
        id: 3,
        name: "Gengar",
        type: "Pfp",
        features: ["Pfp","Diamond","All Items"],
        number: "3",
        price: "10",
        currency: "Diamond"

    },
    {
        id: 4,
        name: "Terrorance",
        type: 'Background',
        features: ["Background","Gold","All Items"],
        number: "1",
        price: "20",
        currency: "GoldCoin"

    },
    {
        id: 5,
        name: "Shadow Warrior",
        type: "Background",
        features: ["Background","Diamond","All Items"],
        number: "2",
        price: "18",
        currency: "Diamond"

    },
    {
        id: 6,
        name: "Fortnite",
        type: "Background",
        features: ["Background","Diamond","All Items"],
        number: "3",
        price: "25",
        currency: "Diamond"

    },
    {
        id: 7,
        name: "Diablo",
        type: "Background",
        features: ["Background","Gold","All Items"],
        number: "4",
        price: "60",
        currency: "GoldCoin"

    },
    {
        id: 8,
        name: "Witcher",
        type: "Background",
        features: ["Background","Recent","Most Popular","Diamond","All Items"],
        number: "5",
        price: "30",
        currency: "Diamond"

    },

];