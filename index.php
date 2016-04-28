<?php 
 session_start();
 $name = $_GET['name'];
 $password = $_GET['password'];
 $action = $_GET['action'];
 $content = $_GET['content'];
 
 switch ($action) {
   case 'Login':  
     login($name,$password);
     break;
   case 'sendContent':
     addSendContent($content);
     break;
   case 'ChatList':
     getAllChatList();
     break;
   case 'OnlineList':
     getOnlineUserList();
     break;
   case 'LogOut':
     logOut($_SESSION['loginuser']);
     break;
   default:
     break;
 }
 
//数据库连接
function dbConnect() {
     $conn = new mysqli('localhost','root','root','chat_room');
     // $conn = new mysqli('localhost','root','','test');
     if (!$conn) {
         throw new Exception('Could not connect to database.');
     }else {
         return $conn;
     }
}

//验证登录
 function login($username, $password) {
    $conn = dbConnect();
    $result = $conn->query("select * from user
                         where username='".$username."'
                          and password ='".$password."'");
    //Ajax获取php输出此处应该用echo不用return
    if (!$result) {
        echo "0";
    }

    if ($result->num_rows>0) {
        echo "1";
        $_SESSION['loginuser'] = $username;
        setUserOnline($_SESSION['loginuser']);
    } else {
        echo "0";
    }
 }

//设置用户在线或离线状态
function setUserOnline($username){
    $conn = dbConnect();
    $query = "update user set isOnline=1 where username='".$username."'";
    $result = $conn->query($query);
    if (!$result) {
          return false;
    }
}
//将聊天记录写入数据库
function addSendContent($content){
    if (isset($_SESSION['loginuser'])) {
        $conn = dbConnect();
        $time = date('Y-m-d H:i:s');
        $query = "insert into talklog values('".$_SESSION['loginuser']."','".$time."','".$content."')";
        $result = $conn->query($query);
        if (!$result) {
            echo "0";
        }else{
            echo "1";
        }
        // if ($result->num_rows>0) {
        //     echo "1";
        // } else {
        //     echo "0";
        // }
    }else{
        echo "0";
    }
    
    
}
//获取在线用户列表
function getOnlineUserList(){
    $query = "select * from user where isOnline=1";
    getDBResult($query);
}
//获取全部的聊天记录
function getAllChatList(){
    $query = "select * from talklog";
    getDBResult($query);
}
//将数据库搜索结果转换为json字符串
function getDBResult($query){
    if (isset($_SESSION['loginuser'])) {
        $conn = dbConnect();
        $result = $conn->query($query);
        $resultArray = array();
        for ($count=0; $row=$result->fetch_assoc(); $count++) { 
          $resultArray[$count] = $row;
        }
        echo json_encode($resultArray);
    }
    
}
//注销当前用户
function logOut($username){
    if (isset($_SESSION['loginuser'])) {
        $conn = dbConnect();
        $query = "update user set isOnline=0 where username='".$username."'";
        $result = $conn->query($query);
        if (!$result) {
              return false;
        }
        $_SESSION = array();
        if(session_destroy()){
          echo "1";
        }
    }
    
}
?>