IncludeCompany = {}

IncludeCompany = (function () {
    var events = function () {
        return new Promise((resolve, reject) => {
            console.log("Starting to include company")
            $("*").each(function () {
                if ($(this).attr("include-company-html")) {
                    Util.getHtml($(this).attr("include-company-html"))
                        .then(function (html) {
                            $(".company").prepend(html)
                            WarehouseSelect.init();
                            Company.init()
                            AddItem.init()
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

var WarehouseSelect = (function () {
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

    var getSelectedLat = function() {
        return warehouseSelect.find(":selected").attr("lat")
    }

    var getSelectedLon = function() {
        return warehouseSelect.find(":selected").attr("lon")
    }


    return {
        init: events,
        getSelectedLat,
        getSelectedLon
    }
})()

var Company = {}

var Company = (function () {

    var events = function () {
        $("#companyLoginForm").on("submit", (e) => {
            e.preventDefault();
            let name = $("#companyLoginName").val();
            console.log("submit with " + name)
            login(name)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    Util.setCookie("co_login", result.id);
                    switchToLogout();
                })
        })

        $("#companyLogoutForm").on('click', (e) => {
            e.preventDefault();
            //TODO: Delete company user cookie
            Util.setCookie("co_login", "")
            switchToLogin();
        })

    }

    var switchToLogout = function () {
        $("#nav-login-comp").attr("face", "logout").text("Logout")
        Util.showFace("logout")
    }

    var switchToLogin = function () {
        $("#nav-login-comp").attr("face", "login").text("Login")
        Util.showFace("login")
    }

    var login = function (name) {
        return fetch("/api/companyLogin?name=" + name)
    }

    return {
        init: events
    }
})()

var AddItem = {}

var AddItem = (function () {

    var events = function () {
        $("#addItemForm").on("submit", (e) => {
            e.preventDefault()

            let sendObj = {}
            params = $("#addItemForm").serialize().split("&")
            for (let param of params) {
                key = param.split("=")[0]
                val = param.split("=")[1]
                sendObj[key] = parseFloat(val)
            }

            sendObj["lon"] = parseFloat(WarehouseSelect.getSelectedLon())
            sendObj["lat"] = parseFloat(WarehouseSelect.getSelectedLat())
            sendObj["ID"] = parseFloat(Util.getCookie("co_login"))

            console.log(JSON.stringify(sendObj))

            $.ajax({
                url: "/api/addItem",
                method: "post",
                contentType: "application/json",
                data: JSON.stringify(sendObj)
            })
            .done((response) => {
                console.log("successfully added item")
            })
            .fail((err) => {
                console.log(err)
            })
        })
    }

    return {
        init: events
    }
})()