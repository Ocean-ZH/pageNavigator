//翻页导航生成函数
/*
    id: 翻页文件容器nav的id;
    pageCountNum: 总页数;
    targetPageNum: 目标页数;
    pageNavFunc: 翻页事件触发后的回调函数,函数中将传入一个targetPage值,回调函数内最后需要更新一遍翻页导航条;
    以上四个皆为必须传入的项
*/
function pageNavCreate(id,pageCountNum,targetPageNum,pageNavFunc){
    var pageCount = pageCountNum;
    var targetPage = targetPageNum;
    var pageNav = document.getElementById(id);
    var pageNavUl =  $(pageNav).find("ul.pagination");
    var pageNavInput = $(pageNav).find(".page-input-box");
    
    //总页数写入placeholder
    pageNavInput.children('input').val("").attr({"placeholder":pageCount,"max":pageCount});

    //若是总页数小于5
    if(pageCount<=5){
        pageNavUl.html("");
        $('<li class="page-nav-Prev">'+
              '<a href="javascript:void(null)" aria-label="Previous" pagenum="1" >'+
                '<span aria-hidden="true">&laquo;</span>'+
              '</a>'+
            '</li>').appendTo(pageNavUl);

        for(var i =1; i<=pageCount; i++){
            $('<li class="pageNum" ><a href="javascript:void(null)"  pagenum="'+i+'" >'+i+'</a></li>').appendTo(pageNavUl);
            if(i == targetPage){
                pageNavUl.children("li.pageNum").last().addClass('active');
            }
        }

        $('<li class="page-nav-Next">'+
              '<a href="javascript:void(null)" aria-label="Next"  pagenum="'+pageCount+'" >'+
                '<span aria-hidden="true">&raquo;</span>'+
              '</a>'+
            '</li>').appendTo(pageNavUl);
    }else{//总页数大于5
        //重写一遍5个翻页按钮 START
        pageNavUl.html("");
        $('<li class="page-nav-Prev">'+
              '<a href="javascript:void(null)" aria-label="Previous" pagenum="1" >'+
                '<span aria-hidden="true">&laquo;</span>'+
              '</a>'+
            '</li>').appendTo(pageNavUl);
        for(var i=1; i<=5; i++){
            $('<li class="pageNum" ><a href="javascript:void(null)"  pagenum="'+i+'" >'+i+'</a></li>').appendTo(pageNavUl);
            if(i == targetPage){
                pageNavUl.children("li.pageNum").last().addClass('active');
            }
        }
        $('<li class="disabled">'+
                '<a href="javascript:void(null)">...</a>'+
            '</li>'+
            '<li class="page-nav-Next">'+
              '<a href="javascript:void(null)" aria-label="Next"  pagenum="'+pageCount+'" >'+
                '<span aria-hidden="true">&raquo;</span>'+
              '</a>'+
            '</li>').appendTo(pageNavUl);
        //重写一遍5个翻页按钮 END

        //若是目标页小于3
        if(targetPage<=3){
            pageNavUl.children("li.disabled").show();
            for(var i =0;i<5;i++){
                pageNavUl.children("li.pageNum").eq(i).children('a').attr({"pagenum":i+1}).html(i+1);
            }
            pageNavUl.children("li.pageNum").removeClass('active').eq(targetPage-1).addClass('active');
            pageNavUl.children("li:last-child").children("a").attr({"pagenum":pageCount});
        }else if(targetPage>=(pageCount-2)){//若是目标页是倒数3个以内
            for(var i =0;i<5;i++){
                pageNavUl.children("li.disabled").hide();
                pageNavUl.children("li.pageNum").eq(i).children('a').attr({"pagenum":(pageCount-4+i)}).html(pageCount-4+i);
                if((pageCount-4+i) == targetPage){
                    pageNavUl.children("li.pageNum").removeClass('active');
                    pageNavUl.children("li.pageNum").eq(i).addClass('active');
                }
            }
            pageNavUl.children("li:last-child").children("a").attr({"pagenum":pageCount});
        }else{
            pageNavUl.children("li.disabled").show();
            for(var i =0;i<5;i++){
                pageNavUl.children("li.pageNum").eq(i).children('a').attr({"pagenum":(targetPage-2+i)}).html(targetPage-2+i);
            }
            pageNavUl.children("li.pageNum").removeClass('active').eq(2).addClass('active');
            pageNavUl.children("li:last-child").attr({"pagenum":pageCount});
        }
    }

    //给生成的翻页框按钮绑定事件
    pageNavUl.children('li.pageNum').off("click").on("click",function(event){
        if($(this).hasClass('active') != true){
            var clickPage = parseInt($(this).children('a').attr("pagenum"));
            console.log("pageNum = "+clickPage);
            //翻页按钮点击后触发的回调函数
            pageNavFunc(clickPage);
        }
    }); 
    pageNavUl.children('li.page-nav-Prev').off("click").on("click",function(event){
        var clickPage = parseInt($(this).children('a').attr("pagenum"));
        console.log("prev = "+clickPage);
        //翻页按钮点击后触发的回调函数
        pageNavFunc(clickPage);
    }); 
    pageNavUl.children('li.page-nav-Next').off("click").on("click",function(event){
        var clickPage = parseInt($(this).children('a').attr("pagenum"));
        console.log("next = "+clickPage);
        //翻页按钮点击后触发的回调函数
        pageNavFunc(clickPage);
    }); 
    pageNavInput.children('button').off("click").on("click",function(event){
        var inputVal = parseInt($(this).siblings('input').val());
        var inputMax = parseInt($(this).siblings('input').attr("max"));
        console.log("button = "+inputVal);
        if(inputVal && inputVal<=inputMax){
            //翻页按钮点击后触发的回调函数
            pageNavFunc(inputVal);
        }else{

        }
    }); 
    pageNavInput.children('input').off("keydown").on('keydown', function(event) {
        if(event.which == 13){//若是回车
            var inputVal = parseInt($(this).val());
            var inputMax = parseInt($(this).attr("max"));
            console.log("input = "+inputVal);
            if(inputVal && inputVal<=inputMax){
                //翻页事件触发的回调函数
                pageNavFunc(inputVal);
            }else{

            }
        }
    });


}

//生成Loading遮罩
//flag: 省略 || true >>创建loading遮罩
//flag: flase >>删除loading遮罩
function LoadingMaskCreate(flag){
    if(flag == false){
        $(".loading-mask").remove();
    }else{
        var iHeight = document.documentElement.clientHeight;
        var documentH = document.body.scrollHeight;
        $(".loading-mask").remove();
        $('<div class="loading-mask" style="position:fixed; left:0; top:0; z-index:999; width: 100%; height: 100%; background-color:rgba(0,0,0,.5); ">'+
                '<img src="images/loading.gif" height="60" width="60" alt="" style="position:absolute; left:50%; top:50%; margin:-30px 0 0 -30px;"/>'+
            '</div>').prependTo($("body"));
        $(".loading-mask").height(iHeight);
    }
}