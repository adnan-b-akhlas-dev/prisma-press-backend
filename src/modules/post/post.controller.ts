import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../user/user.interface";
import { postService } from "./post.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getAllPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = await postService.getAllPostsFromDb();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts retrieved successfully.",
      data,
    });
  },
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
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;
    const payload = req.body;
    const data = await postService.createPostIntoDb(payload, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully.",
      data,
    });
  },
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
