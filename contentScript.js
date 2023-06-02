// globals
var background_request = {
  question_type: "",
  question: "",
  answers: [],
  question_id: "",
};
var inject_answers;
var default_inner_question = [
  "multiple_choice_question",
  "true_false_question",
  "multiple_answers_question",
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.hideElements) {
    // Hide elements injected into the page
    toggleElements(false);
  } else {
    // Show elements injected into the page
    toggleElements(true);
  }

  if (request.correct_answer) {
    const answers = request.correct_answer;
    console.log(answers);
    // Find question with id = request.question_id
    var questionElement = document.querySelector(
      `a[name="${request.question_id}"]`
    ).parentElement;
    if (questionElement) {
      // Find all answer inputs within the question
      const answerInputs = questionElement.querySelectorAll("label");

      answerInputs.forEach((element) => {
        const answer_text = element.textContent.trim();

        if (answers.includes(answer_text)) {
          // select the correct answer
          element.querySelector(".answer_label").style.border =
            "2px solid green";
          element.querySelector(".answer_label").style.padding = "1%";
          element
            .querySelector(".answer_label")
            .classList.add("extension-visible");
        }
      });
    }
  }
});

function toggleElements(visibility) {
  const visible = document.querySelectorAll(".extension-visible");
  if (visibility) {
    // show elements with class extension-visible
    visible.forEach((element) => {
      element.style.border = "2px solid green";
      element.style.padding = "1%";
    });
  } else {
    // hide elements with class extension-visible
    visible.forEach((element) => {
      element.style.border = "none";
      element.style.padding = "0%";
    });
  }
}

// get current state of visibility
chrome.storage.sync.get("enabled", function (data) {
  const visibility = data.enabled;

  // now we inject chagpt answers into canvas quiz
  // send message to background.js to get answers
  // messgae format: question type, question, answers

  if (visibility) {
    // iterate through all elements with classnames quiz_sortable question_holder
    const questions = document.querySelectorAll(
      ".quiz_sortable.question_holder"
    );
    for (var i = 0; i < questions.length; i++) {
      var question_type;
      var question_text;
      var answers = [];
      var answer_divs;
      var question_id;
      // find question type first
      question_type = questions[i].querySelector(".display_question.question")
        .classList[2];
      // only inject answers if question type is multiple choice, true/false, or multiple answers
      if (default_inner_question.includes(question_type)) {
        // find question text
        question_text = questions[i].querySelector("p").innerText;

        // find question id
        question_id = questions[i].querySelector("a").getAttribute("name");
        // store possible answers in array
        answer_divs = questions[i]
          .querySelector("fieldset")
          .querySelectorAll(".answer");

        for (var j = 0; j < answer_divs.length; j++) {
          answers.push(
            answer_divs[j]
              .querySelector("label")
              .querySelector(".answer_label")
              .textContent.trim()
          );
        }

        // send message to background.js to get answers
        var request = { ...background_request };
        request.question_type = question_type;
        request.question = question_text;
        request.answers = answers;
        request.question_id = question_id;

        chrome.runtime.sendMessage(request);
      } else {
        continue;
      }
    }
  }
});