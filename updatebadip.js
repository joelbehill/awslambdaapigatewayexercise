const aws = require("aws-sdk");
const dynamoose = require('dynamoose')
const shell = require('shelljs')

exports.handler =  async function(event, context) {
  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  let message = 'Unable to update the database'
  let responseCode = 200

  // Do a clone of the git repo
  const path = process.cwd
  shell.cd('/tmp')
  shell.exec('git clone https://github.com/firehol/blocklist-ipsets badips')

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
