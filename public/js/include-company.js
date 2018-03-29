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
                            CompanyController.init()
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

var CompanyController = {}

var CompanyController = (function() {

    var events = function() {
        $("#companyLoginForm").on("submit", (e) => {
            e.preventDefault();
            let name = $("#companyLoginName").val();
            console.log("submit with " + name)
            login(name).then((response) => {
                return response.json()
            })
            .then((result) => {
                Util.setCookie("co_login", result.id);
                switchToLogout();
            })
        })

        $("#companyLogoutForm").on('click', function(e) {
            e.preventDefault();
            //TODO: Delete company user cookie
            switchToLogin();
        })

        $("#addItems").on("click", () => Util.showFace("addItems"))
    }

    var switchToLogout = function() {
        $("#nav-login-comp").attr("face", "logout").text("Logout")
        Util.showFace("logout")
    }

    var switchToLogin = function() {
        $("#nav-login-comp").attr("face", "login").text("Login")
        Util.showFace("login")
    }

    var login = function(name) {
        return fetch("/api/companyLogin?name=" + name)
    }

    return {
        init: events
    }
})()