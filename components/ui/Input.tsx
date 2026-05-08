type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return <input className="border px-3 py-2 rounded w-full" {...props} />;
}
