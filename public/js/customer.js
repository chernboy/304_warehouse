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
        console.log("[ItemTableController: intialized");
        importItemScript(); //itemObj.js holds item schema definition
        

        $("#searchitems").on("click", function () {
            getItems().then(function (result) {
                console.log("got items:" + JSON.stringify(result))
                populateTableWithItems(result, $("#itemTableBody"))
            }).catch(function (err) {
                console.log(err)
            })
        })

        //Moves to cart page on clicking checkout
        $("#checkout").on('click', function() {
            //TODO: implement robust checking (must select a shipping option)
            Util.showFace("cart");
        })

        //Creates shipping req, adds it to database, then redirects to order history
        $("#placeorder").on('click', function() {
            //TODO: create shipping request and add it to database
            Util.showFace("orders");
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