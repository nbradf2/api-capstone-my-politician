/******************************
 VARIABLES
 *****************************/

let userState = '';
let politicianId = '';

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
            `<li><a href="/?id=${encodeURI(houseArrayValue.id)}">${houseArrayValue.name}</a></li>`

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
            `<li><a href="/?id=${encodeURI(senateArrayValue.id)}">${senateArrayValue.name}</a></li>`

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
            //            displaySenateResults(resultIndividualPolitician);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};


// START HERE
// Display results of individual politician call
function displayIndividualResults(individualArray) {

    // display selected politician's name
    let buildPoliticianName = "";

    $.each(individualArray.results, function (individualArrayKey, individualArrayValue) {
        buildPoliticianName +=
            `<h2 id="pol-name">${individualArrayValue.first_name} ${individualArrayValue.last_name}</h2>`

        //show in HTML
        $('#info-section').html(buildPoliticianName)
    })
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
        $("#state-form").show();
    }
    // id defined
    else {
        console.log("id-defined");
        $("#state-form").hide();
        $("#list-names").hide();
        $("#results-section").show();

        // CALL RESULTS FUNCTIONS HERE
        // Call ProPublica API for individual call
        getIndividualPolitician(politicianId);

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
    });




})
