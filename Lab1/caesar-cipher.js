const alphabetToNumber = new Map([
    [' ', 0],
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
    ['e', 5],
    ['f', 6],
    ['g', 7],
    ['h', 8],
    ['i', 9],
    ['j', 10],
    ['k', 11],
    ['l', 12],
    ['m', 13],
    ['n', 14],
    ['o', 15],
    ['p', 16],
    ['q', 17],
    ['r', 18],
    ['s', 19],
    ['t', 20],
    ['u', 21],
    ['v', 22],
    ['w', 23],
    ['x', 24],
    ['y', 25],
    ['z', 26]]);

const numberToAlphabet = new Map([
    [0, ' '],
    [1, 'a' ],
    [2, 'b' ],
    [3, 'c' ],
    [4, 'd' ],
    [5, 'e' ],
    [6, 'f' ],
    [7, 'g' ],
    [8, 'h' ],
    [9, 'i' ],
    [10, 'j' ],
    [11, 'k' ],
    [12, 'l' ],
    [13, 'm' ],
    [14, 'n' ],
    [15, 'o' ],
    [16, 'p' ],
    [17, 'q' ],
    [18, 'r' ],
    [19, 's' ],
    [20, 't' ],
    [21, 'u' ],
    [22, 'v' ],
    [23, 'w' ],
    [24, 'x' ],
    [25, 'y' ],
    [26, 'z' ]]);

const alphabetSize = alphabetToNumber.size;

$(document).ready(function () {
   $("#encryptForm").submit(function (e) {
       e.preventDefault();
       var plainText = $(this).find("#plaintext").val();
       var key = $(this).find("#encryptionkey").val();
       $(this).parent().find("#encryptresult").val(encryptCaesarCipher(plainText, Number(key)));
   });
   $("#decryptForm").submit(function (e) {
       e.preventDefault();
       var cipherText = $(this).find("#ciphertext").val();
       var key = $(this).find("#decryptionkey").val();
       $(this).parent().find("#decryptresult").val(decryptCaesarCipher(cipherText, Number(key)));
   });
});

function encryptCaesarCipher(plainText, key) {
    let encryptedText = "";
    for(let i = 0; i < plainText.length; i++){
        let encryptedCharacterPos = ( alphabetToNumber.get(plainText[i]) + key ) % alphabetSize;
        encryptedText = encryptedText + numberToAlphabet.get(encryptedCharacterPos);
    }
    return encryptedText;
}

function decryptCaesarCipher(cipherText, key) {
    let decryptedText = "";
    for(let i = 0; i < cipherText.length; i++){
        let decryptedCharacterPos = alphabetToNumber.get(cipherText[i]) - key;
        while(decryptedCharacterPos <0){
            decryptedCharacterPos = decryptedCharacterPos + alphabetSize;
        }
        console.log(decryptedCharacterPos);
        decryptedText = decryptedText + numberToAlphabet.get(decryptedCharacterPos);
    }
    return decryptedText;
}