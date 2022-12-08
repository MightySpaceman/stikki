const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function input(input, callback) {
    readline.question(input, data => {
        callback(data);
        readline.close();
    });
}

module.exports = { input };