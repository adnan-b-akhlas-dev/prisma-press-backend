import { NextFunction, Request, Response } from "express";
import { Prisma } from "../prisma/generated/prisma/client";
import status from "http-status";
import { AppError } from "../helpers/AppError";

const globalError = async (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let name = "Internal Server Error";
  let message = "Something went wrong";
  let error: unknown = null;

  // Generic JS Error (base fallback)
  if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    name = err.name;
    message = err.message;
    error = err.stack;
  }

  //  Prisma: query engine validation (wrong field name, wrong type, etc.)
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    name = err.name;
    error = err.stack;

    const raw = err.message;

    // Unknown field: `Unknown field 'xyz' for type 'User'`
    const unknownField = raw.match(
      /Unknown field [`'"](\w+)[`'"] for type [`'"](\w+)[`'"]/,
    );
    if (unknownField) {
      message = `Unknown field '${unknownField[1]}' on model '${unknownField[2]}'`;
    }

    // Unknown argument: `Unknown arg 'xyz' in ...`
    else if (raw.includes("Unknown arg")) {
      const unknownArg = raw.match(/Unknown arg [`'"](\w+)[`'"]/);
      message = unknownArg
        ? `Unknown argument '${unknownArg[1]}' provided`
        : "Unknown argument provided in query";
    }

    // Invalid value type: `Got invalid value 'xyz' on prisma.model; Expected Type`
    else if (raw.includes("Got invalid value")) {
      const invalidValue = raw.match(
        /Got invalid value (.+?) on prisma\.(\w+).*?Expected (\w+)/s,
      );
      message = invalidValue
        ? `Invalid value on '${invalidValue[2]}': expected type '${invalidValue[3]}'`
        : "Invalid value type provided in query";
    }

    // Missing required field: `Argument 'xyz' is missing`
    else if (raw.includes("is missing")) {
      const missingArg = raw.match(/Argument [`'"]?(\w+)[`'"]? is missing/);
      message = missingArg
        ? `Required argument '${missingArg[1]}' is missing`
        : "A required argument is missing in query";
    }

    // Null provided for required field
    else if (raw.includes("Expected") && raw.includes("provided Null")) {
      const nullField = raw.match(
        /Argument [`'"]?(\w+)[`'"]?.*?provided Null/s,
      );
      message = nullField
        ? `Field '${nullField[1]}' cannot be null`
        : "A required field received a null value";
    }

    // Unknown model
    else if (raw.includes("Unknown model")) {
      const unknownModel = raw.match(/Unknown model [`'"](\w+)[`'"]/);
      message = unknownModel
        ? `Unknown model '${unknownModel[1]}'`
        : "An unknown model was referenced";
    }

    // Fallback: first meaningful non-stack line
    else {
      const firstLine = raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .find((l) => !l.startsWith("at "));
      message = firstLine ?? "Invalid query input";
    }
  }

  // Prisma: known request errors (db constraints, not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    name = err.name;
    error = err.stack;

    switch (err.code) {
      // Unique constraint violation
      case "P2002": {
        const fields = (err.meta?.target as string[])?.join(", ") ?? "unknown";
        statusCode = status.CONFLICT;
        message = `Unique constraint failed on field(s): ${fields}`;
        break;
      }

      // Foreign key constraint violation
      case "P2003":
        statusCode = status.BAD_REQUEST;
        message = `Foreign key constraint failed on field: ${err.meta?.field_name ?? "unknown"}`;
        break;

      // Record not found (findUniqueOrThrow / findFirstOrThrow)
      case "P2025":
        statusCode = status.NOT_FOUND;
        message =
          (err.meta?.cause as string) ?? "Requested record does not exist";
        break;

      // Required relation not found
      case "P2018":
        statusCode = status.NOT_FOUND;
        message = "Required related record was not found";
        break;

      // Null constraint violation
      case "P2011":
        statusCode = status.BAD_REQUEST;
        message = `Null constraint violation on: ${err.meta?.constraint ?? "unknown"}`;
        break;

      // Value too long for column
      case "P2000":
        statusCode = status.BAD_REQUEST;
        message = `Value too long for column: ${err.meta?.column_name ?? "unknown"}`;
        break;

      // Record to update/delete not found
      case "P2001":
        statusCode = status.NOT_FOUND;
        message = "Record to update or delete does not exist";
        break;

      // Relation violation
      case "P2014":
        statusCode = status.BAD_REQUEST;
        message = `Relation violation: ${err.meta?.relation_name ?? "unknown"}`;
        break;

      // Inconsistent column data
      case "P2023":
        statusCode = status.BAD_REQUEST;
        message = `Inconsistent column data: ${err.meta?.message ?? "unknown"}`;
        break;

      default:
        statusCode = status.BAD_REQUEST;
        message = err.message;
    }
  }

  // Prisma: unknown request errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    name = err.name;
    message = "Unknown database request error";
    error = err.stack;
  }

  //  Prisma: connection / initialization errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = status.SERVICE_UNAVAILABLE;
    name = err.name;
    message = "Database connection failed: " + err.message;
    error = err.stack;
  }

  //  Prisma: Rust panic (engine crash)
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    name = err.name;
    message = "A critical database engine error occurred";
    error = err.stack;
  }

  //  Syntax errors (bad JSON body, etc.)
  if (err instanceof SyntaxError && "body" in err) {
    statusCode = status.BAD_REQUEST;
    name = "SyntaxError";
    message = "Invalid JSON in request body";
    error = err.stack;
  }

  //  Custom App Error (extend this class in your app)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    name = err.name;
    message = err.message;
    error = err.stack;
  }

  res.status(statusCode).json({
    status: false,
    statusCode,
    name,
    message,
    ...(process.env.NODE_ENV !== "production" && { error: error }),
  });
};

export default globalError;
