const aws = require("aws-sdk");

exports.handler =  async function(event, context) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))

  // Do a clone of the git repo
  // Run through the repo files and add those ip addresses to Dynamo

  return context.logStreamName
}
