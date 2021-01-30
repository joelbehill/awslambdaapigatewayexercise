const aws = require("aws-sdk");
const nodegit = require('nodegit')

exports.handler =  async function(event, context) {
  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  // Do a clone of the git repo
  // Run through the repo files and add those ip addresses to Dynamo


}
