import React from "react";

// Sections from components/contactPage
import Hero from "../components/Contact/Hero";

import Cards from "../components/Contact/Cards";
import ContactSection from "../components/Contact/ContactSection";
import EmergencyCTA from "../components/Contact/EmergencyCTA";


export default function ContactPage() {
  return (
    <div>
       <section>
        <Hero />
      </section>
        <section>
        <Cards />
      </section>

       <section>
        < ContactSection />
      </section>
       <section>
        < EmergencyCTA />
      </section>

    
    
    </div>
  );
}
