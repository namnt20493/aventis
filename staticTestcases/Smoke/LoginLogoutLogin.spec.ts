import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { TestUsers } from "@constants/credentials";

test(
    "LoginLogoutLogin",
    {
        tag: ["@[182220]", "@smoke", "@all"]
    },
    async ({ page, seed, context }) => {
        var commonKeyword = new CommonKeyword(page);

        await test.step("L00_URLAventis", async () => {
            await commonKeyword.L00_URLAventis({ url: "/" });
        });

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        await test.step("L03_LogoutAndLoginDiffAccount", async () => {
            await commonKeyword.Stable_LogoutAndLoginDiffAccount(TestUsers.SACHBEARBEITERIN.username, TestUsers.SACHBEARBEITERIN.password);
        });
    }
);
