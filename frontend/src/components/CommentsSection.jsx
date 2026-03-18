// React
import { useState } from "react";

// Clerk
import { useAuth, SignInButton } from "@clerk/react";

// Tanstack
import {
  useCreateComment,
  useDeleteComment,
  useCreateCommentReply,
  useDeleteCommentReply,
} from "../hooks/useComments";

import { useLikes } from "../hooks/useLikes";

// Reusable Component
import ConfirmModal from "./ConfirmModal";

// Icons
import {
  SendIcon,
  Trash2Icon,
  MessageSquareIcon,
  LogInIcon,
  HeartIcon,
  CornerDownRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SmileIcon,
  MoreHorizontalIcon,
} from "lucide-react";

// Toast
import toast from "react-hot-toast";

/* ─────────────────────────────────────────
   Reusable Like Button
───────────────────────────────────────── */
const LikeButton = ({ initialCount = 0, size = "sm", type }) => {
  const { userId } = useAuth();
  const { like, unlike } = useLikes();
  // const [liked, setLiked] = useState(false);
  // const [count, setCount] = useState(initialCount);

  const liked = type.likes.some((like) => like.userId === userId);

  const handleLikeToggle = () => {
    if (!liked) {
      like.mutate({
        type: "comment",
        id: type.id,
        parentCommentId: type.id,
      });
    } else {
      const likeId = type.likes.find((l) => l.userId === userId)?.id;
      if (likeId) {
        unlike.mutate({
          type: "comment",
          id: likeId,
          parentCommentId: type.id,
        });
      }
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`btn btn-ghost btn-xs gap-1.5 rounded-full transition-all group ${
        liked ? "text-error" : "text-base-content/50 hover:text-error"
      }`}
    >
      <HeartIcon
        className={`size-3.5 transition-all ${liked ? "fill-current scale-110" : "group-hover:scale-110"}`}
      />
      {initialCount > 0 && (
        <span className="text-xs font-medium tabular-nums">{initialCount}</span>
      )}
    </button>
  );
};

/* ─────────────────────────────────────────
   Reply Input
───────────────────────────────────────── */
const ReplyInput = ({ onSubmit, onCancel, isLoading }) => {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mt-2 ml-0 animate-in slide-in-from-top-2 duration-200"
    >
      <input
        autoFocus
        type="text"
        placeholder="Write a reply..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
        className="input input-bordered input-sm flex-1 bg-base-100 focus:ring-1 focus:ring-primary/40 rounded-full px-4"
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="btn btn-primary btn-xs btn-square rounded-full"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <SendIcon className="size-3" />
        )}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-ghost btn-xs rounded-full px-2 text-base-content/50"
      >
        Cancel
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────
   Reply Bubble
───────────────────────────────────────── */
const ReplyBubble = ({ reply, currentUserId, onDelete }) => {
  const isOwner = currentUserId === reply.userId;
  return (
    <div className="flex gap-2.5 group animate-in fade-in-0 duration-300">
      <div className="avatar flex-shrink-0 mt-0.5">
        <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-base-300">
          <img
            src={reply.user?.imageUrl}
            alt={reply.user?.name}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-xs">{reply.user?.name}</span>
          <time className="text-xs text-base-content/40">
            {new Date(reply.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-2xl rounded-tl-sm px-3.5 py-2 mt-1 text-sm leading-relaxed max-w-prose">
          {reply.content}
        </div>
        <div className="flex items-center gap-0.5 mt-1.5">
          <LikeButton initialCount={reply.likes.length || 0} type={reply} />
          {isOwner && (
            <button
              onClick={() => onDelete(reply)}
              className="btn btn-ghost btn-xs gap-1 rounded-full text-base-content/30 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2Icon className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Comment Bubble
───────────────────────────────────────── */
const CommentBubble = ({
  comment,
  currentUserId,
  onDeleteComment,
  productId,
}) => {
  const { isSignedIn } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [deleteReplyModal, setDeleteReplyModal] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);
  const isOwner = currentUserId === comment.userId;
  const replies = comment.replies || [];

  const createCommentReply = useCreateCommentReply();
  const deleteCommentReply = useDeleteCommentReply(comment.id);

  const handleAddReply = (content) => {
    createCommentReply.mutate(
      { commentId: comment.id, content, productId }, // 👈 wire up the mutation
      {
        onSuccess: () => {
          setShowReplyInput(false);
          setShowReplies(true);
          toast.success("Reply posted!");
        },
        onError: () => {
          toast.error("Something went wrong, please try again later");
        },
      },
    );
  };

  const handleDeleteReply = () => {
    if (!selectedReply) return;
    deleteCommentReply.mutate(
      { commentReplyId: selectedReply.id, productId }, // 👈 wire up the mutation
      {
        onSuccess: () => {
          setDeleteReplyModal(false);
          setSelectedReply(null);
          toast.success("Reply deleted");
        },
        onError: () => {
          toast.error("Something went wrong, please try again later");
        },
      },
    );
  };

  return (
    <div className="flex gap-3 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Avatar */}
      <div className="avatar flex-shrink-0 mt-1">
        <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-base-300 ring-offset-1 ring-offset-base-200">
          <img
            src={comment.user?.imageUrl}
            alt={comment.user?.name}
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{comment.user?.name}</span>
          <time className="text-xs text-base-content/40">
            {new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>

        {/* Bubble */}
        <div className="bg-base-100 border border-base-300 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-sm max-w-prose">
          {comment.content}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-wrap">
          <LikeButton initialCount={comment.likes.length || 0} type={comment} />

          <div className="divider divider-horizontal mx-0 h-4 self-center" />

          {isSignedIn ? (
            <button
              onClick={() => setShowReplyInput((v) => !v)}
              className={`btn btn-ghost btn-xs gap-1.5 rounded-full transition-all ${
                showReplyInput
                  ? "text-primary"
                  : "text-base-content/50 hover:text-primary"
              }`}
            >
              <CornerDownRightIcon className="size-3.5" />
              Reply
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-xs gap-1.5 rounded-full text-base-content/50 hover:text-primary">
                <CornerDownRightIcon className="size-3.5" />
                Reply
              </button>
            </SignInButton>
          )}

          {replies.length > 0 && (
            <>
              <div className="divider divider-horizontal mx-0 h-4 self-center" />
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="btn btn-ghost btn-xs gap-1.5 rounded-full text-base-content/50 hover:text-base-content"
              >
                {showReplies ? (
                  <ChevronUpIcon className="size-3.5" />
                ) : (
                  <ChevronDownIcon className="size-3.5" />
                )}
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>
            </>
          )}

          {isOwner && (
            <>
              <div className="divider divider-horizontal mx-0 h-4 self-center" />
              <button
                onClick={() => onDeleteComment(comment)}
                className="btn btn-ghost btn-xs gap-1 rounded-full text-base-content/30 hover:text-error opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2Icon className="size-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <ReplyInput
            onSubmit={handleAddReply}
            onCancel={() => setShowReplyInput(false)}
            isLoading={false}
          />
        )}

        {/* Replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 border-base-300 space-y-3">
            {replies.map((reply) => (
              <ReplyBubble
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                onDelete={(r) => {
                  setSelectedReply(r);
                  setDeleteReplyModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Reply Modal */}
      <ConfirmModal
        isOpen={deleteReplyModal}
        title="Delete Reply"
        message="Are you sure you want to delete this reply?"
        onCancel={() => setDeleteReplyModal(false)}
        onConfirm={handleDeleteReply}
      />
    </div>
  );
};

/* ─────────────────────────────────────────
   Main CommentsSection
───────────────────────────────────────── */
const CommentsSection = ({ productId, comments = [], currentUserId }) => {
  const { isSignedIn } = useAuth();
  const [content, setContent] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment(productId);

  const handleDelete = () => {
    if (!selectedComment) return;
    deleteComment.mutate(
      { commentId: selectedComment.id },
      {
        onSuccess: () => {
          setDeleteModalVisibility(false);
          setSelectedComment(null);
          toast.success("Comment deleted");
        },
        onError: () => {
          toast.error("Something went wrong, please try again later");
        },
      },
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(
      { productId, content },
      { onSuccess: () => setContent("") },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquareIcon className="size-4 text-primary" />
          </div>
          <h3 className="font-bold text-base">Discussion</h3>
          <div className="badge badge-neutral badge-sm font-mono">
            {comments.length}
          </div>
        </div>
        <div className="text-xs text-base-content/40 hidden sm:block">
          Share your thoughts ✦
        </div>
      </div>

      {/* Compose */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 items-end">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Add to the discussion…"
                className="input input-bordered w-full bg-base-100 pr-12 rounded-2xl focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createComment.isPending}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content/70 transition-colors"
              >
                <SmileIcon className="size-4" />
              </button>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-square rounded-xl shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              disabled={createComment.isPending || !content.trim()}
            >
              {createComment.isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <SendIcon className="size-4" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-base-100 border border-base-300 rounded-2xl px-4 py-3 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-base-300 flex items-center justify-center flex-shrink-0">
              <LogInIcon className="size-3.5 text-base-content/50" />
            </div>
            <p className="text-sm text-base-content/60 truncate">
              Sign in to join the discussion
            </p>
          </div>
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm rounded-full px-4 gap-1.5 flex-shrink-0">
              <LogInIcon className="size-3.5" />
              Sign In
            </button>
          </SignInButton>
        </div>
      )}

      {/* Divider */}
      <div className="divider text-xs text-base-content/30 my-2">
        {comments.length > 0
          ? `${comments.length} comment${comments.length !== 1 ? "s" : ""}`
          : "No comments yet"}
      </div>

      {/* Comments List */}
      <div className="space-y-5 max-h-150 overflow-y-auto pr-1 scrollbar-thin">
        {comments.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-base-100 border border-base-300 flex items-center justify-center mx-auto">
              <MessageSquareIcon className="size-7 text-base-content/20" />
            </div>
            <div>
              <p className="font-semibold text-sm text-base-content/50">
                No comments yet
              </p>
              <p className="text-xs text-base-content/30 mt-0.5">
                Be the first to share your thoughts!
              </p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              productId={productId}
              onDeleteComment={(c) => {
                setSelectedComment(c);
                setDeleteModalVisibility(true);
              }}
            />
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalVisibility}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        onCancel={() => setDeleteModalVisibility(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CommentsSection;
