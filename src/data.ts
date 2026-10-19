import { ServiceItem, ProjectItem, ReviewItem } from "./types";

export const CITY_NAME = "Lagos";
export const BRAND_NAME = "Auxano Solar";
export const FOUNDED_YEAR = "2018";
export const SYSTEMS_INSTALLED = "640";
export const FOUNDER_NAME = "Engr. Babajide Alao, Lead Design Engineer";

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    number: "1.",
    title: "Residential Solar Systems",
    description: "Cut your grid reliance by 70–90% with Tier-1 monocrystalline panels sized specifically for your home, roof orientation, and daily load profile."
  },
  {
    id: 2,
    number: "2.",
    title: "Premium Lithium Battery Storage",
    description: "Store surplus daytime solar energy and transition automatically during grid drops. Silence the generators forever with silent, instant backup."
  },
  {
    id: 3,
    number: "3.",
    title: "Smart Inverter & EV Charging Integration",
    description: "Incorporate intelligent load management and vehicle chargers. Power your EV directly from your roof with optimized charging times."
  },
  {
    id: 4,
    number: "4.",
    title: "Commercial & Industrial Solar",
    description: "Engineered high-yield systems for offices, warehouses, and estates in Lagos. Stabilize operational overhead and eliminate diesel volatility."
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    suburb: "Lekki Phase 1",
    sizeKw: 12.4,
    hasBattery: true,
    batteryCapacityKwh: 15.0,
    annualSavings: "₦3,840,000",
    installDuration: "2 days",
    quote: "Our electricity bills are down 82% and we haven't turned on our diesel generator in four months. The Auxano crew was extremely professional and clean.",
    clientName: "Dr. Chidi Okechukwu",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true
  },
  {
    id: 2,
    suburb: "Ikeja GRA",
    sizeKw: 8.8,
    hasBattery: true,
    batteryCapacityKwh: 10.0,
    annualSavings: "₦2,730,000",
    installDuration: "1.5 days",
    quote: "The only solar company that provided a customized shade-analysis report for our roof rather than a generic proposal. Exceptional attention to detail.",
    clientName: "Mrs. Toyin Adebayo",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    isFeatured: false
  },
  {
    id: 3,
    suburb: "Ikoyi Residence",
    sizeKw: 15.6,
    hasBattery: true,
    batteryCapacityKwh: 20.0,
    annualSavings: "₦4,830,000",
    installDuration: "3 days",
    quote: "Seamless integration with our home automation system and dual EV chargers. Flawless execution from design to grid inspection.",
    clientName: "Chief Aliyu Usman",
    imageUrl: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80",
    isFeatured: false
  },
  {
    id: 4,
    suburb: "Magodo Phase 2",
    sizeKw: 10.2,
    hasBattery: true,
    batteryCapacityKwh: 15.0,
    annualSavings: "₦3,160,000",
    installDuration: "2 days",
    quote: "With the frequent grid instability in Magodo, Auxano Solar's system has given us 24/7 power without generator noise.",
    clientName: "Mr. Kunle Shonubi",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
    isFeatured: false
  },
  {
    id: 5,
    suburb: "Victoria Island Clinic",
    sizeKw: 25.0,
    hasBattery: true,
    batteryCapacityKwh: 30.0,
    annualSavings: "₦7,750,000",
    installDuration: "4 days",
    quote: "Our diagnostic equipment requires zero-fluctuation power. The Auxano commercial system handles this perfectly.",
    clientName: "Dr. Amara Williams",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    isFeatured: false
  },

  {
    id: 7,
    suburb: "Banana Island Estate",
    sizeKw: 18.0,
    hasBattery: true,
    batteryCapacityKwh: 30.0,
    annualSavings: "₦5,580,000",
    installDuration: "3 days",
    quote: "Auxano built an incredibly robust 3-phase hybrid system for our estate. Complete peace of mind and excellent remote monitoring.",
    clientName: "Chief Raymond Cole",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    isFeatured: false
  },
  {
    id: 8,
    suburb: "Gbagada Duplex",
    sizeKw: 5.4,
    hasBattery: true,
    batteryCapacityKwh: 7.5,
    annualSavings: "₦1,670,000",
    installDuration: "1 day",
    quote: "Incredibly fast execution. Sized perfectly for our daily load. The team completed everything in a single day.",
    clientName: "Mr. Femi Balogun",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    isFeatured: false
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 1,
    rating: 5,
    text: "With Auxano Solar, it's all about durability, quality and professionalism. The 15kVA system built for us has been serving for over 3 years with zero downtime. We run everything with it.",
    author: "Prince Temidayo",
    role: "Homeowner",
    suburb: "Amuwo Odofin"
  },
  {
    id: 2,
    rating: 5,
    text: "We requested quotes from three installers. Auxano was the only team that physically climbed the roof to do a true structurally engineered assessment before pitching. That competence showed.",
    author: "Deji K.",
    role: "Architect",
    suburb: "Ikeja GRA"
  },
  {
    id: 3,
    rating: 5,
    text: "The battery backup changeover is literally instantaneous. We had a 6-hour power outage from the grid last Sunday afternoon and our home didn't experience a single flicker. Truly remarkable.",
    author: "James & Rachel T.",
    role: "Homeowners",
    suburb: "Gbagada"
  },
  {
    id: 4,
    rating: 5,
    text: "Auxano managed all regulatory clearances and net-metering applications with Eko Electric directly. I didn't have to chase a single bureaucrat. Highly recommend their turnkey delivery.",
    author: "Michael O.",
    role: "Clinic Administrator",
    suburb: "Victoria Island"
  },
  {
    id: 5,
    rating: 5,
    text: "Completely honest, zero upfront surprises, and the remote monitoring app shows we are producing about 8% above our initial conservative design forecast. This investment has paid for itself.",
    author: "Linda C.",
    role: "Investor",
    suburb: "Banana Island"
  },
  {
    id: 6,
    rating: 5,
    text: "Our utility expenses are down 78%. Based on actual electricity tariff hikes in Lagos, our projected payback timeline is down to 4.5 years—well below the 5.2 years they estimated. Outstanding.",
    author: "Anthony R.",
    role: "Tech Executive",
    suburb: "Surulere"
  }
];

export const LAGOS_SUBURBS = [
  "Lekki Phase 1",
  "Lekki Phase 2",
  "Ikeja GRA",
  "Ikoyi",
  "Victoria Island",
  "Banana Island",
  "Gbagada",
  "Surulere",
  "Magodo Phase 2",
  "Ogudu",
  "Ajah",
  "Maryland",
  "Yaba"
];
