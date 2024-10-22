const fs = require('fs');


// Function to convert a single part to JSON
function partToJSON(part) {
    const lines = part.split('\n').filter(Boolean);
    const partTitle = lines.shift().trim();

    const questions = lines.map(line => {
        const [questionNumber] = line.match(/^\d+/);
        const rightAnswer = line.replace(/^\d+/,'').trim();
        return {
            part: partTitle,
            questionNumber: parseInt(questionNumber, 10),
            rightAnswer: rightAnswer
        };
    });

    return questions;
}

// Convert each part to JSON
function writeJsonFile(questions, output_file) {
    fs.writeFileSync(output_file, JSON.stringify(questions, null, 4), 'utf-8');
}

// Main function
function main() {
    const output_file = "src/assets/answers-new.json";
    const lines = fs.readFileSync("src/assets/answers-new.txt", 'utf-8');
    const parts = lines.split(/\n(?=[IVXLCDM]+\.\s)/); // Corrected line
    const jsonResult = parts.map(part => partToJSON(part)).flat();
    writeJsonFile(jsonResult, output_file);
}

// Run the main function
main();
