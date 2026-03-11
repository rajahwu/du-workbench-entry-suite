export const parseMissionQuiz = (markdown: string) => {

const lines = markdown.split('\n');

const quizItems: { question: string, answer: string }[] = [];

lines.forEach((line, index) => {

if (line.startsWith('// Q:')) {

const question = line.replace('// Q:', '').trim();

const nextLine = lines[index + 1];

if (nextLine && nextLine.startsWith('// A:')) {

const answer = nextLine.replace('// A:', '').trim();

quizItems.push({ question, answer });

}

}

});

// Return a random question from the file to keep the "Pilot" sharp

return quizItems[Math.floor(Math.random() * quizItems.length)];

};
