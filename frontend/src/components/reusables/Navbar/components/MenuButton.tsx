import { Menu } from "lucide-react";

export default function MenuButton({
  setNavLinksOpen,
}: {
  setNavLinksOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className='menu-button-container'
      onClick={() => setNavLinksOpen((prev) => !prev)}
    >
      <Menu />
    </div>
  );
}
