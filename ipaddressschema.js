const dynamoose = require("dynamoose")

const ipAddressSchema = new dynamoose.Schema({
  "ipaddress": String,
}, {
  "saveUnknown": true,
  "timestamps": true
})