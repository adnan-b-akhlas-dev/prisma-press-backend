import { Router } from "express";
import { commentController } from "./comment.controller";
import auth from "../../middlewares/auth.middleware";
import { Role } from "../../prisma/generated/prisma/enums";

export const commentRouter: Router = Router();

commentRouter.get("/author/:authorId", commentController.getCommentsByAuthor);
commentRouter.get("/:commentId", commentController.getSingleComment);
commentRouter.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.createComment,
);
commentRouter.patch(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.updateComment,
);
commentRouter.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.deleteComment,
);
commentRouter.patch(
  "/:commentId/moderate",
  auth(Role.ADMIN),
  commentController.moderateComment,
);
