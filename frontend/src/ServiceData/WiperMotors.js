import {
  FaPhoneAlt,
  FaPhone,
  FaCar,
  FaWrench,
  FaThermometerHalf,
  FaCheckCircle,
  FaBolt,
  
  
  
} from "react-icons/fa";



export const motHeroData = {
  badge: "Trusted Vehicle Care",

  title: {
    before: "Wiper",
    highlight: "Motors",
  },

  description: {
    afterBold:
      "Maintain clear visibility in all weather conditions with professional wiper motor diagnostics and replacement.",
  },

  buttons: {
    primary: {
      text: "Call: +44 7889 133123",
      href: "tel:+447889133123",
      icon: FaPhoneAlt,
      bg: "#317F21",
      color: "#FFFFFF",
    },
    secondary: {
      text: "Book Service",
      href: "/contact",
      border: "#317F21",
      color: "#317F21",
      hoverBg: "#317F21",
      hoverColor: "#FFFFFF",
    },
  },
};





export const automotiveServicesData = {
  heading: {
    title: "Professional Wiper Motor Services",
    subtitle: "Accurate diagnosis and repair of front and rear wiper motor faults",
  },

  services: [
    {
      title: "Wiper Motor Repairs & Replacement",
      desc: "Effective solutions for wiper system failures.",
      icon: FaCar,
      points: [
        "Front and rear wiper motors",
        "Electrical and linkage checks",
        "Smooth and consistent wiping restored",
      ],
    },
  ],
};


export const majorServicesData = {
  service_name: "Wiper Motor Services",

  intro_description:
    "Why Choose MA Auto Electrics for Wiper Motor Services?\n✓ Electrical fault specialists\n✓ Reliable parts and repairs\n✓ Quick diagnosis and turnaround\n✓ Compatible with most vehicles",

  benefits: [
    {
      title: "Electrical Fault Specialists",
      description:
        "Our team has expert knowledge in diagnosing and repairing wiper motor electrical faults accurately.",
    },
    {
      title: "Reliable Parts and Repairs",
      description:
        "We use high-quality parts and perform repairs that restore your wiper system reliably.",
    },
    {
      title: "Quick Diagnosis and Turnaround",
      description:
        "We quickly identify issues and complete repairs efficiently to get you back on the road safely.",
    },
    {
      title: "Compatible with Most Vehicles",
      description:
        "Our services cater to a wide range of vehicle makes and models, ensuring compatibility and performance.",
    },
  ],

  signs: [
    "Wipers not working at all",
    "Intermittent or slow movement",
    "Wipers stopping mid-cycle",
    "Blown fuses repeatedly",
  ],
};






export const emergencyCtaData = {
  palette: {
    primary: "#317F21",
    fgOnPrimary: "#FFFFFF",
    secondaryBg: "#C6F0C2",
    secondaryText: "#3B0000",
    outline: "#FFFFFF",
    darkBg: "#9B0D24",
  },

  heading: "Wiper Motor Specialists in Accrington, Lancashire",

  subheading:
    "Choose MA Auto Electrics for professional wiper motor diagnostics, repairs, and replacement services you can trust.",

  buttons: {
    call: {
      text: "Call +44 7889 133123",
      href: "tel:+447889133123",
      icon: FaPhone,
    },
    book: {
      text: "Book Service",
      href: "/contact",
    },
  },
};
