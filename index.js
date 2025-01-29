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
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    headers: "*",
    credentials: false,
  };

  const settings = { ...defaults, ...options };
  const typeOfOrigin = typeof settings.origin;

  // Ensure methods are always an array
  if (typeof settings.methods === "string") {
    settings.methods = settings.methods
      .split(",")
      .map((m) => m.trim().toUpperCase());
  }

  // Validate methods array
  const validMethods = [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE",
    "OPTIONS",
  ];
  settings.methods = settings.methods.filter((method) =>
    validMethods.includes(method.toUpperCase())
  );

  return (req, res, next) => {
    const requestOrigin = req.headers.origin;

    // Set allowed origin
    if (typeOfOrigin === "string") {
      res.setHeader("Access-Control-Allow-Origin", settings.origin);
    }

    if (Array.isArray(settings.origin)) {
      if (settings.origin.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      }
    }

    // Restrict methods if needed (but never block OPTIONS)
    if (settings.methods && settings.methods.length) {
      const allowedMethods = settings.methods.join(", ");
      res.setHeader("Access-Control-Allow-Methods", allowedMethods);

      // If the requested method is not in the allowed methods (and not OPTIONS), block it
      if (req.method !== "OPTIONS" && !settings.methods.includes(req.method)) {
        return res.status(405).send(`Method ${req.method} Not Allowed`);
      }
    }

    // Set allowed headers
    res.setHeader("Access-Control-Allow-Headers", settings.headers);

    // Handle credentials
    if (settings.credentials) {
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    // Handle preflight requests (OPTIONS method)
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}
