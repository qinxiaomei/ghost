var ghostArr = [];//定义鬼魂存放数组
var moveTimer;
var createTimer;
var countDownTimer;//倒计时定时器对象
var pauseFlag = false;//是否暂停的标记
var countDownNum ;//倒计时的秒数

function startGame(){
	var welcomeUI = document.getElementById("welcomeUI")
	welcomeUI.style.display = "none";
	var gameUI = document.getElementById("gameUI");
	gameUI.style.display = "block";
	//添加创建鬼魂和移动鬼魂的定时器
	addInterval();
	//对键盘进行监听操作
	document.onkeydown = keyDownFn;
	//设置倒计时的秒数
	document.getElementById("countDown").style.display="block";
	countDownNum = 60;
	document.getElementById("countDown").innerHTML = countDownNum;
	//展示得分
	document.getElementById("scoreDiv").style.display="block";
	document.getElementById("scoreDiv").innerHTML = "您的得分:0,正确率:0.00%";
	//初始化得分,初始化总共敲击的键盘个数
	score = 0;
	keyCount = 0;
}
var score = 0;
var keyCount = 0;
function keyDownFn(event){
	keyCount++;
	//获取鬼魂的存放面板
	var ghostPanel = document.getElementById("ghostPanel");
	var keyCode = event.keyCode;
	var keyword = String.fromCharCode(keyCode);
	for(var i=0;i<ghostArr.length;i++){
		var ghostEl = ghostArr[i];
		//判断鬼魂数组中是否有鬼魂的内容等于敲下的按键
		if(keyword==ghostEl.innerHTML){
			score++;
			//1.在鬼魂数组中删除该鬼魂
			ghostEl.style.background = "url('img/51.png') no-repeat";
			ghostArr.splice(i,1);
			setTimeout(function(){
				//2.在页面中把鬼魂清除掉
				ghostPanel.removeChild(ghostEl);
			},200);
			break;
		}
	}
	document.getElementById("scoreDiv").innerHTML = "您的得分:"+score+",正确率:"+((score/keyCount)*100).toFixed(2)+"%";
}
/**
 * 创建鬼魂的方法
 */
function createGhost(){
	//怎么动态的创建出的div?
	//<div></div>
	var ghostEl = document.createElement("div");
	//<div class="ghost"></div>
	ghostEl.className = "ghost";
	//<div class="ghost">X</div>
	
	var randomNum = Math.random();//产生0~1之间数值
	//产生随机字母
	var chars = "QWERTYUIOPASDFGHJKLZXCVBNM";
	var index = parseInt(randomNum*25);//产生0~25之间数值
	ghostEl.innerHTML = chars.charAt(index);//从26个字母中获取随机字母
	//产生X轴位置
	var xPosition = 180+randomNum*(document.documentElement.clientWidth-510);
	ghostEl.style.left = xPosition+"px";
	
	var ghostPanel = document.getElementById("ghostPanel");
	ghostPanel.appendChild(ghostEl);
	//把鬼魂存入的数组中
	ghostArr.push(ghostEl);
}
/**
 * 让鬼魂移动
 */
function ghostMove(){
	//获取页面高度
	var clientHeight = document.documentElement.clientHeight;
	//找到ghostPanel,从div中把鬼魂删除掉
	var ghostPanel = document.getElementById("ghostPanel");
	//从鬼魂数组中获取到每一个鬼魂
	for(var i=0;i<ghostArr.length;i++){
		var ghostEl = ghostArr[i];
		//设置鬼魂的距离底部的距离
		var yPosition = parseInt(ghostEl.style.bottom)||1;
		var xPosition = parseInt(ghostEl.style.left)||180;
		//判断鬼魂是否到达了页面顶部
		//如果到达了,在页面中把元素删除,把对应数组中的元素删除掉
		if(yPosition<clientHeight){
			//鬼魂还没有到达页面顶部,继续移动
			ghostEl.style.bottom  = yPosition + 10 + "px";
			//只随机产生 0 , 1 
			var op = parseInt(Math.random()*2);
			if(op==1){
				if(xPosition<1230){
					ghostEl.style.left = xPosition+10+"px";
				}
			}else{
				if(xPosition>180){
					ghostEl.style.left = xPosition-10+"px";
				}
			}
		}else{
			//已经到达了页面顶部
			//在数组中删除呀un苏
			ghostArr.splice(i,1);
			ghostPanel.removeChild(ghostEl);
		}
	}
	
}
/**
 * 返回的函数
 */
function returnFn(){
	if(pauseFlag){
		//如果为true表示目前的暂停的状态
		return;//不做任何事情
	}
	//把游戏界面隐藏
	//把欢迎页面展示
	var welcomeUI = document.getElementById("welcomeUI")
	welcomeUI.style.display = "block";
	var gameUI = document.getElementById("gameUI");
	gameUI.style.display = "none";
	//把定时器清除掉
	window.clearInterval(moveTimer);
	window.clearInterval(createTimer);
	//清除数组中的鬼魂
	ghostArr = [];
	//清除页面中的鬼魂
	var ghostPanel = document.getElementById("ghostPanel");
	ghostPanel.innerHTML = "";
}
function openPersonal(){
	window.open("http://www.wolfcode.cn");
}
function pauseFn(){
	if(pauseFlag){
		//如果为true表示目前的暂停的状态
		return;//不做任何事情
	}
	var pauseDiv = document.getElementById("pauseDiv");
	pauseDiv.style.display = "block";
	//获取屏幕的宽度和高度
	var clientWidht = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var xPosition = (clientWidht-350)/2;
	var yPosition = (clientHeight-370)/2;
	pauseDiv.style.left = xPosition + "px";
	pauseDiv.style.top = yPosition + "px";
	//清除定时器,让鬼魂不再创建,不再移动
	removeInterval();
}
var moveSpeed = 300;
var createSpeed = 800;
//清除所有的定时器(暂停的状态)
function removeInterval(){
	window.clearInterval(moveTimer);
	window.clearInterval(createTimer);
	window.clearInterval(countDownTimer);
	//取消键盘监听事件
	document.onkeydown = function(){};
	//设置暂停状态
	pauseFlag = true;
}
//添加项目需要的定时器(正常状态)
function addInterval(){
	createTimer = window.setInterval(createGhost,createSpeed);
	moveTimer = window.setInterval(ghostMove,moveSpeed);
	//添加倒计时的定时器
	countDownTimer = window.setInterval(countDownFn,1000);
	//添加键盘监听事件
	document.onkeydown = keyDownFn;
	//设置取消暂停的状态
	pauseFlag = false;
}
/**
 * 倒计时的功能
 */
function countDownFn(){
	countDownNum--;
	document.getElementById("countDown").innerHTML = countDownNum;
	if(countDownNum<=0){
		//清除倒计时的定时器
		window.clearInterval(countDownTimer);
		alert("游戏结束! "+"您的得分:"+score+",正确率:"+((score/keyCount)*100).toFixed(2)+"%");
		//回到欢迎页面
		returnFn();
		//隐藏倒计时
		document.getElementById("countDown").style.display = "none";
		//隐藏得分
		document.getElementById("scoreDiv").style.display = "none";
	}
}
/*
 * 继续游戏
 */
function resumeFn(){
	//1.把对话框隐藏
	var pauseDiv = document.getElementById("pauseDiv");
	pauseDiv.style.display = "none";
	//2.恢复鬼魂的创建和移动
	//添加创建鬼魂和移动鬼魂的定时器
	addInterval();
}
/**
 * 停止游戏
 */
function stopGameFn(){
	//1.把对话框隐藏
	var pauseDiv = document.getElementById("pauseDiv");
	pauseDiv.style.display = "none";
	pauseFlag = false;//此时不是一个暂停状态了
	returnFn();
}
//设置游戏级别
function optionFn(){
	if(pauseFlag){
		//如果为true表示目前的暂停的状态
		return;//不做任何事情
	}
	var settingDiv = document.getElementById("settingDiv");
	settingDiv.style.display = "block";
	//获取屏幕的宽度和高度
	var clientWidht = document.documentElement.clientWidth;
	var clientHeight = document.documentElement.clientHeight;
	var xPosition = (clientWidht-350)/2;
	var yPosition = (clientHeight-370)/2;
	settingDiv.style.left = xPosition + "px";
	settingDiv.style.top = yPosition + "px";
	//清除定时器,让鬼魂不再创建,不再移动
	removeInterval();
}
var imageLevel = 18;//默认的图片的级别
var realLevel = 18;//游戏真实的级别
//左按钮
function leftFn(){
	//修改级别的图片
	if(imageLevel>18){
		imageLevel--;
		var levelEl = document.getElementById("level");
		levelEl.src = "img/"+imageLevel+".png";
	}else{
		alert("已经是最低级别了!!");
	}
}
//右按钮
function rightFn(){
	//修改级别的图片
	if(imageLevel<20){
		imageLevel++;
		var levelEl = document.getElementById("level");
		levelEl.src = "img/"+imageLevel+".png";
	}else{
		alert("已经是最高级别了!!");
	}
}
function cancelFn(){
	//当用户取消的时候,把image级别修改成游戏真实的级别
	imageLevel = realLevel;
	var levelEl = document.getElementById("level");
	levelEl.src = "img/"+imageLevel+".png";
	
	var settingDiv = document.getElementById("settingDiv");
	settingDiv.style.display="none";
	addInterval();
}
/**
 * 设置游戏级别
 */
function setFn(){
	//1.把对话框隐藏
	var settingDiv = document.getElementById("settingDiv");
	settingDiv.style.display="none";
	//2.如果把级别设置成3级别.
	//imageLevel = 20;
	//realLevel = 20;
	realLevel = imageLevel;
	setSpeed();
	//让鬼魂移动起来,创建起来
	addInterval();
}
//设置鬼魂移动的速度和创建速度
function setSpeed(){
	/**
	 * 级别1: 移动300 创建速度800
		级别2: 移动200 创建速度600
		级别3: 移动100 创建速度400
	 */
	switch(realLevel){
		case 18:moveSpeed=300;createSpeed=800;break;
		case 19:moveSpeed=200;createSpeed=600;break;
		case 20:moveSpeed=100;createSpeed=400;break;
	}
}
