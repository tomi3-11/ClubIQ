import "./style.css";
import { LoaderPinwheel } from "lucide-react";

export default function MainSectionLoader() {
  return (
    <section className='main-section-loader span-section'>
      <LoaderPinwheel className='loading-spinner' />
    </section>
  );
}
