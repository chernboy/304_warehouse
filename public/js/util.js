var Util = {}

var Util = (function() {

    var hide = function(element) {
        element.addClass("hidden")
    }

    var show = function(element) {
        element.removeClass("hidden")
    }

    var refreshStyles = function(name) {
        $(name + "css").replaceWith('<link id="' + name + 'css" rel="stylesheet" href="css/' + name + '.css?t=' + Date.now() + '"></link>')
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

    var showFace = function (face) {
        $(".face").each(function () {
            if ($(this).attr("face") === face) {
                Util.show($(this))
            } else {
                Util.hide($(this))
            }
        })
    }

    return {
        hide: hide,
        show: show,
        getHtml: getHtml
    }
})()