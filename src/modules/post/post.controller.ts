import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

const getAllPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const getPostStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const getMyPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const getSinglePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const createPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const updatePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {},
);

export const postController = {
  getAllPosts,
  getPostStats,
  getMyPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
};
