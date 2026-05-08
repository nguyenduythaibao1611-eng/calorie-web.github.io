type Props = {
  isOpen: boolean;
  children: React.ReactNode;
};

export default function Modal({ isOpen, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-4 rounded">{children}</div>
    </div>
  );
}
