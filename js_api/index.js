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
                console.log("Sent to CR_2 " + JSON.stringify(resp) + " " + failureCallback + " " + successCallback);
                if (!resp.success) {
                    if (failureCallback) {
                        failureCallback(resp);
                    }
                } else if (successCallback) {
                    successCallback(resp);
                }
            } else if (apiVersion == "HTMLVIEW_JCEF") {
                window.softPosPlaceOrder({
                        request: JSON.stringify(order),
                        onSuccess: successCallback,
                        onFailure: failureCallback
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
         * @returns {string} one of NONE/HTMLVIEW_LEGACY/HTMLVIEW_JCEF
         */
        getSoftPosVersion: function() {
            return navigator.userAgent;
        }
    }
};

module.exports = softPos;