function strQ2B(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) >= 65296 && str.charCodeAt(i) <= 65305) {// 如果位于全角！到全角～区间内
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
            // } else if (str.charCodeAt(i) === 12288) {//全角空格的值，它没有遵从与ASCII的相对偏移，必须单独处理
            //     tmp += ' ';
        } else {// 不处理全角空格，全角！到全角～区间外的字符
            tmp += str[i];
        }
    }
    return tmp;
}

function isBlank(char) {
    return (char === '\t' || char === " " | char === "　");
}

function findNextSentenceNo(i, textList) {
    i++;
    while (i < textList.length && textList[i] === "") {
        i++;
    }
    return i;
}

function isSymbol(sentence) {
    var ret = sentence.search(SYMBOL_PATTERN);
    // console.log(sentence, ret, SYMBOL_PATTERN);
    return ret !== -1;

}


function createSentencesList(inputText) {
    var sentenceList = [];
    var paragraphList = inputText.split(NEW_LINE_PATTERN);
    console.log(paragraphList);
    for (let i = 0; i < paragraphList.length; i++) {
        let para = paragraphList[i];
        if (para === "" || para.charCodeAt(0) === 13 || para.charCodeAt(0) === 10) {
            continue;
        }
        var sentencePerPara = createSentencesListPerPara(para);
        sentenceList.push.apply(sentenceList, sentencePerPara);
    }
    return sentenceList;
}

function createSentencesListPerPara(para) {
    var sentenceList = [];
    var textList = para.split(SENTENCE_PATTERN);

    var No = 0;
    var flag = false;
    var ret = "";
    while (textList[No] === "") {
        No += 1;
    }
    while (No < textList.length) {
        var sentence = textList[No];
        if (isBlank(sentence)) {
            if (ret !== "") {
                sentenceList.push(ret);
                ret = "";
            }
            sentenceList.push(sentence);
            flag = false;
            No = findNextSentenceNo(No, textList);
            continue;
        }
        // console.log(sentence);
        var symbolFlag = isSymbol(sentence);
        if (flag && !symbolFlag) {
            sentenceList.push(ret);
            ret = "";
        }
        ret += sentence;
        if (symbolFlag) {
            if ((sentence === "”" && flag) || (sentence !== "”")) {
                flag = true;
                // console.log(sentence, "”", "true")

            } else {
                flag = false;
                // console.log(sentence, "”", "false")

            }
        } else {
            flag = false;
        }
        No = findNextSentenceNo(No, textList);
    }
    if (ret.length > 0) {
        sentenceList.push(ret);
    }
    return sentenceList;
}