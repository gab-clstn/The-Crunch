// upload-plugin.js
// Place this file in your project ROOT (same level as vite.config.js)
//
// vite.config.js:
//   import { uploadPlugin } from "./upload-plugin.js";
//   export default defineConfig({ plugins: [react(), uploadPlugin()] });
//
// Install dependency: npm install multiparty

import fs from "fs";
import path from "path";
import multiparty from "multiparty";

export function uploadPlugin() {
    return {
        name: "upload-image",
        configureServer(server) {
            server.middlewares.use("/upload-image", (req, res) => {
                if (req.method !== "POST") {
                    res.statusCode = 405;
                    return res.end("Method Not Allowed");
                }

                const form = new multiparty.Form();

                form.parse(req, (err, fields, files) => {
                    if (err) {
                        res.statusCode = 500;
                        return res.end(err.message);
                    }

                    try {
                        const file = files.image[0];
                        const rawName = fields.name[0];

                        // Sanitize filename
                        const safeName = rawName
                            .trim()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-zA-Z0-9\-_]/g, "");

                        const ext = path.extname(file.originalFilename) || ".png";
                        // Append timestamp to bust browser cache on re-upload
                        const timestamp = Date.now();
                        const fileName = `${safeName}-${timestamp}${ext}`;

                        // Save to src/assets/images
                        const destDir = path.resolve("src/assets/images");
                        const destPath = path.join(destDir, fileName);

                        fs.mkdirSync(destDir, { recursive: true });
                        fs.copyFileSync(file.path, destPath);

                        try { fs.unlinkSync(file.path); } catch (_) {}

                        // ✅ Vite serves src/ files at /src/... in dev mode
                        const publicUrl = `/src/assets/images/${fileName}`;

                        res.setHeader("Content-Type", "application/json");
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.end(JSON.stringify({ path: publicUrl, ok: true }));
                    } catch (copyErr) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: copyErr.message }));
                    }
                });
            });
        },
    };
}