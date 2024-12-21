// app/utils/api.ts
import { Response } from "node-fetch";
import { Logger } from "./logger";

export const handleApiError = (error: any, message: string, status = 500) => {
    Logger.error(message, error)
  return new Response(
    JSON.stringify({ error: message, details: error?.message || error }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};
