import { blogsAssets } from "../assets/assets";
import HeroSection from "../components/sections/HeroSection";

export const metadata = {
  title: 'Blogs',
};

const Blogs = () => {
    return (
        <main>
            <HeroSection heading={"Blogs"} image={blogsAssets.blogs_cover.src} />
            <section className="h-screen">

            </section>
        </main>
    )
}

export default Blogs;