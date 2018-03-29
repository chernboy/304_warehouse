var UnshippedOrdersController = {}

var UnshippedOrdersController = (function () {
    var warehouseSelect
    var warehouseSelectMove
    var ordersTable
    var events = function () {
        unshippedOrdersTable = $("#unshippedOrders")
        shippedOrdersTable = $("#shippedOrders")

        $("#ordersRefresh").on("click", () => {

            let orderPromises = []
            orderPromises.push(getUnshippedOrders())
            orderPromises.push(getShippedOrders())

            Promise.all(orderPromises).then((results) => {
                results[0].json().then(populateUnshippedOrdersTable)
                results[1].json().then(populateShippedOrdersTable)
            })
        })

        warehouseSelectMove = $("#moveItemsSelect")
        getWarehouses().then((response) => {
            response.json().then((results) => {
                for (let o of results) {
                    warehouseSelectMove.append(createWarehouseOption(o))
                }
            })
        }).catch((err) => {
            console.log(err)
        })

        warehouseSelect = $("#adminWarehouseSelect")
        getWarehouses().then((response) => {
            response.json().then((results) => {
                for (let o of results) {
                    warehouseSelect.append(createWarehouseOption(o))
                }
            })
        }).catch((err) => {
            console.log(err)
        })

        $("#deleteWarehouse").on('click', function () {
            //TODO: Delete warehouse
            Util.showFace("warehousesMove")
        })

        $("#adminLogin").on("submit", async e => {
            e.preventDefault();
            console.log("submt");
            try {
                const res = await fetch(`/api/adminLogin?name=${$("#adminLoginName").val()}`)
                const result = await res.json();

                Util.setCookie("admin_login", "" + result.id);
                switchToLogout();
            } catch (err) {
                console.log(err);
            }
        })

        $("#adminLogoutForm").on("submit", async e => {
            e.preventDefault()
            console.log("logout submit")
            try {
                Util.setCookie("admin_login", "")
                switchToLogin()
            } catch (err) {
                console.log(err)
            }
        })

        $("#moveItems").on('click', function () {
            //TODO: Move Items to selected warehouse
            Util.showFace("itemMoveSuccess")
        })

        $("#backToWarehouses").on('click', function () {
            Util.showFace("warehouses")
        })

        $("#backToWarehousesFail").on('click', function() {
            Util.showFace("warehouses")
        })
    
        function switchToLogout() {
            $("#nav-login-admin").attr("face", "logout").text("Logout")
            Util.showFace("logout")
        }

        function switchToLogin() {
            $("#nav-login-admin").attr("face", "login").text("Login")
            Util.showFace("login")
        }

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

    var getUnshippedOrders = function () {
        return fetch("/api/getUnshippedOrders")
    }
    var getShippedOrders = function () {
        return fetch("/api/getShippedOrders")
    }

    var populateUnshippedOrdersTable = function (results) {
        unshippedOrdersTable.empty()
        for (let result of results) {
            unshippedOrdersTable.append(createOrdersRow(result))
        }
    }

    var populateShippedOrdersTable = function (results) {
        shippedOrdersTable.empty()
        for (let result of results) {
            shippedOrdersTable.append(createShippedOrdersRow(result))
        }
    }

    var createOrdersRow = function (result) {
        console.log(result)
        let row = $("<tr>")
        row.append($("<td>").text(result.req_num))
        row.append($("<td>").text(result.origin))
        row.append($("<td>").text(result.dest))
        row.append($("<td>").text(result.total_val))
        row.append($("<td>").text(result.veh_id))
        row.append($("<td>").text(result.id))
        row.append($("<td>").text(result.lat))
        row.append($("<td>").text(result.lon))
        row.append($("<td>").text(result.i_id))
        row.append(initShipOrderButton)
        row.append(initRejectOrderButton)

        return row
    }

    var initShipOrderButton = function(id) {
        let button = $('<button id="shipOrder" value="' + result.req_num + 'type="button">no</button>')
        $(button).on('click', () => {
            let id = $(button).attr("value") 
            shipOrder(id)
                .then(function (response) {
                    return response.json()
                })
                .then(function (result) {
                    $("#ordersRefresh").trigger("click") 
                })
        })
        return button
    }

    var shipOrder = function (id) {
        return fetch("api/shipOrder?req_num=" + id)
    }

    var initRejectOrderButton = function(id) {
        let button = $('<button id="rejectOrder" value="' + result.req_num + 'type="button">yes</button>')
        $(button).on('click', () => {
            let id = $(button).attr("value")
            let qty = parseFloat($("#" + id + "_qty").val())
            rejectOrder(id)
                .then(function (response) {
                    return response.json()
                })
                .then(function (result) {
                    $("#ordersRefresh").trigger("click") 
                })
        })
        return button
    }

    var rejectOrder = function (id) {
        return fetch("api/rejectOrder?req_num=" + id)
    }

    var createShippedOrdersRow = function(result) {
        console.log(result)
        let row = $("<tr>")
        row.append($("<td>").text(result.req_num))
        row.append($("<td>").text(result.origin))
        row.append($("<td>").text(result.dest))
        row.append($("<td>").text(result.total_val))
        row.append($("<td>").text(result.veh_id))
        row.append($("<td>").text(result.id))
        row.append($("<td>").text(result.lat))
        row.append($("<td>").text(result.lon))
        row.append($("<td>").text(result.i_id))
        row.append($('<button id="shipOrder" value="' + result.req_num))
        row.append($('<button id="rejectOrder" value="' + result.req_num))
        return row 
    }
    return {
        init: events
    }
})()

var PopularItems = (function () {

    var init = function () {
        $("#popItems").on("click", () => {
            getPopularItems()
                .then((response) => {
                    return response.json()
                })
                .then((results) => {
                    console.log(results)
                    $(".reportsTable").each(() => {
                        Util.hide($(this))
                    })
                    populatePopularItemsTable(results)
                })
                .catch((err) => {
                    console.log(err)
                })
                .catch((err) => {
                    console.log("response not in correct format")
                })
        })
    }

    var getPopularItems = function () {
        return fetch("/api/getItemPopularity")
    }

    var populatePopularItemsTable = function (items) {
        $("#popItemsTableBody").empty()
        for (let item of items) {
            $("#popItemsTableBody").append(generatePopItemsRow(item))
        }

        Util.show($("#popItemsTable"))
    }

    var generatePopItemsRow = function(item) {
        let row = $("<tr>")
        row.append($("<td>").text(item.i_id))
        row.append($("<td>").text(item.count))
        return row
    }

    return {
        init
    }
})()

var FindMin = (function () {

    var init = function () {
        $("#findMin").on("click", () => {
            getMin()
                .then((response) => {
                    response.json()
                })
                .then((results) => {
                    $(".reportsTable").each(() => {
                        util.hide($(this))
                    })
                    populateMinTable(results)
                })
                .catch((err) => {
                    console.log("unable to get min")
                })
                .catch((err) => {
                    console.log("response not in correct format for min")
                })
        })
    }

    var getMin = function () {
        return fetch("/api/popularitems")
    }

    var populateMinTable = function (items) {
        $("#minTableBody").empty()
        for (let item of items) {
            $("#minTableBody").append(generateMinRow(item))
        }

        util.show($("#minTable"))
    }

    var generateMinRow = function(item) {
        //todo: generate the right kind of row
        // let row = $("<tr>")
        // row.append($("<td>").text(item.i_id))
        // row.append($("<td>").text(item.cnt))
        // return row
    }

    return {
        init
    }
})()

var FindMax = (function () {

    var init = function () {
        $("#findMax").on("click", () => {
            getMax()
                .then((response) => {
                    response.json()
                })
                .then((results) => {
                    $(".reportsTable").each(() => {
                        util.hide($(this))
                    })
                    populateMaxTable(results)
                })
                .catch((err) => {
                    console.log("unable to get popular max")
                })
                .catch((err) => {
                    console.log("response not in correct format for max")
                })
        })
    }

    var getMax = function () {
        return fetch("/api/getMax")
    }

    var populateMaxTable = function (items) {
        $("#maxTableBody").empty()
        for (let item of items) {
            $("#maxTableBody").append(generateMaxRow(item))
        }

        util.show($("#minTable"))
    }

    var generateMaxRow = function(item) {
        //todo: generate the right kind of row
        // let row = $("<tr>")
        // row.append($("<td>").text(item.i_id))
        // row.append($("<td>").text(item.cnt))
        // return row
    }

    return {
        init
    }
})()

var FindVip = (function () {

    var init = function () {
        $("#vip").on("click", () => {
            getVip()
                .then((response) => {
                    response.json()
                })
                .then((results) => {
                    $(".reportsTable").each(() => {
                        util.hide($(this))
                    })
                    populateVipTable(results)
                })
                .catch((err) => {
                    console.log("unable to get vip customers")
                })
                .catch((err) => {
                    console.log("response not in correct format for vip")
                })
        })
    }

    var getVip = function () {
        return fetch("/api/getVipCustomers")
    }

    var populateVipTable = function (items) {
        $("#vipTableBody").empty()
        for (let item of items) {
            $("#vipTableBody").append(generateVipRow(item))
        }

        Util.show($("#vipTable"))
    }

    var generateVipRow = function(item) {
        //todo: generate the right kind of row
        // let row = $("<tr>")
        // row.append($("<td>").text(item.i_id))
        // row.append($("<td>").text(item.cnt))
        // return row
    }

    return {
        init
    }
})()