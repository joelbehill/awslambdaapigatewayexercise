const aws = require('aws-sdk')

exports.handler =  async function(event, context) {
  const ipAddressModel = dynamoose.model("ipaddress", ipAddressSchema);

  /*
  We set defaults based on the handler
  */
  let responseCode = 200
  let message = 'Unable to parse POST input'

  if (event.body !== null && event.body !== undefined) {
    message = 'Here is the body'
    body = JSON.parse(event.body)

    const ipAddresses = body['ip_addresses']

    let badIpAddresses = []

    for(let ipAddress of ipAddresses) {
      console.log(ipAddress)

    }
  }

  responseBody = {
    message: message,
  }

  let response = {
    statusCode: responseCode,
    body: JSON.stringify(responseBody)
  }

  return response
}
