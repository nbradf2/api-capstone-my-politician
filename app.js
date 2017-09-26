//'use strict'

// VARIABLES

let validateState = ['alabama', 'al', 'alaska', 'ak', 'arizona', 'az', 'arkansas', 'ar', 'california', 'ca', 'colorado', 'co', 'connecticut', 'ct', 'delaware', 'de', 'florida', 'fl', 'georgia', 'ga', 'hawaii', 'hi', 'idaho', 'id', 'illinois', 'il', 'indiana', 'in', 'iowa', 'ia', 'kansas', 'ks', 'kentucky', 'ky', 'louisiana', 'la', 'maine', 'me', 'maryland', 'md', 'massachusetts', 'ma', 'michigan', 'mi', 'minnesota', 'mn', 'mississippi', 'ms', 'missouri', 'mo', 'montana', 'mt', 'nebraska', 'ne', 'nevada', 'nv', 'new hampshire', 'nv', 'new jersey', 'nj', 'new mexico', 'nm', 'new york', 'ny', 'north carolina', 'nc', 'north dakota', 'nd', 'ohio', 'oh', 'oklahoma', 'ok', 'oregon', 'or', 'pennsylvania', 'pa', 'rhode island', 'ri', 'south carolina', 'sc', 'south dakota', 'sd', 'tennessee', 'tn', 'texas', 'tx', 'utah', 'ut', 'vermont', 'vt', 'virginia', 'va', 'washington', 'wa', 'west virginia', 'wv', 'wisconsin', 'wi', 'wyoming', 'wy'];

const errorMessage = $(`<p class="invalid-text">That's not a state!  Enter the full name (i.e., "Illinois"), or the abbreviation (i.e., "IL)</p>`);


/******************************
 FUNCTION DEFINITIONS
 *****************************/

// To get user input (state):

function getStateInput() {
    //    alert("getStateInput() activated!");

    // get value of input box:
    let userState = $('#my-state').val().toLowerCase();

    // test ****console.log() not working****
    //    alert(userState);

    // INPUT VALIDATION

    // if state matches item in validateState array:

    if (validateState.includes(userState) === false) {
        $('#my-state').val('');
        $('#state-form').append(errorMessage);
    }

    if (validateState.includes(userState)) {
        alert('State is validated!');
        $('#state-form').find(errorMessage).remove();
    }

    // to clear user input and error message on focus:
    $('#my-state').keydown(function () {
        $('#state-form').find(errorMessage).remove();
    })
}


/******************************
FUNCTION USAGE
******************************/
$(document).ready(function () {

    // #STATE-FORM

    // At start, only show form (id: #state-form)

    $("#list-names").hide();
    $("#results-section").hide();
    $("#state-form").show();


    // On click #state-submit activate getStateInput() function

    $('#state-submit').on('click', function () {
        event.preventDefault();
        getStateInput();



    })



})
