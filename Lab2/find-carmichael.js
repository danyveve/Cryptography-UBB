$(document).ready(function () {
    $("#carmichaelForm").submit(function (e) {
        // stop the HTML form from clearing it's data after button pressed
        e.preventDefault();
        //get the bound value from the respective input
        var bound = Number($(this).find("#bound").val());
        //call the algorithm to get the list of Carmichael numbers less than the given bound
        var carmichaelNumbersList = findAllCarmichaelsNumberLessThanBound(bound);
        //function that displays the result in the appropriate text area
        setResult(carmichaelNumbersList, bound);
    })
});

function findAllCarmichaelsNumberLessThanBound(bound) {
    var carmichaelNumbersList = [];
    if (bound < 561) { // do not bother to search because
        //the first Carmichael number is 561 :D
        return carmichaelNumbersList
    }

    for (n = 561; n <= bound; n++) {
        if (isCarmichaelByDef(n)) {
            carmichaelNumbersList.push(n);
        }
        // console.log(n);
    }

    return carmichaelNumbersList
}

function isCarmichaelByDef(n) {
    if (n % 2 === 0) {
        /*Theorem (A. Korselt 1899): A positive composite integer n is a Carmichael number if and only if n is square-free,
                and for all prime divisors p of n, it is true that p - 1 | n - 1.
          It follows from this theorem that all Carmichael numbers are odd,
          since any even composite number that is square-free (and hence has only one prime factor of two)
          will have at least one odd prime factor, and thus p - 1 | n - 1 results in an even dividing an odd, which is a contradiction. */
        return false
    }


    //a carmichael number must be a composite number, so if we
    //will get to the square root of  the number and will not find any
    //divisors, then we know for sure it is not having any divisors so
    //the number cannot be a Carmichael numer
    var squareRoot = Math.sqrt(n);
    var divisorFound = false;
    for (b = 2; b < n; b++) {
        //no divisors, so not carmichael number
        if (b > squareRoot && !divisorFound) {
            return false;
        }

        if (euclidGcd(b, n) > 1) {
            divisorFound = true;
        } else {
            if (repeatedSquaringModularExponentiationMethod(b, n - 1, n) !== 1) {
                //the definition saying for any b < n with b relatively prime to n,
                //the following must hold: b^(n-1) = 1 (mod n) IS BROKEN
                return false;
            }
        }
    }
    return true;
}

//
function repeatedSquaringModularExponentiationMethod(base, power, n) {
    var result = 1;
    var x = base;
    while (power) { // we will be extracting the least significant bit form the power and fill with 0 at the end (in the end the power will become 0000000)
        if (power & 1) { // if the least signifficant bit is 1
            result = (result * x) % n; // then we need to multiply with x which is actually the base to the power of two corresponding to the position of the bit
        }
        x = (x * x) % n; //update the base squared for future computations
        power >>>= 1;
    }
    return result;
}

function euclidGcd(a, b) {
    while (b !== 0) {
        var t = b;
        b = a % b;
        a = t;
    }
    return a;
}

//function that displays the result in the appropriate text area
function setResult(carmichaelNumbersList, bound) {
    var result = "";
    if (carmichaelNumbersList.length === 0) {
        result = result.concat("There are no Carmichael numbers smaller than the given bound! (<=" + bound + ")");
    } else {
        carmichaelNumbersList.forEach(number => {
            result = result.concat(number + "\n");
        })
    }
    $("#carmichaelResult").val(result);
}