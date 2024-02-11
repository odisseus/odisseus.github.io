var rules = {};

window.addEventListener("load", function() {
    let rulesRequest = new XMLHttpRequest();
    rulesRequest.open("GET", "data/abecadlo/rules/uk-to-pl.tsv", false);
    rulesRequest.send();
    if (rulesRequest.status < 400) {
        loadRules(rulesRequest.responseText);
    } else {
        console.error("Could not load the rules file!");
    }
});

function loadRules(rules_tsv) {
    for (const line of rules_tsv.split("\n")) {
        let cells = line.trim().split("\t", 2);
        if (cells.length < 2) {
            cells[1] = "";
        }
        if (cells[0]) {
            this.rules[cells[0]] = cells[1];
        }
    }
}

function capitalize(str) {
    if (str.length == 0) return "";
    return str[0].toUpperCase() + str.slice(1);
}

function convert() {
    let input = document.getElementById('input');
    let output = document.getElementById('output');
    output.value = "";
    for (const line of input.value.split(/\r?\n/)) {
        let processedLine = line;
        for (const pattern in this.rules) {
            processedLine = processedLine.replaceAll(pattern, rules[pattern]);
            processedLine = processedLine.replaceAll(capitalize(pattern), capitalize(rules[pattern]));
        }
        output.value = output.value + processedLine + "\n";
    }
}

function copy_output() {
    if (!output.value) return;
    navigator.clipboard.writeText(output.value);
}