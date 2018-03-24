var NavController = {};

var NavController = (function () {

    var nav

    var navhead
    var buttons;

    var navbody
    var faces

    var events = function () {
        $(function () {
            faces = $(".face")
            if ($(".nav-button").length > 0) {
                $(".nav-button").each(function () {
                    $(this).on('click', function () {
                        let face = $(this).attr("face")
                        showFace(face)
                    })
                    $(this).on('mouseenter', function () {
                        console.log("mouseenter")
                        $(this).addClass("active")
                    })
                    $(this).on('mouseleave', function () {
                        console.log("mouseleave")
                        $(this).removeClass("active")
                    })
                })
            }
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
        init: events
    }
})();