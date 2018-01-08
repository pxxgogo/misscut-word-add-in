
function getSameWordNo(sentenceNo, mistake) {
    var sentence = _sentenceList[sentenceNo];
    var position = mistake.position_in_sentence;
    var retNo = 0;
    var name = mistake["raw_word"];
    var index = sentence.indexOf(name);
    while (index >= 0 && index !== position) {
        retNo += 1;
        index = sentence.indexOf(name, index + 1);
    }
    if (index < 0) {
        console.log("getSameWordNo Error: ", name, sentenceNo, sentence);
        return -1;
    }
    return retNo;
}


function hightlightRet() {
    Word.run(function (context) {
        var range = context.document.getSelection();
        context.load(range, 'text');
        var retSentenceSearchRetList = [];
        var retWordSearchRetList = [];
        var retSameWordNoList = [];
        return context.sync()
            .then(function () {
                for (var mistakeNo = 0; mistakeNo < _resultList.length; mistakeNo++) {
                    var mistake = _resultList[mistakeNo];
                    console.log(mistake);
                    var sentence = _sentenceList[mistake["sentence_No"]];
                    var sameWordNo = getSameWordNo(mistake["sentence_No"], mistake);
                    if (sameWordNo < 0) continue;
                    //console.log("load range", mistakeNo);
                    //console.log("sentence: ", sentence);
                    //console.log("range", range);
                    var searchRet = range.search(sentence);
                    context.load(searchRet);
                    retSentenceSearchRetList.push(searchRet);
                    retSameWordNoList.push(sameWordNo);
                }
            }).then(context.sync)
            .then(function () {
                for (var mistakeNo = 0; mistakeNo < _resultList.length; mistakeNo++) {
                    var mistake = _resultList[mistakeNo];
                    var sentence = _sentenceList[mistake["sentence_No"]];
                    var searchRet = retSentenceSearchRetList[mistakeNo];
                    //console.log("load sentenceSearch", mistakeNo);
                    //console.log("searchRet num: ", searchRet.items.length);
                    var num = searchRet.items.length;
                    var subWordSearchRetList = [];
                    for (var i = 0; i < num; i++) {
                        var sentenceRange = searchRet.items[i];
                        var wordSearchRet = sentenceRange.search(mistake["raw_word"]);
                        context.load(wordSearchRet, 'font');
                        subWordSearchRetList.push(wordSearchRet);
                    }
                    retWordSearchRetList.push(subWordSearchRetList);
                }
            }).then(context.sync)
            .then(function () {
                for (var mistakeNo = 0; mistakeNo < _resultList.length; mistakeNo++) {
                    var mistake = _resultList[mistakeNo];
                    var sameWordNo = retSameWordNoList[mistakeNo];
                    var subWordSearchRetList = retWordSearchRetList[mistakeNo];
                    for (var i = 0; i < subWordSearchRetList.length; i++) {
                        var wordSearchRet = subWordSearchRetList[i];
                        if (mistake["mistake_level"] === 0) continue;
                        wordSearchRet.items[sameWordNo].font.highlightColor = HIGHLIGHT_COLORS[mistake["mistake_level"]];
                        var cc = wordSearchRet.items[sameWordNo].insertContentControl();
                        cc.tag = "mistake-" + mistakeNo;  // This value is used in another part of this sample.
                        cc.title = mistake["candidates"][0]["candidate"];
                        console.log("tag: ", cc.tag, "word: ", mistake["raw_word"]);
                    }
                }
            }).then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}




