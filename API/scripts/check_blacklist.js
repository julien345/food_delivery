"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../src/utils/jwt");
async function run() {
    console.log("Starting Redis blacklist check...");
    const token = (0, jwt_1.generateAccessToken)({ userId: "test-user", role: "USER" });
    console.log("Generated token:", token.slice(0, 40) + "...");
    await (0, jwt_1.revokeToken)(token);
    console.log("Token revoked in Redis.");
    try {
        await (0, jwt_1.verifyAccessToken)(token);
        console.error("FAIL: revoked token was accepted by verifyAccessToken.");
        process.exit(1);
    }
    catch (err) {
        console.log("PASS: revoked token rejected by verifyAccessToken. Message:", err.message);
        process.exit(0);
    }
}
run().catch((err) => {
    console.error("Error running blacklist check:", err);
    process.exit(2);
});
//# sourceMappingURL=check_blacklist.js.map