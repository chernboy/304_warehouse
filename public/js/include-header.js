IncludeHeader = {}

IncludeHeader = (function () {
    var events = function () {
        $(function () {
            console.log("Startig to include header")
            $("*").each(function () {
                if ($(this).attr("include-header-html")) {
                    Util.getHtml($(this).attr("include-header-html"))
                        .then(function (html) {
                            $(".header").prepend(html)
                            HeaderController.init();
                        }).catch(function (error) {
                            console.log("failed to get header " + JSON.stringify(error))
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()

IncludeHeader.execute()


HeaderController = {}

HeaderController = (function () {
    var header, logo, banner

    var events = function () {
        console.log("header controller init")
        header = $(".header")
        logo = header.find(".logo")
        banner = header.find(".banner")
        $(".header").mousedown(function () {
            console.log("mouse down")
            header.addClass("active")
        })
        $(".header").mouseup(function () {
            console.log("mouse up")
            header.removeClass("active")
        })
    }

    return {
        init: events
    }
})();