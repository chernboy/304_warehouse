IncludeCompany = {}

IncludeCompany = (function () {
    var events = function () {
        //REMOVE THIS ONCE WE HAVE LOGIN
        Util.setCookie("co_login", "something")
        return new Promise((resolve, reject) => {
            console.log("Starting to include company")
            $("*").each(function () {
                if ($(this).attr("include-company-html")) {
                    Util.getHtml($(this).attr("include-company-html"))
                        .then(function (html) {
                            $(".company").prepend(html)
                            WarehouseSelectController.init();
                            AdminController.init()
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get company " + error)
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()

var WarehouseSelectController = (function () {
    var warehouseSelect
    var events = function () {
        warehouseSelect = $("#warehouseSelect")
        getWarehouses().then((response) => {
            response.json().then((results) => {
                for (let o of results) {
                    warehouseSelect.append(createWarehouseOption(o))
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    var getWarehouses = function () {
        return fetch("/api/getWarehouses")
    }

    var createWarehouseOption = function (warehouse) {
        let option = $("<option>")
        option.text("" + warehouse.lat + ", " + warehouse.lon)
        option.attr("lat", warehouse.lat)
        option.attr("lon", warehouse.lon)
        return option
    }
    return {
        init: events
    }
})()

var AdminController = {}

var AdminController = (function() {

    var events = function() {
        let name = $("#companyLoginName").val()
        $("#companyLoginSubmit").on("click", () => {
            login(name).then((response) => {
                return response.json()
            })
            .then((result) => {
                Util.setCookie("co_login", result.id)
            })
        })
    }

    var login = function(name) {
        return fetch("/api/companyLogin?name=" + name)
    }

    return {
        init: events
    }
})()