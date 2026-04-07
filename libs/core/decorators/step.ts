import { test } from "@playwright/test";

function formatArgs(args: any[]): string {
    return args
        .map((a) => {
            if (typeof a === "string") return `"${a}"`;
            if (typeof a === "object" && a !== null) return "{...}";
            return String(a);
        })
        .join(", ");
}

function wrapWithStep(originalMethod: Function, methodName: string) {
    return async function (this: any, ...args: any[]) {
        const description = this.description ?? this.constructor.name;
        const stepName = `${description}.${methodName}(${formatArgs(args)})`;
        return await test.step(stepName, async () => {
            return await originalMethod.apply(this, args);
        });
    };
}

export function step(
    targetOrValue: any,
    contextOrPropertyKey: ClassMethodDecoratorContext | string,
    descriptor?: PropertyDescriptor
) {
    if (typeof contextOrPropertyKey === "object" && contextOrPropertyKey.kind === "method") {
        const context = contextOrPropertyKey;
        return wrapWithStep(targetOrValue, String(context.name));
    }

    if (descriptor && typeof descriptor.value === "function") {
        const propertyKey = contextOrPropertyKey as string;
        descriptor.value = wrapWithStep(descriptor.value, propertyKey);
        return descriptor;
    }

    return targetOrValue;
}
