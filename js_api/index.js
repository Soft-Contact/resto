
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
                console.log("Result " + JSON.stringify(result));
            } else if (apiVersion == "HTMLVIEW_JCEF") {
                window.softPosPlaceOrder({
                        request: JSON.stringify(order),
                        onSuccess: successCallback,
                        onFailure: function(dummy, responseStr) {
                            failureCallback(JSON.parse(responseStr));
                        }
                    }
                );
            }
        }
    },
    /**
     *  Utility methods
     *  @namespace utils
     **/
    utils: {
        /**
         * Gets the SoftPoS API type depending on which environment is used to run it
         * @returns {string} one of NONE/HTMLVIEW_LEGACY/HTMLVIEW_JCEF
         */
        getApiType : getApiType,
        /**
         * Gets the SoftPoS version
         * @returns {string} SoftPoS version
         */
        getSoftPosVersion: function() {
            return navigator.userAgent;
        }
    }
};

module.exports = softPos;