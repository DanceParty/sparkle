import clsx from "clsx";

const fontSize = {
  h1: "text-4xl lg:text-5xl",
  h2: "text-3xl",
};

const styles = {
  h1: "scroll-m-20 font-light tracking-tight",
  h2: "scroll-m-20 font-light tracking-tight",
};

type TitleProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

function Title({
  as,
  className,
  children,
  size,
}: TitleProps & { size: keyof typeof fontSize }) {
  const Tag = as ?? size;
  const classes = clsx(fontSize[size], styles[size], className);
  return <Tag className={classes}>{children}</Tag>;
}

export function BannerText(props: TitleProps) {
  return <Title {...props} className="!text-9xl" size="h1" />;
}

export function H1(props: TitleProps) {
  return <Title {...props} size="h1" />;
}

export function H2(props: TitleProps) {
  return <Title {...props} size="h2" />;
}
