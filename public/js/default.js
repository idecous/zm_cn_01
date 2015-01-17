if(!Object.create){
    Object.create = function(o){
        function F(){}
        F.prototype = o;
        return new F();
    };
}
var EVE_ScreenHeightManager = function(){
	var winEl = $(window);
	var bodyEl = $("body");
	var screenHeightPlaceholderEl = $("<div class='comm_footerBeforeHolder'></div>");
	$(".footer").before(screenHeightPlaceholderEl);
	
	function screenHeightPlaceholderHandler() {
		var tH = winEl.height() - (bodyEl.height() - screenHeightPlaceholderEl.height() + 41 );
		if (tH < 0) {
			screenHeightPlaceholderEl.height(0);
		} else {
			screenHeightPlaceholderEl.height(tH);
		}
	}
	var imgEls = $("img");
	var imgLoadedCount = 0;
	if( imgEls.length == 0){
		init();
	}else{
		imgEls.each(function(index){
			if( imgEls.eq(index).prop("complete") ){
				init();
			}else{
				imgEls[index].onload = init;
			}
		});
	}
	function init(){
		imgLoadedCount++;
		if( imgLoadedCount >= imgEls.length ){

			winEl.resize(screenHeightPlaceholderHandler);
			screenHeightPlaceholderHandler();
		}
	}
	return {"update":screenHeightPlaceholderHandler};
};

var EVE_ShoppingCarItem = function(){};
(function(){
	this.buildByEl = function(el){
		this.el = el;
		this.id = el.attr("iid");
		this.paramEl = el.find(".paramGroup>div");
		this.name = $.trim( this.paramEl.eq(0).text() );
		var tStr = this.paramEl.eq(1).text();
		this.size = $.trim( tStr.substr(tStr.lastIndexOf(":") + 1 ) );
		tStr = this.paramEl.eq(2).text();
		this.color = $.trim( tStr.substr(tStr.lastIndexOf(":") + 1 ) );
		tStr = this.paramEl.eq(3).text();
		this.count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 ) );
		tStr = this.paramEl.eq(4).text();
		this.price = parseFloat( tStr.substr( 1 ) );
		this.paramEl = el.find(".paramGroup>div");
	};
	this.buildByData = function(data){
		this.id = data.id;
		this.name = $.trim( data.name );
		var tStr = data.size;
		this.size = tStr.substr( tStr.lastIndexOf(":")+1 ) ;
		
		tStr = data.color;
		this.color = tStr.substr( tStr.lastIndexOf(":")+1 ) ;

		tStr = data.price;
		this.price = parseFloat( tStr.substr(1) );
		tStr = data.num;
		this.count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 ) );

		this.el = $("<li iid='"+this.id+"'></li>");
		var t01El =$("<div class='imgContainer'></div>").appendTo(this.el);
		$("<img src='"+data.imgUrl +"' />").appendTo(t01El);
		t01El = $("<div class='paramGroup'></div>").appendTo(this.el);
		
		$("<div class='nameRow'>"+ data.name+"</div>").appendTo( t01El );
		$("<div>"+ data.size+"</div>").appendTo( t01El );
		$("<div>"+ data.color+"</div>").appendTo( t01El );
		$("<div>"+ data.num+"</div>").appendTo( t01El );
		$("<div class='priceRow'>"+ data.price+"</div>").appendTo( t01El );
		
		this.paramEl = t01El.find("div");
	};
	this.addSameGoods = function(data){
		var name = $.trim( data.name );
		var tStr = data.size;
		var size = tStr.substr( tStr.lastIndexOf(":")+1 ) ;
		tStr = data.price;
		var price = parseFloat( tStr.substr(1) );
		tStr = data.num;
		var count = parseInt( tStr.substr( tStr.lastIndexOf(":")+1 )  );
		tStr = data.color;
		var color = tStr.substr( tStr.lastIndexOf(":")+1 ) ;
		
		if( name == this.name && data.id == this.id &&  size == this.size && price == this.price && this.color == color){
			this.count += count;
			tStr = this.paramEl.eq(3).text();
			tStr = tStr.substring( 0, tStr.lastIndexOf(":") +1) + " " + this.count;
			this.paramEl.eq(3).text(tStr);
			return true;
		}
		return false;
	};
}).call(EVE_ShoppingCarItem.prototype);

var EVE_ShoppingCar = function(){
	var el = $(".header .shoppingCar");
	if(el.length == 0){return;}
	var popWinEl = el.find(".popWindow");
	var viewIndex = 0;

	var count01El = el.children("u");
	var count02El = popWinEl.find(".totalRow>u");
	var count03El = $(".header .mobileShoppingcar span");
	
	var emptyInfoEl =  el.find(".scrollPanel .empty");
	var goodsScrollEl = el.find(".scrollPanel");

	var upArrowEl = goodsScrollEl.children(".upArrow").show();
	var downArrowEl = goodsScrollEl.children(".downArrow").show();

	var listContainerEl = goodsScrollEl.find(".contentBlock");
	var listEl = goodsScrollEl.find("ul");
	var liEls = listEl.find("li");
	var liHeight = liEls.length==0?emptyInfoEl.height():liEls.eq(0).height();
	var toPayBtnEl = el.find(".payable");
	var items = [];
	var i,item;
	for( i=0; i < liEls.length ;i++){
		item = new EVE_ShoppingCarItem();
		item.buildByEl( liEls.eq(i) );
		items.push( item );
	}
	
	el.mouseenter(function(){
		viewIndex = 0;
		listContainerEl.css("top",0);
		updateShoppingCarArrow();
	});
	upArrowEl.click(function(){
		listContainerEl.stop();
		viewIndex--;
		if( viewIndex < 0){
			viewIndex = 0;
			return;
		}
		listContainerEl.animate({"top": -viewIndex*160 },"fast" );
		updateShoppingCarArrow();
	});
	downArrowEl.click(function(){
		listContainerEl.stop();
		viewIndex++;
		if( viewIndex == items.length-1){ 
			viewIndex = items.length -2;
			return;
		}
		listContainerEl.animate({"top": -viewIndex*160 },"fast" );
		updateShoppingCarArrow();
	});

	function update(){
		if( items.length == 0 ){
			emptyInfoEl.show();
			updateCount();
			toPayBtnEl.hide();
			updateShoppingCarArrow();
			goodsScrollEl.height( liHeight + 20);
			return;
		}
		emptyInfoEl.hide();
		updateCount();
		listContainerEl.show();
		toPayBtnEl.show();
		
		if( items.length <= 2){
			goodsScrollEl.height( items.length * (liHeight + 10) + 10);
		}else{
			goodsScrollEl.height( 2 * (liHeight + 10) + 10);
		}
		listContainerEl.height( items.length * (liHeight + 10) + 10);
		updateShoppingCarArrow();
	}
	function addGoods( data ){
		var i,item,hasSame = false;
		for(i=0; i < items.length;i++){
			item = items[i];
			hasSame = item.addSameGoods( data);
			if( hasSame ){ break;}
		}
		if( !hasSame ){
			item = new EVE_ShoppingCarItem();
			item.buildByData( data );
			listEl.append(item.el);
			items.push( item );
		}
		update();
		
		popWinEl.addClass("open");
		viewIndex = 0;
		listContainerEl.css("top",0);
		updateShoppingCarArrow();
	}
	function updateShoppingCarArrow(){
		if( items.length < 3 ){
			upArrowEl.hide();
			downArrowEl.hide();
			return;
		}
		if( viewIndex == 0 ){
			upArrowEl.hide();
		}else{
			upArrowEl.show();
		}
		if( viewIndex == items.length -2 ){
			downArrowEl.hide();
		}else{
			downArrowEl.show();
		}
	}
	function updateCount(){
		var i,count = 0;
		//for( i=0;i<items.length;i++){
		//	count += items[i].count;
		//}
		count01El.text( items.length );
		count02El.text( items.length );
		count03El.text( items.length );
	}
	update();
	return {"addGoods":addGoods};
};

var EVE_TopSearchManager = function(errorMessage){
	var el = $(".header .searchPanel");
	var formEl = el.find("form");
	var inputEl = formEl.find("input[type=text]");
	
	var searchBlockEl = el.find(".searchBlock");
	var toSearchEl = el.find(".mobileSearch");
	var logoEl = el.find(".logo");
	var shoppingIconEl = el.find(".mobileShoppingcar");
	
	var mobileMunEl = $(".topNavigationBlock .mobileMenu");
	
	formEl.submit(function(){
		var val =  $.trim( inputEl.val() );
		if(val == ""){
			if( mobileMunEl.is(":visible") ){
				toSearchEl.removeClass("toSearch");
				logoEl.removeClass("toSearch");
				shoppingIconEl.removeClass("toSearch");
				searchBlockEl.removeClass("toSearch");
			}else{
				alert(errorMessage);
			}
			return false;
		}
	});
	toSearchEl.click(function(){
		toSearchEl.addClass("toSearch");
		logoEl.addClass("toSearch");
		shoppingIconEl.addClass("toSearch");
		searchBlockEl.addClass("toSearch");
	});
};
var EBE_MobileMenuManager = function(){
	var winEl = $(window);
	var el = $(".topNavigationBlock .mobileMenu");
	var navEl = $(".topNavigationBlock .normalMenu .topNavModule").clone();
	navEl.find(">li>.popBlock>a").detach();
	el.append(navEl);
	var isOpen = false;
	var openBtnEl = el.find(".button");
	openBtnEl.mousedown(function(e){	
		if(isOpen){return;}	
		setNavVisible(true);
		e.stopPropagation();
	});
	navEl.mousedown(function(e){
		e.stopPropagation();
	});
	winEl.mousedown(function(){
		setNavVisible(false);
	});
	var sub01Els = el.find(".popBlock");
	var sub02Els = el.find(".popBlock .subPopBlock");
	var navBtnEls = el.find("li");
	var subOpenBtnEls = navBtnEls.find("i");
	
	subOpenBtnEls.click(function(){
		var iEl = subOpenBtnEls.eq( subOpenBtnEls.index(this) );
		var liEl = iEl.parent().parent();
		var popBlockEl = liEl.children(".popBlock");
		var subPopBlockEl = liEl.children(".subPopBlock");

		if( iEl.hasClass("open") ){
			if(popBlockEl.length>0){
				popBlockEl.removeClass("open");
			}else{
				subPopBlockEl.removeClass("open");
			}
			iEl.removeClass("open");
		}else{
			if(popBlockEl.length>0){
				popBlockEl.addClass("open");
			}else{
				subPopBlockEl.addClass("open");
			}
			iEl.addClass("open");			
		}	
	});
	function setNavVisible(val){
		if(val==isOpen){return;}
		if(val){
			navEl.addClass("open");
		}else{
			navEl.removeClass("open");
			sub01Els.removeClass("open");
			sub02Els.removeClass("open");
			subOpenBtnEls.removeClass("open");
		}
		isOpen = val;
	}
	winEl.resize(function(){
		setNavVisible(false);	
	});
};
var EBE_TopMenuModule = function(el,index){
	var mainWidth= 200;
	var subWidth = 235;
	var blockEl = el.find(".popBlock");
	var imgWidth =0,imgHeight=0;
	
	var mainMenuEl = blockEl.children("ul").addClass("mainMenuBlock");
	var subBlockEl =  $("<div class='subMenuBlock'></div>").appendTo(blockEl);
	
	var mainMenuLiEls = mainMenuEl.children("li");
	var propagandaEl = blockEl.find(".propaganda");
	var imgEl = propagandaEl.children("img");
	
	var subMenus = [];
	mainMenuLiEls.last().addClass("last");
	var i,liEl,subPopEl,subUlEl,hasSub = false,maxSubCount=0;
	for( i=0; i < mainMenuLiEls.length;i++ ){
		liEl = mainMenuLiEls.eq(i);
		subPopEl = liEl.find(".subPopBlock");
		if(subPopEl.length == 1){
			subUlEl = subPopEl.find("ul").hide();
			subUlEl.find("li").addClass("base");
			subBlockEl.append( subUlEl );
			subMenus.push( subUlEl );
			hasSub = true;
			subPopEl.detach();
			maxSubCount = Math.max( maxSubCount,subUlEl.find("li").length );			
		}else{
			subMenus.push(null);
			liEl.addClass("base");
		}	
	}
	var maxLiCount = Math.max( maxSubCount , mainMenuLiEls.length);
	mainMenuEl.height( maxLiCount * 48 );
	blockEl.height( maxLiCount * 48 );
	subBlockEl.height( maxLiCount * 48 );
	
	if( imgEl.length > 0){
		if(imgEl.prop("complete")){
			imgCompleteHandler();
		}else{
			imgEl[0].onload = imgCompleteHandler;
		}
	}
	
	function imgCompleteHandler(isCenter){
		imgEl.width("auto");
		imgWidth = imgEl.width(); 
		imgHeight = imgEl.height();
		imgEl.width("100%");
		var blockHeight = blockEl.height();
		if( blockHeight < imgHeight + 20){
			mainMenuEl.height(imgHeight + 20);
			blockEl.height( imgHeight + 20 );
			subBlockEl.height( imgHeight + 20 );
		}
		if(!isCenter){
			centerImg();
		}
	}
	function centerImg(){
		if(imgEl.length == 0){return;}
		if( imgWidth <= 100 ){
			if(imgEl.prop("complete")){
				imgCompleteHandler(true);
			}else{
				imgEl[0].onload = imgCompleteHandler;
				return;
			}
		}
		var blockWidth = blockEl.width();
		var blockHeight = blockEl.height();
		var subMunWidth = subBlockEl.hasClass("open")?subWidth:0;
		var canvasWidth = blockWidth-mainWidth-subMunWidth - 20;
		var canvasHeight = blockHeight - 20;
		
		var rate = Math.min( canvasWidth/imgWidth ,canvasHeight/imgHeight );
		var niWidth = imgWidth * rate,niHeight = imgHeight * rate;
		if(niWidth>imgWidth){niWidth=imgWidth;}
		if(niHeight>imgHeight){niHeight=imgHeight;}

		propagandaEl.stop();
		propagandaEl.animate({"width":niWidth,"height":niHeight,
			"top": ( canvasHeight - niHeight) /2 + 10,"left":mainWidth+subMunWidth +  (canvasWidth-niWidth)/2 + 10},200);

	}
	el.mouseenter(centerImg);
	mainMenuLiEls.mouseenter(function(){
		var sub,tIndex = mainMenuLiEls.index(this);
		mainMenuLiEls.removeClass("over");
		mainMenuLiEls.eq(tIndex).addClass("over");
		var hasSub = false;
		for( i=0;i < subMenus.length;i++ ){
			sub = subMenus[i];
			if(!sub){continue;}
			if(tIndex == i){
				sub.show();
				hasSub = true;
			}else{
		   	   sub.hide();
			}	
		}
		subBlockEl.stop();
		if(hasSub){
			subBlockEl.animate({"width":235},200).addClass("open");
		}else{
			subBlockEl.animate({"width":0},200).removeClass("open");
		}
		centerImg();
	});
	el.mouseleave(function(){
		if( blockEl.is(":hidden") ){return;}
		mainMenuLiEls.removeClass("over");
		for(var i=0;i<subMenus.length;i++ ){
			sub = subMenus[i];
			if(sub){sub.hide();}
		}
		subBlockEl.stop();
		subBlockEl.width(0).removeClass("open");
		centerImg();
	});
};
var EBE_TopMenuManager = function(){
	var el = $(".header .normalMenu .topNavModule");
	var moduleBlockEls = el.children("li");
	moduleBlockEls.each( function( index ){
		new EBE_TopMenuModule( moduleBlockEls.eq(index) ,index);
	} ); 
};
var TopSwitchManager = function(){
	var winEl = $(window);
	var el = $(".comm_topSwitchViewBlock");
	if( el.length == 0){return;}
	var placeholderEl = el.find(".placeholderBG");
	var navBlockEl = el.find(".topSwitchNavBlock");
	var i,index = 0;
	var liWidth = 0;
	var timer = -1;
	var isInit = false;
	var borderEl = el.find(".switchContainer");
	var ulEl = el.find("ul");
	var liEl = ulEl.children("li");
	var liCount = liEl.length;
	if( liCount > 1){
		var fLiEl = liEl.eq(0);
		var lLiEl = liEl.eq( liCount-1 );
		fLiEl.before( lLiEl.clone() );
		lLiEl.after( fLiEl.clone() );
		liEl = ulEl.children("li");
		var str = "";
		for( i=0; i < liCount;i++){
			str += ("<a href='javascript:;'><span>"+(i+1)+"</span></a>");
		}
		navBlockEl.append( $(str) );
		var navBtnEls = navBlockEl.find("a");
		navBlockEl.width(  liCount*45 + (liCount-1)*5 );
		navBtnEls.click(navBtnClickHandler);
	}
	function updateSizeHandler(){
		if( !isInit ){return;}
		clearTimeout(timer);
		ulEl.stop();
		liWidth = placeholderEl.width();
		liEl.width( liWidth );
		ulEl.width( liWidth *  (liCount +2 ) );
		if( liCount < 2){return;}
		setPosByIndex(index);
		animaPosByAuto();		
	}
	function setPosByIndex(val){
		index = val;
		ulEl.css("left", -(1+ index%liCount) * liWidth );
		navBtnEls.removeClass("current");
		navBtnEls.eq( index ).addClass("current");
	}
	function navBtnClickHandler(){
		var tIndex = navBtnEls.index(this);
		if( tIndex == index ){return;}
		animaPosByIndex( index,tIndex );
	}
	function animaPosByIndex(startIndex,endIndex){
		clearTimeout(timer);
		ulEl.stop();
		index = endIndex;
		navBtnEls.removeClass("current");
		navBtnEls.eq( index ).addClass("current");
		var curX = parseInt( ulEl.css("left") );
		ulEl.animate({"left":  curX - (endIndex-startIndex)* liWidth },500* Math.abs(endIndex-startIndex),function(){
			ulEl.css("left", -(1 + index%liCount) * liWidth );
			animaPosByAuto();
		});
	}
	function animaPosByAuto(){
		clearTimeout(timer);
		ulEl.stop();
		timer = setTimeout(function(){
			index = (index+1) % liCount;
			navBtnEls.removeClass("current");
			navBtnEls.eq( index ).addClass("current");
			var curX = parseInt( ulEl.css("left") );
			ulEl.animate({"left":  curX - liWidth },500,function(){
				ulEl.css("left", -(1 + index%liCount) * liWidth );
				animaPosByAuto();
			});
		},5000);
	}
	if( placeholderEl.prop("complete") ){
		isInit = true;
		updateSizeHandler();
	}else{
		placeholderEl.load(function(){
			isInit = true;
			updateSizeHandler();
		});
	}
	winEl.resize(updateSizeHandler);
};
var EBE_AccordionManager = function(){
	var winEl = $(window);
	var el = $(".comm_accordion");
	if(el.length==0){return;}
	var liEls = el.children("li");
	var subTitleEls = liEls.children(".subTitleRow");
	var subTitleIconEls = subTitleEls.children("i");
	var subTitleTextEls = subTitleEls.children("span");
	var openIndex = -1;
	var liHeights =[];

	subTitleEls.click(function(){
		var index = subTitleEls.index(this);
		if( index == openIndex  ){
			if( subTitleIconEls.eq(index).hasClass("open") ){
				subTitleIconEls.eq(index).removeClass("open");
				liEls.eq(index).stop();
				subTitleTextEls.eq(index).height("auto");
				subTitleEls.eq(index).height("auto");
				liEls.eq(index).animate({"height":liHeights[index] });
			}else{
				subTitleIconEls.eq(index).addClass("open");
				liEls.eq(index).stop();
				liEls.eq(index).animate({"height":38 });
				subTitleTextEls.eq(index).animate({"height":22 });
			}
			return;
		}
		subTitleIconEls.eq(openIndex).addClass("open");
		liEls.eq(openIndex).stop();
		liEls.eq(openIndex).animate({"height":38});
		subTitleTextEls.eq(openIndex).animate({"height":22 });
		openIndex = index;
		subTitleIconEls.eq(openIndex).removeClass("open");
		liEls.eq(openIndex).stop();
		liEls.eq(openIndex).animate({"height":liHeights[openIndex] });
		subTitleTextEls.eq(index).height("auto");
		subTitleEls.eq(index).height("auto");
	});
	function resizeHandler(){
		el.css("visibility","hidden");
		liEls.stop().remove("open").height("auto");
		subTitleTextEls.height("auto");
		subTitleEls.height("auto");
		liEls.each(function(index,node){
			var liEl = liEls.eq(index);
			liHeights[index] = liEl.height();
			if(openIndex != index){
				liEl.height(38);
				subTitleTextEls.eq(index).height(22);
				subTitleIconEls.eq(index).addClass("open");
			}else{
				liEl.height( liHeights[index] );
				subTitleTextEls.eq(index).height("auto");
				subTitleEls.eq(index).height("auto");
			}
		});
		el.css("visibility","visible");
	}

	var imgLoadedCount= 0;
	var imgEls = el.find("img");
	if( imgEls.length ==0 ){
		init();
	}else{
		imgEls.each(function(index){
			if( imgEls.eq(index).prop("complete")  ){
				init();
			}else{
				var img = new Image();
				img.onload = init;
				img.src = imgEls.eq(index).attr("src");
				if(img.complete){
					init();
				}
			}
		});
	}
	function init(){
		imgLoadedCount++;
		if(  imgLoadedCount >= imgEls.length ){
			el.css("visibility","visible");
			winEl.resize(resizeHandler);
			resizeHandler();
		}
	}
};

var G_screenHeightManager;
var G_shoppingCar=null;

$(function(){
	var bodyEl = $("body").css("visibility","visible");
	if(!$.support.style && !$.support.tbody ){
		bodyEl.empty().append( $("<h1 style='text-align: center;margin-top: 100px;'>请使用IE7以上现代浏览器查看本站！</h1>") );
		return;
	}
	G_screenHeightManager = new EVE_ScreenHeightManager();
	G_shoppingCar = new EVE_ShoppingCar();
	new EVE_TopSearchManager("请不要留空！");
	new EBE_MobileMenuManager();
	new EBE_TopMenuManager();
	new TopSwitchManager();
	new EBE_AccordionManager();
});
