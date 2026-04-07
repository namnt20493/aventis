import * as ts from "typescript";
import * as path from "node:path";
import * as fs from "node:fs";
import { KeywordEntry, KeywordMethod, KeywordParameter } from "./types.js";

export function extractKeywordsFromFile(filePath: string): KeywordEntry | null {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) return null;

    const source = fs.readFileSync(absolutePath, "utf-8");
    const sourceFile = ts.createSourceFile(
        absolutePath,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );

    let className = "";
    const methods: KeywordMethod[] = [];

    function visit(node: ts.Node) {
        if (ts.isClassDeclaration(node) && node.name) {
            className = node.name.text;
            for (const member of node.members) {
                if (ts.isMethodDeclaration(member) && member.name) {
                    const method = extractMethod(member);
                    if (method) methods.push(method);
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    if (!className) return null;

    return {
        className,
        file: filePath.replace(/\\/g, "/"),
        methods
    };
}

function extractMethod(node: ts.MethodDeclaration): KeywordMethod | null {
    const name = node.name && ts.isIdentifier(node.name) ? node.name.text : "";
    if (!name || name === "constructor") return null;

    const parameters = extractParameters(node);
    return { name, parameters };
}

function extractParameters(node: ts.MethodDeclaration): KeywordParameter[] {
    const params: KeywordParameter[] = [];

    if (node.parameters.length === 0) return params;

    const firstParam = node.parameters[0];
    if (!firstParam) return params;

    if (ts.isObjectBindingPattern(firstParam.name)) {
        const binding = firstParam.name;
        const typeAnnotation = firstParam.type;
        const typeMap = typeAnnotation ? buildTypeMap(typeAnnotation) : new Map<string, string>();

        for (const element of binding.elements) {
            if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
                const paramName = element.name.text;
                const paramType = typeMap.get(paramName) || "any";
                const optional = !!element.initializer || paramType.endsWith(" | undefined");
                params.push({
                    name: paramName,
                    type: paramType.replace(" | undefined", ""),
                    optional
                });
            }
        }
    }

    return params;
}

function buildTypeMap(typeNode: ts.TypeNode): Map<string, string> {
    const map = new Map<string, string>();

    if (ts.isTypeLiteralNode(typeNode)) {
        for (const member of typeNode.members) {
            if (ts.isPropertySignature(member) && member.name && ts.isIdentifier(member.name)) {
                const name = member.name.text;
                const type = member.type ? typeToString(member.type) : "any";
                const optional = !!member.questionToken;
                map.set(name, optional ? `${type} | undefined` : type);
            }
        }
    }

    return map;
}

function typeToString(typeNode: ts.TypeNode): string {
    if (ts.isToken(typeNode)) {
        switch (typeNode.kind) {
            case ts.SyntaxKind.StringKeyword: return "string";
            case ts.SyntaxKind.NumberKeyword: return "number";
            case ts.SyntaxKind.BooleanKeyword: return "boolean";
            case ts.SyntaxKind.AnyKeyword: return "any";
            case ts.SyntaxKind.VoidKeyword: return "void";
        }
    }
    if (ts.isArrayTypeNode(typeNode)) {
        return `${typeToString(typeNode.elementType)}[]`;
    }
    if (ts.isUnionTypeNode(typeNode)) {
        return typeNode.types.map(typeToString).join(" | ");
    }
    if (ts.isLiteralTypeNode(typeNode)) {
        if (ts.isStringLiteral(typeNode.literal)) return `"${typeNode.literal.text}"`;
        if (ts.isNumericLiteral(typeNode.literal)) return typeNode.literal.text;
    }
    if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
        return typeNode.typeName.text;
    }
    return "any";
}

export function extractAllKeywords(keywordDir: string): KeywordEntry[] {
    const entries: KeywordEntry[] = [];
    const absDir = path.resolve(keywordDir);

    if (!fs.existsSync(absDir)) return entries;

    const files = fs.readdirSync(absDir).filter(f => f.endsWith("-keyword.ts") || f.endsWith("-keywords.ts"));

    for (const file of files) {
        const filePath = path.join(keywordDir, file);
        const entry = extractKeywordsFromFile(filePath);
        if (entry) entries.push(entry);
    }

    return entries;
}
