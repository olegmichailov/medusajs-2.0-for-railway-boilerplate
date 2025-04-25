import type { MedusaRequest, MedusaResponse } from "@medusajs/types"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  res.status(200).json({ status: "ok" })
}
