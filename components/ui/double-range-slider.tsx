"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minGap?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
  formatLabel?: (value: number) => string;
}

const DoubleRangeSlider = ({
  min,
  max,
  step = 1,
  minGap = 10,
  value,
  onValueChange,
  className,
  formatLabel = (value) => value.toString(),
}: DoubleRangeSliderProps) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinVal = Math.min(Number(e.target.value), maxVal - minGap);
      setMinVal(newMinVal);
      onValueChange([newMinVal, maxVal]);
    },
    [maxVal, minGap, onValueChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMaxVal = Math.max(Number(e.target.value), minVal + minGap);
      setMaxVal(newMaxVal);
      onValueChange([minVal, newMaxVal]);
    },
    [minVal, minGap, onValueChange]
  );

  const getProgressStyle = () => {
    const leftPercentage = ((minVal - min) / (max - min)) * 100;
    const rightPercentage = 100 - ((maxVal - min) / (max - min)) * 100;

    return {
      left: `${leftPercentage}%`,
      right: `${rightPercentage}%`,
    };
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Value Display */}
      <div className="mb-4 flex justify-between font-medium text-sm text-gray-700 dark:text-gray-300">
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          {formatLabel(minVal)}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          {formatLabel(maxVal)}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative mb-2">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Progress */}
          <div
            className="absolute h-2 bg-primary rounded-full transition-all duration-200"
            style={getProgressStyle()}
          />
        </div>

        {/* Range Inputs */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minVal}
            onChange={handleMinChange}
            className="absolute top-0 -mt-2 h-2 w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxVal}
            onChange={handleMaxChange}
            className="absolute top-0 -mt-2 h-2 w-full bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200"
          />
        </div>
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
