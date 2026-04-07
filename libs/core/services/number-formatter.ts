export class NumberFormatter {
    static normalizeNumber(value: string): number {
        const cleaned = value.replace(/'/g, "").replace(",", ".");
        return parseFloat(cleaned);
    }

    static formatSwiss(value: number, decimalPlaces: number = 2): string {
        const isNegative = value < 0;
        const abs = Math.abs(value);
        const fixed = abs.toFixed(decimalPlaces);
        const [intPart, decPart] = fixed.split(".");
        const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        const result = decPart ? `${formatted}.${decPart}` : formatted;
        return isNegative ? `-${result}` : result;
    }

    static formatFrench(value: number, decimalPlaces: number = 2): string {
        const isNegative = value < 0;
        const abs = Math.abs(value);
        const fixed = abs.toFixed(decimalPlaces);
        const [intPart, decPart] = fixed.split(".");
        const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const result = decPart ? `${formatted}.${decPart}` : formatted;
        return isNegative ? `-${result}` : result;
    }

    static formatRegex(value: number, decimalPlaces: number = 2): RegExp {
        const swiss = NumberFormatter.formatSwiss(value, decimalPlaces);
        const french = NumberFormatter.formatFrench(value, decimalPlaces);
        return new RegExp(`${swiss}|${french}`, "i");
    }

    static formatGerman(value: number, decimalPlaces: number = 2): string {
        return value.toLocaleString("de-CH", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
        });
    }
}
