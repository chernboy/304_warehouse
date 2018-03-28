IncludeCompany = {}

IncludeCompany = (function () {
    var events = function () {
        //REMOVE THIS ONCE WE HAVE LOGIN
        Util.setCookie("co_login", "something")
        return new Promise((resolve, reject) => {
            console.log("Starting to include company")
            $("*").each(function () {
                if ($(this).attr("include-company-html")) {
                    Util.getHtml($(this).attr("include-company-html"))
                        .then(function (html) {
                            $(".company").prepend(html)
                            WarehouseSelectController.init();
                            CompanyItemsTableController.init();
                            resolve()
                        }).catch(function (error) {
                            reject("failed to get company " + JSON.stringify(error))
                        })
                }
            })
        })
    }

    return {
        execute: events
    }
})()

const CompanyItemFactory = {
    generateItemRow() {
        $tr = $('<tr>')
            .attr("id", item.iid)
            .append($("<td>").text(item.iid))
            .append($("<td>").text(item.name));
        // TODO FILL IN OTHER ITEM ATTR
        return $tr;
    }
}

const CompanyItemsTableController = {}
{
    let tablebody = $("#companyItemsTable");

    function events() {
        console.log("[CompanyItemsTableController: initialized");

        return getItems().then(function (result) {
            console.log("got items:", result)
            tablebody.append(CompanyItemFactory.generateItemRow(result))
        }).catch(function (err) {
            console.log(err)
        })
    }

    function getItems() {
        return fetch("/api/getItems");
    }

    CompanyItemsTableController.init = events;
}

const WarehouseSelectController = (function () {
    var warehouseSelect
    var events = function () {
        warehouseSelect = $("#warehouseSelect")
        getWarehouses().then((response) => {
            response.json().then((results) => {
                for (let o of results) {
                    warehouseSelect.append(createWarehouseOption(o))
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    var getWarehouses = function () {
        return fetch("/api/getWarehouses")
    }

    var createWarehouseOption = function (warehouse) {
        let option = $("<option>")
        option.text("" + warehouse.lat + "" + warehouse.lon)
        option.attr("lat", warehouse.lat)
        option.attr("lon", warehouse.lon)
        return option
    }


    return {
        init: events
    }
})()
