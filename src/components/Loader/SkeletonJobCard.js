// components/SkeletonJobCard.jsx
import React from "react";

const SkeletonJobCard = () => {
  return (
   <div className="max-w-md mx-auto rounded-2xl shadow-lg p-4 glassy-card space-y-3 animate-pulse">
  <div className="grid grid-cols-3 gap-3 items-center">
    <div className="col-span-2 flex items-center gap-2">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-[var(--bg-button-hover)]"></div>
      <div className="space-y-2">
        {/* Name */}
        <div className="w-32 h-4 rounded bg-[var(--bg-button-hover)]"></div>
        {/* Headline */}
        <div className="w-24 h-3 rounded bg-[var(--bg-card)]"></div>
      </div>
    </div>
    {/* Connection button placeholder */}
    <div className="w-20 h-6 rounded-full bg-[var(--bg-card)]"></div>
  </div>

  <div className="space-y-2">
    {/* Title / text */}
    <div className="w-40 h-3 rounded bg-[var(--bg-card)]"></div>

    {/* Tags / badges */}
    <div className="flex flex-wrap gap-2">
      <div className="w-20 h-5 rounded-full bg-[var(--bg-card)]"></div>
      <div className="w-16 h-5 rounded-full bg-[var(--bg-card)]"></div>
      <div className="w-24 h-5 rounded-full bg-[var(--bg-card)]"></div>
    </div>

    {/* Description lines */}
    <div className="w-3/4 h-5 rounded bg-[var(--bg-card)]"></div>
    <div className="w-full h-3 rounded bg-[var(--bg-card)]"></div>

    {/* Action buttons */}
    <div className="flex gap-2 mt-2">
      <div className="w-24 h-8 rounded-md bg-[var(--bg-button-hover)]"></div>
      <div className="w-20 h-8 rounded-md bg-[var(--bg-button-hover)]"></div>
    </div>
  </div>
</div>

  );
};

export default SkeletonJobCard;
