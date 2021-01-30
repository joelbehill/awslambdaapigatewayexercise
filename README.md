# README

# Purpose

## Installation

Clone the repository to your local machine.

```
git clone git@github.com:joelhillische/fluentstream.git
```

Make sure you have serverless installed.  I am using npm version 7.3.0 and node version v15.5.0

## Input

You must send a POST request to the url.  You can send as many or as few IP addresses to the endpoint.

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