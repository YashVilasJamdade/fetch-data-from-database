import express from "express";
import cors from "cors";
import morgan from "morgan";
import pool from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

// GET /recent?limit=10 -> Top X most recent entries by `time`
app.get("/recent", async (req, res) => {
	try {
		const limitRaw = req.query.limit;
		let limit = Number.parseInt(limitRaw ?? "10", 10);
		if (Number.isNaN(limit) || limit <= 0) limit = 10;
		if (limit > 1000) limit = 1000; // safety cap

		// Query the latest entries
		const sql = "SELECT `time`, `latitude`, `longitude` FROM `LogDetections` ORDER BY `time` DESC LIMIT ?";
		const [rows] = await pool.query(sql, [limit]);

		// Normalize time to ISO string if it's a Date object
		const normalized = rows.map((r) => ({
			time: r.time instanceof Date ? r.time.toISOString() : r.time,
			latitude: typeof r.latitude === "string" ? Number.parseFloat(r.latitude) : r.latitude,
			longitude: typeof r.longitude === "string" ? Number.parseFloat(r.longitude) : r.longitude,
		}));

		res.json({ count: normalized.length, items: normalized });
	} catch (err) {
		console.error("/recent error", err);
		res.status(500).json({ error: "Failed to fetch recent entries" });
	}
});

// Root route
app.get("/", (_req, res) => {
	res.json({ message: "Detections API", endpoints: ["GET /health", "GET /recent?limit=10"] });
});

// Global error handler (fallback)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
	console.error("Unhandled error:", err);
	res.status(500).json({ error: "Internal Server Error" });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

export default app;

