var BodyController = {}

var BodyController = (function () {
    var events = function () {
        $(function () {
            //Util.init()
            clearLoginCookies()
            $("#goto-customer").on('click', function () {
                Util.hide($("#home"))
                Util.hide($(".company"))
                Util.hide($(".admin"))
                if ($(".customer").children().length === 0) {
                    IncludeCustomer.execute().then(function () {
                        NavController.init()
                    }).catch(function (err) {
                        Util.handleErrorBox(err)
                    })
                }
                Util.show($(".customer"))
            })
            $("#goto-company").on('click', function () {
                Util.hide($("#home"))
                Util.hide($(".customer"))
                Util.hide($(".admin"))
                if ($(".company").children().length === 0) {
                    IncludeCompany.execute().then(function () {
                        NavController.init().then(() => {
                            Util.refreshStyles("nav")
                        }).catch((err) => {
                            Util.handleErrorBox(err)
                        })
                    }).catch(function (err) {
                        Util.handleErrorBox(err)
                    })
                }
                Util.show($(".company"))
            })
            $("#goto-admin").on('click', function () {
                Util.hide($("#home"))
                Util.hide($(".customer"))
                Util.hide($(".company"))
                if ($(".admin").children().length === 0) {
                    IncludeAdmin.execute().then(function () {
                        NavController.init().then(() => {
                            Util.refreshStyles("nav")
                        }).catch((err) => {
                            Util.handleErrorBox(err)
                        })
                    }).catch(function (err) {
                        Util.handleErrorBox(err)
                    })
                }
                Util.show($(".admin"))
            })
            $("#goto-home").on('click', function () {
                Util.hide($(".customer"))
                Util.hide($(".company"))
                Util.hide($(".admin"))
                Util.show($("#home"))
            })
        })
    }

    var clearLoginCookies = function() {
        Util.setCookie("cu_login", "")
        Util.setCookie("co_login", "")
        Util.setCookie("admin_login", "")
    }

    return {
        init: events
    }
})()

BodyController.init()