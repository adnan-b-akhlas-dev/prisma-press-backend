import { CommentStatus } from "../../prisma/generated/prisma/enums";

export interface ICommentPayload {
  postId: string;
  content: string;
  status: CommentStatus;
}

export type TCreateCommentPayload = Pick<ICommentPayload, "postId" | "content">;

export type TUpdateCommentPayload = Pick<ICommentPayload, "content" | "status">;

export type TModerateCommentPayload = Pick<ICommentPayload, "status">;
