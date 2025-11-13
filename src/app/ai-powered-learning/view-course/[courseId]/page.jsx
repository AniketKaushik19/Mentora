// import { useParams } from 'next/navigation'
import React from 'react'
import EditCourse from '../../edit-course/[courseId]/page';

function ViewCourse() {
  // const {courseId}=useParams();
  return (
    <div>
      <div>
        <EditCourse viewCourse={true}/>
      </div>
    </div>
  )
}

export default ViewCourse
