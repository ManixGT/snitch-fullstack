const FeaturedCategories = () => {
  const categories = [
    { name: '', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949328/featuredCategory/imgi_7_1756448710_xaxq22.jpg' },
    { name: 'shirts', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_8_1757500061_y34gqk.jpg' },
    { name: 'trousers', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_9_1756448740_aodqjy.jpg' },
    { name: 'jeans', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949329/featuredCategory/imgi_10_1756448755_dgnqyk.jpg' },
    { name: 'ready to party', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949330/featuredCategory/imgi_11_1756450022_tgdqk5.jpg' },
    { name: 'perfume', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949331/featuredCategory/imgi_12_1758356227_n1spq6.jpg' },
    { name: 'essentials', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949333/featuredCategory/imgi_13_1757586970_jdo8fm.jpg' },
    { name: 'work wear', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949334/featuredCategory/imgi_14_1758356247_nluosh.jpg' },
    { name: 'work wear', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949334/featuredCategory/imgi_15_1756448771_mjrqj4.jpg' },
    { name: 'plus size', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949335/featuredCategory/imgi_16_1756448786_rs4pxj.jpg' },
    { name: 'snitch luxe', image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949337/featuredCategory/imgi_18_1757586866_fbxoyo.jpg' },
    { name: "", image: 'https://res.cloudinary.com/dhqxhxpzh/image/upload/v1758949336/featuredCategory/imgi_17_1756449362_spqmjn.jpg' }
  ];

  return (
    <section className="py-12 bg-white">

      <h2 className="text-2xl font-bold text-center mb-8">FEATURED CATEGORIES</h2>
      <div className="grid grid-cols-3 mx-auto h-full max-w-lg gap-x-[6px] gap-y-[6px] md:gap-[5px] md:grid-cols-4 lg:grid-cols-6 md:max-w-full">
        {categories.map((category, idx) => (
          <div key={idx}>
            <div className="relative group cursor-pointer overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10 bg-opacity-70">
                <div className="absolute bottom-2 left-4 right-4">
                  <div className="text-white font-bold text-xs uppercase text-center">{category.name}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default FeaturedCategories;