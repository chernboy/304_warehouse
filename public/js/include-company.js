IncludeCompany = {}

IncludeCompany = (function () {
    var events = function () {
        return new Promise((resolve, reject) => {
            console.log("Starting to include company")
            $("*").each(function () {
                if ($(this).attr("include-company-html")) {
                    Util.getHtml($(this).attr("include-company-html"))
                        .then(function (html) {
                            $(".company").prepend(html)
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get company " + JSON.stringify(error))
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()
