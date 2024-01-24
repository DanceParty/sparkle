import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, className, ...props }: ButtonProps) {
  const size = "h-11 min-w-44 bg-[left_calc(100%)_top_calc(200%)]";
  const border = "border-2 border-black rounded-md";
  const display = "inline-block relative";
  const classes = clsx(size, border, display, "custom-button", className);
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
