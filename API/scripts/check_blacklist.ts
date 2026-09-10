import { generateAccessToken, verifyAccessToken, revokeToken } from "../src/utils/jwt";

async function run() {
  console.log("Starting Redis blacklist check...");

  const token = generateAccessToken({ userId: "test-user", role: "USER" });
  console.log("Generated token:", token.slice(0, 40) + "...");

  await revokeToken(token);
  console.log("Token revoked in Redis.");

  try {
    await verifyAccessToken(token);
    console.error("FAIL: revoked token was accepted by verifyAccessToken.");
    process.exit(1);
  } catch (err: any) {
    console.log("PASS: revoked token rejected by verifyAccessToken. Message:", err.message);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Error running blacklist check:", err);
  process.exit(2);
});
