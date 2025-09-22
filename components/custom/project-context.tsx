"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ProjectContextType = {
  selectedProject: string;
  setSelectedProject: (projectId: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<string>("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedProject");
    if (saved) {
      setSelectedProject(saved);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", selectedProject);
    }
  }, [selectedProject]);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}