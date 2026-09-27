import type { Doctor } from '../types';
import { unknown } from '../site';

/**
 * DOCTOR DIRECTORY
 * ---------------------------------------------------------------------------
 * Only the details supplied by the clinic are listed. No experience figures,
 * awards, hospital affiliations or extra qualifications have been invented.
 *
 * Photographs: the clinic supplied references for all three doctors but no
 * image files are licensed for web use yet, so `photo` is null and the UI
 * renders a branded monogram placeholder with a "Photo to be updated" note.
 * Upload the real photographs from Admin → Doctors (or drop them into
 * /public/images/doctors/ and set the path here).
 */
export const defaultDoctors: Doctor[] = [
  {
    id: 'doc-subhash-yadav',
    slug: 'dr-subhash-yadav',
    name: 'Dr. Subhash Yadav',
    qualifications: 'MBBS, MD (Medicine)',
    specialization: 'Internal Medicine',
    department: 'Polyclinic',
    photo: null,
    consultationTiming: null,
    bio: null,
    highlights: [
      'Consultation for adult medical problems',
      'Review of diagnostic reports and further advice',
      'Referral guidance where specialist care is needed',
    ],
    order: 1,
    visible: true,
  },
  {
    id: 'doc-anubhuti-yadav',
    slug: 'dr-anubhuti-yadav',
    name: 'Dr. Anubhuti Yadav',
    qualifications: 'MBBS, MS',
    specialization: 'Obstetrics & Gynaecology',
    department: 'Obstetrics & Gynaecology',
    photo: null,
    consultationTiming: null,
    bio: null,
    highlights: [
      'Pregnancy consultation and antenatal check-ups',
      'Gynaecological consultation for women of all ages',
      'Obstetric ultrasound as advised by the doctor',
    ],
    order: 2,
    visible: true,
  },
  {
    id: 'doc-rita-yadav',
    slug: 'dr-rita-yadav',
    name: 'Dr. Rita Yadav',
    qualifications: 'BDS',
    specialization: 'Dental Surgeon',
    department: 'Dental',
    photo: null,
    consultationTiming: null,
    bio: null,
    highlights: [
      'Dental check-up and consultation',
      'Teeth cleaning, fillings and extractions',
      'General dental care for adults and children',
    ],
    order: 3,
    visible: true,
  },
];

/** Label shown wherever the clinic has not supplied a value yet. */
export const doctorTimingLabel = unknown;
