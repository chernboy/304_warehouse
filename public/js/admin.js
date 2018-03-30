var UnshippedOrdersController = (function () {
    var warehouseSelect
    var warehouseSelectMove
    var unshippedOrdersTable
    var shippedOrdersTable
    var events = function () {
        unshippedOrdersTable = $("#unshippedOrders")
        shippedOrdersTable = $("#shippedOrders")

        $(".ordersRefresh").each(function() {
            $(this).on("click", function() {
                console.log("refreshing...")
                getUnshippedOrders()
                    .then((response) => {
                        return response.json()
                    })
                    .then((results) => {
                        populateUnshippedOrdersTable(results)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                getShippedOrders()
                    .then((response) => {
                        return response.json()
                    })
                    .then((results) => {
                        populateShippedOrdersTable(results)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
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
        Util.handleErrorBox(err)
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
        Util.handleErrorBox(err)
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
                Util.handleErrorBox(err)
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

        $("#backToWarehousesFail").on('click', function () {
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
        console.log("populating unshipped table with:" + JSON.stringify(results))
        unshippedOrdersTable.empty()
        for (let result of results) {
            unshippedOrdersTable.append(createOrdersRow(result))
        }
    }

    var populateShippedOrdersTable = function (results) {
        console.log("populating shipped table with: " + JSON.stringify(results))
        shippedOrdersTable.empty()
        for (let result of results) {
            shippedOrdersTable.append(createShippedOrdersRow(result))
        }
    }

    var createOrdersRow = function (result) {
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
        row.append(initShipOrderButton(result.req_num))
        row.append(initRejectOrderButton(result.req_num))

        return row
    }

    var initShipOrderButton = function (id) {
        let button = $('<button value="' + id + '" type="button">yes</button>')
        $(button).on('click', () => {
            console.log("calling ship order")
            let id = $(button).attr("value")
            shipOrder(id)
                .then(function (response) {
                    console.log(response)
                })
        })
        return button
    }

    var shipOrder = function (id) {
        return fetch("api/shipOrder?req_num=" + id)
    }

    var initRejectOrderButton = function (id) {
        let button = $('<button value="' + id + '" type="button">no</button>')
        $(button).on('click', () => {
            let id = $(button).attr("value")
            rejectOrder(id)
                .then(function (response) {
                    console.log(response)
                })
        })
        return button
    }

    var rejectOrder = function (id) {
        return fetch("api/rejectOrder?req_num=" + id)
    }

    var createShippedOrdersRow = function (result) {
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

    var generatePopItemsRow = function (item) {
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
                    console.log(response)
                    return response.json()
                })
                .then((results) => {
                    $(".reportsTable").each(() => {
                        Util.hide($(this))
                    })
                    console.log("results: " + results)
                    populateMinTable(results)
                })
                .catch((err) => {
                    console.log(err)
                })
                .catch((err) => {
                    console.log("response not in correct format for min")
                })
        })
    }

    var getMin = function () {
        return fetch("/api/getMinAverageWarehouse")
    }

    var populateMinTable = function (items) {
        console.log("items: " + items)
        $("#minTableBody").empty()
        for (let item of items) {
            $("#minTableBody").append(generateMinRow(item))
        }

        Util.show($("#minTable"))
    }

    var generateMinRow = function (item) {
        let row = $("<tr>")
        row.append($("<td>").text(item.min))
        return row
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
                    return response.json()
                })
                .then((results) => {
                    $(".reportsTable").each(() => {
                        Util.hide($(this))
                    })
                    populateMaxTable(results)
                })
                .catch((err) => {
                    console.log(err)
                })
                .catch((err) => {
                    console.log("response not in correct format for max")
                })
        })
    }

    var getMax = function () {
        return fetch("/api/getMaxAverageWarehouse")
    }

    var populateMaxTable = function (items) {
        $("#maxTableBody").empty()
        for (let item of items) {
            $("#maxTableBody").append(generateMaxRow(item))
        }

        Util.show($("#minTable"))
    }

    var generateMaxRow = function (item) {
        let row = $("<tr>")
        row.append($("<td>").text(item.max))
        return row
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
                    return response.json()
                })
                .then((results) => {
                    console.log(results)
                    $(".reportsTable").each(() => {
                        Util.hide($(this))
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
        return fetch("/api/getCustomersPurchasingEverywhere")
    }

    var populateVipTable = function (items) {
        $("#vipTableBody").empty()
        for (let item of items) {
            $("#vipTableBody").append(generateVipRow(item))
        }

        Util.show($("#vipTable"))
    }

    var generateVipRow = function (item) {
        let row = $("<tr>")
        row.append($("<td>").text(item.id))
        row.append($("<td>").text(item.cu_name))
        return row
    }

    return {
        init
    }
})()