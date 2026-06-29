import { NextFunction, Request, Response } from "express";

const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  res.status(404).json({
    message: "Route not found.",
    path: req.originalUrl,
  });
};

export default notFound;
