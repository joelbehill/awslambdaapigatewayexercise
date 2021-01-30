const aws = require("aws-sdk");
const nodegit = require('nodegit')

exports.handler =  async function(event, context) {
  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  let message = 'Unable to update the database'
  let responseCode = 200

  // Do a clone of the git repo


  // Run through the repo files and add those ip addresses to Dynamo
  /*
  const result = await IpAddress.create({
    ipaddress: ipaddress
  })
  if (result) {

  }
  */

  responseBody = {
    message: message,
  }

  let response = {
    statusCode: responseCode,
    body: JSON.stringify(responseBody)
  }

  return response
}
