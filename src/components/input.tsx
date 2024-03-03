import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ type, className, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={clsx(
        "flex h-10 w-full rounded-md border border-2 border-black bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

Input.displayName = "Input";
