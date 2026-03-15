"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard";

function EnrollCourseList() {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetEnrollCourse();
  }, []);

  const GetEnrollCourse = async () => {
    try {
      const result = await axios.get("/ai-powered-learning/api/enroll-course");
      // console.log("API Response:", result.data);
      // If your API wraps data in { success, data }, extract the array:
      setEnrolledCourseList(result.data?.data || result.data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading courses...</p>;
  }

  return (
    <div className="mt-3">
      {enrolledCourseList?.length > 0 ? (
        <>
          <h2 className="font-bold text-xl text-white">
            Continue Learning your courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {enrolledCourseList.map((course, index) => (
              <EnrollCourseCard
                key={index}
                course={course?.courses}
                enrollCourse={course?.enrollCourse}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-400">No courses enrolled yet.</p>
      )}
    </div>
  );
}

export default EnrollCourseList;