var Customer = {}

Customer = (function () {
    var idCell;
    var nameCell;
    var events = function () {
        console.log("calling events");
        document.querySelector("body").onload = function () {
            console.log("[CUSTOMER] document loaded");
        };
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

    var table = $("#itemTableBody");
    load("./itemObj.js");

    var events = function () {
        $(document).ready(() => {
            var items = getItems(); // TODO: make the xmlhttprequest
            populateTable(items);
        })
    };

    var getItems = function () {
        var items = []
        $.get("/api/getItems", function () {
            cosole.log("sent request for items");
        })
            .done(function (data) {
                console.log("[ITC-AJAX] got result for items back " + JSON.stringify(data));
                // later this will be an array
                items.push(ItemFactory.generateItem(data)); // <- the structure of return should be defined externally
            })
            .fail(function () {
                console.log("[ITC-AJAX] failed or timed out for requests");
            })
            .always(function () {
                console.log("[ITC-AJAX] finished requesting for items");
            });
        return items
    }

    var populateTable = function(items) {
        for (const o of items) {
            table.append(ItemFactory.generateItemRow(o));
        }
    }

    var getCleanRow = function() {
        let row = $("#cleanRow").clone();
        row.attr("id") = "";
        row.removeClass("hidden");
        return row;
    }

    return {
        init: events
    }
});

ItemTableController.init();
