import { test } from "@libs/test-fixtures";
import { CommonKeyword } from "@libs/keywords";
import { DataBrowserkeyword } from "@keywords/dataBrowser-keyword";
import { TestUsers } from "@constants/credentials";

// INFRASTRUCTURE BLOCKER: DataBrowser runs on separate host (url2.databrowser.diartis)
// which is not accessible from test environment. Requires VPN/network configuration.
// Decision needed: Keep test if infrastructure can be fixed, or delete if DataBrowser is decommissioned.
test.skip(
    "DB01_DataBrowser_aufrufen - INFRASTRUCTURE BLOCKER",
    {
        tag: ["@keywordValidation", "@wip"]
    },
    async ({ page, seed, context, authenticatedRequest }) => {
        test.fixme(true, "DataBrowser URL (url2.databrowser.diartis) not reachable - requires VPN/network access");
        var commonKeyword = new CommonKeyword(page);
        var dataBrowserKeyword = new DataBrowserkeyword(page);

        // Login als Sozialarbeiterin

        await test.step("M01_LoginMSOnline", async () => {
            await commonKeyword.Stable_Login(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
        });

        // DB01: DataBrowser aufrufen und filtern
        await test.step("DB01_DataBrowser_aufrufen", async () => {
            await dataBrowserKeyword.DB01_DataBrowser_aufrufen({
                thema: "Ermittlungen",
                fitlerName: "Sozialarbeiter",
                fitlerValue: "",
                checkItemsEqualOrMore: 1
            });
        });
    }
);
