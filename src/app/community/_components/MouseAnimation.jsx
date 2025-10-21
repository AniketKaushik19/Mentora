import React from 'react'
import { useState,useEffect } from 'react'
const MouseAnimation = () => {
    const [mouseposition , setMousePosition]=useState({x:0,y:0})

  useEffect(()=>{
     const handleMouseMove=(e)=>{
      setMousePosition({x:e.clientX,y:e.clientY})
     }
     window.addEventListener("mousemove",handleMouseMove)
     return ()=>{
      window.removeEventListener("mousemove",handleMouseMove)
     }
  },[])
  return (
<>
       <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20 animate-pulse"/>
       <div style={
           { left:mouseposition.x-192,
            top: mouseposition.y-192,
            transition:"all 0.3s ease-out",
        }
        
    } className="fixed w-96 h-96 bg-gradient-to-r from-blue-500/20  to-purple-500/20 rounded-full blur-3xl pointer-events-none z-0"></div>
 
    </>
  )
}

export default MouseAnimation