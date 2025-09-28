import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

const images = [
  "/assets/swiper/swiper1.jpg",
  "/assets/swiper/swiper2.jpg",
  "/assets/swiper/swiper3.jpg",
  "/assets/swiper/swiper4.jpg",
  "/assets/swiper/swiper5.jpg",
];

const marqueeItems = [
  <>
    <span style={{ color: "#FFFFFF", fontSize: "15px" }}>
      FLAT 10% OFF ON FIRST PURCHASE <em>USE CODE:</em> <b>APP10</b>
    </span>
  </>,
  <>
    <span style={{ color: "#FFFFFF", fontSize: "15px" }}>Final prices reflect</span>
    <b style={{ color: "#E58C6F", fontWeight: 600, fontSize: "15px" }}> GST benefit</b>
  </>,
];

const HeroSwiper = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={2}
        loop={true}
        spaceBetween={6}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={5000}
        freeMode={true}
        grabCursor={true}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 2.4 },
          1280: { slidesPerView: 2.8 },
        }}
        className="w-full h-auto cursor-pointer"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              loading="lazy"
              src={src}
              alt={`slide-${idx + 1}`}
              className="w-[50vw] h-[50vw] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Progress Bar */}
      <div className="absolute w-full flex flex-col z-10 bottom-0">
        <div className="w-full flex items-center justify-center py-5">
          <div className="h-[4px] w-[4px] mx-[6px] bg-gray-100 rounded"></div>
          <div className="h-[4px] w-[4px] mx-[6px] bg-gray-100 rounded"></div>
          <div className="w-[40px] h-[5px] mx-[6px]">
            <div className="h-[5px] rounded-full bg-gray-100">
              <div
                className="h-[5px] rounded-full transition-all duration-75 bg-white"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <div className="h-[4px] w-[4px] mx-[6px] bg-gray-100 rounded"></div>
          <div className="h-[4px] w-[4px] mx-[6px] bg-gray-100 rounded"></div>
        </div>

        {/* Marquee */}
        <div className="flex items-center justify-center bg-black/65">
          <div
            className="relative overflow-hidden h-[20px] font-light text-white md:flex-1 w-full"
            style={{ fontFamily: "sans-serif" }}
          >
            <div className="flex animate-marquee whitespace-nowrap min-w-max">
              {/* Duplicate the marquee content 3 times for seamless looping */}
              {[...Array(3)].map((_, repeatIdx) => (
                <div className="flex" key={repeatIdx}>
                  {marqueeItems.map((item, idx) => (
                    <div
                      key={`${repeatIdx}-${idx}`}
                      className="flex items-center min-w-max"
                    >
                      <span className="uppercase text-xs">{item}</span>
                      {!(repeatIdx === 2 && idx === marqueeItems.length - 1) && (
                        <span className="mx-3 text-[#E58C6F] font-bold">•</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSwiper;