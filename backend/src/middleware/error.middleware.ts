import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/appError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const handleZodError = (err: ZodError) => {
  const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
  return new AppError(`Invalid input data: ${message}`, 400);
};

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  if (err.code === "P2002") {
    return new AppError("Duplicate field value: please use another value!", 400);
  }
  if (err.code === "P2025") {
    return new AppError("Record not found!", 404);
  }
  return new AppError(`Database error: ${err.message}`, 500);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  if (err instanceof ZodError) error = handleZodError(err);
  if (err instanceof Prisma.PrismaClientKnownRequestError) error = handlePrismaError(err);

  // Development Error Response
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production Error Response
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};
