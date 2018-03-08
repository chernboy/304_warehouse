var Customer = {}

Customer = (function () {
    var idCell;
    var nameCell;
    var events = function () {
        $(function () {
            console.log("calling events");
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
            importItems();
            var items = getItems(); // TODO: make the xmlhttprequest
            populateTableWithItems(items, $("#itemTableBody"));
        });
    };

    var getItems = function () {
        var items = []
        $.get("/api/getItems", function () {
            console.log("sent request for items");
        })
            .done(function (data) {
                // later this will be an array
                items.push(ItemFactory.generateItemRow(data)); // <- the structure of return should be defined externally
                console.log("pushed row");
            })
            .fail(function () {
                console.log("[ITC-AJAX] failed or timed out for requests");
            })
            .always(function () {
                console.log("[ITC-AJAX] finished requesting for items");
            });
        return items
    }

    var importItems = function() {
        var script = $("<script>");
        script.attr("src", "../js/itemObj.js");
        script.attr("type", "text/javascript");
        $('body').prepend(script);
    }

    var populateTableWithItems = function (items, table) {
        console.log(table.html());
        for (const o of items) {
            var $row = ItemFactory.generateItemRow(o);
            table.append($row);
        }
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
