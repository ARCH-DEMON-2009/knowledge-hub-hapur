import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is the library completely free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Janhitkari Library is 100% free for everyone. There are no registration fees, no monthly charges, and no hidden costs." } },
    { "@type": "Question", "name": "What are the library timings?", "acceptedAnswer": { "@type": "Answer", "text": "We are open daily from 6:00 AM to 8:00 PM — that's 14 hours every single day." } },
    { "@type": "Question", "name": "Is registration required?", "acceptedAnswer": { "@type": "Answer", "text": "No formal registration is needed. Simply walk in and fill your name and entry time in the register placed on the table." } },
    { "@type": "Question", "name": "What facilities are available?", "acceptedAnswer": { "@type": "Answer", "text": "We offer peaceful study areas, competitive exam preparation space, free Wi-Fi, computer lab, printing services, newspapers, clean drinking water, CCTV security, comfortable seating, proper lighting, and a silent environment." } },
    { "@type": "Question", "name": "Who founded this library?", "acceptedAnswer": { "@type": "Answer", "text": "Janhitkari Library was founded by Bijander Kumar with the mission of providing free and disciplined education to every student in Hapur." } },
    { "@type": "Question", "name": "Where is the library located?", "acceptedAnswer": { "@type": "Answer", "text": "We are located in Ramgarhi, Hapur, Uttar Pradesh, India. You can reach us at 9917917437 for directions." } }
  ]
};

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="FAQ | Janhitkari Library Hapur — Common Questions Answered"
        description="Find answers to frequently asked questions about Janhitkari Library in Hapur — timings, fees, facilities, registration, and more."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <Navbar />
      <div className="pt-20">
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
