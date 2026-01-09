interface FilterStatsProps {
  count: number;
}

export function FilterStats({ count }: FilterStatsProps) {
  return (
    <div className="flex items-center gap-2">
      <i className="i-mingcute-filter-line text-base text-white/70" />
      <span className="text-sm font-medium text-white/90">
        显示
        {count}
        {' '}
        张照片
      </span>
    </div>
  );
}
