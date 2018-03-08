var ItemFactory = (function () {
    var generateItemRow = function(item) {
        $tr = $('<tr>').attr("id", item.iid).append($("<td>").text(item.name));
        // TODO FILL IN OTHER ITEM ATTR
        return $tr;
    }

    return {
        generateItemRow: generateItemRow
    }
})();