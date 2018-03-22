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
            getItems().then(function (result) {
                console.log("got items:" + JSON.stringify(result))
                populateTableWithItems(result, $("#itemTableBody"))
            }).catch(function (err) {
                console.log(err)
            })
        });
    };

    var getItems = function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                async: true,
                type: "GET",
                url: "/api/getItems",
                contentType: "application/json",
                success: function(data) {
                    resolve(data)
                },
                error: function(jqxhr, text, thrown) {
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

ItemTableController.init();

var NavController = {};

var NavController = (function () {

    var nav

    var navhead
    var buttons;

    var navbody
    var faces

    var events = function () {
        $(function () {
            nav = $(".nav");
            
            navhead = $(".nav-head")

            navbody = $(".nav-body")
            faces = $(".face")

            $(".nav-button").each(function () {
                $(this).on('click', function () {
                    let face = $(this).attr("face")
                    console.log(face + " was clicked")
                    showFace(face)
                })
                $(this).on('mouseenter', function() {
                    $(this).addClass("active")
                })
                $(this).on('mouseleave', function() {
                    $(this).removeClass("active")
                })
            })
        })
    }

    var showFace = function (face) {
        $(".face").each(function() {
            if ($(this).attr("face") === face) {
                Util.show($(this))
            } else {
                Util.hide($(this))
            }
        })
    }

    return {
        init: events
    }
})();

NavController.init();