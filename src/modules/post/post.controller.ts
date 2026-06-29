import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id as string;

    const result = await postService.createPostIntoBD(payload, userId);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  },
);

const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!postId) {
      return next({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Post ID is required",
      });
    }
    const result = await postService.getSinglePostFromDB(postId as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post retrieved successfully",
      data: result,
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await postService.getMyPostsFromDB(authorId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My posts retrieved successfully",
      data: result,
    });
  },
);

const updateMyPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req?.user?.id as string;
    const isAdmin = req?.user?.role === "ADMIN";
    const { postId } = req.params;
    const payload = req.body;

    if(!postId){
      throw new Error("Post ID is required");
    }

    const result = await postService.updateMyPostIntoDB(
      postId as string,
      payload,
      authorId,
      isAdmin,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  },
);

const deleteMyPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req?.user?.id as string;
    const isAdmin = req?.user?.role === "ADMIN";
    const { postId } = req.params;

    if(!postId){
      throw new Error("Post ID is required");
    }

     await postService.deleteMyPostFromDB(
      postId as string,
      authorId,
      isAdmin,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post deleted successfully",
      data: null,
    });
  },
);

const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post stats retrieved successfully",
      data: result,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPosts,
  updateMyPost,
  deleteMyPost,
  getPostStats,
};
