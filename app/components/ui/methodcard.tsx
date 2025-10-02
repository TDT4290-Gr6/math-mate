import React from "react";
import { Button } from "@/components/ui/button";

interface MethodCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function MethodCard({
  title,
  description,
  buttonText,
  onButtonClick,
}: MethodCardProps) {
  return (
    <div className="relative w-min-128 h-64 bg-[var(--background)] rounded-xl shadow-md flex flex-col justify-start items-start p-4 text-start">
      
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      
      {/* Description */}
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Button */}
      <div className="absolute -bottom-6">
        <Button className="px-6 py-2" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
