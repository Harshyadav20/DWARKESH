import type { GalleryItem } from '../types';

/**
 * GALLERY
 * ---------------------------------------------------------------------------
 * Category list supplied by the clinic: Clinic, Doctors, Diagnostic Services,
 * Dental, Medical Equipment, Healthcare.
 *
 * IMPORTANT: the images below are brand-neutral placeholder photography created
 * for the website launch. Replace them with real photographs of the centre
 * (Admin → Gallery, or drop files into /public/images/ and update `src`).
 * Doctor portraits must only be published with the doctor's own consent.
 */
export const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-reception',
    src: '/images/gallery-reception.jpg',
    alt: 'Reception and waiting area of a modern medical centre',
    category: 'Clinic',
    caption: 'Reception & waiting area',
    order: 1,
    visible: true,
  },
  {
    id: 'gal-consultation',
    src: '/images/hero-medical-centre.jpg',
    alt: 'Doctor consulting with a patient in a bright consultation room',
    category: 'Healthcare',
    caption: 'Doctor consultation',
    order: 2,
    visible: true,
  },
  {
    id: 'gal-xray',
    src: '/images/diagnostic-digital-xray.jpg',
    alt: 'Digital X-Ray room with a ceiling-mounted radiography unit',
    category: 'Diagnostic Services',
    caption: 'Digital X-Ray',
    order: 3,
    visible: true,
  },
  {
    id: 'gal-sonography',
    src: '/images/diagnostic-sonography.jpg',
    alt: 'Sonography / ultrasound examination in progress',
    category: 'Diagnostic Services',
    caption: 'Sonography / Ultrasound',
    order: 4,
    visible: true,
  },
  {
    id: 'gal-ecg',
    src: '/images/diagnostic-ecg.jpg',
    alt: 'ECG machine recording the electrical activity of the heart',
    category: 'Diagnostic Services',
    caption: 'ECG',
    order: 5,
    visible: true,
  },
  {
    id: 'gal-echo',
    src: '/images/diagnostic-2d-echo.jpg',
    alt: '2D Echo echocardiography monitor showing a heart scan',
    category: 'Diagnostic Services',
    caption: '2D Echo',
    order: 6,
    visible: true,
  },
  {
    id: 'gal-pathology',
    src: '/images/diagnostic-pathology.jpg',
    alt: 'Pathology laboratory with blood sample tubes and a microscope',
    category: 'Diagnostic Services',
    caption: 'Pathology & blood testing',
    order: 7,
    visible: true,
  },
  {
    id: 'gal-mammography',
    src: '/images/diagnostic-mammography.jpg',
    alt: 'Digital mammography machine in a calm imaging room',
    category: 'Medical Equipment',
    caption: 'Digital Mammography',
    order: 8,
    visible: true,
  },
  {
    id: 'gal-dental',
    src: '/images/dental-clinic.jpg',
    alt: 'Dental clinic treatment room with dental chair and overhead light',
    category: 'Dental',
    caption: 'Dwarkesh Dental Clinic',
    order: 9,
    visible: true,
  },
  {
    id: 'gal-home-visit',
    src: '/images/home-visit.jpg',
    alt: 'Doctor attending a patient during a home visit',
    category: 'Healthcare',
    caption: 'Home visit service',
    order: 10,
    visible: true,
  },
];

export const galleryCategories = [
  'All',
  'Clinic',
  'Doctors',
  'Diagnostic Services',
  'Dental',
  'Medical Equipment',
  'Healthcare',
] as const;
