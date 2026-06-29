import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/",auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.createComment)

router.get("/:commentId", commentController.getSingleComment)

router.get("/author/:authorId", commentController.getAuthorComments)

router.patch("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.updateComment)

router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.updateCommentModeration)

router.delete("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.deleteComment)

export const commentRoute = router;