Detections API
===============

Small Express server that exposes recent entries from the `LogDetections` table.

Prereqs
-------
- Node.js 18+
- A MySQL database with a table `LogDetections(time, latitude, longitude)`
- Configure environment variables in a `.env` file or host environment. You can use `.env.example` as a starting point.

Environment variables
---------------------
Provide either a single URL or discrete fields:

- DATABASE_URL or MYSQL_URL or MYSQL_DATABASE_URL (e.g., `mysql://user:pass@host:3306/dbname`)
- or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
- Optional: PORT (defaults to 3000)

Install and run
---------------
1. Install dependencies
2. Start the server

Endpoints
---------
- GET `/health` -> `{ status: "ok" }`
- GET `/recent?limit=10` -> returns the top X recent entries ordered by `time` DESC

Example response
----------------
{
	"count": 2,
	"items": [
		{ "time": "2025-10-31T10:20:30.000Z", "latitude": 12.34, "longitude": 56.78 },
		{ "time": "2025-10-31T09:10:20.000Z", "latitude": 11.11, "longitude": 22.22 }
	]
}

"# fetch-data-from-database" 
