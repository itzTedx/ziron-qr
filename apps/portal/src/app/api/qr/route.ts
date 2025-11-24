import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { z } from "@ziron/validators";

import { DEFAULT_BGCOLOR, DEFAULT_FGCOLOR, DEFAULT_LEVEL, DEFAULT_MARGIN } from "@/lib/qr/constants";
import { QRCodeSVG } from "@/lib/qr/utils";

export const runtime = "edge";

const CORS_HEADERS = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
});

const qrCodeQuerySchema = z.object({
  url: z.url("Invalid URL format"),
  size: z.coerce.number().int().min(100).max(2000).optional().default(600),
  level: z.enum(["L", "M", "Q", "H"]).optional().default(DEFAULT_LEVEL),
  fgColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format. Use hex format like #000000")
    .optional()
    .default(DEFAULT_FGCOLOR),
  bgColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format. Use hex format like #FFFFFF")
    .optional()
    .default(DEFAULT_BGCOLOR),
  margin: z.coerce.number().int().min(0).max(10).optional().default(DEFAULT_MARGIN),
  logo: z.url().optional(),
  hideLogo: z.coerce.boolean().optional().default(false),
});

function getSearchParams(url: string): Record<string, string> {
  const searchParams = new URL(url).searchParams;
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

function handleAndReturnErrorResponse(error: unknown, headers: Headers): Response {
  if (error instanceof z.ZodError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...Object.fromEntries(headers),
        "Content-Type": "application/json",
      },
    });
  }

  if (error instanceof Error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...Object.fromEntries(headers),
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Internal server error" }), {
    status: 500,
    headers: {
      ...Object.fromEntries(headers),
      "Content-Type": "application/json",
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const paramsParsed = qrCodeQuerySchema.parse(getSearchParams(req.url));

    const { logo, url, size, level, fgColor, bgColor, margin, hideLogo } = paramsParsed;

    const qrCodeLogo = hideLogo ? undefined : logo;

    return new ImageResponse(
      QRCodeSVG({
        value: url,
        size,
        level,
        fgColor,
        bgColor,
        margin,
        ...(qrCodeLogo
          ? {
              imageSettings: {
                src: qrCodeLogo,
                height: size / 4,
                width: size / 4,
                excavate: true,
              },
            }
          : {}),
        isOGContext: true,
      }),
      {
        width: size,
        height: size,
        headers: CORS_HEADERS,
      }
    );
  } catch (error) {
    return handleAndReturnErrorResponse(error, CORS_HEADERS);
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
