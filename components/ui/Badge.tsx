export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 bg-gray-200 rounded text-sm">{children}</span>
  );
}
