$(function(){
    
    let baiduPath = "https://pan.baidu.com/mbox/msg/shareinfo?msg_id=1123758322217357608&page=1&from_uk=3253638235&gid=757943779352721904&type=2&fs_id=129220754174126&num=50&bdstoken=0336a91401ceff583445145d1fe2ef2d&channel=chunlei&web=1&app_id=250528&logid=MTYyODA2MDI1MDcxODAuNTgxMDYwOTI4Mjk0NTk1OA==&clienttype=0"

    // 此操作需在控制台进行，本地或非百度云盘域名执行会报跨域错误
    // 主目录名称存为数组
    var path = [];
    var totalStr = "";
    function getQueryVariable(url, variable)
    {
        var num = url.indexOf("?");
       var query = url.substring(num + 1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
    var beganUrl = "";
    var endedUrl = "";
    var middleUrl = "";
    var page = 1
    function dir(url,fuhao){
        fuhao += "——";
        $.ajax({
            // 百度网盘接口
            // 路径请点击分享链接的networking获取，只需更改dir即可
            url: url,
            dataType:"json",
            async:false,
            success:function(data){
                if (data.has_more) {
                    page = getQueryVariable(url, "page");
                    var pageNumber = parseInt(page)
                    //  切割字符串
                    var tArr = url.split("page=" + pageNumber);
                    pageNumber++;
                    var lUrl = tArr[0];
                    var rUrl = tArr[1];
                    var reUrl = lUrl + "page=" + pageNumber + rUrl
                    console.log(reUrl)
                    dir(reUrl,fuhao);
                }
                var list = data.records;
                // 循环列表
                for(var m = 0;m < list.length;m++){
                    z = {};
                    // 判断是否为文件夹，文件夹为1，反之为0
                    if(list[m].isdir == 0){
                        // 文件名
                        z.server_filename = list[m].server_filename;
                        // 文件路径
                        z.fs_id = list[m].fs_id;
                        // 文件创建时间
                        z.server_ctime = list[m].server_ctime;
                        // 文件大小
                        z.size = list[m].size/(1024*1024)
                        // 将当前文件信息追加至z
                        path.push(z);
                        // 输出信息
                        console.log(".");
                        totalStr += "|" + fuhao + z.server_filename + "  【文件大小：" + z.size.toFixed(2) + "MB】\r\n"
                    } else {
                        // 文件名
                        z.server_filename = list[m].server_filename;
                        // 文件路径
                        z.fs_id = list[m].fs_id;
                        // 文件创建时间
                        z.server_ctime = list[m].server_ctime;
                        // 将当前文件信息追加至z
                        path.push(z);
                        // 输出信息
                        // console.log("|" + fuhao + z.server_filename);
                        totalStr += "|" + fuhao + z.server_filename + "\r\n"
                        // 转义字符串，防止出现特殊字符出错
                        console.log("/");
                        dir(beganUrl + z.fs_id + endedUrl,fuhao);
                    }
                }
            }
        });
    }
    function fakeClick(obj) {
      var ev = document.createEvent("MouseEvents");
      ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      obj.dispatchEvent(ev);
    }
    function exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      fakeClick(save_link);
    }
    var realPath = decodeURIComponent(baiduPath);
    middleUrl = getQueryVariable(realPath, "fs_id");
    //  切割字符串
    var tempArr = realPath.split(middleUrl);
    beganUrl = tempArr[0];
    endedUrl = tempArr[1];
    dir(realPath,"");
    console.log(totalStr)
    // console.log(path)
    exportRaw('exportDirList.txt',totalStr)       
})
