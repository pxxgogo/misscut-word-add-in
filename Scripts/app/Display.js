function generateHtmlSentence(mistakeNo) {
    var mistake = _resultList[mistakeNo];
    var sentence = _sentenceList[mistake["sentence_No"]];
    var keyClass = "";
    //console.log(candidate);
    var showingWord = mistake["raw_word"]
    if (mistake["is_modified"]) {
        keyClass = "mt-20";
        showingWord = mistake["modified_word"]
    } else {
        keyClass = "mt-" + mistake["mistake_level"];
    }
    if (mistake["is_ignored"])
        keyClass += " mis-judge-state";
    return sentence.substring(0, mistake["position_in_sentence"]) + "<span class='keyword " + keyClass + "' id='w-" + mistakeNo + "'>" + showingWord + "</span>" + sentence.substring(mistake["position_in_sentence"] + showingWord.length);
}

function generateHtmlSentenceDiv(mistakeNo) {
    var html = "";
    var mistake = _resultList[mistakeNo];

    var moreRecommendationBtnStyle = "";
    var misjudgeBtnStyle = "";
    var undoBtnStyle = "";
    var recoverStateBtnStyle = "";

    var subKeyClass = "";
    var mainKeyClass = "";

    if (mistake["is_ignored"]) {
        mainKeyClass = "mis-judge-sentence-div";
        subKeyClass = "mis-judge-state";

        misjudgeBtnStyle = "style='display: none'";
        undoBtnStyle = "style='display: none'";

    } else if (mistake["is_modified"]) {

        misjudgeBtnStyle = "style='display: none'";
        moreRecommendationBtnStyle = "style='display: none'";
        recoverStateBtnStyle = "style='display: none'";

    } else {
        undoBtnStyle = "style='display: none'";
        recoverStateBtnStyle = "style='display: none'";
    }

    html += "<div class='sort-sentence-div " + mainKeyClass + " ' id='mistake-word-" + mistakeNo + "' wordno='" + mistakeNo + "' onmouseenter='connectWordPanel(this)' onmouseleave='disconnectWordPanel(this)'>" +
        "<div class='wrong-sentence-content-div " + subKeyClass + "'>" +
        generateHtmlSentence(mistakeNo, 0) +
        "</div><div class='sentence-description " + subKeyClass + "'><div class='sentence-description-left'><div class='sentence-description-hand'><img src='/Images/check_hand_icon@3x.png' class='hand-icon'/></div><div class='possible-alters-div'>";
    for (var j = 0; j < mistake["candidates"].length; j++) {
        let candidate = mistake["candidates"][j];
        if (candidate["scores"][candidate["scores"].length - 1] < CANDIDATE_DISPLAY_THRESHOLD || j >= CANDIDATES_MAX_SHOWING_NUM) break;
        html += "<span class='possible-alters-btn clickable' onclick='chooseCandidate(this, " + mistakeNo + ", " + j + ")'>" + candidate["candidate"] + "</span> ";
    }
    html += "</div></div><div class='sentence-description-right'><div class='mis-judge-btn special-alters clickable' onclick='misJudge(this, " + mistakeNo + ")' " + misjudgeBtnStyle + ">误判</div>" +
        "<div class='recovery-btn special-alters clickable' onclick='recoverState(this, " + mistakeNo + ")' " + recoverStateBtnStyle + ">恢复</div><div class='undo-btn special-alters clickable' onclick='undo(this, " + mistakeNo + ")' " + undoBtnStyle + ">撤销修改</div>" +
        "</div></div></div>";

    return html
}

function printSentences() {
    var html = "";
    for (var i = 0; i < _resultList.length; i++) {
        if (_resultList[i]["mistake_level"] === 0) continue;
        html += generateHtmlSentenceDiv(i);
    }
    $("#display-sentence-div").html(html);
}

// 用于打印出"未找到错误"提示
function printNoErrorNotification() {
    var html = "<div id='no-error-notification-div'> <img src='/Images//hint.png'> " +
        "<div class='notification-info'>未找到文本错误</div></div>"
    $("#display-sentence-div").html(html);
}