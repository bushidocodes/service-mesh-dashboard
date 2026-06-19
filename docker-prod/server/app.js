import express from "express";
import morgan from "morgan";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { promisify } from "util";
import { readFile as fsReadFile } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const readFile = promisify(fsReadFile);
const fabricServer =
  process.env.FABRIC_SERVER ||
  "https://edge.deciphernow.com/services/discovery-service/1.0/";

const app = express();

// Rate-limit all requests. Every route here (the static asset middleware and
// the catch-all below) touches the file system, so an unbounded request rate
// is a DoS vector — CodeQL flags the catch-all as js/missing-rate-limiting.
// The window is generous: an SPA legitimately fires many asset requests per
// page load, so this only bounds abusive clients, not normal browsing.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // requests per window per IP
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

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
