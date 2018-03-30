IncludeHeader = {}

IncludeHeader = (function () {
    var events = function () {
        $(function () {
            $("*").each(function () {
                if ($(this).attr("include-header-html")) {
                    Util.getHtml($(this).attr("include-header-html"))
                        .then(function (html) {
                            $(".header").prepend(html)
                            HeaderController.init();
                        }).catch(function (error) {
                            Util.handleErrorBox(err)
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
        header = $(".header")
        logo = header.find(".logo")
        banner = header.find(".banner")
        $(".header").mousedown(function () {
            header.addClass("active")
        })
        $(".header").mouseup(function () {
            header.removeClass("active")
        })
    }

    return {
        init: events
    }
})();