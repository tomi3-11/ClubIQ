import { StarSvg } from "@/assets/icons";

export default function RatingSelector({
  rating,
  setRating,
}: {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  const stars = new Array(5).fill(null).map((_, index) => (
    <span key={index} onClick={() => setRating(index + 1)}>
      <StarSvg fill={index < rating ? "red" : "gray"} />
    </span>
  ));

  return <div className='ratings-container'>{stars}</div>;
}
