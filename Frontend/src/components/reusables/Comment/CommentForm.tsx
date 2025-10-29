import { backendService } from "@/services/backendService";
import { FilmPageReview } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import RatingSelector from "./RatingSelector";
import CommentContainer from "./CommentContainer";
import { toast } from "sonner";

interface CommentFormProps {
  filmId: number;
  filmTitle?: string;
  filmPoster?: string | null;
  setCurrentReviews: React.Dispatch<React.SetStateAction<FilmPageReview[]>>;
  currentReviewText?: string;
  currentRating?: number;
  closeAction?: () => void;
  isEditing?: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  reviewId?: number;
}

export default function CommentForm({
  filmId,
  filmTitle,
  filmPoster,
  setCurrentReviews,
  currentReviewText = "",
  currentRating = 0,
  closeAction,
  isEditing = false,
  setIsEditing,
  reviewId,
}: CommentFormProps) {
  const { user } = useUser();
  const [commentText, setCommentText] = useState(currentReviewText);
  const [rating, setRating] = useState(currentRating);
  const inputRef = useRef<HTMLDivElement>(null);

  const editReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please log in to leave a review");
      return;
    }
    const userId = user.id;

    if (!reviewId) {
      toast.error("Review ID is required for editing");
      return;
    }
    const review_text = commentText.trim();

    if (!review_text) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!filmPoster) {
      toast.error("Film poster is required");
      return;
    }

    try {
      const res = await backendService.editReview(
        userId,
        reviewId,
        review_text,
        rating
      );

      setCurrentReviews((prevReviews) =>
        prevReviews.map((review) => {
          return String(review.id) === String(res.film_data.id)
            ? { ...review, ...res.film_data }
            : review;
        })
      );
    } catch (error) {
      console.error("Error editing review:", error);
    } finally {
      if (setIsEditing) {
        setIsEditing(false);
      }
    }
  };

  const addReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to leave a review");
      return;
    }
    const userId = user.id;
    const username = user.username || user.firstName || "Anonymous";
    const pfp_url = user.imageUrl || "/svgs/default-user-icon.svg";

    const review_text = commentText.trim();

    if (!review_text) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!filmPoster) {
      toast.error("Film poster is required");
      return;
    }

    try {
      const res = await backendService.addReview(
        userId,
        username,
        pfp_url,
        filmId,
        review_text,
        rating,
        filmTitle,
        filmPoster
      );

      console.log("Review submitted:", res);

      setCurrentReviews((prevReviews) => [...prevReviews, res.film_data]);
      setCommentText("");
      setRating(0);
      inputRef.current!.innerHTML = ""; // Clear the input field
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isEditing ? editReview(e) : addReview(e);
  };

  return (
    <form className='comment-form' onSubmit={handleSubmit}>
      <div className='comment-form-upper'>
        <CommentContainer
          inputRef={inputRef}
          commentText={commentText}
          setCommentText={setCommentText}
        />
      </div>
      <div className='comment-form-lower'>
        <RatingSelector rating={rating} setRating={setRating} />
        <div className='button-container'>
          {closeAction && (
            <button
              type='button'
              className='comment-cancel-button'
              onClick={closeAction}
            >
              Cancel
            </button>
          )}
          <button type='submit' className='comment-submit-button'>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
