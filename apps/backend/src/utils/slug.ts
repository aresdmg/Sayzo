import { nanoid } from "nanoid";

const MAX_SLUG_LENGTH = 70;
const HASH_LENGTH = 8;

function normalizeText(text: string) {
    return text
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "");
}

function slugify(text: string) {
    return normalizeText(text)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function makeSlug(title: string) {
    const hash = nanoid(HASH_LENGTH).toLowerCase();
    const reserved = HASH_LENGTH + 1;

    let base = slugify(title);

    if (base.length > MAX_SLUG_LENGTH - reserved) {
        base = base
            .slice(0, MAX_SLUG_LENGTH - reserved)
            .replace(/-+$/, "");

        const lastDash = base.lastIndexOf("-");
        if (lastDash > 20) {
            base = base.slice(0, lastDash);
        }
    }

    return `${base}-${hash}`;
}