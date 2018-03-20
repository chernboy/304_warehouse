var Customer = {}

Customer = (function () {
    var idCell;
    var nameCell;
    var events = function () {
        $(function () {
            console.log("[CUSTOMER] document loaded");
        });
    };

    return {
        init: events
    }
})();

Customer.init();

// =================================
var ItemTableController = {}
// =================================

ItemTableController = (function () {


    var events = function () {
        $(function () {
            console.log("[ItemTableController: Document loaded");
            importItemScript(); //itemObj.js holds item schema definition
            getItems().then(function(result) {
                console.log("got items:" + JSON.stringify(result))
                populateTableWithItems(result, $("#itemTableBody"))
            }).catch(function(err) {
                console.log(err)
            })
        });
    };

    var getItems = function () {
        return new Promise(function (resolve, reject) {
            result = [];
            $.get("/api/getItems", function () {
                console.log("sent request for items");
            })
                .done(function (data) {
                    // later this will be an array
                    console.log("got items back");
                    result.push(data); // <- the structure of return should be defined externally
                    resolve(result);
                })
                .fail(function () {
                    console.log("[ITC-AJAX] failed or timed out for requests");
                    reject("failed to get items");
                })
                .always(function () {
                    console.log("[ITC-AJAX] finished requesting for items");
                });
        });
    }

    var importItemScript = function () {
        var script = $("<script>");
        script.attr("src", "../js/itemObj.js");
        script.attr("type", "text/javascript");
        $('body').prepend(script);
    }

    var populateTableWithItems = function (items, table) {
        for (const o of items) {
            table.append(ItemFactory.generateItemRow(o));
        }
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

ItemTableController.init();

var NavController = {};

var NavController = (function() {

    var bar = $("#navbar")
    var buttons = []
    var navbody = $("#navbody")
    var faces = [];

    var events = function() {
        $(function() {
            faces.push(...document.getElementsByClassName("nav-face"))
            buttons.push(...document.getElementsByClassName("nav-button"))
            for (let o of Array.keys(buttons)) {
                
            }
        })
    }

    return {
        init: events
    }
})();

NavController.Init(function() {

});