IncludeCustomer = {}

IncludeCustomer = (function () {
    var events = function () {
        console.log("Starting to include customer")
        //REMOVE THIS ONCE WE HAVE LOGIN
        Util.setCookie("cu_login", "something")
        return new Promise((resolve, reject) => {
            $("*").each(function () {
                if ($(this).attr("include-customer-html")) {
                    Util.getHtml($(this).attr("include-customer-html"))
                        .then(function (html) {
                            $(".customer").prepend(html)
                            ItemTableController.init();
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

    let tablebody = $("#itemTableBody")

    var events = function () {

        importItemScript(); //itemObj.js holds item schema definitio

        $("#searchitems").on("click", function () {
            let itemFilter = $("#itemFilter").val()
            getItems(itemFilter)
            .then((response) => {
                return response.json();
            })
            .then((results) => {
                populateTableWithItems(results, tablebody)
            })
        })

        $("#loginSubmit").on('click', function () {
            login().then(function (results) {
                console.log("successfully logged in")
            })
        })

        //Moves to cart page on clicking checkout
        $("#checkout").on('click', function () {
            //TODO: implement robust checking
            Util.showFace("cart");
        })

        $("#placeorder").on('click', function () {
            //TODO: create shipping method and add it to database
            Util.showFace("orders");
        })
    };

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
        for (let item of items) {
            table.append(generateItemRow(item));
        }
        console.log("[CUSTOMER] finished populating table with items")
    }

    var generateItemRow = function(item) {
        let row = $("<tr>").attr("value", item.I_ID)
        row.append($("<td>").text(item.I_ID))
        row.append($("<td>").text(item.cost))
        return row
    }

    return {
        init: events
    }
})();