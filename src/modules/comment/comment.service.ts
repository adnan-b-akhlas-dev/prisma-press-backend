import { prisma } from "../../lib/prisma";
import { CommentModel } from "../../prisma/generated/prisma/models";

const getCommentsByAuthorFromDb = async (
  userId: string,
): Promise<CommentModel[]> => {
  const comments = await prisma.comment.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return comments;
};

const getSingleCommentFromDb = async (
  commentId: string,
): Promise<CommentModel> => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
  });

  return comment;
};

const createCommentIntoDb = async (): Promise<void> => {};
const updateCommentIntoDb = async (): Promise<void> => {};

const deleteCommentFromDb = async (
  commentId: string,
  authorId: string,
  isAdmin: boolean,
): Promise<void> => {
  const comment = await prisma.comment.delete({
    where: { id: commentId },
  });

  if (!isAdmin && authorId !== comment.authorId) {
    throw new Error("You are not authorized to delete others comments.");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
};
const moderateCommentIntoDb = async (): Promise<void> => {};

export const commentService = {
  getCommentsByAuthorFromDb,
  getSingleCommentFromDb,
  createCommentIntoDb,
  updateCommentIntoDb,
  deleteCommentFromDb,
  moderateCommentIntoDb,
};
