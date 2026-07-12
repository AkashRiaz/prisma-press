import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const authorId = req?.user?.id as string;

    const comment = await commentService.createCommentIntoDB(payload, authorId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  },
);

// const getSingleCommentByCommentId = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { commentId } = req.params;
//     // console.log(commentId, "commentId");
//     const result = await commentService.getSingleCommentByCommentIdFromDB(
//       commentId as string,
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Comment retrieved successfully",
//       data: result,
//     });
//   },
// );

const getSingleCommentByPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const result = await commentService.getSingleCommentByPostIdFromDB(
      postId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment retrieved successfully",
      data: result,
    });
  },
);

const getCommentsByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorId } = req.params;
    const comments = await commentService.getCommentsByAuthorIdFromDB(
      authorId as string,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authorId = req?.user?.id as string;
    const payload = req.body;

    const comment = await commentService.updateCommentIntoDB(
      commentId as string,
      authorId as string,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  },
);

const updateCommentModeration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const payload = req.body;

    const comment = await commentService.updateCommentModerationIntoDB(
      commentId as string,
      payload,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment moderation updated successfully",
      data: comment,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const authorId = req?.user?.id as string;
    const isAdmin = req?.user?.role === "ADMIN";
    const comment = await commentService.deleteCommentFromDB(
      commentId as string,
      authorId as string,
      isAdmin as boolean,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Comment deleted successfully",
      data: comment,
    });
  },
);

export const commentController = {
  createComment,
  getSingleCommentByPostId,
  getCommentsByAuthorId,
  updateComment,
  updateCommentModeration,
  deleteComment,
  // getSingleCommentByCommentId,
};
