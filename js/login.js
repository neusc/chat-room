$(function () {
    $("#message").ajaxStart(function () {
        $(this).show().html("正在发送登录请求...");
    });
    $("#message").ajaxStop(function () {
        $(this).html("请求处理已完成").hide();
    });

    $("#confirm").bind("click", function () {
        var $name = $("#name");
        var $password = $("#password");
        if ($name.val() != "" && $password.val() != "") {
            userLogin($name.val(), $password.val());
        } else {
            if ($name.val() == "") {
                alert("用户名不能为空!");
                $name.focus();
                return false;
            } else {
                alert("密码不能为空！");
                $password.focus();
                return false;
            }
        }
    });

});
//发送用户登录请求
function userLogin(name, password) {
    $.ajax({
        type: "GET",
        url: "index.php",
        data: "action=Login&d=" + new Date() + "&name=" + name + "&password=" + password,
        success: function (data) {
            if (data == "1") {
                window.location = "ChatMain.html";
            } else {
                alert("请确认您输入的用户名和密码是否正确！");
                $("#name").focus();
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}
