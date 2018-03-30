var Index = {}

var Index = (function() {

    var init = function() {
        $(function() {
            header = $("#jokeHeader")
            rand = Math.random()
            if (rand > 0.6) {
                $(header).html("&nbsp; &nbsp;There used to be a forest...")
            } else if(rand < 0.6 && rand > 0.3) {
                $(header).html("&nbsp; &nbsp;Amazon! but <em>worse</em>&nbsp;&nbsp;&#x1f6bd")
            } else {
                $(header).html("&nbsp; &nbsp;Introducing featureless Amazon!")
            }
        })
    }

    return {
        init
    }
})()

Index.init()