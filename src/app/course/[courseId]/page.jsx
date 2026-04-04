"use client"
import React, { useEffect, useState } from 'react'
import ChapterListSidebar from './_components/ChapterListSidebar'
import ChapterContent from './_components/ChapterContent'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { SelectedChapterIndexProvider } from '@/app/context/SelectedChapterindexContext';
import { Menu, X } from 'lucide-react';

function Course() {
    const {courseId}=useParams();
    const [courseInfo,setCourseInfo]=useState();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        GetEnrollCourseById();
    }, []);

    const GetEnrollCourseById = async () => {
        try {
            const result = await axios.get("/ai-powered-learning/api/enroll-course?courseId="+courseId);
            console.log(result.data);
            setCourseInfo(result.data.data);
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
        }
    };

    return (
        <SelectedChapterIndexProvider>
            <div className='flex h-screen overflow-hidden bg-gray-950 relative'>

                {/* ── Mobile overlay ─────────────────────────────── */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── Mobile toggle button ───────────────────────── */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed bottom-5 right-5 z-30 md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-xl shadow-purple-900/50 border border-purple-500/40 text-white hover:scale-110 active:scale-95 transition-transform"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                </button>

                {/* ── Sidebar ────────────────────────────────────── */}
                <div className={`
                    fixed md:static inset-y-0 left-0 z-30 md:z-auto
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    shrink-0 h-full overflow-y-auto
                `}>
                    <ChapterListSidebar
                        courseInfo={courseInfo}
                        onChapterSelect={() => setSidebarOpen(false)}
                    />
                </div>

                {/* ── Content ────────────────────────────────────── */}
                <div className='flex-1 overflow-y-auto'>
                    <ChapterContent
                        courseInfo={courseInfo}
                        refreshData={() => GetEnrollCourseById()}
                    />
                </div>
            </div>
        </SelectedChapterIndexProvider>
    )
}

export default Course
