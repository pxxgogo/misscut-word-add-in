// JavaScript source code

// 对相同的错误做聚类处理


function generateSentenceOrWord2MistakesIndexDict() {
    for (var i = 0; i < mistakeWordsList.length; i++) {
        var mistakeWord = mistakeWordsList[i];
        var wordNo = mistakeWord.No;
        var sentenceNo = mistakeWord.sentenceNo;
        word2MistakeIndexDict[wordNo] = i;
        if (sentence2MistakeIndexDict[sentenceNo]) {
            sentence2MistakeIndexDict[sentenceNo].push(i);
        } else {
            sentence2MistakeIndexDict[sentenceNo] = [i];
        }
    }
    // console.log(sentence2MistakeIndexDict);

}


function sortMistakeWordsList() {
    mistakeWordsList.sort(function (x, y) {
        if (x.bestScore < y.bestScore)
            return 1;
        else if (x.bestScore > y.bestScore)
            return -1;
        else return 0;
    });
}

// 用于判断两个错词相同
// 在getSameWrongSameRecommendationDict()中调用
function findWordInmistakesClusterList(mistakesClusterList, mistakeWord) {
    for (var i = 0; i < mistakesClusterList.length; i++) {
        if (mistakesClusterList[i].mistakeWordName === mistakeWord.name && mistakesClusterList[i].recommendedWordName === mistakeWord.recommendations[0].n) {
            return i;
        }
    }
    return -1;
}


function getSameWrongSameRecommendationDict() {
    var mistakesClusterList = [];
    // console.log(maxIndex);
    for (var i = 0; i < mistakeWordsList.length; i++) {
        // 用暴力的方法找出第一个相同的词
        var mistakeWord = mistakeWordsList[i];
        // console.log(mistakeWord);
        var retNo = findWordInmistakesClusterList(mistakesClusterList, mistakeWord);
        if (retNo === -1) {
            var mistakeWordNoList = [];
            mistakeWordNoList.push(i);
            mistakesClusterList.push(new MistakesCluster(mistakeWord.name, mistakeWord.recommendations[0].n, mistakeWordNoList, mistakeWord.bestScore));
        } else {
            mistakesClusterList[retNo].mistakeWordNoList.push(i);
            mistakesClusterList[retNo].score += mistakeWord.bestScore;
        }
    }
    mistakesClusterList.sort(function (x, y) {
        if (x.mistakeWordNoList.length < y.mistakeWordNoList.length)
            return 1;
        else if (x.mistakeWordNoList.length > y.mistakeWordNoList.length)
            return -1;
        else {
            if (x.score > y.score)
                return -1;
            else if (x.score < y.score)
                return 1;
            else return 0;
        }
    });
    return mistakesClusterList;
}

function analyze(ret) {
    var sentenceNo = -1;
    var text = "";
    var positionInSentence = 0;
    sentenceDict = {};
    mistakeWordsList = [];
    word2MistakeIndexDict = {};
    sentence2MistakeIndexDict = {};
    sentenceBeginIndexDict = {};
    LIndex = 0;
    maxSentenceNo = 0;
    var beginIndex = 0;
    // 生成每句话
    for (var i = 0; i < ret.length; i++) {
        if (ret[i].s !== sentenceNo) {
            sentenceDict[sentenceNo] = text;
            sentenceBeginIndexDict[sentenceNo] = beginIndex;
            // console.log(text);
            sentenceNo = ret[i].s;
            text = "";
            beginIndex = i;
            positionInSentence = 0;
        }
        if (ret[i].t > 0 && ret[i].t <= 9) {
            var type = "type" + ret[i];
            var Num = 3;
            mistakeWordsList.push(new MistakeWord(ret[i].n, ret[i].r, i, sentenceNo, positionInSentence, ret[i].t));
            text += ret[i].n;
            positionInSentence += ret[i].n.length;
            continue;
        }
        text += ret[i].n;
        positionInSentence += ret[i].n.length;
    }
    if (text !== "") {
        sentenceDict[sentenceNo] = text;
        sentenceBeginIndexDict[sentenceNo] = beginIndex;
    }
    maxSentenceNo = sentenceNo;
    sortMistakeWordsList();
    generateSentenceOrWord2MistakesIndexDict();
    mistakesClusterList = getSameWrongSameRecommendationDict();
     //console.log(mistakeWordsList);
     //console.log(sentenceDict);
}

