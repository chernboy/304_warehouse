IncludeCustomer = {}

IncludeCustomer = (function () {
    var events = function () {
        return new Promise((resolve, reject) => {
            $("*").each(function () {
                if ($(this).attr("include-customer-html")) {
                    Util.getHtml($(this).attr("include-customer-html"))
                        .then(function (html) {
                            $(".customer").prepend(html)
                            ItemTableController.init()
                            OrderHistory.init()
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get customer " + JSON.stringify(error))
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()

// =================================
var ItemTableController = {}
// =================================

ItemTableController = (function () {

    let tablebody

    var events = function () {

        tablebody = $("#itemTableBody")

        importItemScript(); //itemObj.js holds item schema definitio

        $("#searchitems").on("click", function () {
            Cart.emptyCartOptions()
            Cart.emptyCart()
            let itemFilter = $("#itemFilter").val()
            getItems(itemFilter)
                .then((response) => {
                    return response.json();
                })
                .then((results) => {
                    populateTableWithItems(results, tablebody)
                    Cart.fillCartOptions(results) 
                })
        })

        $("#customerLoginForm").on('submit', function (e) {
            e.preventDefault();

            let name = $("#customerLoginName").val();

            login(name)
                .then(function (response) {
                    return response.json()
                })
                .then(function (result) {
                    Util.setCookie("cu_login", result.id)
                    switchToLogout()
                })
        })

        $("#customerLogoutForm").on('submit', function (e) {
            e.preventDefault();
            Util.setCookie("cu_login", "")
            switchToLogin()
        })

        //Moves to cart page on clicking checkout
        $("#checkout").on('click', function () {
            Cart.populateCart()
            Util.showFace("cart");
        })

        //Creates shipping req, adds it to database, then redirects to order history
        $("#placeorder").on('click', function () {
            makeOrders()
            Util.showFace("orders");
        })
    };

    var makeOrders = function() {
        var orderPromises = []
        items = Cart.getCartItems()
        for (let item of items) {
            var orderObj = {}
            orderObj["qty"] = parseFloat(item.quantity)
            orderObj["origin"] = "PLACEHOLDER ORIGIN"
            orderObj["dest"] = "PLACEHOLDER DEST"
            orderObj["total_val"] = item.cost
            orderObj["shipped"] = 0
            orderObj["veh_id"] = "A0003"
            orderObj["id"] = parseFloat(Util.getCookie("cu_login"))
            orderObj["lat"] = parseFloat(item.lat)
            orderObj["lon"] = parseFloat(item.lon)
            orderObj["i_id"] = parseFloat(item.i_id)
            console.log("sending order: " + JSON.stringify(orderObj))
            $.ajax({
                url: "/api/makeShippingRequest",
                method: "post",
                contentType: "application/json",
                data: JSON.stringify(orderObj),
                success: function(result) {
                    console.log("succeeded")
                },
                error: function(err) {
                    console.log(err)
                }
            })
        }
    }

    var switchToLogout = function () {
        $("#login-nav-cust").attr("face", "logout").text("Logout")
        Util.showFace("logout")
    }

    var switchToLogin = function () {
        $("#login-nav-cust").attr("face", "login").text("Login")
        Util.showFace("login")
    }

    var login = function (name) {
        return fetch("api/userLogin?name=" + name)
    }

    var getItems = function (itemFilter) {
        return fetch("/api/getItems?filter=" + itemFilter)
    }

    var importItemScript = function () {
        var script = $("<script>");
        script.attr("src", "../js/itemObj.js");
        script.attr("type", "text/javascript");
        $('body').prepend(script);
    }

    var populateTableWithItems = function (items, table) {
        table.empty()
        for (let item of items) {
            table.append(generateItemRow(item));
        }
        console.log("[CUSTOMER] finished populating table with items")
    }

    var generateItemRow = function (item) {
        let row = $("<tr>").attr("value", item.i_id)
        row.append($("<td>").text(item.i_id))
        row.append($("<td>").text(item.weight))
        row.append($("<td>").text(item.quantity))
        row.append($("<td>").text(item.cost))
        row.append($("<td>").text(item.volume))
        row.append($("<td>").text(item.lat))
        row.append($("<td>").text(item.lon))
        row.append($("<td>").text(item.id))
        row.append(initItemQuantitySelect(item.i_id))
        row.append(initAddToCartButton(item.i_id))

        return row
    }

    var initItemQuantitySelect = function(id) {
        let input = $('<input type=number id="' + id + '_qty">')
        return input
    }

    var initAddToCartButton = function(id) {
        let button = $('<button value="' + id + '">add2Cart</button>')
        $(button).on('click', () => {
            let id = $(button).attr("value")
            let qty = parseFloat($("#" + id + "_qty").val())
            Cart.addToCart(id, qty)
        })
        return button
    }

    return {
        init: events,
        generateItemRow
    }
})();

var OrderHistory = {}

var OrderHistory = (function () {

    let shippedTable, pendingTable

    var events = function () {

        shippedTable = $("#orderHistoryShipped")
        pendingTable = $("#orderHistoryPend")

        $("#ordersRefresh").on("click", () => {
            let orderPromises = []
            orderPromises.push(getShippedOrders(Util.getCookie("cu_login")))
            orderPromises.push(getPendingOrders(Util.getCookie("cu_login")))

            Promise.all(orderPromises).then((results) => {
                results[0].json().then(populateShippedOrders)
                results[1].json().then(populatePendingOrders)
            })
        })
    }

    var getShippedOrders = function (id) {
        return fetch("/api/getCustomerShippedOrders?id=" + id)
    }

    var populateShippedOrders = function (orders) {
        shippedTable.empty()
        for (let order of orders) {
            shippedTable.append(generateOrderRow(order))
        }
    }

    var getPendingOrders = function (id) {
        return fetch("/api/getCustomerPendingOrders?id=" + id)
    }

    var populatePendingOrders = function (orders) {
        pendingTable.empty()
        for (let order of orders) {
            pendingTable.append(generateOrderRow(order))
        }
    }

    var generateOrderRow = function (order) {
        let row = $("<tr>")
        row.append($("<td>").text(order.req_num))
        row.append($("<td>").text(order.qty))
        row.append($("<td>").text(order.origin))
        row.append($("<td>").text(order.dest))
        row.append($("<td>").text(order.total_val))
        row.append($("<td>").text(order.shipped))
        row.append($("<td>").text(order.veh_id))
        row.append($("<td>").text(order.ID))
        row.append($("<td>").text(order.lat))
        row.append($("<td>").text(order.lon))
        row.append($("<td>").text(order.i_id))
        return row
    }

    return {
        init: events
    }
})()

var Cart = (function() {

    var cart = []
    var cartOptions = {}

    var init = function() {
        $("#")
    }

    var addToCart = function(id, qty) {
        let order = cartOptions[id]
        order.quantity = qty
        order.cost = qty * order.cost
        cart.push(cartOptions[id])
    }

    var getCartItems = function() {
        return cart
    }

    var emptyCart = function() {
        cart = []
    }

    var emptyCartOptions = function() {
        cartOptions = {}
    }

    var fillCartOptions = function(options) {
        for (let option of options) {
            cartOptions[option.i_id] = option
        }
    }

    var populateCart = function() {
        cartTable = $("#itemsInCart")
        for (let item of cart) {
            cartTable.append(generateItemRow(item))
        }
    }

    var generateItemRow = function (item) {
        let row = $("<tr>").attr("value", item.i_id)
        row.append($("<td>").text(item.i_id))
        row.append($("<td>").text(item.quantity))
        row.append($("<td>").text(item.cost))
        return row
    }

    return {
        init,
        addToCart,
        getCartItems,
        populateCart,
        emptyCart,
        emptyCartOptions,
        fillCartOptions
    }
    
})()