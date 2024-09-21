const bodyParser = require("body-parser");

const urlEncoded = bodyParser.urlencoded({extended : false});
const jsonEncoded = bodyParser.json();

module.exports = {
    urlEncoded,
    jsonEncoded
}