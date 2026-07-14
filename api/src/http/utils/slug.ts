export class Slug {
    public value: string

    private constructor(value: string) {
        this.value = value
    }

    static create(value: string) {
        return new Slug(value)
    }

    /**
     * Creates a slug from a given string by normalizing it, converting to lowercase, trimming whitespace,
     * replacing spaces with hyphens, removing non-word characters, and collapsing multiple hyphens into one.
     * @param value string
     * @return Slug
     */
    static createFromText(value: string): Slug {
        const slug = value
            .normalize("NFKD")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/_/g, "-")
            .replace(/--+/g, "-")
            .replace(/-$/g, "")

        return new Slug(slug)
    }
}
