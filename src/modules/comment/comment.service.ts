import { prisma } from "../../lib/prisma";
import {
  ICommentCreatePayload,
  ICommentModerationPayload,
  ICommentUpdatePayload,
} from "./comment.interface";

const createCommentIntoDB = async (
  payload: ICommentCreatePayload,
  authorId: string,
) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return comment;
};

const getSingleCommentByCommentIdFromDB = async (commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment;
};

const getSingleCommentByPostIdFromDB = async (postId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });
  return comment;
};

const getCommentsByAuthorIdFromDB = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  });

  return comments;
};

const updateCommentIntoDB = async (
  commentId: string,
  authorId: string,
  payload: ICommentUpdatePayload,
) => {
  const comment = await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
      authorId: authorId,
    },
  });

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
      authorId: authorId,
    },
    data: payload,
  });
  return updatedComment;
};

const updateCommentModerationIntoDB = async (
  id: string,
  payload: ICommentModerationPayload,
) => {
  const commentData = await prisma.comment.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === payload.status) {
    throw new Error(`Comment is already ${payload.status}`);
  }

  const comment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });

  return comment;
};

const deleteCommentFromDB = async (
  commentId: string,
  authorId: string,
  idAdmin: boolean,
) => {
  const comment = await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
    },
  });

  if (!idAdmin && comment.authorId !== authorId) {
    throw new Error("You are not authorized to delete this comment");
  }

  const deletedComment = await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });

  return deletedComment;
};

export const commentService = {
  createCommentIntoDB,
  getSingleCommentByPostIdFromDB,
  getCommentsByAuthorIdFromDB,
  updateCommentIntoDB,
  updateCommentModerationIntoDB,
  deleteCommentFromDB,
  getSingleCommentByCommentIdFromDB,
};
