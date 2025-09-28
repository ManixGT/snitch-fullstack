const SnitchInfoPage = () => {
  return (
    <div className="bg-[#fef6f2] text-black px-6 md:px-12 py-10 text-sm leading-relaxed">
      {/* Header */}
      <h2 className="font-bold text-lg mb-6">
        More about shopping At Snitch for men
      </h2>

      {/* TOP CATEGORIES */}
      <section className="mb-8">
        <h3 className="font-bold uppercase mb-2">Top Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            "T-shirts", "Shirts", "Joggers", "Shorts", "Trousers", "Sweatshirts & Hoodies",
            "Sweaters", "Bags", "Accessories", "Belts", "Blazers", "Boxers",
            "Cargo Pants", "Chinos", "Co-ords", "Hoodies", "Jackets", "Jeans",
            "Night Suit & Pyjamas", "Overshirt", "Perfumes", "Shoes", "Sunglasses",
          ].map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      {/* POPULAR SEARCHES */}
      <section className="mb-8">
        <h3 className="font-bold uppercase mb-2">Popular Searches</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            "shirts for men", "jackets for men", "t-shirts for men", "cargo", "baggy jeans", "mens jeans",
            "polo t-shirts", "hoodie", "joggers for men", "baggy jeans mens", "straight fit jeans", "printed shirts for men",
            "varsity jacket", "formal pants for men", "polo t-shirts for men", "formal trousers for men", "sweatshirt", "white shirt for men",
            "black shirt", "korean pants", "baggy pants", "trousers for men", "cargo jeans", "oversized shirt",
            "denim", "linen pants", "crochet shirt", "old money outfits", "branded shirts for men", "boutiques near me",
            "check shirt for men", "casual shirts for men", "chinos for men", "formal shirts for men", "printed shirts", "mens tshirt",
            "linen shirt", "denim jeans", "baggy pants men", "varsity jacket mens", "black t-shirt men", "club wear for men"
          ].map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      {/* MOST POPULAR ACCESSORIES */}
      <section className="mb-12">
        <h3 className="font-bold uppercase mb-2">Most Popular Accessories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[
            "Ravenwood Braided Bracelet", "EternaWrap Black Braclet", "Obsidian Blue Braided Bracelet", "Rustic Revolve Brown Braided Braclet",
            "Divine Skull Cross Chain", "Bar of Luxe Chain", "Rogue Bullet Pendant", "Pirate's Anchor Steel Chain",
            "Debonair Black Bracelet", "Solid Block SS Chain", "Hyphenated Weave Braided Bracelet", "Metal Black Trio Bracelet",
            "Abstract Trio Metal Bracelet", "Rattle Square Chain", "Blacksmith Nail Braided Bracelet", "Duo Gold & Silver SS Chain",
            "Rover Wrap Black Braclet", "Mafia SS Chain", "Nob Nail Edge Braided Bracelet", "Hexa Beads Bracelet",
            "Bold Swirl Bracelet", "Grey Cuboid SS Chain", "Midnight Eclipse Braid Bracelet", "Black Cuboid SS Chain",
            "Wavecrest Dollar Brown Bracelet"
          ].map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="space-y-6 mb-12">
        <h2 className="font-semibold text-xl">The SNITCH Shopping Experience – Where Digital Meets Style</h2>
        <p>
          At SNITCH, we redefine the modern shopping experience, merging seamless digital convenience with engaging in-store interactions...
        </p>

        <h3 className="font-semibold text-lg">Shop Anytime, Anywhere – The Digital Shopping Experience</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🛍️ 24/7 Accessibility – Fashion at Your Fingertips</li>
          <li>✔ User-Friendly Navigation</li>
          <li>✔ AI-Powered Recommendations</li>
          <li>✔ Detailed Product Views</li>
          <li>✔ Secure & Easy Checkout</li>
          <li>✔ Exclusive Online Drops</li>
        </ul>

        <h3 className="font-semibold text-lg">Beyond the Screen – The SNITCH In-Store Experience</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🏬 Feel the Fabric, Perfect the Fit</li>
          <li>✔ Try Before You Buy</li>
          <li>✔ Expert Styling Assistance</li>
          <li>✔ Exclusive In-Store Drops</li>
          <li>✔ Instant Gratification</li>
          <li>✔ Interactive Shopping Spaces</li>
        </ul>

        <h3 className="font-semibold text-lg">SNITCH Seasonal Collections – Year-Round Style Evolution</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>✔ Summer-Ready Looks</li>
          <li>✔ Monsoon Essentials</li>
          <li>✔ Winter Warmth</li>
          <li>✔ Year-Round Staples</li>
        </ul>

        <h3 className="font-semibold text-lg">Omnichannel Shopping – The Best of Both Worlds</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>🔗 Shop Online</li>
          <li>🏬 Visit a Store</li>
          <li>📦 Click & Collect</li>
          <li>🔁 Easy Returns & Exchanges</li>
        </ul>
      </section>

      {/* WHY SHOP AT SNITCH */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-semibold text-lg mb-2">Why Shop at SNITCH?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>✔ Contemporary Menswear That Keeps Up with You</li>
          <li>✔ Effortless Online & In-Store Shopping Experience</li>
          <li>✔ Premium Fabrics, Trend-Driven Designs, & Smart Tailoring</li>
          <li>✔ Seamless Omnichannel Flexibility – Shop Anywhere, Anytime</li>
          <li>✔ Fashion for Every Season, Occasion & Mood</li>
        </ul>
        <p className="mt-2">
          Your wardrobe should work as hard as you do. SNITCH makes fashion easy, exciting, and accessible—whether you're scrolling from your couch or styling in-store.
        </p>
      </section>

      {/* CTA - Upgrade Experience */}
      <section className="bg-white p-6 rounded shadow mb-10">
        <h3 className="font-semibold text-lg mb-2">Upgrade Your Shopping Experience – Explore SNITCH Today!</h3>
        <p>
          Ready to redefine your wardrobe? Shop the latest men's fashion online or visit your nearest store for a hands-on experience...
        </p>
        <p className="mt-2">🔥 Stay ahead of trends. Elevate your style. Shop SNITCH now! 🔥</p>
      </section>

      {/* FOOTER */}
      <footer className="border-t pt-6 text-sm text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-4 font-semibold">
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Return/Exchange Policy</a>
          <a href="#">Contact Us</a>
          <a href="#">Sitemap</a>
        </div>
        <p className="mb-2 font-bold">DOWNLOAD APP</p>
        <div className="flex justify-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Available_on_the_App_Store_(black)_SVG.svg"
            alt="App Store"
            className="h-10"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Play Store"
            className="h-10"
          />
        </div>
      </footer>
    </div>
  );
};

export default SnitchInfoPage;
