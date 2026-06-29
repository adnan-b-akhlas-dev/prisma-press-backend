import { Request, Response } from "express";
import status from "http-status";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./comment.service";
import { User } from "../user/user.interface";
import { Role } from "../../prisma/generated/prisma/enums";

const getCommentsByAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { authorId } = req.params;
    if (!authorId) {
      throw new Error("Author ID required on params.");
    }
    const data = await commentService.getCommentsByAuthorFromDb(
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Author's comments retrieved successfully.",
      data,
    });
  },
);
const getSingleComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;
    if (!commentId) {
      throw new Error("Comment ID required on params");
    }
    const data = await commentService.getSingleCommentFromDb(
      commentId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Comment retrieved successfully.",
      data,
    });
  },
);
const createComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const authorId = (req.user as User).id;
    const payload = req.body;
    const data = await commentService.createCommentIntoDb(authorId, payload);

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Comment created successfully.",
      data,
    });
  },
);
const updateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    const authorId = (req.user as User).id;
    const payload = req.body;

    const data = await commentService.updateCommentIntoDb(
      authorId,
      commentId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Comment updated successfully.",
      data,
    });
  },
);
const deleteComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    const authorId = (req.user as User).id;
    const isAdmin = (req.user as User).role === Role.ADMIN;

    await commentService.deleteCommentFromDb(commentId, authorId, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Comment removed successfully.",
    });
  },
);
const moderateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const commentId = req.params.commentId as string;
    const payload = req.body;
    const data = await commentService.moderateCommentIntoDb(commentId, payload);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Comment moderate successfully.",
      data,
    });
  },
);

export const commentController = {
  getCommentsByAuthor,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};
