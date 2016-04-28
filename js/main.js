//初始化页面并绑定事件
$(function() {
    //发送文本框内容
    $("#send").bind("click", function() {
        var $content = $("#txtContent");
        if ($content.val() != "") {
            sendContent($content.val());
        } else {
            alert("发送内容不能为空！");
            $content.focus();
            return false;
        }
    });
    $("#logout").bind("click", function() {
        sendLogOut();
    });
    //显示表情图标,并将表情图标的id号显示在文本框中
    initFace();
    $("table tr td img").bind("click", function() {
        var strContent = $("#txtContent").val() + "<:" + this.id + ":>";
        $("#txtContent").val(strContent);
    });

    //定时获取最新聊天内容和当前在线的用户信息
    autoUpdateContent();
    //注意setTimeout()和setInterval()两个函数的用法
    var hander = setInterval("autoUpdateContent()", 2000);
    $("#divMsg").ajaxStart(function() {
        $(this).show().html("正在发送数据...");
    });
    $("#divMsg").ajaxStop(function() {
        $(this).html("已完成").hide();
    });

});

//初始化所有表情图标
function initFace() {
    var strHTML = "";
    for (var i = 1; i <= 6; i++) {
        strHTML += "<img src='emoji/" + i + ".png' id='" + i + "' />";
    }
    $("#divFace").html(strHTML);
}
//发送聊天对话框内容
function sendContent(content) {
    $.ajax({
        type: "GET",
        url: "index.php",
        //参数"d"为避免返回缓存中的数据，保持数据是最新的
        data: "action=sendContent&d=" + new Date() + "&content=" + content,
        success: function(data) {
            if (data == "1") {
                //发送成功后重新获取聊天框的最新内容
                getMessageList();
                //发送成功后清空发送框的内容
                $("#txtContent").val("");
            } else {
                // alert(data);
                alert("发送失败！");
                return false;
            }
        }
    });
}


//发送请求并处理返回的数据
function autoUpdateContent() {
    getMessageList();
    getOnlineList();
}
//发送获取全部聊天记录的请求
function getMessageList() {
    $.ajax({
        type: "GET",
        url: "index.php",
        data: "action=ChatList&d=" + new Date(),
        success: function(data) {
            //ajax请求没有指定返回数据格式为json,
            // 需要将返回的json字符串转化为json对象才能够取对象的属性
            var obj = eval(data);
            var contentHTML = '<table>';
            // for(var i=0;i<data.length;i++){
            //     for( var key in data[i]){
            //         contentHTML += data[i][key];
            //     }
            // }
            $.each(obj, function(index, value) {
                var face = value.content;
                //将表情符编码替换为原表情图标,g表示全局替换
                face = face.replace(/<:/g,"<img src='./emoji/");
                face = face.replace(/:>/g,".png '/>");
                contentHTML += '<tr><td>'
                contentHTML += value.username + '于' + value.date + '说: ' + face;
                contentHTML += '</td></tr>';
            });
            contentHTML += '</table>';
            $("#divContent").html(contentHTML);
        }
    });
}
//发送获取当前在线用户列表的请求
function getOnlineList() {
    $.ajax({
        type: "GET",
        url: "index.php",
        data: "action=OnlineList&d=" + new Date(),
        success: function(data) {
            var obj = eval(data);
            var userHTML = '<table>';
            $.each(obj, function(index, value) {
                userHTML += '<tr><td>'
                userHTML += value.username;
                userHTML += '</td></tr>';
            });
            userHTML += '</table>';
            $("#divOnline").html(userHTML);
        }
    });
}
//发送注销当前用户的请求
function sendLogOut() {
    $.ajax({
        type: "GET",
        url: "index.php",
        data: "action=LogOut&d=" + new Date(),
        success: function(data) {
            if (data == "1") {
                window.location = "login.html";
            } else {
                alert("error");
            }
        }
    });
}
