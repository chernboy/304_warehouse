var NavController = {};

var NavController = (function () {

    var nav

    var navhead
    var buttons;

    var navbody
    var faces

    var events = function () {
        return new Promise((resolve, reject) => {
            faces = $(".face")
            if ($(".nav-button").length > 0) {
                $(".nav-button").each(function () {
                    $(this).on('click', function () {
                        let face = $(this).attr("face")
                        // only allow access to orders or catalog if user is signed in
                        if (!protectFaces(face, "cu_login", ["orders", "catalog"])) {
                            return
                        }

                        //only allow access to additem and listitem if company is logged in
                        if (!protectFaces(face, "co_login", ["listItems", "addItems"])) {
                            return
           i             }

                        //only allows acces to admin parts if admin is logged in
                        if (!protectFaces(face, "admin_login", ["unshippedOrders", "shippedOrders", "reports", "warehouses"])){
                            return
                        }

                        Util.showFace(face)
                    })
                    $(this).on('mouseenter', function () {
                        $(this).addClass("active")
                    })
                    $(this).on('mouseleave', function () {
                        $(this).removeClass("active")
                    })
                })
            }

            function protectFaces(target, cookie, protected) {
                let check = false
                for (let face of protected) {
                    if (target === face) {
                        check = true
                    }
                }

                if (!Util.checkCookieExists(cookie) && check) {
                    return false
                } else {
                    return true
                }
            }

            resolve()
        })
    }

    return {
        init: events
    }
})();