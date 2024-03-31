(function () {
    'use strict';
    document.onkeydown = function (event) {
        event = (event || window.event);
        if (event.keyCode == 123) {
            iziToast.info({
                title: '已开启开发者模式',
                message: '请遵守MIT协议',
                timeout: 2000,
                backgroundColor: '#e5f7ff',
                icon: 'Fontawesome',
                icon: 'far fa-copyright',
                position: 'topRight'
            });
        }
    }
})();

document.body.oncopy = function () {
    iziToast.info({
        timeout: 2000,
        icon: 'Fontawesome',
        closeOnEscape: 'true',
        transitionIn: 'bounceInLeft',
        transitionOut: 'fadeOutRight',
        layout: '2',
        position: 'topRight',
        icon: 'far fa-copy',
        backgroundColor: '#e5f7ff',
        title: '复制成功',
        message: '请遵守 CC BY-NC-SA 4.0 协议'
    });
}

// 老旧浏览器提示
function browserTC() {
    iziToast.warning({
        title: '检测到您的浏览器版本过低',
        message: '这可能会导致网站样式错乱',
        timeout: 5000,
        position: 'topRight'
    });
}

function browserVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //Edge浏览器
    var isFirefox = userAgent.indexOf("Firefox") > -1; //Firefox浏览器
    var isOpera = userAgent.indexOf("Opera")>-1 || userAgent.indexOf("OPR")>-1 ; //Opera浏览器
    var isChrome = userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Chrome浏览器
    var isSafari = userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Chrome")==-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Safari浏览器
    if(isEdge) {
        if(userAgent.split('Edge/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isFirefox) {
        if(userAgent.split('Firefox/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isOpera) {
        if(userAgent.split('OPR/')[1].split('.')[0]<80){
            browserTC()
        }
    } else if(isChrome) {
        if(userAgent.split('Chrome/')[1].split('.')[0]<90){
            browserTC()
        }
    }
}
function setCookies(obj, limitTime) {
	let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toGMTString()
	for (let i in obj) {
		document.cookie = i + '=' + obj[i] + ';expires=' + data
	}
}
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
if(getCookie('browsertc')!=1){
    setCookies({
        browsertc: 1,
    }, 1);
    browserVersion();
}
now = new Date(), hour = now.getHours();
if (hour < 6) {
    var hello = "凌晨好";
} else if (hour < 9) {
    var hello = "早上好";
} else if (hour < 12) {
    var hello = "上午好";
} else if (hour < 14) {
    var hello = "中午好";
} else if (hour < 17) {
    var hello = "下午好";
} else if (hour < 19) {
    var hello = "傍晚好";
} else if (hour < 22) {
    var hello = "晚上好";
} else {
    var hello = "夜深了";
}
/*
var sayhello = function(){
    if(document.body.clientWidth > 600){
        document.body.onload = function(){
            iziToast.info({
                timeout: 2000,
                icon: 'Fontawesome',
                closeOnEscape: 'true',
                transitionIn: 'bounceInLeft',
                transitionOut: 'fadeOutRight',
                layout: '2',
                position: 'topLeft',
                icon: 'fa-solSWd fa-sun',
                backgroundColor: '#efefef',
                title: hello,
                message: '欢迎来到 cqlkc 的博客'  
            });
    }

}
}();*/
// 固定卡片点击动作
function FixedCardWidget(type,name,index){
    // 根据id或class选择元素
    if (type === "id"){
      var tempcard = document.getElementById(name);
    }
    else{
      var tempcard = document.getElementsByClassName(name)[index];
    }
    // 若元素存在
    if (tempcard) {
        // 首先判断是否存在fixed-card-widget类
        if (tempcard.className.indexOf('fixed-card-widget') > -1){
          // 存在则移除
          RemoveFixedCardWidget();
        }
        else{
          // 不存在则先初始化防止卡片叠加
          RemoveFixedCardWidget();
          //新建退出蒙版
          CreateQuitBox();
          // 再添加固定卡片样式
          tempcard.classList.add('fixed-card-widget');
        }
    }
  }
  //创建一个蒙版，作为退出键使用
  function CreateQuitBox(){
    var quitBox = `<div id="quit-box" onclick="RemoveFixedCardWidget()"></div>`
    var asideContent = document.getElementById('aside-content');
    asideContent.insertAdjacentHTML("beforebegin",quitBox)
  }
  // 移除卡片方法
  function RemoveFixedCardWidget(){
    var activedItems = document.querySelectorAll('.fixed-card-widget');
    if (activedItems) {
      for (i = 0; i < activedItems.length; i++) {
        activedItems[i].classList.remove('fixed-card-widget');
      }
    }
    //移除退出蒙版
    var quitBox = document.getElementById('quit-box');
    if (quitBox) quitBox.remove();
  }
  // 常规先初始化，确保切换页面后不会有固定卡片留存
  RemoveFixedCardWidget()
  window.ATK_LIGHTBOX_CONF = {
    groupAll: true,
  }