import type { ModulesRequest, ModulesResponse } from "@medusajs/types";

export async function GET(
  req: ModulesRequest,
  res: ModulesResponse
): Promise<void> {
  res.status(200).json({ status: "ok" });
}
