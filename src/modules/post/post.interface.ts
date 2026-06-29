import { PostStatus } from "../../prisma/generated/prisma/enums";
import { PostWhereInput } from "../../prisma/generated/prisma/models";

export interface ICreatePostRequest {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[];
}

export interface IPostsStatsResponse {
  totalPosts: number;
  totalPublishedPosts: number;
  totalDraftPosts: number;
  totalArchivedPosts: number;
  totalComments: number;
  totalApprovedComments: number;
  totalRejectedComments: number;
  totalViews: number | null;
}

export interface IPostQueries extends PostWhereInput {
  limit?: number;
  page?: number;
  search?: string;
  fields?: string;
  sortBy?: string;
  orderBy?: string;
}
