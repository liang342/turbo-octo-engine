<%'--- upload.asp 主文件---
' 配置区
Const UPLOAD_FOLDER = "snapshots\"   ' 存储目录
Const MAX_SIZE = 1024000             ' 1MB限制
Const ALLOW_TYPES = "jpg,png,gif"    ' 允许类型
%>

<!DOCTYPE html>
<html>
<head>
<!-- 前端视频采集部分 -->
<script>
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById('preview');
            video.srcObject = stream;
        })
        .catch(err => alert("摄像头访问失败: " + err));
}

function capture() {
    const canvas = document.createElement('canvas');
    const video = document.getElementById('preview');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('snapshot', blob, 'capture.jpg');

        fetch(window.location.href, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                document.getElementById('status').innerHTML = 
                    `截图保存成功：${data.filename}`;
            } else {
                alert("上传失败：" + data.error);
            }
        });
    }, 'image/jpeg', 0.8);
}
</script>
</head>
<body onload="startCamera()">
    <h2>实时监控系统</h2>
    <video id="preview" autoplay muted width="640"></video><br>
    <button onclick="capture()">抓拍截图</button>
    <div id="status"></div>

<% '--- 后端处理部分 ---
If Request.TotalBytes > 0 Then
    On Error Resume Next
    
    ' 接收上传数据
    Dim upload, fileName, fileExt, savePath
    Set upload = Server.CreateObject("Persits.Upload")
    upload.OverwriteFiles = False
    upload.SetMaxSize MAX_SIZE, True
    upload.Save
    
    ' 文件验证
    Set file = upload.Files("snapshot")
    If Err.Number <> 0 Then
        Response.Write "{""success"":false,""error"":""文件接收失败""}"
        Response.End
    End If
    
    fileExt = LCase(upload.ExtractFileExt(file.FileName))
    If InStr(ALLOW_TYPES, fileExt) = 0 Then
        Response.Write "{""success"":false,""error"":""不允许的文件类型""}"
        Response.End
    End If
    
    ' 生成唯一文件名
    fileName = Year(Now) & Right("0" & Month(Now),2) & Right("0" & Day(Now),2) & "_" & _
               Replace(FormatDateTime(Now,4),":","") & "_" & _
               Request.ServerVariables("REMOTE_ADDR") & "." & fileExt
    savePath = Server.MapPath(UPLOAD_FOLDER & fileName)
    
    ' 保存文件
    file.SaveAs savePath
    If Err.Number = 0 Then
        ' 记录日志
        Call WriteLog("[" & Now & "] " & Request.ServerVariables("REMOTE_ADDR") & _
                     " 上传文件：" & fileName)
        Response.Write "{""success"":true,""filename"":""" & fileName & """}"
    Else
        Response.Write "{""success"":false,""error"":""文件保存失败""}"
    End If
    
    Response.End
End If
%>
</body>
</html>

<% '--- 日志记录函数 ---
Sub WriteLog(msg)
    Dim fs, logFile
    Set fs = Server.CreateObject("Scripting.FileSystemObject")
    Set logFile = fs.OpenTextFile(Server.MapPath("operation.log"), 8, True)
    logFile.WriteLine msg
    logFile.Close
End Sub
%>