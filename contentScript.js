// get current state of visibility
var visibility;
chrome.storage.sync.get("enabled", function (data) {
  visibility = data.enabled;
});

// globals
var background_request = {
  question_type: "",
  question: "",
  answers: [],
};

var default_inner_question = [
  "multiple_choice_question",
  "true_false_question",
  "multiple_answers_question",
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.hideElements) {
    // Hide elements injected into the page
    toggleElements(visibility);
  } else {
    // Show elements injected into the page
    toggleElements(visibility);
  }
});

function toggleElements(visibility) {
  if (visibility) {
    // show elements with class extension-visible
    var elements = document.getElementsByClassName("extension-visible");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
  } else {
    // hide elements with class extension-visible
    var elements = document.getElementsByClassName("extension-visible");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }
  visibility = !visibility;
}

// now we inject chagpt answers into canvas quiz
// send message to background.js to get answers
// messgae format: question type, question, answers
if (!visibility) {
  // iterate through all elements with classnames quiz_sortable question_holder
  const questions = document.querySelectorAll(".quiz_sortable.question_holder");
  for (var i = 0; i < questions.length; i++) {
    var question_type;
    var question_text;
    var answers = [];
    var answer_divs;
    // find question type first
    question_type = questions[i].querySelector(".display_question.question")
      .classList[2];
    // only inject answers if question type is multiple choice, true false, or multiple answers
    if (default_inner_question.includes(question_type)) {
      // find question text
      question_text = questions[i].querySelector("p").innerText;

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

      chrome.runtime.sendMessage(request, (function(answers, answer_divs) {
        return function(response) {
          // Handle the response from the background script
          var correct_indexes = [];

          // Inject answers into canvas quiz as tooltip
          // response contains one-word answers for now
          if (response.length === 1) {
            // Find index of response in answers
            correct_indexes.push(answers.indexOf(response[0]));
          } else {
            for (var i = 0; i < response.length; i++) {
              correct_indexes.push(answers.indexOf(response[i]));
            }
          }

          // apply tooltip to correct answers
          for (var i = 0; i < correct_indexes.length; i++) {
            answer_divs[correct_indexes[i]].style.border = "2px solid green";
          }

        };
      })(answers, answer_divs));

    } else {
      continue;
    }
  }
}
