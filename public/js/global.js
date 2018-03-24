var BodyController = {}

var BodyController = (function () {
    var events = function () {
        $(function () {
            $("#goto-customer").on('click', function () {
                Util.hide($("#home"))
                Util.hide($(".company"))
                Util.hide($(".admin"))
                if ($(".customer").children().length === 0) {
                    console.log("including customer html")
                    IncludeCustomer.execute().then(function () {
                        console.log("got customer")
                        NavController.init()
                    }).catch(function (err) {
                        console.log(err)
                    })
                }
                Util.show($(".customer"))
            })
            $("#goto-company").on('click', function () {
                console.log("before home")
                Util.hide($("#home"))
                console.log("before customer")
                Util.hide($(".customer"))
                console.log("before admin")
                Util.hide($(".admin"))
                if ($(".company").children().length === 0) {
                    console.log("including company html")
                    IncludeCompany.execute().then(function () {
                        console.log("got company")
                        NavController.init()
                    }).catch(function (err) {
                        console.log(err)
                    })
                }
                Util.show($(".company"))
            })
            $("#goto-admin").on('click', function () {
                Util.hide($("#home"))
                Util.hide($(".customer"))
                Util.hide($(".company"))
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

    return {
        init: events
    }
})()

BodyController.init()