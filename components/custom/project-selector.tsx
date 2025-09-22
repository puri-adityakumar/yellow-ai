"use client";

import { Plus, Folder, Settings, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateProjectDialog } from "./create-project-dialog";

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    defaultModel: string;
    systemPrompt?: string;
    safetyLevel: 'strict' | 'moderate' | 'permissive';
  };
};

interface ProjectSelectorProps {
  selectedProject?: string;
  onProjectChange: (projectId: string) => void;
  className?: string;
}

export function ProjectSelector({ selectedProject, onProjectChange, className }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      } else {
        toast.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: { name: string; description?: string; settings?: any }) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(prev => [...prev, data.project]);
        onProjectChange(data.project.id);
        setShowCreateDialog(false);
        toast.success('Project created successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (selectedProject === projectId) {
          onProjectChange('');
        }
        toast.success('Project deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const getDisplayName = () => {
    if (selectedProject === "VIEW_ALL") return "View All";
    if (selectedProject === "") return "No Project";
    return currentProject?.name || "Select Project";
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between" disabled={loading}>
            <div className="flex items-center gap-2">
              <Folder className="size-4" />
              <span className="truncate">
                {loading ? "Loading..." : getDisplayName()}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem
            onClick={() => onProjectChange("VIEW_ALL")}
            className="flex items-center justify-between p-3"
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">View All</span>
              <span className="text-xs text-muted-foreground">
                Show all chats regardless of project
              </span>
            </div>
            {selectedProject === "VIEW_ALL" && (
              <span className="text-xs text-blue-600 font-medium">Selected</span>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => onProjectChange("")}
            className="flex items-center justify-between p-3"
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">No Project</span>
              <span className="text-xs text-muted-foreground">
                Show chats with no project assigned
              </span>
            </div>
            {selectedProject === "" && (
              <span className="text-xs text-blue-600 font-medium">Selected</span>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => onProjectChange(project.id)}
              className="flex items-center justify-between p-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{project.name}</span>
                {project.description && (
                  <span className="text-xs text-muted-foreground truncate max-w-40">
                    {project.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {project.id === selectedProject && (
                  <span className="text-xs text-blue-600 font-medium">Selected</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="size-6 p-0"
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowCreateDialog(true);
            }}
          >
            <Plus className="size-4 mr-2" />
            Create New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateProject={handleCreateProject}
      />

      {currentProject && (
        <div className="text-xs text-muted-foreground mt-1">
          Model: {currentProject.settings.defaultModel} • Safety: {currentProject.settings.safetyLevel}
        </div>
      )}
    </div>
  );
}