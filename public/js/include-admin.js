IncludeAdmin = {}

IncludeAdmin = (function () {
    var events = function () {
        console.log("Starting to include admin")
        return new Promise((resolve, reject) => {
            $("*").each(function () {
                if ($(this).attr("include-admin-html")) {
                    Util.getHtml($(this).attr("include-admin-html"))
                        .then(function (html) {
                            $(".admin").prepend(html)
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get admin" + JSON.stringify(error))
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()