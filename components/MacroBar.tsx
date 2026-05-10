interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  color: "emerald" | "blue" | "orange";
}

export default function MacroBar({
  label,
  consumed,
  target,
  color,
}: MacroBarProps) {
  const percentage = (consumed / target) * 100;

  const colorMap = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-600">{consumed}g / {target}g</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorMap[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
