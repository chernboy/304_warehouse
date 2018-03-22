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


    var events = function () {
        console.log("[ItemTableController: intialized");
        importItemScript(); //itemObj.js holds item schema definition
        getItems().then(function (result) {
            console.log("got items:" + JSON.stringify(result))
            populateTableWithItems(result, $("#itemTableBody"))
        }).catch(function (err) {
            console.log(err)
        })
    };

    var getItems = function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                async: true,
                type: "GET",
                url: "/api/getItems",
                contentType: "application/json",
                success: function (data) {
                    resolve(data)
                },
                error: function (jqxhr, text, thrown) {
                    reject(text)
                }
            })
        })
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