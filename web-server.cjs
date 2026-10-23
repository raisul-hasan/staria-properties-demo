const express = require("express");
const path = require("node:path");
const { existsSync } = require("node:fs");

const app = express();
const dist = path.join(__dirname, "frontend", "dist");
const index = path.join(dist, "index.html");

if (!existsSync(index)) {
  throw new Error("Frontend build not found. Run npm run build before npm start.");
}

app.disable("x-powered-by");
app.use(express.static(dist));

app.get("*", (_req, res) => {
  res.sendFile(index);
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`STARIA frontend listening on port ${port}`);
});
