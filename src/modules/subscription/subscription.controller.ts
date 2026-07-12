import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;

    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let event = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;
    console.log(signature, event);

    await subscriptionService.handleWebhook(event, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Web hook triggered successfully",
      data: null,
    });
  },
);

const getSubscriptionStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await subscriptionService.getSubscriptionStatus(userId);

    sendResponse(res, {
      success: true,
      message: "Subscription status fetched successfully",
      statusCode: HttpStatus.OK,
      data: result,
    });
  },
);

export const subscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
};
