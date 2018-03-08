var Customer = {}

Customer = (function () {
    var idCell;
    var nameCell;
    var events = function () {
        console.log("calling events");
        document.querySelector("body").onload = function () {
            console.log("document loaded");
            var itemRow = document.getElementById("row");
            console.log(itemRow.childNodes.length);
            var children = itemRow.childNodes.forEach((child) => {
                switch (child.id) {
                    case "itemID":
                        idCell = child;
                        console.log("found idCell: " + JSON.stringify(idCell));
                        break;
                    case "itemName":
                        nameCell = child;
                        console.log("found nameCell: " + JSON.stringify(nameCell));
                        break;
                    default:
                        console.log("found extra item");
                        break;
                }
            });
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

    var events = function () {
        $(document).onload(() => {
            items = getItems(); // TODO: make the xmlhttprequest
            populateTable(items);
        })
    };

    var getItems = function () {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                this.responseL
            }
        };
        xhttp.open("GET", "/api/getItems", true);
        xhttp.send();
    }

    return {
        init: events
    }
});

ItemTableController.init();
