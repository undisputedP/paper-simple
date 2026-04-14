"use client";

import type { DepthLevel } from "@/types/paper";
import { GraduationCap, BookOpen, Microscope, Atom } from "lucide-react";

const levels: { value: DepthLevel; label: string; icon: React.ElementType; desc: string }[] = [
  {
    value: "high-school",
    label: "High School",
    icon: GraduationCap,
    desc: "Simple analogies & everyday language",
  },
  {
    value: "undergrad",
    label: "Undergrad",
    icon: BookOpen,
    desc: "Clear & structured with some technical terms",
  },
  {
    value: "graduate",
    label: "Graduate",
    icon: Microscope,
    desc: "Detailed methodology & analysis",
  },
  {
    value: "expert",
    label: "Expert",
    icon: Atom,
    desc: "Full technical depth & nuance",
  },
];

interface DepthSliderProps {
  current: DepthLevel;
  onChange: (depth: DepthLevel) => void;
  disabled?: boolean;
}

export function DepthSlider({ current, onChange, disabled }: DepthSliderProps) {
  const currentIdx = levels.findIndex((l) => l.value === current);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Explanation Depth
      </h3>

      <div className="flex gap-2">
        {levels.map((level, i) => {
          const active = level.value === current;
          return (
            <button
              key={level.value}
              onClick={() => !disabled && onChange(level.value)}
              disabled={disabled}
              className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg p-3 text-center transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-muted/50 text-muted-foreground"
              } ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <level.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{level.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {levels[currentIdx]?.desc}
      </p>
    </div>
  );
}
