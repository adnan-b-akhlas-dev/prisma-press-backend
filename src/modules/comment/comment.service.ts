import status from "http-status";
import { AppError } from "../../helpers/AppError";
import { prisma } from "../../lib/prisma";
import { CommentModel } from "../../prisma/generated/prisma/models";
import {
  TCreateCommentPayload,
  TModerateCommentPayload,
  TUpdateCommentPayload,
} from "./comment.interface";

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

const createCommentIntoDb = async (
  authorId: string,
  payload: TCreateCommentPayload,
): Promise<CommentModel> => {
  await prisma.post.findUniqueOrThrow({ where: { id: payload.postId } });

  const comment = await prisma.comment.create({
    data: { ...payload, authorId },
  });

  return comment;
};

const updateCommentIntoDb = async (
  authorId: string,
  commentId: string,
  payload: TUpdateCommentPayload,
): Promise<CommentModel> => {
  await prisma.comment.findUniqueOrThrow({
    where: { id: commentId, authorId },
  });

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { ...payload },
  });

  return updatedComment;
};

const deleteCommentFromDb = async (
  commentId: string,
  authorId: string,
  isAdmin: boolean,
): Promise<void> => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
  });

  if (!isAdmin && authorId !== comment.authorId) {
    throw new AppError(
      "You are not authorized to delete others comments.",
      status.UNAUTHORIZED,
    );
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
};

const moderateCommentIntoDb = async (
  commentId: string,
  payload: TModerateCommentPayload,
): Promise<CommentModel> => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
  });

  if (comment.status === payload.status) {
    throw new AppError(
      `Your provided status ${payload.status} is already up to date.`,
      status.CONFLICT,
    );
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { ...payload },
  });

  return updatedComment;
};

export const commentService = {
  getCommentsByAuthorFromDb,
  getSingleCommentFromDb,
  createCommentIntoDb,
  updateCommentIntoDb,
  deleteCommentFromDb,
  moderateCommentIntoDb,
};
