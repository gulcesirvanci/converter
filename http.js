const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
var child_process = require("child_process");

app.use(express.static("/Users/gulcesirvanci/Desktop/three.js/"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  //* Every origin that a request comes from is allowed, this can be restricted to specific ips like 'http:/website.com
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //The options request which is an HTTP method is always sent first and once by the browser
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json());

router.get("/hello", (request, response) => {
  response.send(
    "Hello, Enter your personal details and start editing 3D objects"
  );
});

router.get("/download", (request, res) => {
  let filename = "output.usdz";
  let absPath = path.join(__dirname, filename);
  let relPath = path.join("/Users/gulcesirvanci/Desktop/untitled/", filename); // path relative to server root

  fs.writeFile(relPath, "File content", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.download(absPath, (err) => {
      console.log("downloaded...");
      if (err) {
        console.log(err);
        return;
      }
      fs.unlink(relPath, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("FILE [" + filename + "] REMOVED!");
      });
    });
  });
});

router.post("/hello", (request, res) => {
  const input = JSON.stringify(request.body);

  fs.writeFile("input.gltf", input, function (err, data) {
    if (err) throw err;
  });

  console.log(`Downloading usdz format...`);

  var cmd = `
    cd gltf2usd/Source
    python gltf2usd.py --gltf /Users/gulcesirvanci/Desktop/untitled/input.gltf --output /Users/gulcesirvanci/Desktop/untitled/output.usdz --optimize-textures `; //TODO: output name take date.

  child_process.exec(cmd, function (err, output) {
    if (err) {
      console.log("child processes failed with error code: " + err.code);
    }

    console.log("Sucsess!");
  });
});

app.use("/", router);

const server = http.createServer(app);
server.listen("1234");
