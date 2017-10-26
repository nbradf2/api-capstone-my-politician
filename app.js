/******************************
 VARIABLES
 *****************************/

let userState = '';
let politicianId = '';
let politicianName = '';
let politicianNameWithMiddle = '';

/******************************
 FUNCTION DEFINITIONS
 *****************************/

function getStateInput() {
    userState = $('#my-state').val();
};

// Set url to id of selected name with politicianId variable
function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};

    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName][paramNum] = paramValue;
                }
            } else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}

function getProPublicaHouse(userState) {

    var resultHouse = $.ajax({
            url: `https://api.propublica.org/congress/v1/members/house/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        .done(function (resultHouse) {
            displayHouseResults(resultHouse);
        })
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
            `<li><a href="./?id=${encodeURI(houseArrayValue.id)}">${houseArrayValue.name} (${houseArrayValue.party})</a></li>`

        $('#house ul').html(buildHouseMembers)
    })
}


function getProPublicaSenate(userState) {
    var resultSenate = $.ajax({
            url: `https://api.propublica.org/congress/v1/members/senate/${userState}/current.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        .done(function (resultSenate) {
            displaySenateResults(resultSenate);
        })
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
            `<li><a href="./?id=${encodeURI(senateArrayValue.id)}">${senateArrayValue.name} (${senateArrayValue.party})</a></li>`

        $('#senate ul').html(buildSenateMembers)
    })
}

function getIndividualPolitician(politicianId) {
    var resultIndividualPolitician = $.ajax({

            url: `https://api.propublica.org/congress/v1/members/${politicianId}.json`,
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        .done(function (resultIndividualPolitician) {
            displayIndividualResults(resultIndividualPolitician);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

function displayIndividualResults(individualArray) {
    $.each(individualArray.results, function (individualArrayKey, individualArrayValue) {

        politicianName = `${individualArrayValue.first_name} ${individualArrayValue.last_name}`;
        politicianNameWithMiddle = `${individualArrayValue.first_name} ${individualArrayValue.middle_name} ${individualArrayValue.last_name}`;

        $('#pol-name').append(`<a href="${individualArrayValue.url}" target="_blank">${politicianName}</a>`);
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

        $('#contact-info').append(
            `
            <p><i class = "fa fa-phone"></i>${individualArrayValue.roles[0].phone}</p>
            <p><i class="fa fa-map-marker"></i> ${individualArrayValue.roles[0].office}, Washington, DC 20515</p>
            <p><i class="fa fa-facebook-square"></i><a href="https://www.facebook.com/${individualArrayValue.facebook_account}/" target="_blank">${individualArrayValue.facebook_account}</a></p>
            <p><i class="fa fa-twitter-square"></i><a href="https://www.twitter.com/${individualArrayValue.twitter_account}?lang=en" target="_blank">${individualArrayValue.twitter_account}</a></p>
            `
        );
    });

    function getWikiApi(politicianName) {
        var resultWiki = $.ajax({
                url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&exintro&explaintext&exsentences=1&exlimit=max&gsrlimit=10&callback=?&gsrsearch=${politicianName}`,
                type: "GET",
                dataType: 'jsonp',
            })
            .done(function (resultWiki) {
                displayWikiArticle(resultWiki);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };

    function displayWikiArticle(wikiArray) {
        let buildWikiOutput = '';

        $.each(wikiArray.query.pages, function (wikiArrayKey, wikiArrayValue) {
            if (
               
                wikiArrayValue.pageid == 361176 || //Bernie Sanders (VT)
                // wikiArrayValue.pageid == 43266580 || //Gary Palmer (AL)
                // wikiArrayValue.pageid == 24332024 || //Dan Sullivan (AK)
                // wikiArrayValue.pageid == 44279869 || //French Hill (AK)
                wikiArrayValue.title == politicianName ||
                wikiArrayValue.title == politicianNameWithMiddle
            ) {

                buildWikiOutput += `<article>`;
                buildWikiOutput += `<p class="wiki-style">${wikiArrayValue.extract}</p>`
                buildWikiOutput += `<h5><a href="https://en.wikipedia.org/?curid=${wikiArrayValue.pageid}" target="_blank">More on <i class="fa fa-wikipedia-w"></i></a></h5>`
                buildWikiOutput += `</article>`

                // show in html
                $('#contact-info').append(buildWikiOutput);
            }
        });
    }

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
            .done(function (timesResult) {
                displayTimesArticle(timesResult);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }

    function displayTimesArticle(timesArray) {
        let firstThree = timesArray.response.docs.slice(0, 3);
        $.each(firstThree, function (timesArrayKey, timesArrayValue) {
            let buildNyTimesOutput = '';

            buildNyTimesOutput += `<article class="col-4 ny-times-style">`;
            buildNyTimesOutput += `<h4><a href="${timesArrayValue.web_url}" target="_blank">${timesArrayValue.headline.main}</a></h4>`;
            buildNyTimesOutput += `<img href="${timesArrayValue.multimedia.subtype}">`;
            buildNyTimesOutput += `<p>${timesArrayValue.snippet}</p>`;
            buildNyTimesOutput += `</article>`;

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
    politicianId = decodeURI(getAllUrlParams().id);

    console.log("Bioguide ID ==> ", politicianId);
    console.log("urlParams ==> ", Object.keys(getAllUrlParams()).length);

    if ((Object.keys(getAllUrlParams()).length == 0) || (politicianId == '') || (politicianId === undefined)) {
        console.log("id-undefined");
        $("#list-names").hide();
        $("#results-section").hide();
        $(".return-link-div").hide();
        $("#state-form").show();
        $(".headline").show();
    } else {
        console.log("id-defined");
        $("#state-form").hide();
        $(".headline").hide();
        $("#list-names").hide();
        $("#previous-page").hide();
        $(".return-link-div").show();
        $("#results-section").show();

        getIndividualPolitician(politicianId);
    }

    $('#my-state').on('change', function () {
        event.preventDefault();

        getStateInput();
        getProPublicaHouse(userState);
        getProPublicaSenate(userState);

        $("#results-section").hide();
        $("#state-form").hide();
        $(".headline").hide();
        $("#previous-page").hide();
        $(".return-link-div").show();
        $("#list-names").show();
    });

    $("#start-over").click(function () {
        $("#list-names").hide();
        $("#results-section").hide();
        $(".return-link-div").hide();
        $("#state-form").show();
        $(".headline").show();
    })
})
