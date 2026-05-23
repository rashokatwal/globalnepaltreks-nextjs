// app/contact/page.js
import { contactAssets } from "@/app/assets/assets";
import GoogleCaptchaWrapper from "@/app/components/wrappers/GoogleCaptchaWrapper";
import ContactClient from "./ContactClient";

export const metadata = {
  title: 'Contact Us | Himalayan Trekking Experts - Global Nepal Treks',
  description: 'Reach out to Global Nepal Treks. Our trekking experts customize itineraries and help plan authentic Himalayan adventures in Nepal, Tibet & Bhutan.',
  // keywords: 'contact nepal trekking company, himalayan trekking inquiry, plan everest base camp trek, nepal trekking experts contact, trekking agency kathmandu, bhutan tour inquiry, tibet travel contact',
  openGraph: {
    title: 'Contact Us | Global Nepal Treks',
    description: 'Contact our trekking experts to plan your perfect Himalayan adventure.',
    images: [contactAssets.contact_cover?.src],
  },
  alternates: {
      canonical: "https://globalnepaltreks.com/contact",
  },
};

export default function ContactPage() {
  return (
    <GoogleCaptchaWrapper>
      <ContactClient />
    </GoogleCaptchaWrapper>
  );
}