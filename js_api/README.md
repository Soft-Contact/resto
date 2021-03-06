<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [jsonApi][1]
    -   [placeOrder][2]
        -   [Parameters][3]
-   [utils][4]
    -   [getApiType][5]
    -   [getSoftPosVersion][6]

## jsonApi

JSON API methods to control the SoftPoS CashRegister, see also [https://github.com/Soft-Contact/resto/issues/2#placeorder][7]

### placeOrder

Place order

#### Parameters

-   `order`  as a JSON object
-   `successCallback`  as a function for successful callback
-   `failureCallback`  as a function for failure callback

## utils

Utility methods

### getApiType

Gets the SoftPoS API type depending on which environment is used to run it

Returns **[string][8]** one of NONE/HTMLVIEW_LEGACY/HTMLVIEW_JCEF

### getSoftPosVersion

Gets the SoftPoS version

Returns **[string][8]** containing "SoftPos version.number"

[1]: #jsonapi

[2]: #placeorder

[3]: #parameters

[4]: #utils

[5]: #getapitype

[6]: #getsoftposversion

[7]: https://github.com/Soft-Contact/resto/issues/2#placeorder

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
