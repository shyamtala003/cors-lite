# cors-lite

A lightweight CORS middleware for Node.js applications. `cors-lite` provides essential Cross-Origin Resource Sharing (CORS) capabilities while maintaining a minimal footprint, making it a great alternative to the `cors` package.

## Installation

Install `cors-lite` using npm:

```sh
npm install cors-lite
```

## Usage

### Basic Setup

Import and use `cors-lite` in your Express application:

```javascript
import express from "express";
import cors from "cors-lite";

const app = express();

// Enable CORS with default settings
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "CORS enabled!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Custom Configuration

You can customize `cors-lite` by passing an options object:

```javascript
app.use(
  cors({
    origin: ["https://example.com", "https://another.com"],
    methods: "GET,POST", // Allow only GET and POST requests
    headers: "Content-Type, Authorization", // Allow specific headers
    credentials: true, // Enable cookies and authorization headers
  })
);
```

## Options

The middleware accepts the following options:

| Option        | Type                             | Default Value                                       | Description                                                                      |
| ------------- | -------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `origin`      | `string`, `string[]`, `Function` | `"*"`                                               | Specifies allowed origins. Accepts a string, an array of strings, or a function. |
| `methods`     | `string`, `string[]`             | `["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"]` | Specifies allowed HTTP methods.                                                  |
| `headers`     | `string`, `string[]`             | `"*"`                                               | Specifies allowed request headers.                                               |
| `credentials` | `boolean`                        | `false`                                             | If `true`, includes `Access-Control-Allow-Credentials: true` in the response.    |

## Handling Preflight Requests

CORS preflight requests (`OPTIONS` method) are automatically handled:

```javascript
app.options("/api", cors()); // Enable preflight for specific route
```

## Example: Dynamic Origin

You can use a function to dynamically determine the allowed origin:

```javascript
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://trusted.com", "https://secure.com"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
```

## Why Use cors-lite?

- 🏗 **Lightweight**: Smaller and more efficient than the `cors` package.
- 🚀 **Easy to Use**: Simple API with intuitive configuration.
- 🔄 **Flexible**: Supports dynamic origin handling and custom options.
- ✅ **Automatic Preflight Handling**: Seamlessly processes `OPTIONS` requests.

## License

MIT License
