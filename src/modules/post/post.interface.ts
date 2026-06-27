import { PostStatus } from "../../prisma/generated/prisma/enums";

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
