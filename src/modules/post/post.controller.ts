import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../user/user.interface";
import { postService } from "./post.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { Role } from "../../prisma/generated/prisma/enums";

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
  async (req: Request, res: Response): Promise<void> => {
    const data = await postService.getPostStatsFromDb();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts stats retrieved successfully.",
      data,
    });
  },
);

const getMyPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.user as User;
    const data = await postService.getMyPostsFromDb(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts retrieved successfully.",
      data,
    });
  },
);

const getSinglePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    if (!postId) {
      throw new Error("Post ID required in params");
    }

    const data = await postService.getSinglePostFromDb(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully.",
      data,
    });
  },
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
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = (req.user as User).id;
    const isAdmin = (req.user as User).role === Role.ADMIN;
    const payload = req.body;

    if (!postId) {
      throw new Error("Post ID required in params");
    }

    const data = await postService.updatePostIntoDb(
      postId as string,
      userId,
      isAdmin,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully.",
      data,
    });
  },
);

const deletePost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const userId = (req.user as User).id;
    const isAdmin = (req.user as User).role === Role.ADMIN;

    if (!postId) {
      throw new Error("Post ID required in params.");
    }

    await postService.deletePostFromDb(postId as string, userId, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post removed successfully.",
    });
  },
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
