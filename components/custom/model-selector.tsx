"use client";

import { ChevronDown, Brain, Zap, Shield } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModelCapabilities = {
  thinking: boolean;
  multimodal: boolean;
  search: boolean;
  codeExecution: boolean;
  urlContext: boolean;
  imageGeneration: boolean;
};

type ModelVariant = {
  id: string;
  name: string;
  description: string;
  capabilities: ModelCapabilities;
};

const modelVariants: ModelVariant[] = [
  {
    id: "gemini-2.5-pro-thinking",
    name: "Gemini 2.5 Pro (Thinking Mode)",
    description: "Most advanced model with enhanced reasoning capabilities",
    capabilities: {
      thinking: true,
      multimodal: true,
      search: true,
      codeExecution: true,
      urlContext: true,
      imageGeneration: false,
    },
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Most advanced model for complex tasks",
    capabilities: {
      thinking: false,
      multimodal: true,
      search: true,
      codeExecution: true,
      urlContext: true,
      imageGeneration: false,
    },
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Fast and efficient model for most tasks",
    capabilities: {
      thinking: false,
      multimodal: true,
      search: true,
      codeExecution: false,
      urlContext: true,
      imageGeneration: false,
    },
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Lightweight model for quick responses",
    capabilities: {
      thinking: false,
      multimodal: true,
      search: true,
      codeExecution: false,
      urlContext: true,
      imageGeneration: false,
    },
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

const getCapabilityIcon = (capability: string) => {
  switch (capability) {
    case "thinking":
      return <Brain className="size-3" />;
    case "multimodal":
      return <Zap className="size-3" />;
    default:
      return <Shield className="size-3" />;
  }
};

const getCapabilityColor = (capability: string) => {
  switch (capability) {
    case "thinking":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "multimodal":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "search":
      return "text-green-600 bg-green-50 border-green-200";
    case "codeExecution":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "urlContext":
      return "text-cyan-600 bg-cyan-50 border-cyan-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export function ModelSelector({ selectedModel, onModelChange, className }: ModelSelectorProps) {
  const currentModel = modelVariants.find(m => m.id === selectedModel);

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">{currentModel?.name || "Select Model"}</span>
            <ChevronDown className="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80">
          {modelVariants.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className="flex flex-col items-start space-y-2 p-3 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
                {model.id === selectedModel && (
                  <div className="text-xs text-blue-600 font-medium">Selected</div>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(model.capabilities)
                  .filter(([_, enabled]) => enabled)
                  .map(([capability]) => (
                    <div
                      key={capability}
                      className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getCapabilityColor(capability)}`}
                    >
                      {getCapabilityIcon(capability)}
                      {capability === "codeExecution" ? "code" : capability}
                    </div>
                  ))}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentModel?.capabilities.thinking && (
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Brain className="size-3" />
          Enhanced reasoning mode active
        </div>
      )}
    </div>
  );
}