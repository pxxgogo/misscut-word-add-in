var tip = 0.1;

function updateMistakes() {
    _sentenceNo2MistakeNoDict = {};
    for (var mistakeNo = 0; mistakeNo < _resultList.length; mistakeNo++) {
        var mistake = _resultList[mistakeNo];
        mistake["is_ignored"] = false;
        mistake["is_modified"] = false;
        mistake["modified_word"] = "";
        var score = mistake["highest_score"];
        var finalLevel = 0;
        for (var level = MISTAKES_THRESHOLD.length - 1; level >= 0; level--) {
            if (score > MISTAKES_THRESHOLD[level]) {
                finalLevel = level;
                break;
            }
        }
        mistake["mistake_level"] = finalLevel;

        var sentenceNo = mistake["sentence_No"];
        if (_sentenceNo2MistakeNoDict[sentenceNo]) {
            _sentenceNo2MistakeNoDict[sentenceNo].push(mistakeNo);
        } else {
            _sentenceNo2MistakeNoDict[sentenceNo] = [mistakeNo];
        }
    }
}


function getResult(ret, inputText) {
    _resultList = ret.result;
    _resultListBackUp = JSON.parse(JSON.stringify(ret)).result;
    updateMistakes();
    //console.log(_resultList.length, _resultList[0]["mistake_level"]);
    if (_resultList.length === 0 || _resultList[0]["mistake_level"] < 1) {
        $("#no-error-notification-div").show();
        return;
    } else {
        $("#no-error-notification-div").hide();
    }
    _checkingFlag = true;
    inputText = strQ2B(inputText);
    _sentenceList = createSentencesList(inputText);
    //console.log(_sentenceList);
    console.log(_resultList);
    //console.log(_resultList);
    hightlightRet();
    printSentences();
}



