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