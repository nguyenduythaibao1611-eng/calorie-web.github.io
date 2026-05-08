type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-medium";

  const styles = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-200 text-black",
  };

  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}
