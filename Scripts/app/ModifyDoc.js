var hightlightColors = ["red", "yellow", "orange"];

function getSameWordNo(sentence, mistake) {
    var position = mistake.positionInSentence;
    var retNo = 0;
    var index = sentence.indexOf(mistake.name);
    while (index >= 0 && index !== position) {
        retNo += 1;
        index = sentence.indexOf(mistake.name, index + 1);
    }
    if (index < 0) {
        console.log(sentence, mistake.name);
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
                for (var mistakeNo = 0; mistakeNo < mistakeWordsList.length; mistakeNo++) {
                    var mistake = mistakeWordsList[mistakeNo];
                    var sentence = sentenceDict[mistake.sentenceNo];
                    var sameWordNo = getSameWordNo(sentence, mistake);
                    if (sameWordNo < 0) continue;
                    console.log("load range", mistakeNo);
                    console.log("sentence: ", sentence);
                    console.log("range", range);
                    var searchRet = range.search(sentence);
                    context.load(searchRet);
                    retSentenceSearchRetList.push(searchRet);
                    retSameWordNoList.push(sameWordNo);
                }
            }).then(context.sync)
            .then(function () {
                for (var mistakeNo = 0; mistakeNo < mistakeWordsList.length; mistakeNo++) {
                    var mistake = mistakeWordsList[mistakeNo];
                    var sentence = sentenceDict[mistake.sentenceNo];
                    var searchRet = retSentenceSearchRetList[mistakeNo];
                    console.log("load sentenceSearch", mistakeNo);
                    console.log("searchRet num: ", searchRet.items.length);
                    var num = searchRet.items.length;
                    var subWordSearchRetList = [];
                    var sameWordNo = retSameWordNoList[mistakeNo];
                    for (var i = 0; i < num; i++) {
                        var sentenceRange = searchRet.items[i];
                        var wordSearchRet = sentenceRange.search(mistake.name);
                        context.load(wordSearchRet, 'font');
                        subWordSearchRetList.push(wordSearchRet);
                    }
                    retWordSearchRetList.push(subWordSearchRetList);
                }
            }).then(context.sync)
            .then(function () {
                for (var mistakeNo = 0; mistakeNo < mistakeWordsList.length; mistakeNo++) {
                    var mistake = mistakeWordsList[mistakeNo];
                    var sameWordNo = retSameWordNoList[mistakeNo];
                    var subWordSearchRetList = retWordSearchRetList[mistakeNo];
                    for (var i = 0; i < subWordSearchRetList.length; i++) {
                        var wordSearchRet = subWordSearchRetList[i];
                        wordSearchRet.items[sameWordNo].font.highlightColor = hightlightColors[6 - mistake.type]; // 黄色
                        var cc = wordSearchRet.items[sameWordNo].insertContentControl();
                        cc.tag = "mistake-" + mistakeNo;  // This value is used in another part of this sample.
                        cc.title = mistake.recommendations[0].n;
                    }
                }
            }).then(context.sync);
    }).catch(function (error) {
        console.log('Error: ' + JSON.stringify(error));
        console.log('Debug info: ' + JSON.stringify(error.debugInfo));
    });
}




