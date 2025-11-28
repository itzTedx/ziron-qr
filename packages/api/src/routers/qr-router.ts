import { z } from "zod";

import { protectedProcedure } from "..";

/**
 * Get base URL from request
 */
function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

/**
 * Fetch QR code from Next.js API route and convert to base64
 */
async function fetchQRCodeFromAPI(
  baseUrl: string,
  url: string,
  size: number,
  margin: number,
  fgColor: string,
  bgColor: string,
  level?: string,
  logo?: string,
  hideLogo?: boolean
): Promise<string> {
  // Build query parameters
  const params = new URLSearchParams({
    url,
    size: size.toString(),
    margin: margin.toString(),
    fgColor,
    bgColor,
  });

  if (level) {
    params.append("level", level);
  }
  if (logo) {
    params.append("logo", logo);
  }
  if (hideLogo !== undefined) {
    params.append("hideLogo", hideLogo.toString());
  }

  // Fetch from Next.js API route
  const apiUrl = `${baseUrl}/api/qr?${params.toString()}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch QR code: ${response.status} ${errorText}`);
  }

  // Convert image response to base64
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");

  return `data:image/png;base64,${base64}`;
}

export const generateQR = protectedProcedure
  .route({
    method: "GET",
    path: "/qr",
    summary: "Generate QR code",
    description: "Generate a QR code PNG image for the given URL, similar to api.dub.co/qr",
    tags: ["qr"],
  })
  .input(
    z.object({
      url: z.string().url("Invalid URL format"),
      size: z.number().int().min(100).max(2000).optional().default(600),
      margin: z.number().int().min(0).max(10).optional().default(2),
      fgColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format. Use hex format like #000000")
        .optional()
        .default("#000000"),
      bgColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format. Use hex format like #FFFFFF")
        .optional()
        .default("#FFFFFF"),
      level: z.enum(["L", "M", "Q", "H"]).optional(),
      logo: z.string().url().optional(),
      hideLogo: z.boolean().optional().default(false),
    })
  )
  .output(z.string()) // Base64 encoded PNG
  .handler(async ({ input, context, errors }) => {
    try {
      const baseUrl = getBaseUrl(context.request);
      const dataUrl = await fetchQRCodeFromAPI(
        baseUrl,
        input.url,
        input.size,
        input.margin,
        input.fgColor,
        input.bgColor,
        input.level,
        input.logo,
        input.hideLogo
      );

      return dataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: error instanceof Error ? error.message : "Failed to generate QR code",
      });
    }
  });
