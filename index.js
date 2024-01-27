"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

const slugify = require("slugify")

const createTemplate = require("./modules/createTemplate")

// SERVER
const productData = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf8",
  (err, data) => data
);
const productDataObj = JSON.parse(productData);

const slugs= productDataObj.map(el=>slugify(el.productName))

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8",
  (err, data) => data
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8",
  (err, data) => data
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8",
  (err, data) => data
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //   OVERVIEWE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = productDataObj
      .map((card) => createTemplate(tempCard, card))
      .join("");
    const overview = tempOverview.replace(/%PRODUCT_CARDS%/g, cardsHTML);
    res.end(overview);
  } else if (pathname === "/product") {
    // PRODUCT
    res.writeHead(200, { "Content-type": "text/html" });
    const product = productDataObj[query.id];
    const output = createTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    // API
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(productData);
  } else {
    // NOT FOUND
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "silly text",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});

