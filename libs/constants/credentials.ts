export interface PoolUser {
    username: string;
    password: string;
    displayName: string;
}

export const sozialMitarbeiterPool: PoolUser[] = [
    { username: "bern.sozialarbeiterin1a@diartis.ch", password: "SMze97-jkSJ59!F.", displayName: "Bern Sozialarbeiterin 1A" },
    { username: "bern.sozialarbeiterin1B@diartis.ch", password: "VUrh27!yxJA95?W.", displayName: "Bern Sozialarbeiterin 1B" }
];

export function getPoolUser(pool: PoolUser[]): PoolUser {
    const idx = parseInt(process.env.PW_WORKER_INDEX || "0", 10);
    return pool[idx % pool.length];
}

export const TestUsers = {
    get SOZIALARBEITERIN() {
        const u = getPoolUser(sozialMitarbeiterPool);
        return { username: u.username, password: u.password };
    },
    // SOZIALARBEITERIN: {
    //     username: "bern.sozialarbeiterin1a@diartis.ch",
    //     password: "SMze97-jkSJ59!F."
    // },
    SACHBEARBEITERIN: {
        username: "Bern.Sachbearbeiterin@diartis.ch",
        password: "XXxa22?pdTA66-S@"
    },
    GEMEINDE_MA: {
        username: "aventis-gemeinde-ma@diartis.ch",
        password: "#xFymiADPk7wJG/FWMz"
    },
    BUCHHALTER: {
        username: "Bern.Buchhalter@diartis.ch",
        password: "HBcc73+ppTX42?E."
    },
    AMTSLEITER: {
        username: "aventis-test-aml@diartis.ch",
        password: "E7Qr=3cTiz$8Q!"
    },
    KANTONS_MA: {
        username: "aventis-kantons-ma@diartis.ch",
        password: "W9qc8*fNzt!nGAD2udZc"
    },
    SUPERUSER: {
        username: "aventis-e2e_superuser_1@diartis.ch",
        password: "QJxw78?nmVD56!T+"
    }
};

export type TestUserKey = keyof typeof TestUsers;
