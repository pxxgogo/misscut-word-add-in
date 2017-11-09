
(function () {
    "use strict";

    var messageBanner;

    // 每次加载新页面时都必须运行初始化函数
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // 初始化 FabricUI 通知机制并隐藏
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();

            // 如果未使用 Excel 2016，请使用回退逻辑。
            if (!Office.context.requirements.isSetSupported('WordApi', '1.1')) {
                $("#template-description").text("此示例显示选定的文本。");
                $('#button-text').text("显示!");
                $('#button-desc').text("显示选定的文本");

                $('#check-button').click(checkText);
                return;
            }

            $("#template-description").text("提交待查错文本，我们将会直接反馈给您文本错误信息。");
            $('#button-text').text("提交文本");
            $('#button-desc').text("");

            //loadSampleData();

            // 为突出显示按钮添加单击事件处理程序。
            $('#check-button').click(checkText);
        });
    };

    function loadSampleData() {
        // 针对 Word 对象模型运行批处理操作。
        Word.run(function (context) {
            // 为文档正文创建代理对象。
            var body = context.document.body;

            // 将清空正文内容的命令插入队列。
            body.clear();
            // 将在 Word 文档正文结束位置插入文本的命令插入队列。
            body.insertText(
                "中美执法部门连手成功破获特大跨国走私武器弹药案，在中国抓获犯罪嫌疑人23名，缴获各类枪支93支、子弹5万余发及大量强制配件。在美国抓获犯罪嫌疑人3名，缴获各类枪支12支。专案组于8月26日在浙江台州取件处将犯罪献艺人王挺抓获。公安部刑侦局局长刘安成：因为是从海关进口的货物中检查出来夹带，说明来源地是境外，或是说国外，这应该是一起特大跨国走私无期弹药的案件。有的是军用枪、仿制的抢，还有猎枪、私制的火药枪等等。按照我国的抢支管理法，这些都是眼力禁止个人非法持有的。\n 但他的道歉，没有得到网友的接收和原谅，有网友建瑞指出，张绍刚的问题就在俯视他人，连道歉都不会，声称自己没错，绝不道歉。他最后表示：“留学生的批评我很感谢，我会努力去了解这个群体的所思所想。”",
                Word.InsertLocation.end);

            // 通过执行排队的命令来同步文档状态，并返回承诺以表示任务完成。
            return context.sync();
        })
            .catch(errorHandler);
    }

    function checkText() {
        Word.run(function (context) {
            var range = context.document.getSelection();
            context.load(range, 'text');
            return context.sync()
                .then(function () {
                    submitText(range.text);
                })
        }).catch(function (error) {
                console.log('Error: ' + JSON.stringify(error));
                if (error instanceof OfficeExtension.Error) {
                    console.log('Debug info: ' + JSON.stringify(error.debugInfo));
                }
            });
    }

    function submitText(text) {
        $.support.cors = true;
        $.ajax({ // 提交文本，处理json
            type: 'post',
            url: "http://www.misscut.cn:8001/about_test",
            data: { 'text': text },
            datatype: "json",
            crossDomain: true,
            success: function (ret) { // html元素动作，进度条……
            
                // 非常重要
                var result = ret; // 浅拷贝
                if (result.return_code === 0) {
                    operateResult(result);
                    hightlightRet();
                } else {
                    //messageBanner.alert("系统繁忙, 请稍后重试!");
                    //messageBanner.showBanner();
                }
            },
            error: function (e) {
                //messageBanner.alert("系统繁忙, 请稍后重试!");
                //messageBanner.showBanner();
                console.log(e);

            }
        });
    }

    function operateResult(ret) {
        resultList = ret.result;
        resultListBackUp = JSON.parse(JSON.stringify(ret)).result;
        var resultForBuilding = JSON.parse(JSON.stringify(ret)).result;
        checkingFlag = true;
        analyze(resultForBuilding);
        //generateWordsPanel();
        updateResult();
    }



    function updateResult() {
        // console.log(resultShowingType);
        // console.log(mistakeWordsList);
        if (mistakeWordsList.length === 0) {
            printNoErrorNotification();
            return;
        }
        switch (resultShowingType) {
            case 0: // 普通模式
                printSentences();
                break;
            //case 1:  // 聚类模式
            //    clusterWrongWords(mistakesClusterList);
        }
    }


    function displaySelectedText() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    showNotification('选定的文本为:', '"' + result.value + '"');
                } else {
                    showNotification('错误:', result.error.message);
                }
            });
    }

    //$$(Helper function for treating errors, $loc_script_taskpane_home_js_comment34$)$$
    function errorHandler(error) {
        // $$(Always be sure to catch any accumulated errors that bubble up from the Word.run execution., $loc_script_taskpane_home_js_comment35$)$$
        showNotification("错误:", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }

    // 用于显示通知的帮助程序函数
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
