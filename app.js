/******************************
 VARIABLES
 *****************************/

let userState = '';

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

// get ProPublica API (House):

function getProPublicaHouse(userState) {

    // House

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
            `<li><a href="#">${houseArrayValue.name}</a></li>`

        //show in HTML
        $('#house ul').html(buildHouseMembers)
    })
}


// Senate
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
            `<li><a href="#">${senateArrayValue.name}</a></li>`

        //show in HTML
        $('#senate ul').html(buildSenateMembers)
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

    })



})
