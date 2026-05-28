import "./style.css";
interface MainSectionErrorProps {
  errorMessage: string;
}

export default function MainSectionError({
  errorMessage,
}: MainSectionErrorProps) {
  return (
    <section className='main-section-error span-section'>
      <p>{errorMessage}</p>
    </section>
  );
}
