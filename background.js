var accessToken = "";

// Retrieve the stored access token from storage
chrome.storage.local.get({ accessToken: "" }, function (data) {
  accessToken = data.accessToken;
});

// listen to message from content script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  try {
    // Handle the message based on its content
    const content = generate_prompt(request);
    const answers = await gpt_api(content[0], content[1]);
    // send the response to the content script using chrome.tabs.sendMessage
    chrome.tabs.sendMessage(
      sender.tab.id,
      {
        correct_answer: answers,
        answers: request.answers,
        question_id: request.question_id,
      },
      function (response) {
        // response is handled using tabs, not through listener
      }
    );
  } catch (error) {
    console.error(error);
  }
});

// condense question into prompt
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
      max_tokens = 2;
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

  return [content, max_tokens]; // true false questions only require 2 tokens
}

// get the api response from openAI
function get_answer(response) {
  var answers = [];
  const tokens = response["usage"]["completion_tokens"];
  var output = response["choices"][0]["message"]["content"];

  if (tokens <= 2) {
    // if answer ends in period, remove it
    if (output[output.length - 1] === ".") {
      output = output.slice(0, -1);
    }

    answers.push(output); // true/false question or one-word answer
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
          role: "system", // advice to format and make respones more concise
          content: "return answer(s) split by newlines",
        },
      ],
      max_tokens: token_limit,
      temperature: 0.2,
    }),
  });
  const json = await response.json(); // convert to json
  console.log(json);
  const answers = get_answer(json);

  return answers;
}
