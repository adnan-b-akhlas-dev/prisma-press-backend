import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middlewares/auth.middleware";
import { Role } from "../../prisma/generated/prisma/enums";

export const postRouter: Router = Router();

postRouter.get("/", postController.createPost);
postRouter.get("/stats", auth(Role.ADMIN), postController.createPost);
postRouter.get(
  "/my-posts",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.createPost,
);
postRouter.get("/:postId", postController.createPost);
postRouter.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
postRouter.patch(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
postRouter.delete(
  "/:postId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  postController.createPost,
);
