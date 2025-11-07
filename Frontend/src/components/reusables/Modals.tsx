import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Modal({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const target = document.getElementById("modals");
    setModalRoot(target);
  }, []);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div className='modal-backdrop'>
      <div className='modal-content'>{children}</div>
    </div>,
    modalRoot
  );
}
