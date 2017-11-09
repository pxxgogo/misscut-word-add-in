/**
 * Created by pxxgogo on 2017/5/25.
 */
/**
 * Created by pxxgogo on 2017/5/21.
 */
var resultListBackUp = [];
var resultList = [];

var sentenceDict = {};
var sentenceBeginIndexDict = {};
var sentence2MistakeIndexDict = {};
var word2MistakeIndexDict = {};
var mistakeWordsList = [];
var mistakesClusterList = [];

var maxSentenceNo = 0;
var resultShowingType = 0;
var scoreThreshold = 1.8;
var LIndex = 0;
var wordPanelLength = 300;
var checkingFlag = false;
var clip = null;

// 将显示切换到聚类模式
// 切换到排序模式

// 存的过程中同时找错词
function MistakeWord(name, recommendations, No, sentenceNo, positionInSentence, type) {
    this.name = name;
    this.recommendations = recommendations; // 推荐
    this.No = No; // wordNo
    this.bestScore = recommendations[0].s; // 评分值（第一个recommendation和它的原分值相减。如果大于0说明有问题。这是排序用的。）
    this.sentenceNo = sentenceNo; // 句子的索引
    this.positionInSentence = positionInSentence; // 词在句子中的位置
    this.type = type; // type
    this.isModified = false;
    this.isIgnored = false;
    this.modifiedName = name;
}

// 聚类
// 同一个词对应……
function MistakesCluster(mistakeWordName, recommendedWordName, mistakeWordNoList, score) {
    this.mistakeWordName = mistakeWordName;
    this.recommendedWordName = recommendedWordName;
    this.mistakeWordNoList = mistakeWordNoList; // 所有句子编号的list，重用句子的html
    this.score = score; // 仍然要排序；当前的class中的第一个句子的第一个错词的value
}

