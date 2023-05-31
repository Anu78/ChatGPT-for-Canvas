// grab api key from local chrome storage
var accessToken = "";

// Retrieve the stored access token from storage
chrome.storage.local.get({ accessToken: "" }, function (data) {
  accessToken = data.accessToken;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the message based on its content

  (async function () {
    const content = generate_prompt(request);
    //const answers = await gpt_api(content[0], content[1]);
    const answers = ["red", "blue", "green"];
    sendResponse(answers);
  })();
});

function generate_prompt(request) {
  var content = "";
  var max_tokens = undefined;

  switch (request.question_type) {
    case "multiple_choice_question":
      content = "return correct answer only. " + request.question;
      for (var j = 0; j < request.answers.length; j++) {
        content += "\n" + request.answers[j];
      }
      break;
    case "true_false_question":
      content = "TF." + request.question;
      max_tokens = 1;
      break;
    case "multiple_answers_question":
      content = "correct answer(s) only. " + request.question;
      for (var i = 0; i < request.answers.length; i++) {
        content += "\n" + request.answers[i];
      }
      break;
    default:
      return;
  }

  return [content, max_tokens];
}

function get_answer(response) {
  var answers = [];
  const tokens = response["usage"]["completion_tokens"];
  const output = response["choices"][0]["message"]["content"];

  if (tokens === 1) {
    answers.push(output); // true/false question or one word answer
  } else {
    // multiple answers questions
    answers = output.split("\n");
  }

  return answers;
}

async function gpt_api(content, token_limit = 100) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: content,
        },
        {
          role: "system",
          content: "return answer(s) split by newlines",
        },
      ],
      max_tokens: token_limit,
      temperature: 0.2,
    }),
  });

  const json = await response.json();
  return get_answer(json);
}
