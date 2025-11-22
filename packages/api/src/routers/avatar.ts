import { z } from "zod";

import { publicProcedure } from "..";
import { getAvatar as fetchAvatar } from "../utils/get-avatar";
import { generateGradient } from "../utils/gradient";

export const getAvatarV1 = publicProcedure
  .route({
    method: "GET",
    path: "/v1/avatar",
    summary: "Generate an avatar",
    description: "Generate an SVG avatar with gradient background based on a name",
    tags: ["avatar"],
    operationId: "ping",
    deprecated: true,
  })
  .input(
    z.object({
      name: z.string().min(1),
      text: z.string().optional(),
      size: z.number().int().min(1).max(1000).default(120),
      rounded: z.number().int().min(0).default(0),
    })
  )
  .output(z.string())
  .handler(async ({ input }) => {
    const gradient = await generateGradient(input.name);

    const textElement = input.text
      ? `<text alignmentBaseline="central" dominantBaseline="central" fill="#fff" fontFamily="Geist, sans-serif" fontSize="34px" textAnchor="middle" x="50%" y="50%">${input.text}</text>`
      : "";

    const svg = `<svg height="${input.size}" version="1.1" viewBox="0 0 ${input.size} ${input.size}" width="${input.size}" xmlns="http://www.w3.org/2000/svg">
      <g>
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${gradient.fromColor}" />
            <stop offset="100%" stop-color="${gradient.toColor}" />
          </linearGradient>
        </defs>
        <rect fill="url(#gradient)" height="${input.size}" rx="${input.rounded}" ry="${input.rounded}" width="${input.size}" x="0" y="0" />
        ${textElement}
      </g>
    </svg>`;

    return svg;
  });

export const getAvatar = publicProcedure
  .route({
    method: "GET",
    path: "/v2/avatar",
    summary: "Get an avatar",
    description: "Get an SVG avatar with gradient background based on a name",
    tags: ["avatar"],
  })
  .input(
    z.object({
      name: z.string().min(1),
      text: z.string().optional(),
    })
  )
  .output(z.string())
  .handler(async ({ input }) => {
    return fetchAvatar(input.name, input.text);
  });
