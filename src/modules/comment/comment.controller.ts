import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

const getCommentsByAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);
const getSingleComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);
const createComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);
const updateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);
const deleteComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);
const moderateComment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

export const commentController = {
  getCommentsByAuthor,
  getSingleComment,
  createComment,
  updateComment,
  deleteComment,
  moderateComment,
};
