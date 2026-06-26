import { prisma } from "../../lib/prisma";
import { PostModel } from "../../prisma/generated/prisma/models";
import { ICreatePostRequest } from "./post.interface";

const getAllPostsFromDb = async (): Promise<PostModel[]> => {
  const posts = await prisma.post.findMany({
    include: {
      author: { omit: { password: true } },
      comment: true,
    },
  });

  return posts;
};
const getPostStatsFromDb = async (): Promise<void> => {};
const getMyPostsFromDb = async (): Promise<void> => {};
const getSinglePostFromDb = async (): Promise<void> => {};

const createPostIntoDb = async (
  payload: ICreatePostRequest,
  userId: string,
): Promise<PostModel> => {
  const post = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return post;
};

const updatePostIntoDb = async (): Promise<void> => {};
const deletePostFromDb = async (): Promise<void> => {};

export const postService = {
  getAllPostsFromDb,
  getPostStatsFromDb,
  getMyPostsFromDb,
  getSinglePostFromDb,
  createPostIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
};
