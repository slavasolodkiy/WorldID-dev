import { Router } from "express";

const router = Router();

router.get("/ecosystem", async (req, res) => {
  res.json({
    verifiedHumans: 11200000,
    countriesActive: 160,
    registeredApps: 847,
    totalTransactions: 245000000,
    weeklyActiveUsers: 1800000,
    orbLocations: 312,
  });
});

router.get("/api-status", async (req, res) => {
  const now = new Date().toISOString();
  res.json([
    {
      name: "World ID Verification",
      endpoint: "/api/v1/verify",
      status: "operational",
      latencyMs: 48,
      uptime: 99.98,
      lastChecked: now,
    },
    {
      name: "IDKit Widget",
      endpoint: "idkit.worldcoin.org",
      status: "operational",
      latencyMs: 62,
      uptime: 99.97,
      lastChecked: now,
    },
    {
      name: "Developer Portal API",
      endpoint: "/api/v1",
      status: "operational",
      latencyMs: 34,
      uptime: 99.99,
      lastChecked: now,
    },
    {
      name: "MiniKit JS",
      endpoint: "minikit.worldcoin.org",
      status: "operational",
      latencyMs: 55,
      uptime: 99.96,
      lastChecked: now,
    },
    {
      name: "World App Bridge",
      endpoint: "app.worldcoin.org/bridge",
      status: "operational",
      latencyMs: 71,
      uptime: 99.94,
      lastChecked: now,
    },
    {
      name: "Credential Issuance",
      endpoint: "/api/v1/credentials",
      status: "operational",
      latencyMs: 88,
      uptime: 99.91,
      lastChecked: now,
    },
    {
      name: "Grant Distribution",
      endpoint: "/api/v1/grants",
      status: "operational",
      latencyMs: 103,
      uptime: 99.88,
      lastChecked: now,
    },
    {
      name: "Transaction Relay",
      endpoint: "/api/v1/transactions",
      status: "operational",
      latencyMs: 156,
      uptime: 99.85,
      lastChecked: now,
    },
  ]);
});

export default router;
