var UnshippedOrdersController = {}

var UnshippedOrdersController = (function() {
    var warehouseSelect
    var warehouseSelectMove
    var ordersTable
    var events = function() {
        ordersTable = $("#unshippedOrders")
        shippedOrdersTable = $("#shippedOrders")

        $("#ordersRefresh").on("click", () => {
            
            let orderPromises = []
            orderPromises.push(getUnshippedOrders(Util.getCookie("admin_login"))) 
            orderPromises.push(getShippedOrders(Util.getCookie("admin_login"))) 

            Promise.all(orderPromises).then((results) => {
                results[0].json().then(populateOrdersTable)
                results[0].json().then(populateShippedOrdersTable)
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
            //TODO: FIX, not working!!
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
    
        function switchToLogout() {
            $("#nav-login-admin").attr("face", "logout").text("Logout")
            Util.showFace("logout")
        }
    
        function switchToLogin() {
            $("#nav-login-admin").attr("face", "login").text("Login")
            Util.showFace("login")
        }

        $("#shipOrder").on('yes', function () {
            //TODO: remove orders off the unshipped orders  
            // Add orders to shipped orders 
            // figure out which button corresponds to what row 
            Util.showFace("shippedOrders")
        })

        $("#rejectOrder").on('no', function () {
            //TODO: Remove orders off the unshipped orders 
            Util.showFace("shippedOrders")
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

    var getUnshippedOrders = function() {
        return fetch("/api/getUnshippedOrders")
    }
    var getShippedOrders = function() {
        return fetch("/api/getShippedOrders")
    }
    
    var populateOrdersTable = function(results) {    
        ordersTable.empty()
        for (let result of results) {
            ordersTable.append(createOrdersRow(result))
        }
    }

    var populateShippedOrdersTable = function(results) {    
        ordersTable.empty()
        for (let result of results) {
            ordersTable.append(createShippedOrdersRow(result))
        }
    }

    var createOrdersRow = function(result) {
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
        row.append($('<button id="shipOrder" value="' + result.req_num + 'type="button">yes</button>'))
        row.append($('<button id="rejectOrder" value="' + result.req_num + 'type="button">no</button>'))

        return row
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

