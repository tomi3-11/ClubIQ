export default function RegularImage({
  src,
  alt,
  className = "",
  isHidden = false,
}: {
  src: string;
  alt: string;
  className?: string;
  isHidden?: boolean;
}) {
  if (isHidden) return null;

  const handleError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLImageElement;
    target.src = "/svgs/default-user-icon.svg"; // Fallback image
    target.alt = "Default image"; // Update alt text
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`regular-image ${className}`}
      onError={handleError}
      loading='lazy'
    />
  );
}
