"use client";
import React, { createContext, useState, useContext } from "react";

const SelectedChapterIndexContext = createContext();

export const useSelectedChapter = () => useContext(SelectedChapterIndexContext);

export const SelectedChapterIndexProvider = ({ children }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  return (
    <SelectedChapterIndexContext.Provider
      value={{ selectedChapterIndex, setSelectedChapterIndex }}
    >
      {children}
    </SelectedChapterIndexContext.Provider>
  );
};
