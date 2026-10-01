import {
    BarChart3,
    Bed,
    Briefcase,
    Building2,
    CalendarClock,
    CalendarDays,
    Clock,
    HandHeart,
    HeartHandshake,
    HeartPulse,
    Hospital,
    MapPinned,
    Shield,
    ShieldCheck,
    Siren,
    Stethoscope,
    Users,
    type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
    BarChart3,
    Bed,
    Briefcase,
    Building2,
    CalendarClock,
    CalendarDays,
    Clock,
    HandHeart,
    HeartHandshake,
    HeartPulse,
    Hospital,
    MapPinned,
    Shield,
    ShieldCheck,
    Siren,
    Stethoscope,
    Users,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getLucideIcon(name?: string | null): LucideIcon | null {
    if (!name) {
        return null;
    }

    return ICONS[name] ?? null;
}
