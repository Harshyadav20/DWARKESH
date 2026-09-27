export type Faq = { question: string; answer: string };

/**
 * FAQ
 * ---------------------------------------------------------------------------
 * Operational questions only. Nothing here gives medical advice or makes
 * clinical claims — for anything about symptoms, treatment or test necessity
 * the answer always points back to a doctor consultation.
 */
export const faqs: Faq[] = [
  {
    question: 'Where is Dwarkesh Medical Centre LLP located?',
    answer:
      'We are at Shop No. 4, Swapnikiran Building, Pimparipada, Malad East, Mumbai – 400097, Maharashtra. Use the "Get Directions" button on our Contact page to open the location in Google Maps.',
  },
  {
    question: 'What are the clinic timings?',
    answer:
      'The centre is open 8:00 AM – 10:00 PM. Home visit services are also available between 8:00 AM – 10:00 PM. For emergency assistance you can call us on 86559 19879.',
  },
  {
    question: 'Which diagnostic tests are available at the centre?',
    answer:
      'Digital X-Ray, 2D Echo, Digital Mammography, ECG, Sonography / Ultrasound, blood tests and pathology investigations are available at the centre.',
  },
  {
    question: 'Do you provide home visits?',
    answer:
      'Yes. Home visit services are available for patients who require convenient healthcare support at home, including doctor consultation and basic healthcare support. Request a home visit through WhatsApp or the appointment form.',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'Use the "Book Appointment" button on this website, call 86559 19879, or send us a WhatsApp message. You can also submit the appointment form and we will confirm your slot.',
  },
  {
    question: 'Is there a dental clinic at the centre?',
    answer:
      'Yes. Dwarkesh Dental Clinic offers dental check-ups, teeth cleaning, tooth filling, tooth extraction, dental consultation and general dental care.',
  },
  {
    question: 'Which doctors are available at the centre?',
    answer:
      'Dr. Subhash Yadav (MBBS, MD Medicine — Internal Medicine), Dr. Anubhuti Yadav (MBBS, MS — Obstetrics & Gynaecology) and Dr. Rita Yadav (BDS — Dental Surgeon). Consultation timings may vary, so please call ahead to confirm.',
  },
  {
    question: 'Do I need a doctor\'s prescription for diagnostic tests?',
    answer:
      'Most investigations are carried out as advised by a doctor. Please call the centre or speak to our doctors about the test you need, and we will guide you on the process.',
  },
  {
    question: 'How can I contact the centre in an emergency?',
    answer:
      'Call 86559 19879. For a life-threatening emergency, also contact the nearest hospital emergency department or dial 112 (India\'s emergency number).',
  },
];
