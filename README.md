# README

## Purpose

The purpose is to show what an awesome person I am to work with.  No really the purpose is to go through the exercise to set up bad ip detection.

## What we are using and why

We are using Serverless Framework (https://serverless.com) to deploy.  The reason we are using Serverless as opposed to CDK, Terraform is because it is easier to deploy API Gateway / Lambda.  If we were needing to deploy Docker containers, an entire network (VPC, subnets, routing tables) then CDK or Terraform would be a better solution.

I decided to go with API Gateway / Lambda / Dyanmo because I wanted a system that would make it easiest to quickly check a list of IP addresses.  Also, where scalability wouldn't be an issue and costs would be low, no matter the times it was called.

There are two main functions `badipchecker` and `updatebadip`.  The former is what the API Gateway is using to query DynamoDB.  The latter is set up to run every 24 hours, but you can vary that in the serverless.yml configuration by modifying the schedule `- schedule: rate(24 hours)`.  I broke it up into two so badipchecker could be quick by allowing it to do only a few things.  Take in a list of IP addresses, query DynamoDB, and report the results of the query.

### DynamoDB

We are indexing DynamoDB based on the IP address which should be unique.  We guarantee it is unique by using a `Set` variable in our NodeJS code.

I set the throughput for the DynamoDB table to be on-demand.  The reason I choose this was because I didn't want to limit  the code immediately.  If after sometime there is a settling of the amount of new IP addresses / old perhaps, but since I am not sure how many IP addresses will be added / removed I decided to go with on-demand.  You can read more about provisioined throughput here (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html)

If at some point someone wanted to expand DyanmoDB to be multi-region you could do it using help from this how-to (https://www.serverless.com/blog/build-multiregion-multimaster-application-dynamodb-global-tables).  At this time I will not do this.
### Route53

I did not decide to use Route53 because I wanted to keep costs at a minimum.  However, if I were to continue with this deploy I would set up a DNS to point to the API Gateway.  If at some point a blue/green deployment was wanted / needed we could flip the DNS setting to point to the new Gateway.
## Installation

Clone the repository to your local machine.

*Make sure you have serverless installed.  I am using npm version 7.3.0 and node version v15.5.0*

To install serverless

```
npm install serverless
```

Also, you will need to be able to deploy to an AWS account.  I personally endorse AWSP (https://github.com/johnnyopao/awsp)

You can change the region by editing the serverless.yml file under the region statement.

```
git clone git@github.com:joelhillische/fluentstream.git
npm install
sls deploy
```

Note: If you see the following for now please ignore it.  It will have no impact on the deploy.

```
Serverless: Running "serverless" installed locally (in service node_modules)
Serverless: Deprecation warning: Serverless constructor expects resolved service configuration path to be provided via "config.configurationPath".
            Starting from next major Serverless will no longer auto resolve that path internally.
            More Info: https://www.serverless.com/framework/docs/deprecations/#MISSING_SERVICE_CONFIGURATION_PATH
```

## Input

You must send a POST request to the url specified after running sls deploy.  You can send as many or as few IP addresses to the endpoint.

```
{
    "ip_addresses": ["1.1.1.1", "2.2.2.2"]
}
```

## Output

*Note: These are just example output.  If there are no IP addresses you will still receive a 200 response but the bad_ip_addresses array will be empty `[]`*

### Response

#### Bad ip addresses were submitted

```
{
    "message": "These are the bad ip addresses.",
    "bad_ip_addresses": [
      "1.1.1.1",
      "2.2.2.2"
    ]
}
```

#### No bad ip addresses were submitted

```
{
    "message": "There are no bad ip addresses submitted.",
    "bad_ip_addresses": []
}
```
