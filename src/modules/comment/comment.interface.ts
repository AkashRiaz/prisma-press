import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICommentCreatePayload {
  content: string;
  postId: string;
  status: CommentStatus;
}

export interface ICommentUpdatePayload {
    content?: string;
    status?: CommentStatus;
}

export interface ICommentModerationPayload {
    status: CommentStatus;
}
