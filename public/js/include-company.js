IncludeCompany = {}

IncludeCompany = (function () {
    var events = function () {
        return new Promise((resolve, reject) => {
            console.log("Starting to include company")
            $("*").each(function () {
                if ($(this).attr("include-company-html")) {
                    Util.getHtml($(this).attr("include-company-html"))
                        .then(function (html) {
                            $(".company").prepend(html)
                            WarehouseSelectController.init();
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


var WarehouseSelectController = {}
{
    WarehouseSelectController = (function () {
    
    let select = $("#warehouseSelect");

    function events() {
        console.log("[CompanyShippingMethodsTableController: initialized");

        return getWarehouses().then(function (result) {
            console.log("got ShippingMethods:", result)
            select.append(warehouseOptions(result))
        }).catch(function (err) {
            console.log(err)
        })
    }

    var warehouseOptions = function(objs) {
        let result = []
        for (let o of obj){
            let option = $("<option>")
            option.value = obj.id
            results.append(option)
        }
        return results
    }

    function getWarehouses() {
        return fetch("/api/getWarehouses");
    }

    return {
        init: events
    }
})}
