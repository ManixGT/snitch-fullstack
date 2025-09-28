const PromotionalBanner = () => {
  return (
    <section className="py-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-8">SHOP YOUR SIZE</h2>
        <div className="relative h-48 lg:h-64 overflow-hidden">
          <img
            loading='lazy'
            src="/assets/banner1.jpg"
            alt="Trendy Styles"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};


export default PromotionalBanner