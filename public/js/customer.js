IncludeCustomer = {}

IncludeCustomer = (function () {
    var events = function () {
        console.log("Starting to include customer")
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
        console.log("[ItemTableController: intialized");
        importItemScript(); //itemObj.js holds item schema definitio
        

        $("#itemSearch").on("click", function () {
            getItems().then(function (result) {
                console.log("got items:" + JSON.stringify(result))
                populateTableWithItems(result, $("#itemTableBody"))
            }).catch(function (err) {
                console.log(err)
            })
            var methods = await getShippingMethods()
            for (let o in methods)
        })

        //Moves to cart page on clicking checkout
        $("#checkout").on('click', function() {
            Util.showFace("cart");
        })
    };

    var getItems = function () {
        return fetch("/api/getItems")
    }

    var importItemScript = function () {
        var script = $("<script>");
        script.attr("src", "../js/itemObj.js");
        script.attr("type", "text/javascript");
        $('body').prepend(script);
    }

    var populateTableWithItems = function (items, table) {
        table.append(ItemFactory.generateItemRow(items));
        console.log("finished populating table");
    }

    var getCleanRow = function () {
        let row = $("#cleanRow").clone();
        row.attr("id") = "";
        row.removeClass("hidden");
        return row;
    }

    return {
        init: events
    }
})();