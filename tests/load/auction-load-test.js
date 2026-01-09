import http from "k6/http";
import { check, sleep } from "k6";
import sql from "k6/x/sql";
import driver from "k6/x/sql/driver/postgres";

// Database connection configuration
// Adjust connection string as needed: postgres://user:password@host:port/database?sslmode=disable
// Set DATABASE_URL env var or update the default below with your credentials
const connectionString =
  __ENV.DATABASE_URL ||
  "postgres://omarkhaled@localhost:5432/adexchange?sslmode=disable";

// Open database connection (xk6-sql v1.0+ requires driver object, not string)
const db = sql.open(driver, connectionString);

export const options = {
  stages: [
    { duration: "30s", target: 50 }, // Ramp up to 50 users
    { duration: "1m", target: 100 }, // Hold at 100 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% failures
  },
};

// Setup function runs once before the test starts
// Fetches all active publishers and their ad slots from the database
export function setup() {
  // Fetch publishers with their ad slots (xk6-sql v1.0+ uses db.query() directly)
  // Cast UUIDs to TEXT to avoid binary encoding issues
  const results = db.query(
    `SELECT 
      p.id::text as publisher_id, 
      p.domain,
      a.id::text as ad_slot_id,
      a.slot_type,
      a.floor_price
    FROM publishers p
    JOIN ad_slots a ON a.publisher_id = p.id
    WHERE p.status = 'active' AND a.status = 'active'`
  );

  const publisherData = [];
  for (const row of results) {
    publisherData.push({
      publisherId: row.publisher_id,
      domain: row.domain,
      adSlotId: row.ad_slot_id,
      adSlotType: row.slot_type,
      floorPrice: parseFloat(row.floor_price) || 0.01,
    });
  }

  if (publisherData.length === 0) {
    console.warn(
      "No active publishers with ad slots found! Using fallback data."
    );
    // Fallback to original hardcoded data if no publishers found
    publisherData.push({
      publisherId: "62c51d2b-4523-40b9-a6fb-ae4dd50fbf7b",
      domain: "medium.com",
      adSlotId: "fb2df6c2-dd7f-4160-8f7f-2f68c60e814d",
      adSlotType: "banner",
      floorPrice: 0.01,
    });
  }

  console.log(`Loaded ${publisherData.length} publisher/ad-slot combinations`);
  return { publisherData };
}

// Main test function - runs for each virtual user iteration
export default function (data) {
  // Select a random publisher/ad-slot combination
  const randomIndex = Math.floor(Math.random() * data.publisherData.length);
  const selected = data.publisherData[randomIndex];

  const payload = JSON.stringify({
    publisherId: selected.publisherId,
    domain: selected.domain,
    adSlotId: selected.adSlotId,
    adSlotType: selected.adSlotType,
    floorPrice: selected.floorPrice,
    userContext: {
      device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
      browser: ["Chrome", "Firefox", "Safari", "Edge"][
        Math.floor(Math.random() * 4)
      ],
    },
  });

  const res = http.post("http://localhost:3003/api/auctions", payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has auctionId": (r) => r.json("auctionId") !== "",
  });

  sleep(1);
}

// Teardown function runs once after the test completes
export function teardown() {
  db.close();
}
