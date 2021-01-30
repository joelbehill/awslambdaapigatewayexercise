const aws = require('aws-sdk')
const dynamoose = require('dynamoose')

exports.handler =  async function(event, context) {
  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  let badIpAddresses = []

  /*
  We set defaults based on the handler
  */
  let responseCode = 200
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
