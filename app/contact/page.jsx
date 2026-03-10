// app/contact/page.js
import { contactAssets } from "../assets/assets";
import GoogleCaptchaWrapper from "../components/wrappers/GoogleCaptchaWrapper";
import ContactClient from "./ContactClient";

export const metadata = {
  title: 'Contact Us | Himalayan Trekking Experts - Global Nepal Treks',
  description: 'Get in touch with Global Nepal Treks. Our trekking experts are here to answer your questions, customize itineraries, and help plan your dream Himalayan adventure in Nepal, Tibet & Bhutan.',
  keywords: 'contact nepal trekking company, himalayan trekking inquiry, plan everest base camp trek, nepal trekking experts contact, trekking agency kathmandu, bhutan tour inquiry, tibet travel contact',
  openGraph: {
    title: 'Contact Us | Global Nepal Treks',
    description: 'Contact our trekking experts to plan your perfect Himalayan adventure.',
    images: [contactAssets.contact_cover?.src],
  },
};

export default function ContactPage() {
  return (
    <GoogleCaptchaWrapper>
      <ContactClient />
    </GoogleCaptchaWrapper>
  );
}