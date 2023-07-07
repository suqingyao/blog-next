import React from 'react';

export default async function Posts() {
  return (
    <div
      className="
        flex
        flex-col
      "
    >
      <div
        className="
          animate-slide 
          pointer-events-none
          relative
          h-20
          select-none
        "
      >
        <div
          className="
            text-stroke
            absolute
            -left-[3rem]
            -top-[3rem]
            text-[8em]
            font-bold
            text-transparent
            opacity-10
          "
        >
          2023
        </div>
      </div>
    </div>
  );
}
