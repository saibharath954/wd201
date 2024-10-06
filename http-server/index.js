const http = require("http");
const fs = require("fs");

const minimist = require("minimist");
// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2));
const port = args.port;

let homeContent = "";
let projectContent = "";
let registrationContent = "";
let cssContent = "";
let jsContent = "";

fs.readFile("home.html",(err, home) => {
    if (err) {
        throw err;
    }
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err) {
      throw err;
    }
    projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
    if (err) {
        throw err;
    }
    registrationContent = registration;
});

fs.readFile("output.css", (err, css) => {
    if (err) {
      throw err;
    }
    cssContent = css;
});

fs.readFile("registration.js", (err, js) => {
    if (err) {
      throw err;
    }
    jsContent = js;
});

http.createServer((request, response) => {
    let url = request.url;
    switch (url) {
        case "/project":
            response.writeHeader(200, {"Content-type": "text/html"});
            response.write(projectContent);
            response.end();
            break;
        case "/registration":
            response.writeHeader(200, {"Content-type": "text/html"});
            response.write(registrationContent);
            response.end();
            break;
        case "/output.css":
            response.writeHeader(200, {"Content-type": "text/css"});
            response.write(cssContent);
            response.end();
            break;
        case "/registration.js":
            response.writeHeader(200, {"Content-type": "application/javascript"});
            response.write(jsContent);
            response.end();
            break;
        default:
            response.writeHeader(200, {"Content-type": "text/html"});
            response.write(homeContent);
            response.end();
            break;
    }
})
.listen(port);


