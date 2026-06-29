import { NextFunction, Request, Response } from "express";
import status from "http-status";

const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  res.status(status.NOT_FOUND).json({
    success: false,
    statusCode: status.NOT_FOUND,
    message: "Route not found.",
    error: {
      path: req.originalUrl,
      method: req.method,
    },
    timestamp: new Date().toISOString(),
  });
};

export default notFound;
