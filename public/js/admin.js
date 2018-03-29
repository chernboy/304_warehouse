var UnshippedOrdersController = {}

var UnshippedOrdersController = (function() {
    var warehouseSelect
    var warehouseSelectMove
    var ordersTable
    var events = function() {
        ordersTable = $("#unshippedOrders")
        getUnshippedOrders()
        .then((response) => {
            return response.json()
        })
        .then((results) => {
            populateOrdersTable(results)
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
            //TODO: FIX, not working!!
            Util.showFace("moveItems")
        })

        $("#adminLogin").on("submit", async e => {
            e.preventDefault();
            console.log("submt");
            try {
                const res = await fetch(`/api/adminLogin?name=${$("#adminLoginName").val()}`)
                const result = await res.json();

                Util.setCookie("admin_login", "" + result.log);
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
            } catch (err) {
                console.log(err)
            }
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

    var getUnshippedOrders = function() {
        return fetch("/api/getUnshippedOrders")
    }

    var populateOrdersTable = function(results) {
        for (let result of results) {
            ordersTable.append(createOrdersRow(result))
        }
    }

    var createOrdersRow = function(result) {
        let row = $("<tr>")
        row.append($("<td>").text(result.req_num))
        row.append($("<td>").text(result.origin))
        row.append($("<td>").text(result.dest))
        row.append($("<td>").text(result.total_val))
        row.append($("<td>").text(result.veh_ID))
        row.append($("<td>").text(result.ID))
        row.append($("<td>").text(result.lat))
        row.append($("<td>").text(result.lon))
        row.append($("<td>").text(result.I_ID))
        row.append($('<button id="shipOrder" value="' + result.req_num + 'type="button">yes</button>'))
        row.append($('<button id="rejectOrder" value="' + result.req_num + 'type="button">no</button>'))

        return row
    }

    return {
        init: events
    }
})()
