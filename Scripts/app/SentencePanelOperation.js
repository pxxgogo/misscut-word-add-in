var targetNode = null;
function connectWordPanel(node) {
    targetNode = node;
    setTimeout(function () {
        if (targetNode != node) return;
        var mistakeNo = parseInt($(node).attr("wordno"));
        var mistakeTag = "mistake-" + mistakeNo;
        Word.run(function (context) {
            var ccs = context.document.contentControls.getByTag(mistakeTag);
            context.load(ccs);
            return context.sync()
                .then(function () {
                    for (var i = 0; i < ccs.items.length; i++) {
                        ccs.items[i].select();
                        console.log(mistakeNo, i, ccs.items[i].text);
                        //ccs.items[i].font.highlightColor = "#FFFFFF";
                    }
                })
                .then(context.sync);
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        });
    }, 400);
}

function disconnectWordPanel(node) {

}

function checkInputLength(which, mode) {
    var keyCode = event.keyCode;
    if (keyCode === 13) {
        if (mode === 0) {
            confirmAC(which);
        } else {
            finishInputCorrection(which);
        }
    }
    var iCount = which.value.replace(/[^\u0000-\u00ff]/g, "aa");
    if (iCount.length === 0)
        $(which).attr('size', 2);
    else
        $(which).attr('size', iCount.length);
}

function hoverOnCandidate(node, mistakeWordNo, candidateNo) {
    var contentNode = $(node).parents()[3].children[0];
    console.log(contentNode);
    var html = generateHtmlSentence(mistakeWordNo);
    $(contentNode).html(html);
}


// fixed  all above
function modifySentence(mistake, oldWordName, newWordName) {
    var sentenceNo = mistake["sentence_No"];
    var sentence = _sentenceList[sentenceNo];
    _sentenceList[sentenceNo] = sentence.substring(0, mistake["position_in_sentence"]) + newWordName + sentence.substring(mistake["position_in_sentence"] + oldWordName.length);
    console.log("new sentence", _sentenceList[sentenceNo], mistake["position_in_sentence"], newWordName, oldWordName);
    updatePositionInSentences(sentenceNo, mistake["position_in_sentence"], oldWordName.length, newWordName.length);
    updateSentencePanelSentenceShowing(sentenceNo);
}

function modifySentence_normalWord(sentenceNo, sentencePosition, oldWord, candidateContent) {
    var sentence = sentenceDict[sentenceNo];
    sentenceDict[sentenceNo] = sentence.substring(0, sentencePosition) + candidateContent + sentence.substring(sentencePosition + oldWord.length);
    console.log("new sentence", sentenceDict[sentenceNo]);
    updatePositionInSentences(sentenceNo, sentencePosition, oldWord.length, candidateContent.length);
    updateSentencePanelSentenceShowing(sentenceNo);

}

// fixed
function updateSentencePanelSentenceShowing(sentenceNo) {
    var mistakesNo = _sentenceNo2MistakeNoDict[sentenceNo];
    for (var i = 0; i < mistakesNo.length; i++) {
        var mistakeNo = mistakesNo[i];
        var mistake = _resultList[mistakeNo]
        var sentenceHtmlID = "mistake-word-" + mistakeNo;
        var node = document.getElementById(sentenceHtmlID);
        var newSentenceHtml = generateHtmlSentence(mistakeNo);
        $(node).find(".wrong-sentence-content-div").html(newSentenceHtml);
    }
}

// fixed
function updatePositionInSentences(sentenceNo, keyPositionL, keyLengthOld, keyLengthNew) {
    if (keyLengthNew === keyLengthOld) {
        return;
    }
    var deltaLength = keyLengthNew - keyLengthOld;
    var mistakesNo = _sentenceNo2MistakeNoDict[sentenceNo];
    for (var i = 0; i < mistakesNo.length; i++) {
        var mistake = _resultList[mistakesNo[i]];
        if (mistake["position_in_sentence"] <= keyPositionL) {
            continue;
        }
        mistake["position_in_sentence"] += deltaLength;
    }
}

// fixed
// trigger with chooseCandidate()
function updateWordPanel_chooseCandidate(mistakeNo, candidateContent) {
    var mistakeTag = "mistake-" + mistakeNo;
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    if (candidateContent !== "{空}") {
                        ccs.items[i].insertText(candidateContent, 'Replace');
                    } else {
                        ccs.items[i].insertText(candidateContent, 'Replace');
                    }
                    ccs.items[i].font.highlightColor = "#FFFFFF";
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}


// fixed
// trigger with undo()
function updateWordPanel_undo(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    var mistake = _resultList[mistakeNo];
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    ccs.items[i].insertText(mistake["raw_word"], 'Replace');
                    ccs.items[i].font.highlightColor = HIGHLIGHT_COLORS[mistake["mistake_level"]];
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}

// fixed
// trigger with misJudge()
function updateWordPanel_misJudge(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    ccs.items[i].font.highlightColor = "#FFFFFF";
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}

// fixed
// trigger with recoverState()
function updateWordPanel_recoverState(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    var mistake = _resultList[mistakeNo];
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    ccs.items[i].font.highlightColor = HIGHLIGHT_COLORS[mistake["mistake_level"]];
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}

// fixed
function chooseCandidate(node, mistakeNo, candidateNo) {
    var parent = node.parentNode.parentNode.parentNode.parentNode;
    var mistake = _resultList[mistakeNo];
    var candidate = mistake["candidates"][candidateNo];
    var candidateContent = candidate["candidate"];
    var oldWord = mistake["raw_word"];
    mistake["modified_name"] = candidateContent;
    mistake["is_modified"] = true;
    modifySentence(mistake, oldWord, candidateContent);
    

    // Update wordPanel
    updateWordPanel_chooseCandidate(mistakeNo, candidateContent);
    $(parent).find(".mis-judge-btn").hide();
    $(parent).find(".undo-btn").show();

}


// fixed 
function misJudge(node, mistakeNo) {
    var parent = node.parentNode.parentNode.parentNode;
    var mistake = _resultList[mistakeNo];
    mistake["is_ignored"] = true;
    updateWordPanel_misJudge(mistakeNo);
    $(parent).addClass("mis-judge-sentence-div");
    $(parent).find(".sentence-description,.wrong-sentence-content-div,.keyword").addClass("mis-judge-state");
    $(parent).find(".mis-judge-btn").hide();
    $(parent).find(".recovery-btn").show();
    $(parent).find(".possible-alters-btn").removeClass("clickable").attr("disabled", "disabled");

}

// fixed
function recoverState(node, mistakeNo) {
    var parent = node.parentNode.parentNode.parentNode;
    $(parent).removeClass("mis-judge-sentence-div");
    $(parent).find(".sentence-description,.wrong-sentence-content-div,.keyword").removeClass("mis-judge-state");
    $(parent).find(".mis-judge-btn").show();
    $(parent).find(".recovery-btn").hide();
    $(parent).find(".possible-alters-btn").removeAttr("disabled").addClass("clickable");
    _resultList[mistakeNo]["is_ignored"] = false;
    updateWordPanel_recoverState(mistakeNo);
}

// fixed
function undo(node, mistakeNo) {
    var parent = node.parentNode.parentNode.parentNode;
    var possibleNodes = parent.firstChild.childNodes;
    var mistake = _resultList[mistakeNo];
    mistake["is_modified"] = false;
    modifySentence(mistake, mistake["modified_name"], mistake["raw_word"]);
    mistake["modified_name"] = ""
    // Update wordPanel
    updateWordPanel_undo(mistakeNo);
    $(parent).find(".mis-judge-btn").show();
    $(parent).find(".undo-btn").hide();
}
