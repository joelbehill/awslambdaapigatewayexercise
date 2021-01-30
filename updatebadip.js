const aws = require("aws-sdk")
const dynamoose = require('dynamoose')
const git = require('simple-git')
const fs = require('fs')
const lineReader = require('line-reader')
const path = require('path')

function difference(setA, setB) {
  let _difference = new Set(setA)
  for (let elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

/*
We return a set based on the file array that is sent in
*/
async function processFiles(fileNames, filePath) {
  let badIpAddressSet = new Set()
  for (let fileName of fileNames) {
    // We read the file into the badIpAddressSet set
    lineReader.eachLine(`${filePath}/${fileName}`, (line, last) => {
      const regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      const resultMatch = line.match(regex)
      if (resultMatch) {
        badIpAddressSet.add(line)
      }
    })
  }

  return badIpAddressSet
}

/*
Go through all "rows" and assign each IP address to a set to return
*/
async function processDynamo(dynamooseModel) {
  let badIpAddressSet = new Set()

  const scanResult = await dynamooseModel.scan().exec()

  for (let row of scanResult) {
    const ipAddress = row['ipaddress']
    badIpAddressSet.add(ipAddress)
  }

  return badIpAddressSet
}

exports.handler =  async function(event, context) {
  const filePath = '/tmp/badips'

  const IpAddress = dynamoose.model('badips', { ipaddress: String })

  let message = 'Unable to update the database'
  let responseCode = 200

  // Do a clone of the git repo we will always have to do this because we are using a
  // tmp directory.  We are not using EFS because of costs for this exercise.  We could also
  // save the files to s3 but since the only thing we need the files for is to read them and
  // put their ip addresses into Dynamo
  try {
    await git().silent(true).clone('https://github.com/firehol/blocklist-ipsets.git', filePath)
  } catch (error) {
    console.log('Already cloned the repository')
  }
  try {
    // We need to get all of the files in the filePath directory
    const fileNames = fs.readdirSync(filePath).filter(el => path.extname(el) === '.ipset')

    // Both processFiles and processDynamo returns a set of ip addresses
    const fileSet = await processFiles(fileNames, filePath)
    const dynamodbSet = await processDynamo(IpAddress)

    // We use sets because no IP address should be duplicated in the list and we can do set math
    const addIps = difference(fileSet, dynamodbSet)
    const removeIps = difference(dynamodbSet, fileSet)

    /*
    We don't wait to create or delete an ip address from the Dynamo table
    */
    if (addIps.size > 0) {
      console.log('We are adding IP addresses')
      addIps.forEach(ipAddress => {
        IpAddress.create({'ipaddress': ipAddress})
      })
    }

    if (removeIps.size > 0) {
      console.log('We are removing IP addresses')
      removeIps.forEach(ipAddress => {
        IpAddress.delete(ipAddress)
      })
    }

    message = 'We were able to update the database'
  } catch (error) {
    console.log(error)
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
