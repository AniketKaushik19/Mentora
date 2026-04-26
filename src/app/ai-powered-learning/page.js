import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import CourseList from "./_components/CourseList";
import EnrollCourseList from "./_components/EnrollCourseList";

const AIPoweredLearningPage = () => {
  return (
    <div className="mx-4 mt-10">
      <WelcomeBanner/>
      <EnrollCourseList/>
      <CourseList/>
      
    </div>
  );
};

export default AIPoweredLearningPage;
