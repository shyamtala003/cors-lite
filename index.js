/**
 * CORS middleware for Node.js applications.
 * @typedef {Object} CorsOptions
 * @property {string|string[]|Function} [origin='*'] - Controls the `Access-Control-Allow-Origin` header.
 * @property {string|string[]} [methods='GET,HEAD,PUT,PATCH,POST,DELETE'] - Allowed HTTP methods.
 * @property {string|string[]} [headers='*'] - Controls the `Access-Control-Allow-Headers` header.
 * @property {boolean} [credentials=false] - Controls the `Access-Control-Allow-Credentials` header.
 */

/**
 * Creates a CORS middleware with the given options.
 * @param {CorsOptions} [options={}] - Configuration options for CORS.
 * @returns {Function} - Express middleware function.
 */
export default function cors(options = {}) {
  const defaults = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    headers: "*",
    credentials: false,
  };

  const settings = { ...defaults, ...options };
  const typeOfOrigin = typeof settings.origin;
  console.log(settings);

  return (req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (typeOfOrigin === "string") {
      res.setHeader("Access-Control-Allow-Origin", settings.origin);
    }

    if (Array.isArray(settings.origin)) {
      if (settings.origin.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      }
    }

    // Ensure methods are always an array
    if (typeof settings.methods === "string") {
      settings.methods = settings.methods
        .split(",")
        .map((m) => m.trim().toUpperCase());
    } else {
      settings.methods = defaults.methods;
    }

    res.setHeader("Access-Control-Allow-Methods", settings.methods.join(", "));
    res.setHeader("Access-Control-Allow-Headers", settings.headers);

    if (settings.credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}
