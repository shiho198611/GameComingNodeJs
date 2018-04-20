# GameComingNodeJs
Game coming skill note.

This skill is purpose to use alexa to get game coming list, the skill will request 5 result.

The game coming list is via igdb open data.

This skill develope has below careful issues:

* Skill `response.speak` can put SSML(Speech Synthesis Markup Language) directly.
* Alexa response speak can pause in sentence, add `<break time ='1s' />` in pause point.
* If need alexa to speak date format, must add `interpret-as` in return speak, like: `<say-as interpret-as ='date'>2018-Apr-13</say-as>`

You can find and enable this skill "[**GameComing**](https://www.amazon.com/dp/B07C4NFSRJ/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1524208905&sr=1-1&keywords=GameComing)" from Alexa skills.

