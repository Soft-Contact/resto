function isCalledFromSoftPos() {
    return navigator.userAgent.indexOf("SoftPos") !== -1;
}


function getApiType() {
    if (!isCalledFromSoftPos()) {
        return "NONE";
    }
    if (window.softPosApi424242) {
        //old synchronous Jfx HtmlView
        return "HTMLVIEW_LEGACY";
    } else if (window.softPos && window.softPos.placeOrder) {
        return "HTMLVIEW_JXBROWSER";
    } else {
        //New JCEF
        return "HTMLVIEW_JCEF";
    }
}

function onlyJfxSupported(actionFn) {
    const apiVersion = getApiType();
    if (!apiVersion || apiVersion == 'NONE') {
        alert("SoftPoS API not supported on standalone web applications, please consult Kassamagneetti support")
    }
    if (apiVersion == "HTMLVIEW_LEGACY") {
        alert("SoftPoS API supported only on JxBrowser");
    } else if (apiVersion == "HTMLVIEW_JCEF") {
        alert("SoftPoS API supported only on JxBrowser");
    } else if (apiVersion == "HTMLVIEW_JXBROWSER") {
        actionFn();
    }
}

let parseResultAndMakeCallbacks = function (result, failureCallback, successCallback) {
    if (typeof result === 'string' || result instanceof String) {
        result = JSON.parse(result);
    }
    if (!result.success) {
        if (failureCallback) {
            failureCallback(result);
        }
    } else if (successCallback) {
        successCallback(result);
    }
}


softPos = {
    /**
     * JSON API methods to control the SoftPoS CashRegister, see also https://github.com/Soft-Contact/resto/issues/2#placeorder
     *  @namespace jsonApi
     **/
    jsonApi: {
        /**
         * Place order
         * @param order as a JSON object
         * @param successCallback as a function for successful callback
         * @param failureCallback as a function for failure callback
         */
        placeOrder: function (order, successCallback, failureCallback) {
            const apiVersion = getApiType();
            if (!apiVersion || apiVersion == 'NONE') {
                alert("SoftPoS API not supported on standalone web applications, please consult Kassamagneetti support")
            }
            if (apiVersion == "HTMLVIEW_LEGACY") {
                let resp = JSON.parse(window.softPosApi424242.jsonPlaceOrder(JSON.stringify(order)));
                if (!resp.success) {
                    if (failureCallback) {
                        failureCallback(resp);
                    }
                } else if (successCallback) {
                    successCallback(resp);
                }
            } else if (apiVersion == "HTMLVIEW_JXBROWSER") {
                let result = window.softPos.placeOrder(JSON.stringify(order));
                parseResultAndMakeCallbacks(result, failureCallback, successCallback);
            } else if (apiVersion == "HTMLVIEW_JCEF") {
                window.softPosPlaceOrder({
                        request: JSON.stringify(order),
                        onSuccess: successCallback,
                        onFailure: function (dummy, responseStr) {
                            failureCallback(JSON.parse(responseStr));
                        }
                    }
                );
            }
        },
        /**
         * addToOpenTable
         * @param openTable as a JSON object from https://github.com/Soft-Contact/resto/issues/2#addtoopentable
         * @param successCallback as a function for successful callback
         * @param failureCallback as a function for failure callback
         */
        addToOpenTable: function (openTable, successCallback, failureCallback) {
            onlyJfxSupported(() => {
                let result = window.softPos.addToOpenTable(JSON.stringify(openTable));
                parseResultAndMakeCallbacks(result, failureCallback, successCallback);
            });
        },
        /**
         * get currently on cashregister screen active transaction
         * @param successCallback
         * @param failureCallback
         */
        getActiveTransaction: function (successCallback, failureCallback) {
            onlyJfxSupported(() => {
                let result = window.softPos.getActiveTransaction();
                parseResultAndMakeCallbacks(result, failureCallback, successCallback);
            });
        },
        /**
         * Execute lisp macro on cashregister side
         * @param cmd lisp macro to execute
         * @param successCallback
         * @param failureCallback
         */
        executeLisp: function (cmd, successCallback, failureCallback) {
            onlyJfxSupported(() => {
                let result = window.softPos.executeLisp(cmd);
                parseResultAndMakeCallbacks(result, failureCallback, successCallback);
            });
        }
    },
    /**
     * JSON API methods to control the SoftPoS CashRegister printing
     *  @namespace printer
     **/
    printer: {

        /**
         * Print data to the printer
         * @example
         let printData =
         {
         lines: [

         { type: "TEXT", contents: "test string"},
         { type: "TEXT", contents: "text\non\nmultiple\nlines"},
         { type: "QR_CODE", contents: "sample code", alignment: "RIGHT"},
         { type: "BAR_CODE", contents: "1234567890123"},
         { type: "QR_CODE", contents: "another code"},
         ]
         }
         * @requires SoftPoS 21.11.2 at least
         * @todo experimental
         */
        print: function (printData, successCallback) {
            onlyJfxSupported(() => {
                let resp = window.softPos.print(JSON.stringify(printData));
                if (successCallback) {
                    successCallback(resp);
                }
            });
        }

    },

    /**
     * JSON API methods to control the SoftPoS CashRegister payment terminal
     *  @namespace payments
     **/
    payments: {
        /**
         * Authorize payment on SoftPoS side using SoftPos configured payment device
         * @requires SoftPoS 21.11.2 at least
         * @todo experimental
         */
        authorizePayment: function (payment, successCallback, failureCallback, statusCallback) {
            onlyJfxSupported(() => {
                window.softPos.authorizePayment(payment, function (result) {
                    if (typeof result === 'string' || result instanceof String) {
                        result = JSON.parse(result);
                    }
                    if (!result.success) {
                        if (failureCallback) {
                            failureCallback(result);
                        }
                    } else if (successCallback) {
                        successCallback(result);
                    }
                }, function (status) {
                    if (statusCallback) {
                        statusCallback(status);
                    }
                });
            });
        },

        /**
         * Abort currently active payment
         * @requires SoftPoS 21.11.2 at least
         * @todo experimental
         */
        abortAuthorization(successCallback) {
            onlyJfxSupported(() => {
                let resp = window.softPos.abortAuthorization();
                if (successCallback) {
                    successCallback(resp);
                }
            });
        }
    },

    /**
     *  Utility methods
     *  @namespace utils
     **/
    utils:
        {
            /**
             * Gets the SoftPoS API type depending on which environment is used to run it
             * @returns {string} one of NONE/HTMLVIEW_LEGACY/HTMLVIEW_JCEF
             */
            getApiType: getApiType,
            /**
             * Gets the SoftPoS version
             * @returns {string} SoftPoS version
             */
            getSoftPosVersion: function () {
                return navigator.userAgent;
            },
            /**
             * Get the SoftPos info JSON
             * @requires SoftPoS 21.09.4 at least
             * @returns {json} with fields "success" and "data", where data contains the SoftPosInfo object
             */
            getSoftPosInfo: function (successCallback, failureCallback) {
                onlyJfxSupported(() => {
                    let result = window.softPos.getSoftPosInfo();
                    parseResultAndMakeCallbacks(result, failureCallback, successCallback);
                });
            }

        }
};

module.exports = softPos;