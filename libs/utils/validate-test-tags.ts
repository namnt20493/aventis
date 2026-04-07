import * as fs from "fs";
import * as path from "path";

interface TagRequirement {
    directory: string;
    requiredTag: string;
    displayName: string;
}

const TAG_REQUIREMENTS: TagRequirement[] = [
    {
        directory: "staticTestcases/Keywordvalidation",
        requiredTag: "@keywordValidation",
        displayName: "Keyword Validation"
    },
    {
        directory: "staticTestcases/Journey",
        requiredTag: "@journey",
        displayName: "Journey"
    },
    {
        directory: "staticTestcases/FunctionalUI",
        requiredTag: "@functionalUI",
        displayName: "Functional UI"
    },
    {
        directory: "staticTestcases/Acceptance",
        requiredTag: "@acceptance",
        displayName: "Acceptance"
    }
];

interface ValidationError {
    file: string;
    requirement: TagRequirement;
}

function findTestFilesRecursive(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            files.push(...findTestFilesRecursive(fullPath));
        } else if (item.isFile() && item.name.endsWith(".spec.ts")) {
            files.push(fullPath);
        }
    }

    return files;
}

function findTestFiles(directory: string): string[] {
    return findTestFilesRecursive(directory);
}

function hasRequiredTag(filePath: string, requiredTag: string): boolean {
    const content = fs.readFileSync(filePath, "utf-8");

    // Regex that handles nested brackets in ADO tags like @[181252]
    const tagRegex = /tag:\s*\[((?:[^[\]]*|\[[^\]]*\])*)\]/;
    const match = content.match(tagRegex);

    if (!match) {
        return false;
    }

    const tagsContent = match[1];

    const normalizedRequired = requiredTag.toLowerCase();
    const normalizedContent = tagsContent.toLowerCase();

    return normalizedContent.includes(`"${normalizedRequired}"`) || normalizedContent.includes(`'${normalizedRequired}'`);
}

function validateTestTags(): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const requirement of TAG_REQUIREMENTS) {
        const testFiles = findTestFiles(requirement.directory);

        for (const file of testFiles) {
            if (!hasRequiredTag(file, requirement.requiredTag)) {
                errors.push({ file, requirement });
            }
        }
    }

    return errors;
}

function main() {
    console.log("🔍 Validating test tags...\n");

    const errors = validateTestTags();

    if (errors.length === 0) {
        console.log("✅ All test files have the required tags!");
        process.exit(0);
    }

    console.error("❌ Test tag validation failed!\n");
    console.error("The following test files are missing required tags:\n");

    const errorsByRequirement = new Map<TagRequirement, string[]>();

    for (const error of errors) {
        if (!errorsByRequirement.has(error.requirement)) {
            errorsByRequirement.set(error.requirement, []);
        }
        errorsByRequirement.get(error.requirement)!.push(error.file);
    }

    for (const [requirement, files] of errorsByRequirement) {
        console.error(`\n📁 ${requirement.displayName} tests (${requirement.directory})`);
        console.error(`   Required tag: ${requirement.requiredTag}\n`);

        for (const file of files) {
            console.error(`   - ${file}`);
        }
    }

    console.error("\n💡 To fix: Add the required tag to the test() function:");
    console.error('   test("Test Name", { tag: ["@RequiredTag", ...] }, async ({ ... }) => { ... });');
    console.error("\n");

    process.exit(1);
}

main();
