require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function exportDatabase() {
    try {
        console.log(process.env.PORT)
        // Match the variable in your config/connect.js
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const db = mongoose.connection.db;

        console.log(`Connected to: ${db.databaseName}`);

        const collections = await db
            .listCollections({}, { nameOnly: true })
            .toArray();

        const backup = {
            database: db.databaseName,
            exportedAt: new Date().toISOString(),
            collections: {}
        };

        for (const item of collections) {
            console.log(`Exporting ${item.name}...`);

            backup.collections[item.name] = await db
                .collection(item.name)
                .find({})
                .toArray();
        }

        const outputPath = path.join(
            __dirname,
            `mongodb-backup-${Date.now()}.json`
        );

        fs.writeFileSync(
            outputPath,
            JSON.stringify(backup, null, 2),
            "utf8"
        );

        console.log("Export successful!");
        console.log(`Collections: ${collections.length}`);
        console.log(`File saved: ${outputPath}`);

    } catch (error) {
        console.error("Export failed:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

exportDatabase();