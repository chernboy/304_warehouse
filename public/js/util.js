var Util = {}

var Util = (function() {

    var hide = function(element) {
        element.addClass("hidden")
    }

    var show = function(element) {
        element.removeClass("hidden")
    }

    var getHtml = function(file) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url:"../html/" + file, //maybe this url should be generalised? full path?
                success: function(data) {
                    resolve(data)
                },
                error: function(xhr, text, status) {
                    reject(status)
                }
            })
        })
    }

    return {
        hide: hide,
        show: show,
        getHtml: getHtml
    }
})()