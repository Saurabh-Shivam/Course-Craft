import React from "react";

import { Swiper, SwiperSlide } from "swiper/react"; //this is the slider"swiper" which contain many type of slider
import "swiper/css"; //only we have to insert data into slider and styling or position
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/react";
import Course_Card from "./Course_Card";
// import { delay } from "@reduxjs/toolkit/dist/utils";

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          pagination={true}
          navigation={true}
          breakpoints={{ 1024: { slidesPerView: 3 } }}
          className="mySwiper max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  );
};

export default CourseSlider;
