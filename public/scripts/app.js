$(document).ready(function() {
    // handle the form submit
    $('#searchText').on('keypress', function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            if ($(this).val().trim().length > 0) {
                // initiate an Ajax call to send the data
                fireAJAX($(this).val().trim());
            }
        }
    });

    function fireAJAX(text) {
        $.ajax({
            type: 'POST',
            url: '/search',
            data: {
                search: text
            },
            beforeSend: function(xhr) {
                $('.tweet-results').html('');
                $('.results').show();
                enableState();
            },
            success: parseData,
            error: oops
        });
        console.log("To jest log");
        console.log(text);
    }

    function parseData(data) {
        disableState();
        var scoreResult = [];
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var s = data[i].sentiment,
                t = data[i].tweet;
            console.log("Wynik: " + s.score);

            if(s.score != 0) {
                scoreResult[i] = s.score;
                console.log("Wynik: " + s.score);

            }
            var _o = {
                imgSrc: t.user.profile_image_url,
                tweetLink: 'http://twitter.com/' + t.user.screen_name + '/status/' + t.id_str,
                tweet: t.text,
                score: s.score ? s.score : '--',
                comparative: s.comparative ? s.comparative : '--',
                favorited: t.favorite_count ? t.favorite_count : 0,
                retweet: t.retweet_count ? t.retweet_count : 0,
                wordsMatched: s.words && s.words.length ? s.words : '--',
                positiveWords: s.positive && s.positive.length ? s.positive : '--',
                negativeWords: s.negative && s.negative.length ? s.negative : '--'
            };

            html += tmpl('tweet_tmpl', _o);
        };
        console.log("Tablica: " + scoreResult[2]);
        console.log("Ilosc danych: " + data.length);
        $('.tweet-results').html(html);
        createHistogram(scoreResult);
    }

    function createHistogram(scoreResult)
    {



        var data = [
            {
                x: scoreResult,
                type: 'histogram'
            }
        ];
        Plotly.newPlot('graf', data);
    }

    function makeGraph()
    {
        var container = document.getElementById("graph");
        var labels = document.getElementById("labels");
        var dnl = container.getElementsByTagName("li");
        for(var i = 0; i < dnl.length; i++)
        {
            var item = dnl.item(i);
            var value = item.innerHTML;
            var content = value.split(":");
            value = content[0];
            item.style.height=value + "px";
            item.style.top=(199 - value) + "px";
            item.style.left = (i * 50 + 20) + "px";
            item.style.height = value + "px";
            item.innerHTML = value;
            item.style.visibility="visible";
            left = (i * 50 + 58) + "px";
            labels.innerHTML = labels.innerHTML +
                "<span style='position:absolute;top:-16px;left:"+
                left+";background:"+ color+"'>" + year + "</span>";
        }
    }
    window.onload=makeGraph;

    function oops(data) {
        $('.error').show();
        disableState();
    }

    function disableState() {
        $('.loading').hide();
        $('#searchText').prop('disabled', false);
    }

    function enableState() {
        $('.loading').show();
        $('#searchText').prop('disabled', true);
    }
});

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("{{").join("\t") // modified
                    .replace(/((^|\}\})[^\t]*)'/g, "$1\r") // modified
                    .replace(/\t=(.*?)}}/g, "',$1,'") // modified
                    .split("\t").join("');")
                    .split("}}").join("p.push('") // modified
                    .split("\r").join("\\'") + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();
