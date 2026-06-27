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

const getMyPostsFromDb = async (userId: string): Promise<PostModel[]> => {
  const myPosts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comment: true,
      _count: {
        select: {
          comment: true,
        },
      },
    },
  });

  return myPosts;
};

const getSinglePostFromDb = async (postId: string): Promise<PostModel> => {
  const post = await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
    include: {
      author: {
        omit: { password: true },
      },
      comment: true,
    },
  });

  return post;
};

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

const deletePostFromDb = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
): Promise<void> => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });
  if (!post) {
    throw new Error("Requested post not found.");
  }

  if (!isAdmin && userId !== post.authorId) {
    throw new Error("You can not delete others post.");
  }

  await prisma.post.delete({
    where: { id: postId },
  });
};

export const postService = {
  getAllPostsFromDb,
  getPostStatsFromDb,
  getMyPostsFromDb,
  getSinglePostFromDb,
  createPostIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
};
