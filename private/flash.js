/**
 * flashCards.html (javascript memorization tool)
 * version: 0.5 (2014-07-28)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Acknowledgements:
 * Thanks to stackoverflow.com and w3schools.com
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * Copyright (c) 2014 by Brent Neal Reeves
 */
var timer1;
var timer2;
var timeA=3;
var timeB=10;
var n = 0;
var groupSize = 3; 
var wN = 0;

var cardsInput='';
var cardsArray;

var i = 0;
var lines="";

function nextN() {
    //      console.log("nextN n: " + n + " groupSize [" + groupSize + "]")

    if (groupSize > 1) {
        wN += 1;
        if (wN >= groupSize) {
            n = n - (groupSize - 1);
            wN = 0;
        };
    };
    n += 1;
    if (n >= cardsArray.length) {
        n = 0;
    }
    if (n < 0) {
        n = cardsArray.length + n;
    }
    return n;
}


function loadExample( id ) {
    var txt = document.getElementById( id ).innerText.trim();
    cardsArray = CSVToArray( txt );
    redisplayLines();
}


function loadData(data) {
    var txt = document.getElementById( data );
    if (typeof txt === 'undefined') {
        alert("Sorry - had trouble loading [" + data + "]");
        return;
    }
    var txt = txt.value;
    if (typeof txt === 'undefined') {
        alert("Sorry - had trouble loading the value [" + data + "]");
        return;
    }
    var txt = txt.trim();
    cardsArray = CSVToArray( txt );
}


function shuffleData() {
    loadData();
    shuffle(cardsArray);
    redisplayLines();
}

function redisplayLines() {
    var txt ="";
    for (var i=0; i< cardsArray.length; i++) {
        txt = txt + cardsArray[i][0] + "," + cardsArray[i][1] + "\n";
    }
    document.getElementById("lines").value = txt;
}


function dumpData() {
    console.log( document.getElementById("lines").value );
}


function dumpArray() {
    var arrayLength = cardsArray.length;
    console.log('Length: ' + arrayLength + ' n is ' + n);
    for(var i=0; i< arrayLength; i++) {
        console.log( i + ': ' + cardsArray[i][0] + ' is ' + cardsArray[i][1]);
    }
}

function startFlow() {
    loadData("lines");
    
    n=0;
    var gs = document.getElementById("groupSize").value;
    var gsInt = parseInt(gs);

    if ( isNaN(gsInt) ) {
        groupSize = 1;
        document.getElementById("groupSize").value = 1;
    } else {
        groupSize = Math.abs(gsInt);
        if (gsInt < 0) {
            document.getElementById("groupSize").value = groupSize;          
        }
        
        
        if (groupSize >= cardsArray.length) {
            groupSize = cardsArray.length - 2;
            document.getElementById("groupSize").value = groupSize;
        }
        
        if (groupSize < 1) {
            groupSize = 1;
            document.getElementById("groupSize").value = 1;
        }

    }

    if ( typeof timer1 !== 'undefined' ) {
        return;
    }        

    showA();
}


function stopFlow() {
    if ( typeof timer1 === 'undefined') 
    { 
        //
    } else {
        clearTimeout(timer1);
        clearTimeout(timer2);
    }
    timer1 = undefined;
    timer2 = undefined;
};


function imageReset(id) {
    var i1= document.getElementById(id);
    i1.src = "";
    //      i1.height=0;
    //      i1.width=0;
}


function showA() {
    nextN();
    
    daItem = document.getElementById("item1");
    document.getElementById("item2").innerHTML = '...';
    //      imageReset("image1");
    imageReset("image2");
    // parse question and answers
    // <p> followed by DD/DT ?
    
    if ( isURL (cardsArray[n][0] ) ) {
        daItem.innerHTML = "";
        var i1=document.getElementById("image1");
        //        i1.width="100";
        //        i1.height="68";
        i1.src= cardsArray[n][0];
    } else {
        if ( isMC( cardsArray[n][0] )) {
	    var str = cardsArray[n][0];
	    var ar1 = str.slice(5).split("/");
	    console.log('ar1 ' + ar1);
	    var html = '<h4>' + ar1[1] + '</h4>';
	    html += '<ul>';
	    for (var i=2; i< ar1.length; i++) {
		html += '<li>' + ar1[i] + '</li>';
	    }
	    html += '</ul>';
            daItem.innerHTML = html;
	    //<dl>
	    //  <dt>Coffee</dt>
	    //  <dd>Black hot drink</dd>
	    //  <dt>Milk</dt>
	    //  <dd>White cold drink</dd>
	    //</dl> 
        } else {
            daItem.innerHTML = cardsArray[n][0];
        }
    }

    var daTime = document.getElementById("timeA").value * 1000;
    timer2 = setTimeout(
        function() {
            showB()
        }, daTime);
};

function isMC (str) {
    if (typeof str === 'undefined') {
        return false;
    }
    if (str.length < 7) {
        return false;
    }
    var prefix = str.substring(0,5).toUpperCase();
    if ( prefix == "MC://" ) {
        return true;
    }
    return false;
    
}

function isURL( str ) {
    if (typeof str === 'undefined') {
        return false;
    }
    if (str.length < 7) {
        return false;
    }
    var prefix = str.substring(0,4).toUpperCase();
    if ( prefix == "HTTP" || prefix == "FILE" ) {
        return true;
    }
    return false;
}


function showB() {
    var daItem = document.getElementById("item2");
    if ( isURL (cardsArray[n][1] ) ) {
        daItem.innerHTML = "";
        var i2=document.getElementById("image2");
        //        i2.width="100";
        //        i2.height="68";
        i2.src= cardsArray[n][1];
    } else {
        daItem.innerHTML = cardsArray[n][1];
    }
    var daTime = document.getElementById("timeB").value * 1000;
    timer1 = setTimeout(
        function() {
            showA();
        }, daTime);

};


function resetFlow() {
    n = 0;
};


function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
};

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    var arrData = [[]];
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
        ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

function toggleDisplay(obj) {
    var e=document.getElementById(obj);
    e.className=(e.className!='displayNone') ? 'displayNone' : '';
}
