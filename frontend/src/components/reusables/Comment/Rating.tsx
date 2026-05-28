import "./style.css";
import { StarSvg } from "@/assets/icons";

export default function Rating({ rating }: { rating: number }) {
  //limit rating to 5
  rating = Math.min(Math.max(rating, 0), 5);
  const stars = new Array(Math.floor(rating)).fill(null).map((_, index) => (
    <span key={index}>
      <StarSvg fill={"red"} />
    </span>
  ));

  const rem = Math.round(rating) - Math.floor(rating);

  return (
    <div className='ratings-container'>
      {stars}
      <span>{rem ? "1/2" : ""}</span>
    </div>
  );
}
