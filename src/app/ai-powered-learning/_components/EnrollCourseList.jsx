"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard";

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);

  useEffect(() => {
    GetEnrollCourse();
  }, []);

  const GetEnrollCourse = async () => {
    try {
      const result = await axios.get("/ai-powered-learning/api/enroll-course");
      console.log(result.data);
      setEnrolledCourseList(result.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  return (
    enrolledCourseList?.length > 0 && (
      <div className="mt-3">
        <h2 className="font-bold text-xl">
          Continue Learning your courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrolledCourseList?.map((course, index) => (
            <EnrollCourseCard
              key={index}
              course={course?.courses}
              enrollCourse={course?.enrollCourse}
            />
          ))}
        </div>
      </div>
    )
  );
}

export default EnrollCourseList;
