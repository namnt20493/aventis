import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

export default {
    testDir: "staticTestcases",
    reporter: [["html", { open: "never" }]]
};
