// grab api key from local chrome storage
var accessToken = "";

// Retrieve the stored access token from storage
chrome.storage.local.get({ accessToken: "" }, function (data) {
  accessToken = data.accessToken;
  console.log(data.accessToken);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Handle the message based on its content

  const content = generate_prompt(request);
  //const api_resp = gpt_api(content[0], content[1]);
  const answer = ["False"];


  sendResponse(answer);
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
      content = "return correct answer(s) only. " + request.question;
      for (var i = 0; i < request.answers.length; i++) {
        content += "\n" + request.answers[i];
      }
      break;
    default:
      return;
  }

  return [content, max_tokens];
}

function get_answer(response) {}

async function gpt_api(content, token_limit = 30) {
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
      ],
      temperature: 0.7,
      max_tokens: token_limit,
    }),
  });

  var data = await response.json();

  answer = get_answer(data);

  return answer;
}
