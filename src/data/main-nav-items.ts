import {
  Building2,
  Globe,
  Heart,
  Instagram,
  Lightbulb,
  Mail,
  Users,
} from "lucide-react";
import {
  NavEventIcon,
  NavTalentIcon,
} from "@/components/navigation-glyphs";

export const mainNavItems = [
  { id: "event-organizer", href: "/event-organizer", label: "Event Organizer", icon: NavEventIcon, color: "#6366F1", bg: "#E0E7FF" },
  { id: "wedding-organizer", href: "/wedding-organizer", label: "Wedding Organizer", icon: Heart, color: "#DB2777", bg: "#FCE7F3" },
  { id: "sosmed-management", href: "/sosmed-management", label: "Sosmed Management", icon: Instagram, color: "#E11D48", bg: "#FFE4E6" },
  { id: "wedding-invitation", href: "/wedding-invitation", label: "Wedding Invitation", icon: Mail, color: "#7C3AED", bg: "#F3E8FF" },
  { id: "web-development", href: "/web-development", label: "Web Development", icon: Globe, color: "#0EA5E9", bg: "#E0F2FE" },
  { id: "design-creative", href: "/design-creative", label: "Design Creative", icon: Lightbulb, color: "#D97706", bg: "#FEF3C7" },
  { id: "talent-management", href: "/talent", label: "Talent Management", icon: NavTalentIcon, color: "#8B5CF6", bg: "#EDE9FE" },
  { id: "business-system", href: "/business-system", label: "Business System", icon: Building2, color: "#0F766E", bg: "#CCFBF1" },
  { id: "nempo-community", href: "/komunitas", label: "Nempo Community", icon: Users, color: "#2563EB", bg: "#DBEAFE" },
] as const;
