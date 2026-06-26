import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth.middleware";
import { Role } from "../../prisma/generated/prisma/enums";

export const postRouter: Router = Router();

postRouter.get("/", postController.getAllPosts);
postRouter.get("/stats", auth(Role.ADMIN), postController.getPostStats);
postRouter.get(
  "/my-posts",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.getMyPosts,
);
postRouter.get("/:postId", postController.getSinglePost);
postRouter.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
postRouter.patch(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.updatePost,
);
postRouter.delete(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.deletePost,
);
