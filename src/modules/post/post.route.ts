import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.createPost,
);
router.get("/", postController.getAllPosts);

router.get(
  "/my-posts",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.getMyPosts,
);
router.get("/stats", auth(Role.ADMIN), postController.getPostStats);
router.get("/:postId", postController.getSinglePost);
router.patch(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.updateMyPost,
);
router.delete(
  "/:postId",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  postController.deleteMyPost,
);

export const postRoute = router;
