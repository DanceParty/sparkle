import clsx from "clsx";
import { ReactNode } from "react";
import Link from "next/link";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  contentClass?: string;
  containerClass?: string;
  closeButtonClass?: string;
  redirectRoute: string;
}

export function Modal({
  redirectRoute,
  children,
  isOpen,
  contentClass,
  containerClass,
  closeButtonClass,
}: ModalProps) {
  const overlay = clsx("fixed inset-0 z-10 p-8 bg-gray-600/80", {
    block: isOpen,
    hidden: !isOpen,
  });
  const container = clsx(
    "relative w-full max-w-md mx-auto mt-8 ",
    containerClass
  );
  const closeButton = clsx(
    "absolute -top-2 -right-2 flex justify-center rounded-full h-7 w-7 bg-gray-600 cursor-pointer shadow-xl",
    closeButtonClass
  );
  const content = clsx(
    "overflow-hidden bg-white rounded shadow-xl p-5",
    contentClass
  );
  return (
    <div className={overlay}>
      <div className={container}>
        <Link className={closeButton} href={redirectRoute}>
          <span className="text-xl leading-6 select-none text-white">
            &times;
          </span>
        </Link>
        <div className={content}>{children}</div>
      </div>
    </div>
  );
}
