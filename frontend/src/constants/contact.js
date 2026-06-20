export const CONTACT = {
  companyName: "MA Auto Electrics",
  phoneDisplay: "+44 7889 133123",
  phoneDigits: "447889133123",
  phoneHref: "tel:+447889133123",
  whatsappHref: "https://wa.me/447889133123",
  email: "maautoelectrics@gmail.com",
  emailHref: "mailto:maautoelectrics@gmail.com",
  address: {
    line1: "13 Laburnum Drive, Oswaldtwistle",
    line2: "Accrington, BB5 3AW",
    country: "United Kingdom",
    inline: "13 Laburnum Drive, Oswaldtwistle, Accrington, BB5 3AW, United Kingdom",
    multiline: "13 Laburnum Drive, Oswaldtwistle\nAccrington, BB5 3AW\nUnited Kingdom",
  },
  mapsSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=13+laburnum+drive+oswaldtwistle+accrington+bb5+3aw",
  mapsPlaceUrl:
    "https://www.google.com/maps/place/M+A+Auto+Electrics/@53.7508303,-2.4371918,10.79z",
  mapsDirectionsUrl: "https://maps.app.goo.gl/EPnqrDkCRBvqW38z8",
};

export const formatPhoneAction = (label = "Call") =>
  `${label}: ${CONTACT.phoneDisplay}`;

export const formatPhoneCta = (label = "Call") =>
  `${label} ${CONTACT.phoneDisplay}`;
