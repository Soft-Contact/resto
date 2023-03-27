# Soft-Contact JSON API Protocol Technical Description

## Technical overview

The requests are made towards server using HTTPS POST request using the [JSON](https://en.wikipedia.org/wiki/JSON) based format defined in this document.
 
All amounts are represented by cents (integer) and quantities in 1/1000 parts (integer).

All dates and times are represented using [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).

Both request and response messages might get additional (optional) parameters in the future.

Note that for the sake of brevity all the JSON examples in this document are formatted.

## Process flow

1. SoftPos sends a request message
2. 3rd-party replies with either 
   * a response message or
   * an error response message or 
   * an HTTP error code

### Request parameters

HTTP request contains two parameters:

1. `request` - [Base64](https://en.wikipedia.org/wiki/Base64) encoded JSON request containing the api key

2. `hash` - [SHA-256](https://en.wikipedia.org/wiki/SHA-256) hash of the JSON request using secret key
The hash is a hexadecimal representation that can be obtained using 
for example in Java: `org.apache.commons.codec.digest.HmacUtils.hmacSha256Hex`:
```java
    public static String hmacSha256Hex(byte[] key, byte[] valueToDigest)
```
where `key` is the secret key of the api user as a byte array and `valueToDigest` is the JSON message as a byte array
    
Generating hashes can be tested online for example at http://www.freeformatter.com/hmac-generator.html 
3rd-party must verify the hash using the secret key corresponding the api key and **must not** accept the request
in case verification fails.

### Sample session

JSON request:

```json
{"apiKey":"1","requestID":"2","cashRegisterUUID":"3","method":"test","params":{"param1":"value"}}
```

Base64 encoded JSON request:

```
eyJhcGlLZXkiOiIxIiwicmVxdWVzdElEIjoiMiIsImNhc2hSZWdpc3RlclVVSUQiOiIzIiwibWV0aG9kIjoidGVzdCIsInBhcmFtcyI6eyJwYXJhbTEiOiJ2YWx1ZSJ9fQ==
```

SHA-256 hash from JSON request (here using password `hunter2`):

```
268b0360dfc7eae551728b28d6c72ad18e76960bbef4a7c6e3fe847093a0e6be
```

Final HTTP request:

```
request=eyJhcGlLZXkiOiIxIiwicmVxdWVzdElEIjoiMiIsImNhc2hSZWdpc3RlclVVSUQiOiIzIiwibWV0aG9kIjoidGVzdCIsInBhcmFtcyI6eyJwYXJhbTEiOiJ2YWx1ZSJ9fQ==&hash=268b0360dfc7eae551728b28d6c72ad18e76960bbef4a7c6e3fe847093a0e6be
```

## Request message
 
Required parameters for all requests:

* `timestamp` - time when the request was created
* `requestID` - ID of the request used later in response
* `method` - name of the method to call
* `params` - method specific parameters

Optional parameters for all requests:

* `cashRegisterUUID` - UUID of the cash register the request is sent to  
* `lang` - [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) language code for response messages

request structure:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "apiKey":"user_283764",
    "requestID":"req_28376428",
    "cashRegisterUUID":"3aaf2ef6-89ee-4e8f-8191-cbf725435a96",
    "method":"methodName",
    "params":{
        "param1":"value",
        "param2":"value"
    }
}
```

## Response message 

common parameters:

* `timestamp` - time when the response was created
* `requestID` - ID of the original request 
* `success` - shows whether the request was processed successfully (i.e. `true`)
* `message` - optional human readable message which can be shown to user
* `response` - optional method specific result
* `cashRegisterVersion` - optional version of the cash register that processed the request

response structure:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "success":true,
    "requestID":"req_28376428",
    "response":{
        "field1":"value",
        "field2":"value"
    },
    "message":"optional human readable message",
    "cashRegisterVersion":"19.03.2.36141"
}
```

### Error response 
 
parameters:

* `timestamp` - time when the response was created
* `requestID` - ID of the original request. Optional in case the original request did not contain `requestID`
* `success` - shows whether the request was processed successfully (i.e. `false`)
* `statusCode` - in case of unsuccessful request. see the list of error codes below
* `message` - optional human readable description of the error which can be shown to user
* `cashRegisterVersion` - optional version of the cash register that processed the request

response structure:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "success":false,
    "requestID":"req_28376428",
    "statusCode":"ERR_CODE",
    "message":"human readable error message"
}
```    
    
### Error codes

* UNKNOWN_ERROR - not listed error code with details in `message` field
* METHOD_MISSING - required parameter `method` not provided in the request
* AMOUNT_MISSING
* TRANSACTION_UUID_MISSING
* CARD_NOT_FOUND
* INVALID_AMOUNT
* LIMIT_EXCEEDED
* TRANSACTION_ALREADY_CANCELLED
* TRANSACTION_NOT_FOUND
* CUSTOMER_NOT_FOUND
* CARD_ALREADY_REGISTERED
* CARD_NUMBER_MISSING
* CUSTOMER_NUMBER_MISSING
* INVALID_CUSTOMER_NUMBER
* CREDITING_NOT_ALLOWED
* INVALID_JSON
* INVALID_DATA
* INVALID_PERIOD
* UNEXPECTED_VALUE_TYPE
* MISSING_PARAMETERS
* INTERNAL_ERROR - the server or cash register failed to process the request. contact the service provider.
* UNKNOWN_METHOD - the server or cash register does not recognize the method
* NOT_IMPLEMENTED - the server or cash register recognizes, but has not (yet) implemented the method
* ORDER_ROWS_MISSING
* ORDER_ROWS_EMPTY
* ORDER_ID_MISSING
* REQUEST_ALREADY_EXISTS
* REQUEST_NOT_FOUND
* REQUEST_ID_MISSING
* API_KEY_MISSING
* RESPONSE_NOT_FOUND
* CASH_REGISTER_UUID_MISSING
* INVALID_CASH_REGISTER_UUID
* UNKNOWN_CASH_REGISTER_UUID
* NO_REQUESTS_FOUND
* ARTICLE_NOT_FOUND
* CAN_NOT_OPEN_TABLE
* TABLE_ALREADY_OPENED
* CAN_NOT_ADD_TO_TABLE
* TABLE_NOT_OPEN
* DATABASE_LOCK_ERROR
* CLERK_NOT_FOUND
* PAYMENT_TYPE_NOT_FOUND
* TAX_NOT_FOUND
* PAYMENT_ERROR
    
## Server status codes 

* 200 - OK
* 400 - bad request
* 401 - not authorized
* 404 - not found
* 500 - internal server error    

## Version history

| Date        | Author                            | Summary                      |
| ----------- | --------------------------------- | ---------------------------- |
| 17.4.2018  | mats.antell@soft-contact.fi       | Initial version              |
