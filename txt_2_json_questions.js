const fs = require('fs');

function parseTextFile(file_path) {
  question_number = '';

  const lines = fs.readFileSync(file_path, 'utf-8').split('\n');

  let current_question = null;
  let current_part = null;
  let current_question_text = '';
  let current_alternative = 'A';
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    line = lines[i].trim();

    // Handle Roman numeral part that spans multiple lines
    if (line.match(/^[IVX]+\./)) {
      if (current_part) {
        let temp_index = i;
        let part_text = line;

        // Concatenate lines until the next part or question/alternative appears
        while (lines[temp_index + 1] &&
        !lines[temp_index + 1].match(/^\d+\./) &&
        !lines[temp_index + 1].match(/^[A-D]\./) &&
        !lines[temp_index + 1].match(/^[IVX]+\./)) {

          part_text += ' ' + lines[temp_index + 1].trim();
          temp_index++;
        }

        current_part = part_text;
        i = temp_index;  // Update i to skip over concatenated lines
      } else {
        current_part = line;
      }
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
        let temp_index = i;
        if (lines[temp_index + 1]) {
          while (!lines[temp_index + 1].match(/^[A-D]\./)) {
            question_text += ' ' + lines[temp_index + 1].trim();
            temp_index++;
          }

          i = temp_index;
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
      const regex = /^[A-D]\.\s*/;

      // Use the pattern to find the match
      const match = line.match(regex);

      current_question[current_alternative] = match ? line.substring(match[0].length) : line;

      let temp_index = i;
      if (lines[temp_index + 1]) {
        while (true) {
          if ((!lines[temp_index + 1]?.match(/^[A-D]\./) && !lines[temp_index + 1]?.match(/^\d+\./)) && !lines[temp_index + 1]?.match(/^[IVX]+\./)) {
            current_question[current_alternative] = current_question[current_alternative] + ' ' + lines[temp_index + 1].trim();
          }

          if (lines[temp_index + 1]?.match(/^[A-D]\./)) {
            current_alternative = lines[temp_index + 1].split('.')[0];
            break;
          }

          if (lines[temp_index + 1]?.match(/^\d+\./)) {
            current_alternative = 'A';
            break;
          }

          if (lines[temp_index + 1]?.match(/^[IVX]+\./)) {
            current_alternative = 'A';
            break;
          }
          temp_index++;
        }

        i = temp_index;
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
  const input_file = "src/assets/questions-new.txt";
  const output_file = "src/assets/questions-new.json";
  const questions = parseTextFile(input_file);
  writeJsonFile(questions, output_file);
}

main();
