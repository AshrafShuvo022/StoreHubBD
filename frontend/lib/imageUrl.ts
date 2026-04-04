/**
 * Cloudinary image URL transformer.
 *
 * Presets:
 *  card  — 600×600, smart-crop fill  (store grid, carousel, section rows)
 *  thumb — 200×200, smart-crop fill  (thumbnail strips)
 *  full  — 1000×1000, pad + white bg (product detail main image — no cropping)
 *
 * Non-Cloudinary URLs are returned unchanged.
 */

const TRANSFORMS: Record<string, string> = {
  card:  "w_600,h_600,c_fill,g_auto,q_auto,f_auto",
  thumb: "w_200,h_200,c_fill,g_auto,q_auto,f_auto",
  full:  "w_1000,h_1000,c_pad,b_white,q_auto,f_auto",
}

const CLOUDINARY_ORIGIN = "res.cloudinary.com"

export function getImageUrl(
  url: string | null | undefined,
  preset: keyof typeof TRANSFORMS = "card"
): string {
  if (!url) return ""
  if (!url.includes(CLOUDINARY_ORIGIN)) return url   // not Cloudinary — return as-is

  const transform = TRANSFORMS[preset]

  // URL shape: https://res.cloudinary.com/<cloud>/image/upload/[existing_transforms/]v.../public_id
  // If transforms are already present (e.g. /upload/w_500/...), strip them first
  // so we never stack duplicate transforms.
  const clean = url.replace(
    /\/image\/upload\/(?!v\d)([^/]+\/)*/,
    "/image/upload/"
  )

  return clean.replace("/image/upload/", `/image/upload/${transform}/`)
}
