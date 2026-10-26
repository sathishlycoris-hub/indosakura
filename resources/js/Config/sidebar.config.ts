import { LucideIcon } from "lucide-react";
import {
  Phone,
  Briefcase,
  FilePlus,
  Newspaper,
  Users,
  Calendar,
  PenSquare,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  IdCard,
  Clock,
  Handshake,
  ShieldCheck,
  Puzzle,
  Settings,
  Factory,
  Search,
  LayoutTemplate,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  role?: string[];
  children?: SidebarItem[];
};

export const sidebarItems: SidebarItem[] = [
  {
    label: "Contact List",
    icon: Phone,
    href: route("admin.contacts.index"),
    role: ["admin"],
  },
  // {
  //   label: "Job Applications",
  //   icon: Briefcase,
  //   href: route("admin.job-applications.index"),
  //   role: ["admin"],
  // },
  {
    label: "Jobs List",
    icon: FilePlus,
    href: route("admin.jobs.index"),
    role: ["admin"],
  },

  {
    label: "Home page",
    icon: ShieldCheck,
    href: route("admin.homepage.index"),
    role: ["admin"],
  },
  {
    label: "Site settings",
    icon: ShieldCheck,
    href: route("admin.site-settings.index"),
    role: ["admin"],
  },

  {
    label: "Products",
    icon: Puzzle,
    href: route("admin.solutions.index"),
    role: ["admin"],
  },



  {
    label: "Services",
    icon: HelpCircle, // you can change icon
    role: ["admin"],
    children: [
      {
        label: "Services",
        icon: Settings,
        href: route("admin.services.index"),
        role: ["admin"],
      },
      {
        label: "Service Landing",
        icon: LayoutTemplate,
        href: route("admin.service_landings.index"),
        role: ["admin"],
      },
      {
        label: "Services Industry",
        icon: Factory,
        href: route("admin.service-industries.index"),
        role: ["admin"],
      },
      {
        label: "FAQs",
        icon: HelpCircle,
        href: route("admin.faqs.index"),
        role: ["admin"],
      },
      {
        label: "Seminar",
        icon: Calendar,
        href: route("admin.seminars.index"),
        role: ["admin"],
      },
    ],
  },
  {
    label: "India Desks",
    icon: Handshake,
    role: ["admin"],
    children: [
      {
        label: "India Desk TOP",
        icon: Settings,
        href: route("admin.india_desks_page.index"),
        role: ["admin"],
      },
      {
        label: "India Desks",
        icon: Settings,
        href: route("admin.india_desks.index"),
        role: ["admin"],
      },
      {
        label: "India Desk Industry",
        icon: Factory,
        href: route("admin.india-desk-industries.index"),
        role: ["admin"],
      },
      {
        label: "FAQs",
        icon: HelpCircle,
        href: route("admin.india_desk_faqs.index"),
        role: ["admin"],
      },
    ],
  },

  {
    label: "Insights",
    icon: IdCard, // you can change icon
    role: ["admin"],
    children: [
      {
        label: "Blogs",
        icon: PenSquare,
        href: route("admin.blogs.index"),
        role: ["admin"],
      },
      {
        label: "CaseStudies",
        icon: Briefcase,
        href: route("admin.casestudies.index"),
        role: ["admin"],
      },
      {
        label: "Home Case Studies",
        icon: Briefcase,
        href: route("admin.home_case_studies.index"),
        role: ["admin"],
      },
      {
        label: "Infographics",
        icon: Briefcase,
        href: route("admin.infographics.index"),
        role: ["admin"],
      },


    ],
  },





  {
    label: "Corporate Info",
    icon: Factory, // you can change icon
    role: ["admin"],
    children: [
      {
        label: "Corporate Top",
        icon: MessageSquare,
        href: route("admin.corporate.index"),
        role: ["admin"],
      },
      {
        label: "Greetings",
        icon: MessageSquare,
        href: route("admin.greetings.index"),
        role: ["admin"],
      },
      {
        label: "Philosophy",
        icon: Lightbulb,
        href: route("admin.philosophy.index"),
        role: ["admin"],
      },
      {
        label: "Profile",
        icon: IdCard,
        href: route("admin.profile.index"),
        role: ["admin"],
      },
      {
        label: "Whitepaper",
        icon: FilePlus,
        href: route("admin.whitepaper.index"),
        role: ["admin"],
      },

      {
        label: "Strength & Location",
        icon: Puzzle,
        href: route("admin.corpprofile.index"),
        role: ["admin"],
      },
      {
        label: "History",
        icon: Clock,
        href: route("admin.history.index"),
        role: ["admin"],
      },

      {
        label: "Team",
        icon: Users,
        href: route("admin.team.index"),
        role: ["admin"],
      },
      {
        label: "News Event",
        icon: Newspaper,
        href: route("admin.newsevent.index"),
        role: ["admin"],
      },
      {
        label: "Client & Partners",
        icon: Handshake,
        href: route("admin.clients.index"),
        role: ["admin"],
      },
      {
        label: "Policy",
        icon: ShieldCheck,
        href: route("admin.policy.index"),
        role: ["admin"],
      },
    ],
  },

  {
    label: "SEO",
    icon: Search,
    href: route("admin.seo.index"),
    role: ["admin"],
  },

];