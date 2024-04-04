const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' });


async function getQuestions(numberOfQuestions,course, code, specialInstruction) {

  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);


  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const num = numberOfQuestions || 3;
  const subject = course || "General Knowledge";
  const difficultyCode = code || 0;

  let difficultyText = '';

  switch(difficultyCode)
  {
    case 1: 
        difficultyText = "write only Easy difficulty level questions";
        break;
    case 2:
        difficultyText = "write only Medium difficulty level questions";
        break;
    case 3:
        difficultyText = "write only Hard difficulty level questions";
        break;
  }

  const prompt = `Write a set of multiple-choice questions (MCQs), some with single correct answers and few with multiple correct answers, total ${num} in JSON format for ${subject} only. Each question should have the following attributes: content (containing the main question), options (an array containing all options), correctAnswers (an array containing correct answers, if multiple otherwise a single answer), category (indicating the subject), and difficultyLevel (categorized as "Easy", "Medium", or "Hard") ${difficultyText}, ${specialInstruction? specialInstruction: '' }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (text.indexOf('[') !== -1 && text.lastIndexOf(']') !== -1) {
    const data = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
    const jsonData = JSON.parse(data);
    return jsonData;
  } else {
    return text;
  }
  
//   console.log(text.substring(indexOf('['), lastIndexOf(']') + 1));
}

module.exports = getQuestions;