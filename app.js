/******************************
 VARIABLES
 *****************************/

let userState = '';
let politicianName = '';
let facebookName = '';
let twitterName = '';

/******************************
 FUNCTION DEFINITIONS
 *****************************/

// To get user input (state):

function getStateInput() {
    //    alert("getStateInput() activated!");

    // get value of selected state:
    userState = $('#my-state').val();

    // test
    console.log(userState);

};

var politicianNameDetails = "";

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}



// get ProPublica API (House):
function getProPublicaHouse(userState) {

    var resultHouse = $.ajax({
            /* https://projects.propublica.org/api-docs/congress-api/members/#get-current-members-by-statedistrict*/
            //url: "https://api.propublica.org/congress/v1/members/senate/IL/current.json",
            url: `https://api.propublica.org/congress/v1/members/house/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultHouse) {
            /* if the results are meaningful, we can just console.log them */
            console.log(resultHouse);

            displayHouseResults(resultHouse);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

// Build list of House members
function displayHouseResults(houseArray) {

    let buildHouseMembers = "";

    $.each(houseArray.results, function (houseArrayKey, houseArrayValue) {
        buildHouseMembers +=
            `<li><a href="/?name=${encodeURI(houseArrayValue.name)}">${houseArrayValue.name}</a></li>`

        //show in HTML
        $('#house ul').html(buildHouseMembers)
    })
}

// get ProPublica API (Senate):
function getProPublicaSenate(userState) {

    var resultSenate = $.ajax({
            /* https://projects.propublica.org/api-docs/congress-api/members/#get-current-members-by-statedistrict*/
            //url: "https://api.propublica.org/congress/v1/members/senate/IL/current.json",
            url: `https://api.propublica.org/congress/v1/members/senate/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultSenate) {
            /* if the results are meaningful, we can just console.log them */
            console.log(resultSenate);

            displaySenateResults(resultSenate);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

// Build list of Senate members
function displaySenateResults(senateArray) {

    let buildSenateMembers = "";

    $.each(senateArray.results, function (senateArrayKey, senateArrayValue) {
        buildSenateMembers +=
            `<li><a href="/?name=${encodeURI(senateArrayValue.name)}">${senateArrayValue.name}</a></li>`

        //show in HTML
        $('#senate ul').html(buildSenateMembers)
    })
}

// Get name of person clicked on

function getPoliticianName(politicianNameDetails) {

    $("#info-section h2").text(politicianNameDetails);
    //    $('#senate-members').on('click', function {
    //        politicianName =
    //            '<h2 id="pol-name">' + senateArrayValue.name + '</h2>';
    //        console.log(politicianName);
    //
    //        // show in HTML
    //        $('#pol-name').html(politicianName);
    //    })
};

function callTimesApi(politicianNameDetails) {
    var data = politicianNameDetails;

    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    url += '?' + $.param({
        'api-key': '048e67fe7fe94ffb92aa6a58646dc462',
        'q': data,
        //        'fq': 'congress',
    });


    var resultTimes = $.ajax({

            url: url,
            method: 'GET',
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultTimes) {
            /* if the results are meaningful, we can just console.log them */
            console.log(resultTimes);
            showTimesArticle(resultTimes);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });

}


// display times articles
function showTimesArticle(timesArray) {


    //    console.log(timesArray);

    // get first 3 items of timesArray

    //store article info in a variable:


    let firstThree = timesArray.response.docs.slice(0, 3);
    //    console.log(firstThree);

    $.each(firstThree, function (timesArrayKey, timesArrayValue) {

        let buildNyTimesOutput = '';

        buildNyTimesOutput += `<article class="col-4">`;
        buildNyTimesOutput += `<h4><a href="${timesArrayValue.web_url}" target="_blank">${timesArrayValue.headline.main}</a></h4>`;
        buildNyTimesOutput += `<img href="${timesArrayValue.multimedia}">`
        buildNyTimesOutput += `<p>${timesArrayValue.snippet}</p>`;
        buildNyTimesOutput += `</article>`;

        //show in html

        $('#news-section').append(buildNyTimesOutput);

    });

};

function callWikiApi(politicianNameDetails) {
    var txt = politicianNameDetails;
    var resultWiki = $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&exintro&explaintext&exsentences=1&exlimit=max&gsrlimit=10&callback=?&gsrsearch=" + encodeURIComponent(txt),
            type: "GET",
            //                    data: data,
            dataType: 'jsonp',
        })

        /* if the call is successful (status 200 OK) show results */
        .done(function (resultWiki) {
            /* if the results are meaningful, we can just console.log them */
            console.log(resultWiki);

            // show in html
            showWikiArticle(resultWiki);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);

            console.log(errorThrown);
        });
};

function getAreaMetaInfo_Wikipedia(page_id) {
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            pageids: page_id,
            format: 'json'
        },
        dataType: 'jsonp',
        success: function (data) {

            title = data.query.pages[page_id].title.replace(' ', '_');
            $.ajax({
                url: 'http://en.wikipedia.org/w/api.php',
                data: {
                    action: 'parse',
                    prop: 'text',
                    page: title,
                    format: 'json'
                },
                dataType: 'jsonp',
                success: function (data) {
                    console.log(data);
                    wikipage = $("<div>" + data.parse.text['*'] + "</div>").children().children('p');
                    console.log(data.parse.text['*']);
                    wikipage.find('sup').remove();
                    wikipage.find('a').each(function () {
                        $(this)
                            .attr('href', 'http://en.wikipedia.org' + $(this).attr('href'))
                            .attr('target', 'wikipedia');
                    });

                    $("#wiki_container").append(wikipage);
                    //                    $("#wiki_container").append("<a href='http://en.wikipedia.org/wiki/" + title + "' target='wikipedia'>Read more on Wikipedia</a>");
                }
            });
        }
    });
}

// diplay wiki article
function showWikiArticle(wikiArray) {

    let buildWikiOutput = '';

    // pages.title == politicianNameDetails

    $.each(wikiArray.query.pages, function (wikiArrayKey, wikiArrayValue) {

        if (wikiArrayValue.title == politicianNameDetails) {

            buildWikiOutput += `<article>`;
            buildWikiOutput += `<h4><a href="https://en.wikipedia.org/?curid=${wikiArrayValue.pageid}" target="_blank">${wikiArrayValue.title}</a></h4>`;
            buildWikiOutput += `<p>${wikiArrayValue.extract}</p>`

            // show in html
            $('#wiki-section').append(buildWikiOutput);

            getAreaMetaInfo_Wikipedia(wikiArrayValue.pageid);
        }
    });
}







/******************************
FUNCTION USAGE
******************************/
$(document).ready(function () {


    // #STATE-FORM

    // At start, only show form (id: #state-form)

    politicianNameDetails = decodeURI(getAllUrlParams().name);

    console.log("mame ==> ", politicianNameDetails);
    console.log("urlParams ==> ", Object.keys(getAllUrlParams()).length);


    //no name defined
    if ((Object.keys(getAllUrlParams()).length == 0) || (politicianNameDetails == '') || (politicianNameDetails === undefined)) {
        console.log("name-undefined");
        $("#list-names").hide();
        $("#results-section").hide();
        $("#state-form").show();

    }
    //name defined
    else {
        console.log("name-defined");
        $("#state-form").hide();
        $("#list-names").hide();
        $("#results-section").show();

        getPoliticianName(politicianNameDetails);
        // Call Wiki API with politician name

        callTimesApi(politicianNameDetails);
        callWikiApi(politicianNameDetails);

    }

    // On change #state-submit activate getStateInput() function

    $('#my-state').on('change', function () {
        event.preventDefault();

        // Get user input (state)
        getStateInput();

        // Call ProPublica API for House and Senate name info
        getProPublicaHouse(userState);
        getProPublicaSenate(userState);

        // show #list-names section
        $("#results-section").hide();
        $("#state-form").hide();
        $("#list-names").show();


    });

    // # LIST-NAMES

    // on click #house-members or #senate-members (this), show #results-section

    //    $('#list-names').on('click', function () {
    //
    //        $("#state-form").hide();
    //        $("#list-names").hide();
    //        $("#results-section").show();
    //
    //        getPoliticianName();
    //    })



})
