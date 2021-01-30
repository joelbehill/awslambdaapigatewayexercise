const aws = require('aws-sdk')
const dynamoose = require('dynamoose')

exports.handler =  async function(event, context) {
  // dynamoose makes it really easy to work on Dynamo without much thought
  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  let badIpAddresses = []

  // We set a response code to 200 because they connected successfully to our API
  // Whether that resulted in no IP addresses found is something that they can check
  let responseCode = 200

  // We set the message to be bad.
  let message = 'Unable to parse POST input'

  if (event.body !== null && event.body !== undefined) {
    body = JSON.parse(event.body)

    const ipAddresses = body['ip_addresses']

    for(let ipAddress of ipAddresses) {
      // If the ipAddress does not exist already in the badIpAddresses array
      if (badIpAddresses.indexOf(ipAddress) === -1) {
        const result = await IpAddress.get(ipAddress)

        if (result) {
          const badIp = result.ipaddress
          badIpAddresses.push(badIp)
        }
      }
    }
  }

  // If we find that the bad ip address array length is greater than 0
  if (badIpAddresses.length > 0) {
    message = 'These are the bad ip addresses.'
  } else {
    message = 'There are no bad ip addresses submitted.'
  }

  responseBody = {
    message: message,
    bad_ip_addresses: badIpAddresses
  }

  let response = {
    statusCode: responseCode,
    body: JSON.stringify(responseBody)
  }

  return response
}
