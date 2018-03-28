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

    //gotten from w3schools
    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue;
    }    

    //gotten from w3schools
    var getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    } 

    var checkCookieExists = function(cookie) {
        return !!getCookie(cookie)
    }

    return {
        hide,
        show,
        getHtml,
        showFace,
        checkCookieExists,
        setCookie
    }
})()