IncludeAdmin = {}

IncludeAdmin = (function () {
    var events = function () {
        return new Promise((resolve, reject) => {
            $("*").each(function () {
                if ($(this).attr("include-admin-html")) {
                    Util.getHtml($(this).attr("include-admin-html"))
                        .then(function (html) {
                            $(".admin").prepend(html)
                            UnshippedOrdersController.init()
                            PopularItems.init()
                            FindMin.init()
                            FindMax.init()
                            FindVip.init()
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get admin" + error)
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()