import "./style.css";
import { FilmPageReview, Review } from "@/types/types";
import Rating from "./Rating";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { Delete, Edit, Edit2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface CommentProps {
  filmId?: number;
  review: Review | FilmPageReview;
  setCurrentReviews?: React.Dispatch<React.SetStateAction<FilmPageReview[]>>;
}

export default function Comment({
  filmId,
  review,
  setCurrentReviews,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Normalize data
  const author =
    "author" in review
      ? review.author
      : "username" in review
        ? review.username
        : "Unknown User";

  const content =
    "content" in review
      ? review.content
      : "review_text" in review
        ? review.review_text
        : "";

  const rating =
    "author_details" in review
      ? review.author_details?.rating ?? 0
      : "rating" in review
        ? review.rating ?? 0
        : 0;

  const imgUrl =
    "author_details" in review && review.author_details.avatar_path
      ? review.author_details.avatar_path
      : "pfp_url" in review
        ? review.pfp_url
        : "/svgs/default-user-icon.svg";

  const filmIdId = "film_id" in review ? review.film_id : filmId || 0;
  const filmTitle = "film_title" in review ? review.film_title : "";
  const filmPoster = "film_poster" in review ? review.film_poster : "";
  const currentReviewText = "review_text" in review ? review.review_text : "";
  const currentRating = "rating" in review ? review.rating : 0;
  const reviewId = "id" in review ? review.id : undefined;
  const userId = "user_id" in review ? review.user_id : undefined;
  const { user, isSignedIn } = useUser();

  return (
    <div className='comment-wrapper'>
      {isEditing && setCurrentReviews ? (
        <CommentForm
          filmId={filmIdId}
          filmTitle={filmTitle}
          filmPoster={filmPoster}
          setCurrentReviews={setCurrentReviews}
          currentReviewText={currentReviewText ?? ""}
          currentRating={currentRating ?? 0}
          closeAction={() => setIsEditing(false)}
          reviewId={reviewId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <div className='comment-upper comment-part'>
            <img
              src={imgUrl ?? "/svgs/default-user-icon.svg"}
              className='review-pfp'
            />
            <div className='comment-content'>
              <div className='content-upper'>
                <h3>{author}</h3>
                <Rating rating={rating} />
              </div>
              <div className='content-lower'>
                <p>{content}</p>
              </div>
            </div>
          </div>

          {isSignedIn && String(user.id) === String(userId) && (
            <div className='comment-lower comment-part'>
              <Edit onClick={() => setIsEditing(!isEditing)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
