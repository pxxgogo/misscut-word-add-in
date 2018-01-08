
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
            if (!Office.context.requirements.isSetSupported('WordApi', '1.3')) {
                $("#description").text("请更新您的word版本，方能使用MissCut插件");
                $('#check-button').attr("disabled", "disabled");
                return;
            }

            // loadSampleData();

            // 为突出显示按钮添加单击事件处理程序。
            $('#check-button').click(checkText);
            $("#finish-button").click(finishRecheck);
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

    function showDebugInfo(text) {
        Word.run(function (context) {
            // 为文档正文创建代理对象。
            var body = context.document.body;

            // 将清空正文内容的命令插入队列。
            body.clear();
            // 将在 Word 文档正文结束位置插入文本的命令插入队列。
            body.insertText(text,
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

    function finishRecheck() {
        Word.run(function (context) {
            var ccs = context.document.contentControls.getByTypes(["RichText"]);
            context.load(ccs, 'text,tag');
            return context.sync()
                .then(function () {
                    for (var i = 0; i < ccs.items.length; i++) {
                        if (ccs.items[i].tag.substring(0, 8) === "mistake-") {
                            ccs.items[i].font.highlightColor = "#FFFFFF";
                            ccs.items[i].delete(true);

                        }
                    }
                })
                .then(context.sync).then(function () {
                    $("#finish-button").hide();
                    $("#check-button").show();
                    $("#display-sentence-div").html("<div id='no-error-notification-div' style='display: none'>< img src= Images/hint.png'><div class='notification-info'>未找到文本错误</div></div >");
                });
        }).catch(function (error) {
            console.log('Error: ' + JSON.stringify(error));
            console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        });
    }

    function submitText(text) {
        if (text.length === 0) return;
        $.support.cors = true;
        $.ajax({ // 提交文本，处理json
            type: 'post',
            url: "https://www.misscut.top/check_api_v5",
            data: { 'text': text },
            datatype: "json",
            crossDomain: true,
            success: function (ret) { // html元素动作，进度条……
                if (ret.return_code === 0) {
                    getResult(ret, text);
                    $("#check-button").hide();
                    $("#finish-button").show();
                } else {
                    //messageBanner.alert("系统繁忙, 请稍后重试!");
                    //messageBanner.showBanner();
                }
            },
            error: function (e) {
                //messageBanner.alert("系统繁忙, 请稍后重试!");
                //messageBanner.showBanner();

                console.log(e.responseText);
                showDebugInfo(e.responseText);
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
