/******************************
 VARIABLES
 *****************************/

let userState = '';
let politicianId = '';
let politicianName = '';

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

// Set url to id of selected name with politicianId variable

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

    // House

    var resultHouse = $.ajax({

            url: `https://api.propublica.org/congress/v1/members/house/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultHouse) {
            /* if the results are meeningful, we can just console.log them */
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

function displayHouseResults(houseArray) {

    let buildHouseMembers = "";

    $.each(houseArray.results, function (houseArrayKey, houseArrayValue) {
        buildHouseMembers +=
            `<li><a href="./?id=${encodeURI(houseArrayValue.id)}">${houseArrayValue.name}</a></li>`

        //show in HTML
        $('#house ul').html(buildHouseMembers)
    })
}

// Senate
function getProPublicaSenate(userState) {

    var resultSenate = $.ajax({

            url: `https://api.propublica.org/congress/v1/members/senate/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultSenate) {
            /* if the results are meeningful, we can just console.log them */
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

function displaySenateResults(senateArray) {

    let buildSenateMembers = "";

    $.each(senateArray.results, function (senateArrayKey, senateArrayValue) {
        buildSenateMembers +=
            `<li><a href="./?id=${encodeURI(senateArrayValue.id)}">${senateArrayValue.name}</a></li>`

        //show in HTML
        $('#senate ul').html(buildSenateMembers)
    })
}

// Call ProPublica API for individual members using politicianId variable

function getIndividualPolitician(politicianId) {

    var resultIndividualPolitician = $.ajax({

            url: `https://api.propublica.org/congress/v1/members/${politicianId}.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (resultIndividualPolitician) {
            /* if the results are meeningful, we can just console.log them */
            console.log(resultIndividualPolitician);

            displayIndividualResults(resultIndividualPolitician);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

// Display results of individual politician call
function displayIndividualResults(individualArray) {

    $.each(individualArray.results, function (individualArrayKey, individualArrayValue) {

        // store name in variable
        politicianName = `${individualArrayValue.first_name} ${individualArrayValue.last_name}`

        console.log(politicianName);

        // Politician name - heading
        $('#pol-name').append(`<a href="${individualArrayValue.url}" target="_blank">${politicianName}</a>`);

        // Image
        $('#pol-image').append(`<img src="https://theunitedstates.io/images/congress/225x275/${politicianId}.jpg" alt="Image of ${individualArrayValue.first_name} ${individualArrayValue.last_name}">`)

        if (individualArrayValue.current_party === "D") {
            $('#party').append('Democrat');
        }
        if (individualArrayValue.current_party === "R") {
            $('#party').append('Republican');
        }
        if (individualArrayValue.current_party === "I") {
            $('#party').append('Independent');
        }

        // Contact Info

        $('#contact-info').append(
            `
<p>Phone: ${individualArrayValue.roles[0].phone}</p>
<p>Office: ${individualArrayValue.roles[0].office}, Washington, DC 20515</p>
<p>Facebook:  <a href="https://www.facebook.com/${individualArrayValue.facebook_account}/" target="_blank">${individualArrayValue.facebook_account}</a></p>
<p>Twitter:  <a href="https://www.twitter.com/${individualArrayValue.twitter_account}?lang=en" target="_blank">${individualArrayValue.twitter_account}</a></p>
`);
    });

    // Call Wiki API
    function getWikiApi(politicianName) {
        //        var txt = politicianName;
        var resultWiki = $.ajax({
                url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&exintro&explaintext&exsentences=1&exlimit=max&gsrlimit=10&callback=?&gsrsearch=${politicianName}`,
                type: "GET",
                //                    data: data,
                dataType: 'jsonp',
            })

            /* if the call is successful (status 200 OK) show results */
            .done(function (resultWiki) {
                /* if the results are meaningful, we can just console.log them */
                console.log(resultWiki);

                // show in html
                displayWikiArticle(resultWiki);
            })
            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);

                console.log(errorThrown);
            });
    };

    // Display Wiki API

    function displayWikiArticle(wikiArray) {

        let buildWikiOutput = '';

        // pages.title == politicianNameDetails

        $.each(wikiArray.query.pages, function (wikiArrayKey, wikiArrayValue) {

            if (wikiArrayValue.title == politicianName) {

                buildWikiOutput += `<article>`;
                buildWikiOutput += `<p>${wikiArrayValue.extract}</p>`
                buildWikiOutput += `<h5><a href="https://en.wikipedia.org/?curid=${wikiArrayValue.pageid}" target="_blank">See more on Wikipedia</a></h5>`
                buildWikiOutput += `</article>`

                // show in html
                $('#contact-info').append(buildWikiOutput);


            }
        });
    }

    // Call NY Times API
    function getTimesArticles(politicianName) {

        var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
        url += '?' + $.param({
            'api-key': '048e67fe7fe94ffb92aa6a58646dc462',
            'q': politicianName,
        });

        var timesResult = $.ajax({

                url: url,
                method: 'GET',
            })
            /* if the call is successful (status 200 OK) show results */
            .done(function (timesResult) {
                /* if the results are meeningful, we can just console.log them */
                console.log(timesResult);

                displayTimesArticle(timesResult);

            })
            /* if the call is NOT successful show errors */
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }

    // display times articles

    function displayTimesArticle(timesArray) {

        let firstThree = timesArray.response.docs.slice(0, 3);
        //    console.log(firstThree);

        $.each(firstThree, function (timesArrayKey, timesArrayValue) {

            let buildNyTimesOutput = '';

            buildNyTimesOutput += `<article class="col-4">`;
            buildNyTimesOutput += `<h4><a href="${timesArrayValue.web_url}" target="_blank">${timesArrayValue.headline.main}</a></h4>`;
            buildNyTimesOutput += `<img href="${timesArrayValue.multimedia.subtype}">`;
            buildNyTimesOutput += `<p>${timesArrayValue.snippet}</p>`;
            buildNyTimesOutput += `</article>`;

            //show in html

            $('#news-section').append(buildNyTimesOutput);

        });
    }
    getWikiApi(politicianName);
    getTimesArticles(politicianName);
}



/******************************
FUNCTION USAGE
******************************/
$(document).ready(function () {

    // #STATE-FORM

    // At start, only show form (id: #state-form)

    politicianId = decodeURI(getAllUrlParams().id);

    console.log("Bioguide ID ==> ", politicianId);
    console.log("urlParams ==> ", Object.keys(getAllUrlParams()).length);

    // Conditional to set #list-names if name is clicked

    // no id defined
    if ((Object.keys(getAllUrlParams()).length == 0) || (politicianId == '') || (politicianId === undefined)) {
        console.log("id-undefined");
        $("#list-names").hide();
        $("#results-section").hide();
        $('.return-link-div').hide();
        $("#state-form").show();
    }
    // id defined
    else {
        console.log("id-defined");
        $("#state-form").hide();
        $("#list-names").hide();
        $('.return-link-div').show();
        $("#results-section").show();

        // CALL RESULTS FUNCTIONS HERE
        // Call ProPublica API for individual call
        getIndividualPolitician(politicianId);
        //        getTimesArticles(politicianName);
    }

    // On click #state-submit activate getStateInput() function and show #list-names section

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
        $('.return-link-div').show();
    });

})
