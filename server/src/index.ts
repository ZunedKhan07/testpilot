import dns from "dns";
// Node.js ko Google DNS enforce karwao (SRV resolution fixed)
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import connect_DB from "./config/db.js";

dotenv.config();

connect_DB();

const app = express();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`\n ✅ Server running on http://localhost:${port}`);  
})