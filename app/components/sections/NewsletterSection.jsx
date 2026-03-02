// app/components/sections/NewsletterSection.js
export default function NewsletterSection() {
  return (
    <section className="py-16 bg-secondary-color text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat">
          Never Miss a Story
        </h2>
        <p className="text-white/90 mb-8 text-lg">
          Subscribe to our newsletter and get trekking tips, destination guides, and special offers straight to your inbox.
        </p>
        
        <form className="flex flex-col gap-2 justify-center md:items-center md:flex-row">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="px-5 py-2 border border-gray-300 focus:outline-primary-color-dark" 
          />
          <button className="px-5 py-2 text-white bg-primary-color-dark">
            Subscribe
          </button>
        </form>

        <p className="text-white/70 text-sm mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}