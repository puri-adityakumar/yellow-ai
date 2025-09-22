"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const models = [
  { id: "gemini-2.5-flash", name: "Gemini Flash" },
  { id: "gemini-2.5-pro", name: "Gemini Pro" },
];

interface SimpleModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function SimpleModelSelector({ selectedModel, onModelChange }: SimpleModelSelectorProps) {
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2 text-xs border-border/40"
        >
          {currentModel.name}
          <ChevronDown className="ml-1 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={selectedModel === model.id ? "bg-accent" : ""}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}