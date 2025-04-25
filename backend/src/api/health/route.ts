import { Request, Response } from "express";

export async function GET(req: Request, res: Response): Promise<void> {
  res.status(200).json({ status: "ok" });
}
