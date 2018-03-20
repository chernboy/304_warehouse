var Util = {}

var Util = (function() {

    var hide = function(element) {
        element.addClass("hidden")
    }

    var show = function(element) {
        element.removeClass("hidden")
    }

    return {
        hide: hide,
        show: show
    }
})()