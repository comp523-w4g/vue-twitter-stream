"use strict";

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const tone_analyzer = new ToneAnalyzerV3({
  username: "b6b0e996-c0ee-4187-83c8-445ba6da0c97",
  password: "Ie180ho5eHhD",
  version_date: '2016-05-19'
});

// const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

// const nlu = new NaturalLanguageUnderstandingV1({
//   username: '1efb922e-aa11-4638-ae95-cfe01ec9c949',
//   password: 'eBkBiBx6aQ1v',
//   version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27,
// });

// const formatForNLU = string => {
//   return {
//     "text": string,
//     "features": {
//       "emotion": {
//         "targets": [
//           "Trump",
//           "Silent Sam",
//           "Obama"
//         ]
//       },
//       "entities": {
//         "emotion": true,
//         "sentiment": true,
//         "limit": 2
//       },
//       "keywords": {
//         "emotion": true,
//         "sentiment": true,
//         "limit": 2
//       }
//     }
//   }
// }

module.exports = {
  tone_analyzer
}