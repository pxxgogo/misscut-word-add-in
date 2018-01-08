// /**
//  * Created by pxxgogo on 2017/5/25.
//  */
var _resultListBackUp = [];
var _resultList = [];
//
var _sentenceList = [];
var _checkingFlag = false;
var _sentenceNo2MistakeNoDict = []

var MISTAKES_THRESHOLD = [-5, 2, 3, 5]


let SYMBOL_PATTERN = new RegExp("[\u3002\uff1f\uff01\u0021\u003f\u2026\u3000\u201d\u002c\uff0c\u0009\u2014]", 'g');
let SENTENCE_PATTERN = new RegExp("([\u3002\uff1f\uff01\u0021\u003f\u2026\u3000\u201d\u002c\uff0c\u0009])", 'g');
let NEW_LINE_PATTERN = new RegExp("([\u000A\u000D])", "g");


let HIGHLIGHT_COLORS = ["", "yellow", "orange", "red"];

let CANDIDATE_DISPLAY_THRESHOLD = 2

let CANDIDATES_MAX_SHOWING_NUM = 3


//let SYMBOL_PATTERN = new RegExp("[。？！!\?…　”,，\t—]", 'ug');
//let SENTENCE_PATTERN = new RegExp("([。？！!\?…　”,，\t])", 'ug');
//let NEW_LINE_PATTERN = new RegExp("(\n)", "ug");

 
