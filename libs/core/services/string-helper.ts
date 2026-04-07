export class StringHelper {
    static extractDossierName(text: string): string {
        if (!text) return text;
        const idx = text.indexOf("|");
        return idx === -1 ? text.trim() : text.substring(0, idx).trim();
    }

    static capitalizeFirstLetter(text: string): string {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static formatAhvNumber(ahv: string): string {
        const cleaned = ahv.replace(/\s+|\.|-/g, "");
        if (cleaned.length !== 13 || !/^\d+$/.test(cleaned)) return ahv;
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 7)}.${cleaned.slice(7, 11)}.${cleaned.slice(11, 13)}`;
    }

    static formatIban(iban: string): string {
        const cleaned = iban.replace(/\s/g, "").toUpperCase();
        const countryAndCheck = cleaned.slice(0, 4);
        const rest = cleaned.slice(4);
        const groups = rest.match(/.{1,4}/g) || [];
        return `${countryAndCheck} ${groups.join(" ")}`;
    }

    static removeWhitespace(text: string): string {
        return text.replace(/\s+/g, "");
    }

    static normalizeWhitespace(text: string): string {
        return text.replace(/\s+/g, " ").trim();
    }

    static extractNumber(input: string): number | null {
        const match = input.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : null;
    }

    static getFileName(path: string): string {
        const normalizedPath = path.replace(/\\/g, "/");
        const parts: string[] = normalizedPath.split("/");
        return parts.pop() || "";
    }

    static reverseCommaSeparated(input: string): string {
        const segments = input.split(", ");
        return segments.reverse().join(" ");
    }

    static separateText(text: string | undefined | null): string[] {
        if (text === undefined || text === null || text === "") return [];
        return text.split(",").map((item) => item.trim());
    }
}
