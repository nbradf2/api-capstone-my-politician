//'use strict'

// VARIABLES

let validateState = ['alabama', 'al', 'alaska', 'ak', 'arizona', 'az', 'arkansas', 'ar', 'california', 'ca', 'colorado', 'co', 'connecticut', 'ct', 'delaware', 'de', 'florida', 'fl', 'georgia', 'ga', 'hawaii', 'hi', 'idaho', 'id', 'illinois', 'il', 'indiana', 'in', 'iowa', 'ia', 'kansas', 'ks', 'kentucky', 'ky', 'louisiana', 'la', 'maine', 'me', 'maryland', 'md', 'massachusetts', 'ma', 'michigan', 'mi', 'minnesota', 'mn', 'mississippi', 'ms', 'missouri', 'mo', 'montana', 'mt', 'nebraska', 'ne', 'nevada', 'nv', 'new hampshire', 'nv', 'new jersey', 'nj', 'new mexico', 'nm', 'new york', 'ny', 'north carolina', 'nc', 'north dakota', 'nd', 'ohio', 'oh', 'oklahoma', 'ok', 'oregon', 'or', 'pennsylvania', 'pa', 'rhode island', 'ri', 'south carolina', 'sc', 'south dakota', 'sd', 'tennessee', 'tn', 'texas', 'tx', 'utah', 'ut', 'vermont', 'vt', 'virginia', 'va', 'washington', 'wa', 'west virginia', 'wv', 'wisconsin', 'wi', 'wyoming', 'wy'];

const errorMessage = $(`<p class="invalid-text">That's not a state!  Enter the full name (i.e., "Illinois"), or the abbreviation (i.e., "IL)</p>`);

const blankMessage = $(`<p class="invalid-text">Uh oh! Looks like you forgot to add the state you're looking for!</p>`)

let userState = '';

/******************************
 FUNCTION DEFINITIONS
 *****************************/

// To get user input (state):

function getStateInput() {
    //    alert("getStateInput() activated!");

    // get value of input box:
    userState = $('#my-state').val().toLowerCase();

    // test ****console.log() not working****
    console.log(userState);

    // INPUT VALIDATION

    // if state does not match item in validateState array:

    if (userState == "") {
        $('#my-state').val('');
        $('#state-form').append(blankMessage);

    } else if (validateState.includes(userState) === false) {
        $('#my-state').val('');
        $('#state-form').append(errorMessage);
    }
    // if state matches item in validateState array
    else {
        // alert(`State is ${userState}!`);
        $('#state-form').find(errorMessage).remove();
        getProPublicaInfo(userState);
    }

    // to clear user input and error message on focus:
    $('#my-state').keydown(function () {
        $('#state-form').find(errorMessage).remove();
        $('#state-form').find(blankMessage).remove();
    })
};

// get ProPublica API:

function getProPublicaInfo(userState) {
    var result = $.ajax({
            /* https://projects.propublica.org/api-docs/congress-api/members/#get-current-members-by-statedistrict*/
            //url: "https://api.propublica.org/congress/v1/members/senate/IL/current.json",
            url: "https://api.propublica.org/congress/v1/members/house/" + userState + "/current.json",
            type: "GET",
            dataType: 'json',
            headers: {
                'X-API-Key': 'YNoO8cdS5NIhOruok98nV3s6bBzGoJCynVa97XnW'
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (result) {
            /* if the results are meeningful, we can just console.log them */
            console.log(result);
            displayHouseResults(result);
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
            `<li><a href="#">${houseArrayValue.name}</a></li>`
    })

    //show in HTML
    $('#house ul').html(buildHouseMembers)
}


/******************************
FUNCTION USAGE
******************************/
$(document).ready(function () {

    // #STATE-FORM

    // At start, only show form (id: #state-form)

    //    $("#list-names").hide();
    //    $("#results-section").hide();
    //    $("#state-form").show();

    // On click #state-submit activate getStateInput() function

    $('#state-submit').on('click', function () {
        event.preventDefault();
        getStateInput();



    })



})
