import clsx from 'clsx';

export default function Post() {
  return (
    <div className="flex flex-col">
      <div
        className="
          animate-slide-enter
          pointer-events-none
          relative
          h-10
          select-none
        "
      >
        <div
          className={clsx(
            `
            text-stroke
            absolute
            -left-[3rem]
            -top-[3rem]
            text-[8em]
            font-bold
            text-transparent
            opacity-10
          `
          )}
        >
          2023
        </div>
        hh
      </div>
    </div>
  );
}
