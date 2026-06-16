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
    before: "Window",
    highlight: "Regulators",
  },

  description: {
    afterBold:
      "Restore smooth and reliable window operation with professional window regulator repair and replacement services.",
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
    title: "Professional Window Regulator Services",
    subtitle: "Expert repair and replacement of faulty electric and manual window mechanisms",
  },

  services: [
    {
      title: "Window Regulator Repairs & Replacement",
      desc: "Reliable fixes for window movement issues.",
      icon: FaCar,
      points: [
        "Electric window regulator replacement",
        "Cable and motor-related repairs",
        "Jammed or stuck windows",
        "Smooth and quiet operation restored",
      ],
    },
  ],
};




export const majorServicesData = {
  service_name: "Window Regulator Services",

  intro_description:
    "Why Choose MA Auto Electrics for Window Regulator Services?\n✓ Experienced auto electrical technicians\n✓ Quality replacement components\n✓ Damage-free door panel removal\n✓ Suitable for most vehicles",

  benefits: [
    {
      title: "Experienced Auto Electrical Technicians",
      description:
        "Our team has the skills to accurately diagnose and repair faulty window regulators efficiently.",
    },
    {
      title: "Quality Replacement Components",
      description:
        "We use reliable replacement parts to restore your window’s smooth and consistent operation.",
    },
    {
      title: "Damage-Free Door Panel Removal",
      description:
        "All repairs are carried out carefully to protect your door panels and maintain factory standards.",
    },
    {
      title: "Suitable for Most Vehicles",
      description:
        "Our services cover a wide range of makes and models, ensuring compatibility and performance.",
    },
  ],

  signs: [
    "Window stuck or moving slowly",
    "Clicking or grinding noises",
    "Window falling inside the door",
    "Switch works but window doesn’t move",
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

  heading: "Window Regulator Specialists in Accrington, Lancashire",

  subheading:
    "Choose MA Auto Electrics for professional window regulator diagnostics, repairs, and replacement services you can trust.",

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
