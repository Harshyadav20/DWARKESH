import {
  Activity,
  ClipboardList,
  Droplet,
  HandHeart,
  HeartPulse,
  House,
  MessageSquareHeart,
  Microscope,
  Ribbon,
  ScanLine,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRound,
  Waves,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icons are stored as strings in content data (so they stay JSON-serialisable
 * and editable from the admin panel) and resolved here at render time.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  Activity,
  ClipboardList,
  Droplet,
  HandHeart,
  HeartPulse,
  House,
  MessageSquareHeart,
  Microscope,
  Ribbon,
  ScanLine,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRound,
  Waves,
  Wrench,
};

export const iconNames = Object.keys(iconRegistry).sort();

export function resolveIcon(name: string | undefined): LucideIcon {
  return (name && iconRegistry[name]) || Stethoscope;
}
