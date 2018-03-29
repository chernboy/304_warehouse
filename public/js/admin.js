var UnshippedOrdersController = {}

var UnshippedOrdersController = (function() {
    var ordersTable
    var events = function() {
        ordersTable = $("#unshippedTable")
        getUnshippedOrders()
        .then((response) => {
            return response.json()
        })
        .then((results) => {
            populateOrdersTable(results)
        })
    }

    var populateOrdersTable = function(results) {
        for (let result of results) {
            ordersTable.append(createOrdersRow(result))
        }
    }

    var createOrdersRow = function(result) {
        let row = $("<tr>")
    }

    return {
        init: events
    }
})