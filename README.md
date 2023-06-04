# Overview

This is a Chrome extension that automatically highlights the correct answer on Canvas quizzes. It works by fetching the quiz data from the Canvas API and comparing it with the quiz questions on the web page.

## Features

- Highlights the correct answer in green for multiple choice, true/false, and matching questions
- Shows the correct answer in a tooltip for fill-in-the-blank and numerical questions
- Works for both graded and practice quizzes
- Supports quizzes with multiple attempts and random questions
- Compatible with Canvas quizzes that use Respondus LockDown Browser

## Installation

To install this extension, follow these steps:

1. Download or clone this repo to your local machine
2. Open Chrome and go to chrome://extensions
3. Enable developer mode by toggling the switch in the top right corner
4. Click on "Load unpacked" and select the folder where you downloaded or cloned this repo
5. You should see a new icon in your browser toolbar that you can use to activate the extension.

## Usage

To use this extension, follow these steps:

1. Log in to your Canvas account and open a quiz
2. Enable the extension using its popup menu.
3. The correct answers for multiple choice, true/false, and multiple answer questions will be highlighted. (more coming soon.)

## To-do for release 1.0

- [ ] Add better commenting and documentation.
- [ ] Change highlighting mechanism to be more appealing.
- [ ] Add verification system for API token.
- [ ] Create an extension icon.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

If you want to contribute to this project, please follow these guidelines:

- Fork this repo and create a new branch for your feature or bug fix
- Write clear and concise commit messages and pull request descriptions
- Follow the code style and formatting of this project
- Test your code before submitting a pull request