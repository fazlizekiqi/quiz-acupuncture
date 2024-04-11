
const fs = require('fs');

function parseTextFile(file_path) {


    question_number = ''

    const lines = fs.readFileSync(file_path, 'utf-8').split('\n');

    let current_question = null;
    let current_part = null;
    let current_question_text = '';
    let current_alternative = 'A';
    const questions = [];

    for (let i = 0; i < lines.length; i++) {
        line = lines[i].trim();
        if (line.match(/^[IVX]+\./)) {
            current_part = line;
            continue;
        }

        if (line.match(/^\d+\./)) {
            if (current_question) {
                questions.push(current_question);
            }

            if (current_question_text) {
                current_question.question = current_question_text.trim();
                current_question_text = '';
            }
            const match = line.match(/^(\d+(\.\d+)?)\. (.+)/);

            if (match) {
                const question_number = match[1];
                let question_text = match[3];
                temp_index = i;
                if (lines[temp_index + 1]) {
                    while (!lines[temp_index + 1].match(/^[A-D]\./)) {
                        question_text = question_text + ' ' + lines[temp_index + 1];
                        temp_index++;
                    }

                    i = temp_index
                }
                current_question = {
                    part: current_part,
                    questionNumber: question_number,
                    question: question_text,
                    A: '',
                    B: '',
                    C: '',
                    D: ''
                };
                current_alternative = 'A';

            }
        } else if (line.match(/^[A-D]\./)) {
            current_question[current_alternative] = line.split('.')[1];


            temp_index = i;
            if (lines[temp_index + 1] ) {
                while (true) {
                    if ((!lines[temp_index + 1]?.match(/^[A-D]\./) && !lines[temp_index + 1]?.match(/^\d+\./)) && !lines[temp_index + 1]?.match(/^[IVX]+\./)) {
                        current_question[current_alternative] = current_question[current_alternative] + ' ' + lines[temp_index + 1];
                        
                        
                    }

                    if(lines[temp_index + 1]?.match(/^[A-D]\./) ) {
                        current_alternative = lines[temp_index + 1].split('.')[0]
                        break;
                    }

                    if (lines[temp_index + 1]?.match(/^\d+\./)){
                    
                        current_alternative = 'A'
                        break;
                    }

                    if (lines[temp_index + 1]?.match(/^[IVX]+\./)){
                        
                        current_alternative = 'A'
                        break;
                    }
                    temp_index++

                }

                i = temp_index


            }


        } else {
            // If it's not a question number or alternative, treat it as part of the question text
            if (current_question_text !== '') {
                current_question_text += ' ';
            }
            current_question_text += line;
        }
    }

    // Push the last question
    if (current_question) {
        questions.push(current_question);
    }

    // Assign the last question text
    if (current_question_text !== '') {
        current_question.question = current_question_text.trim();
    }



    return questions;
}

function writeJsonFile(questions, output_file) {
    fs.writeFileSync(output_file, JSON.stringify(questions, null, 4), 'utf-8');
}

function main() {
    const input_file = "src/assets/questions.txt";
    const output_file = "src/assets/questions.json";
    const questions = parseTextFile(input_file);
    writeJsonFile(questions, output_file);
}

main();
