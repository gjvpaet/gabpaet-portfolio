import type { Metadata } from "next";

import ContactBody from "@/content/contact";

export const metadata: Metadata = {
  title: "contact.md",
  description: "Reach Gabriel Joshua Paet — email, mobile, GitHub, LinkedIn.",
};

export default function ContactPage() {
  return <ContactBody />;
}
