import * as path from "path";

export class PathHelper {
    private static readonly testDataRoot = path.resolve(__dirname, "../../../testfiles");

    static getTestDataPath(relativePath: string): string {
        return path.join(this.testDataRoot, relativePath);
    }

    static getDocumentPath(filename: string): string {
        return path.join(this.testDataRoot, "documents", filename);
    }

    static getImagePath(filename: string): string {
        return path.join(this.testDataRoot, "images", filename);
    }
}
