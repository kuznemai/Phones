import { SITE } from "~/data/site";

interface SeoInput {
  /** Page title without the brand suffix; empty on the home page. */
  title: string;
  description: string;
  /** Root-relative path of a representative image. */
  image?: string;
}

/**
 * Page metadata plus the canonical/OG tags a storefront needs. Thin on purpose —
 * it only removes the repetition of building absolute URLs on every page.
 */
export function useSeo({ title, description, image }: SeoInput): void {
  const route = useRoute();
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
  const canonical = `${siteUrl}${route.path === "/" ? "/" : route.path.replace(/\/$/, "")}`;
  const ogImage = `${siteUrl}${image ?? "/hero-phone.png"}`;
  const socialTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — privacy-focused smartphones`;

  useSeoMeta({
    title: title || null,
    description,
    ogTitle: socialTitle,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: socialTitle,
    twitterDescription: description,
    twitterImage: ogImage,
  });

  useHead({ link: [{ rel: "canonical", href: canonical }] });
}
