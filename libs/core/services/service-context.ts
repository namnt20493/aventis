import { Page } from "@playwright/test";
import { StabilityHelper } from "@utils/stability-helper";
import { IServiceContext } from "@core/interfaces";
import { IStabilityService } from "@core/interfaces";

const contextCache = new WeakMap<Page, ServiceContext>();

export class ServiceContext implements IServiceContext {
    readonly stability: IStabilityService;

    constructor(stability: IStabilityService) {
        this.stability = stability;
    }

    static for(page: Page): ServiceContext {
        let ctx = contextCache.get(page);
        if (!ctx) {
            ctx = new ServiceContext(new StabilityHelper(page));
            contextCache.set(page, ctx);
        }
        return ctx;
    }
}
