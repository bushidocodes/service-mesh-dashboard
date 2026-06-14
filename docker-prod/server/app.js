import express from "express";
import morgan from "morgan";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { promisify } from "util";
import { readFile as fsReadFile } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const readFile = promisify(fsReadFile);
const fabricServer =
  process.env.FABRIC_SERVER ||
  "https://edge.deciphernow.com/services/discovery-service/1.0/";

const app = express();

// Setup Gzip compression of response bodies
// Note: This might be better done at the NGINX level
// via ngx_http_gzip_module
app.use(compression());

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

// Serve static assets, and do not automatically direct to the index
app.use(express.static(resolve(__dirname, "build"), { index: false }));

// Always return the main index.html, so react-router render the route in the client
app.get("*", (req, res) => {
  readFile(resolve(__dirname, "build", "index.html"), "utf8")
    .then((data) => data.replace(/__FABRIC_SERVER__/g, fabricServer))
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

export default app;
