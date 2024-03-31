import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        {/* Top Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />{" "}
              {/* Put group in the parent element and group-hover: in all those child elements where we want the style on hover so when we hover on any space under parent then */}
              {/* all child which contain group-hover: get styled, for more detail see notes in public */}
            </div>
          </div>
        </Link>

        {/* Top Heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />{" "}
          {/* here we passed "Coding Skills" text as props in component <Highlight> so we apply filter in that text part*/}
        </div>

        {/* Top Introduction */}
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* Two Buttons */}
        <div className="flex flex-row gap-7 mt-8">
          {" "}
          {/* here we passed "Learn More" as a children in CTAButton component and here component is used because there are many button like this; */}
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          {/* here active is passed as props because if active is true then button is yellow otherwise black; */}
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video Panel  */}
        {/* TODO: add width to  w-[800px] if need in future */}
        <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            muted
            loop
            autoPlay
            className="shadow-[20px_20px_rgba(255,255,255)]"
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section Panel 1 */}
        <div>
            <CodeBlocks />
        </div>




      </div>

      {/* Section 2 */}
      {/* Section 3 */}
      {/* Section 4 */}
    </div>
  );
};

export default Home;
