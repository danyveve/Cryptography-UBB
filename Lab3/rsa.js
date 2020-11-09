var Ke = null;
var Kd = null;

var k = 2;
var l = 3;

$(document).ready(function () {
    generateKeys();
    $("#encryptForm").submit(function (e) {
        e.preventDefault();
        var plainText = $(this).find("#plaintext").val();
        $(this).parent().find("#encryptresult").val(encryption(plainText));
    });
    $("#decryptForm").submit(function (e) {
        e.preventDefault();
        var cipherText = $(this).find("#ciphertext").val();
        $(this).parent().find("#decryptresult").val(decryption(cipherText));
    });
});

function generateKeys() {
    //takes two random prime numbers from a predefined list of prime numbers
    var q = primes[getRandomArbitrary(0, primes.length)];
    var p = primes[getRandomArbitrary(0, primes.length)];


    //if the two numbers are the same, take another one
    while (p === q) {
        p = primes[getRandomArbitrary(0, primes.length)];
    }

    //computes n = p*q
    var n = p * q;

    //compute k and l
    k = 1;
    while(Math.pow(27, k) < n){
        k = k + 1;
    }
    k = k - 1;

    l = k + 1;

    //computes the Euler function
    var phiN = (p - 1) * (q - 1);


    //computes nr "e"
    var e = getRandomArbitrary(2, phiN);
    while (euclidGcd(e, phiN) !== 1) {
        e = getRandomArbitrary(2, phiN);
    }


    //computes the private/decryption key
    d = inverse(e, phiN);

    //public key;
    Ke = [n, e];

    //private key;
    Kd = d;
}

function encryption(message) {
    //adds spaces if we cannot divide into groups of k characters
    while (message.length % k !== 0) {
        message = message + " ";
    }

    //divide the message into groups of k characters
    var groups = message.match(new RegExp('.{1,' + k + '}', 'g'));
    var groupNumericalEquivalents = [];

    //compute the numerical equivalents of the groups
    groups.forEach(function (group) { //for each group
        var power = k - 1;
        var sum = 0;

        for (i = 0; i < group.length; i = i + 1) { // we consider each character and multiply it with the alphabet size to the corresponding power
            character = group.charAt(i);
            sum = sum + alphabetToNumber.get(character) * Math.pow(27, power);
            power = power - 1;
        }

        groupNumericalEquivalents.push(sum);
    });

    //transform the numerical equivalents groups into the encrypted numerical equivalent groups
    var encryptedGroups = [];
    groupNumericalEquivalents.forEach(function (group) {
        encryptedGroups.push(repeatedSquaringModularExponentiationMethod(group, Ke[1], Ke[0]));
    });


    //transofrm the encrypted numerical equivalents groups into the encrypted characters groups
    var encryptedMessage = "";
    encryptedGroups.forEach(function (encryptedGroup) {
        var power = l - 1;
        while (power >= 0) {
            var divisor = Math.pow(27, power);
            var coefficient = Math.trunc(encryptedGroup / divisor);
            encryptedMessage = encryptedMessage + numberToAlphabet.get(coefficient);
            encryptedGroup = encryptedGroup - coefficient * divisor;
            power = power - 1;
        }
    });

    return encryptedMessage;
}

function decryption(message) {
    while (message.length % l !== 0) {
        message = message + " ";
    }

    var groups = message.match(new RegExp('.{1,' + l + '}', 'g'));
    var groupNumericalEquivalents = [];

    groups.forEach(function (group) {
        var power = l - 1;
        var sum = 0;

        for (i = 0; i < group.length; i = i + 1) {
            character = group.charAt(i);
            sum = sum + alphabetToNumber.get(character) * Math.pow(27, power);
            power = power - 1;
        }

        groupNumericalEquivalents.push(sum);
    });


    var encryptedGroups = [];
    groupNumericalEquivalents.forEach(function (group) {
        console.log("encGroups=" + repeatedSquaringModularExponentiationMethod(group, Kd, Ke[0]));
        encryptedGroups.push(repeatedSquaringModularExponentiationMethod(group, Kd, Ke[0]));
    });

    var decryptedMessage = "";

    encryptedGroups.forEach(function (encryptedGroup) {
        var power = k - 1;
        while (power >= 0) {
            var divisor = Math.pow(27, power);
            var coefficient = Math.trunc(encryptedGroup / divisor);
            decryptedMessage = decryptedMessage + numberToAlphabet.get(coefficient);
            encryptedGroup = encryptedGroup - coefficient * divisor;
            power = power - 1;
        }
    });

    return decryptedMessage;
}