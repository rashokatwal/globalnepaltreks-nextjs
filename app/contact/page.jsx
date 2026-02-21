import { contactAssets } from "../assets/assets";
import HeroSection from "../components/sections/HeroSection";

export const metadata = {
  title: 'Contact Us',
};

const Contact = () => {
    return (
        <main>
            <HeroSection heading={"Contact Us"} image={contactAssets.contact_cover.src} />
            <section className="h-screen">

            </section>
        </main>
    )
}

export default Contact;