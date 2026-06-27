import { prisma } from "../../lib/prisma";
import { CommentStatus, PostStatus } from "../../prisma/generated/prisma/enums";
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

const getPostStatsFromDb = async (): Promise<{
  totalPosts: number;
  totalPublishedPosts: number;
  totalDraftPosts: number;
  totalArchivedPosts: number;
  totalComments: number;
  totalApprovedComments: number;
  totalRejectedComments: number;
  totalViews: number | null;
}> => {
  const result = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
      await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
      await tx.post.aggregate({ _sum: { views: true } }),
    ]);
    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalViews: totalViews._sum.views,
    };
  });
  return result;
};

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

const updatePostIntoDb = async (
  postId: string,
  userId: string,
  isAdmin: boolean,
  payload: Partial<ICreatePostRequest>,
): Promise<PostModel> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Requested post not found.");
  }
  if (!isAdmin && userId !== post.authorId) {
    throw new Error("You are not authorized to update others post.");
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { ...payload },
    include: {
      author: {
        omit: { password: true },
      },
      comment: true,
    },
  });

  return updatedPost;
};

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
