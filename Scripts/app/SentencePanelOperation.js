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

function modifySentence(mistakeWord, newWordName) {
    var sentenceNo = mistakeWord.sentenceNo;
    var sentence = sentenceDict[sentenceNo];
    sentenceDict[sentenceNo] = sentence.substring(0, mistakeWord.positionInSentence) + newWordName + sentence.substring(mistakeWord.positionInSentence + mistakeWord.modifiedName.length);
    // console.log("new sentence", sentenceDict[sentenceNo]);
    updatePositionInSentences(sentenceNo, mistakeWord.positionInSentence, mistakeWord.modifiedName.length, newWordName.length);
    if (mistakeWord.name === newWordName) {
        mistakeWord.isModified = false;
    } else {
        mistakeWord.isModified = true;
    }
    mistakeWord.modifiedName = newWordName;
    updateSentencePanelSentenceShowing(sentenceNo);
}

function modifySentence_normalWord(sentenceNo, sentencePosition, oldWord, candidateContent) {
    var sentence = sentenceDict[sentenceNo];
    sentenceDict[sentenceNo] = sentence.substring(0, sentencePosition) + candidateContent + sentence.substring(sentencePosition + oldWord.length);
    console.log("new sentence", sentenceDict[sentenceNo]);
    updatePositionInSentences(sentenceNo, sentencePosition, oldWord.length, candidateContent.length);
    updateSentencePanelSentenceShowing(sentenceNo);

}

function updateSentencePanelSentenceShowing(sentenceNo) {
    var mistakesNo = sentence2MistakeIndexDict[sentenceNo];
    for (var i = 0; i < mistakesNo.length; i++) {
        var mistake = mistakeWordsList[mistakesNo[i]];
        var sentenceHtmlID = "mistake-word-" + mistakesNo[i];
        var node = document.getElementById(sentenceHtmlID);
        var newSentenceHtml = generateHtmlSentence(sentenceDict[sentenceNo], mistake);
        // console.log("newSentenceHtml", newSentenceHtml);
        $(node).find(".wrong-sentence-content-div").html(newSentenceHtml);
    }

}

function updatePositionInSentences(sentenceNo, keyPositionL, keyLengthOld, keyLengthNew) {
    if (keyLengthNew === keyLengthOld) {
        return;
    }
    var deltaLength = keyLengthNew - keyLengthOld;
    var mistakes = sentence2MistakeIndexDict[sentenceNo];
    for (var i = 0; i < mistakes.length; i++) {
        var otherMistake = mistakeWordsList[mistakes[i]];
        if (otherMistake.positionInSentence <= keyPositionL) {
            continue;
        }
        otherMistake.positionInSentence += deltaLength;
    }
}

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

// trigger with undo()
function updateWordPanel_undo(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    var mistake = mistakeWordsList[mistakeNo];
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    ccs.items[i].insertText(mistake.name, 'Replace');
                    ccs.items[i].font.highlightColor = hightlightColors[6-mistake.type];
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}

// trigger with misJudge()
function updateWordPanel_misJudge(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    var mistake = mistakeWordsList[mistakeNo];
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

// trigger with recoverState()
function updateWordPanel_recoverState(mistakeNo) {
    var mistakeTag = "mistake-" + mistakeNo;
    var mistake = mistakeWordsList[mistakeNo];
    Word.run(function (context) {
        var ccs = context.document.contentControls.getByTag(mistakeTag);
        context.load(ccs, 'text');
        return context.sync()
            .then(function () {
                for (var i = 0; i < ccs.items.length; i++) {
                    ccs.items[i].font.highlightColor = hightlightColors[6 - mistake.type];
                }
            })
            .then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}


function chooseCandidate(node) {
    var candidateContent = node.innerHTML;
    var parent = node.parentNode.parentNode.parentNode.parentNode;
    var wordNo = parseInt($(parent).attr("wordno"));
    resultList[wordNo].modifiedName = candidateContent;
    resultList[wordNo].isModified = true;
    var mistakeNo = parseInt(parent.id.substring(13));
    var mistakeWord = mistakeWordsList[mistakeNo];

    modifySentence(mistakeWord, candidateContent);

    // Update wordPanel
    updateWordPanel_chooseCandidate(wordNo, candidateContent);
    $(parent).find(".mis-judge-btn").hide();
    $(parent).find(".more-recommendation-btn").hide();
    $(parent).find(".confirm-AC-btn").hide();
    $(parent).find(".cancel-AC-btn").hide();
    $(parent).find(".undo-btn").show();

}

function misJudge(node) {
    var parent = node.parentNode.parentNode.parentNode;
    var mistakeNo = parseInt(parent.id.substring(13));
    mistakeWordsList[mistakeNo].isIgnored = true;
    var wordNo = parseInt($(parent).attr("wordno"));
    resultList[wordNo].isIgnored = true;
    updateWordPanel_misJudge(wordNo);
    $(parent).addClass("mis-judge-sentence-div");
    $(parent).find(".sentence-description,.wrong-sentence-content-div,.keyword").addClass("mis-judge-state");
    $(parent).find(".mis-judge-btn").hide();
    $(parent).find(".recovery-btn").show();
    $(parent).find(".possible-alters-btn").removeAttr("onclick").removeClass("clickable");
    $(parent).find(".more-recommendation-btn").removeAttr("onclick").removeClass("clickable");

}

function recoverState(node) {
    var parent = node.parentNode.parentNode.parentNode;
    $(parent).removeClass("mis-judge-sentence-div");
    $(parent).find(".sentence-description,.wrong-sentence-content-div,.keyword").removeClass("mis-judge-state");
    $(parent).find(".mis-judge-btn").show();
    $(parent).find(".recovery-btn").hide();
    $(parent).find(".possible-alters-btn").attr("onclick", "chooseCandidate(this)").addClass("clickable");
    $(parent).find(".more-recommendation-btn").attr("onclick", "artificiallyCorrect(this)").addClass("clickable");
    var mistakeNo = parseInt(parent.id.substring(13));
    mistakeWordsList[mistakeNo].isIgnored = false;
    var wordNo = parseInt($(parent).attr("wordno"));
    resultList[wordNo].isIgnored = false;
    updateWordPanel_recoverState(wordNo);
}

function artificiallyCorrect(node) {
    var parent = node.parentNode.parentNode.parentNode;
    var possibleNodes = parent.firstChild.childNodes;
    for (var i = 0; i < possibleNodes.length; i++) {
        if (possibleNodes[i].id) {
            var wordNo = parseInt($(parent).attr("wordno"));
            var word = resultList[wordNo].n;
            var iCount = word.replace(/[^\u0000-\u00ff]/g, "aa").length;
            possibleNodes[i].innerHTML = "<input class='artificially-correct-input' type='text' onkeyup='checkInputLength(this, 0)' size='" + iCount + "' value='" + word + "'>";
            break;
        }
    }
    $(parent).find(".mis-judge-btn").hide();
    $(parent).find(".more-recommendation-btn").hide();
    $(parent).find(".confirm-AC-btn").show();
    $(parent).find(".cancel-AC-btn").show();
}

function confirmAC(node) {
    var parent = node.parentNode.parentNode.parentNode;
    var possibleNodes = parent.firstChild.childNodes;
    for (var i = 0; i < possibleNodes.length; i++) {
        if (possibleNodes[i].id) {
            var candidateContent = possibleNodes[i].firstChild.value;
            var wordNo = parseInt($(parent).attr("wordno"));
            var ret = resultList[wordNo];
            if (ret.n === candidateContent) {
                cancelAC(node);
                return;
            }
            // change logic
            ret.modifiedName = candidateContent;
            ret.isModified = true;
            var mistakeNo = parseInt(parent.id.substring(13));
            var mistakeWord = mistakeWordsList[mistakeNo];
            modifySentence(mistakeWord, candidateContent);
            // Update wordPanel
            updateWordPanel_chooseCandidate(wordNo, candidateContent);
            break;
        }
    }
    $(parent).find(".confirm-AC-btn").hide();
    $(parent).find(".cancel-AC-btn").hide();
    $(parent).find(".undo-btn").show();
}

function cancelAC(node) {
    var parent = node.parentNode.parentNode.parentNode;
    var possibleNodes = parent.firstChild.childNodes;
    for (var i = 0; i < possibleNodes.length; i++) {
        if (possibleNodes[i].id) {
            var wordNo = parseInt(possibleNodes[i].id.substring(2));
            possibleNodes[i].innerHTML = resultList[wordNo].n;
            $(possibleNodes[i]).attr("class", "keyword mt-" + resultList[wordNo].t);
            break;
        }
    }
    $(parent).find(".confirm-AC-btn").hide();
    $(parent).find(".cancel-AC-btn").hide();
    $(parent).find(".mis-judge-btn").show();
    $(parent).find(".more-recommendation-btn").show();

}

function undo(node) {
    var parent = node.parentNode.parentNode.parentNode;
    var possibleNodes = parent.firstChild.childNodes;
    var wordNo = parseInt($(parent).attr("wordno"));
    resultList[wordNo].isModified = false;
    var mistakeNo = parseInt(parent.id.substring(13));
    var mistakeWord = mistakeWordsList[mistakeNo];
    modifySentence(mistakeWord, mistakeWord.name);
    // Update wordPanel
    updateWordPanel_undo(wordNo);
    $(parent).find(".mis-judge-btn").show();
    $(parent).find(".more-recommendation-btn").show();
    $(parent).find(".undo-btn").hide();
}
