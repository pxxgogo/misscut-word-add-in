function generateHtmlSentence(sentence, mistakeWord) {
    var keyClass = "";
    if (mistakeWord.isModified) {
        keyClass = "mt-20";
    } else {
        keyClass = "mt-" + mistakeWord.type;
    }
    if (mistakeWord.isIgnored)
        keyClass += " mis-judge-state";
    return sentence.substring(0, mistakeWord.positionInSentence) + "<span class='keyword " + keyClass + "' id='w-" + mistakeWord.No + "'>" + mistakeWord.modifiedName + "</span>" + sentence.substring(mistakeWord.positionInSentence + mistakeWord.modifiedName.length);
}

function generateHtmlSentenceDiv(mistakeWordNo) {
    var html = "";
    var mistakeWord = mistakeWordsList[mistakeWordNo];

    var moreRecommendationBtnStyle = "";
    var misjudgeBtnStyle = "";
    var undoBtnStyle = "";
    var recoverStateBtnStyle = "";
    var confirmACBtnStyle = "";
    var cancelACBtnStyle = "";

    var subKeyClass = "";
    var mainKeyClass = "";

    if (mistakeWord.isIgnored) {
        mainKeyClass = "mis-judge-sentence-div";
        subKeyClass = "mis-judge-state";

        misjudgeBtnStyle = "style='display: none'";
        undoBtnStyle = "style='display: none'";
        confirmACBtnStyle = "style='display: none'";
        cancelACBtnStyle = "style='display: none'";

    } else if (mistakeWord.isModified) {

        misjudgeBtnStyle = "style='display: none'";
        moreRecommendationBtnStyle = "style='display: none'";
        recoverStateBtnStyle = "style='display: none'";
        confirmACBtnStyle = "style='display: none'";
        cancelACBtnStyle = "style='display: none'";

    } else {
        undoBtnStyle = "style='display: none'";
        recoverStateBtnStyle = "style='display: none'";
        confirmACBtnStyle = "style='display: none'";
        cancelACBtnStyle = "style='display: none'";
    }

    html += "<div class='sort-sentence-div " + mainKeyClass + " ' id='mistake-word-" + mistakeWordNo + "' wordno='" + mistakeWordNo + "' onmouseenter='connectWordPanel(this)' onmouseleave='disconnectWordPanel(this)'>" +
        "<div class='wrong-sentence-content-div " + subKeyClass + "'>" +
        generateHtmlSentence(sentenceDict[mistakeWord.sentenceNo], mistakeWord) +
        "</div><div class='sentence-description " + subKeyClass + "'><div class='sentence-description-left'><div class='sentence-description-hand'><img src='/Images/check_hand_icon@3x.png' class='hand-icon'/></div><div class='possible-alters-div'>";
    for (var j = 0; j < mistakeWord.recommendations.length; j++) {
        if (mistakeWord.recommendations[j].s < scoreThreshold) break;
        html += "<span class='possible-alters-btn clickable' onclick='chooseCandidate(this)'>" + mistakeWord.recommendations[j].n + "</span> ";
    }
    html += "</div></div><div class='sentence-description-right'><div class='mis-judge-btn special-alters clickable' onclick='misJudge(this)' " + misjudgeBtnStyle + ">误判</div>" +
        "<div class='recovery-btn special-alters clickable' onclick='recoverState(this)' " + recoverStateBtnStyle + ">恢复</div><div class='undo-btn special-alters clickable' onclick='undo(this)' " + undoBtnStyle + ">撤销修改</div>" +
        "<div class='confirm-AC-btn special-alters clickable' onclick='confirmAC(this)' " + confirmACBtnStyle + ">确认修改</div><div class='cancel-AC-btn special-alters clickable' onclick='cancelAC(this)' " + cancelACBtnStyle + ">返回</div></div></div></div>";

    return html
}

function printSentences() {
    var html = "";
    for (var i = 0; i < mistakeWordsList.length; i++) {
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