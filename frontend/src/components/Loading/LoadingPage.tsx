import { Loader, Loader2 } from "lucide-react";
import "./style.css";
export default function LoadingPage() {
  return (
    <main className='loading-page'>
      <header className='loading-header'></header>
      <div className='loading-middle'>
        <Loader className='loading-spinner' />
      </div>
      <footer className='loading-footer'></footer>
    </main>
  );
}
