var EBE_GoodsViewManager = function(){
	var winEl = $(window);
	var docEl = $(document);
	var el = $(".mainPreviewBlock");
	var holderEl = el.find(".placeholderBG");

	var mainPreviewEl = el.children(".imgContainer");
	var listEl = el.find(".listGroup");
	var containerEl = listEl.find(".listContainer");
	var containerUlEl = containerEl.find("ul");
	var leftArrowEl = listEl.find(".leftArrow").hide();
	var rightArrowEl = listEl.find(".rightArrow");
	var showMoreEl = el.find(".showMore");
	var containerLiEl = containerUlEl.find("li");
	
	var viewMaskEl = el.find(".whitehMask"); 
	var viewAreaEl = el.find(".viewArea");
	var viewAreaImgEl = viewAreaEl.find("img");
	var mouseAreaEl = el.find(".mouseArea");
	var partViewEl = $(".mainParamBlock .partViewBlock");
	var partViewBorderEl = $(".mainParamBlock .partViewBorder");
	
	var mainViewImgEl = mainPreviewEl.children("img");
	var partViewImgEl = partViewEl.children("img");
	
	var topBarEl = $(".header .topBar ");
	var mobileNavEls = el.find(".mobileNavBlock");
	
	var isInit = false;
	var scrollIndex = 0;
	var viewIndexM = -1;
	var viewIndexL = 0;

	var viewCount = 0;
	var totalItem = containerLiEl.length;;
	var liWidth = 137;
	var liRightM = 0;
	
	var i,str="";
	for( i=0; i< mainViewImgEl.length;i++){
		str += "<a href='javascript:;'></a>";
	}
	mobileNavEls.append( $(str) );
	var phoneNavLiEls = mobileNavEls.find("a");
	phoneNavLiEls.click(function(){
		var index = phoneNavLiEls.index(this);
		setMainViewIndex(index);
	});
	containerLiEl.mouseenter(previewListItemEnterHandler);
	
	function previewListItemEnterHandler(){
		var index = containerLiEl.index(this);
		if( index == viewIndexL ){return;}
		var liEl = containerLiEl.eq(index);
		if( liEl.find("i").length > 0 ){
			return;
		}
		containerLiEl.eq(viewIndexL).removeClass("checked");
		viewIndexL = index;
		containerLiEl.eq(viewIndexL).addClass("checked");
		setMainViewIndex( viewIndexL );
	}

	showMoreEl.mouseenter(function(){
		listEl.stop();
		listEl.animate({"bottom":0},"fast",function(){
			showMoreEl.hide();
		});
	});
	listEl.mouseleave(function(){
		listEl.stop();
		listEl.animate({"bottom":-220},"fast",function(){
			showMoreEl.css("display","");
		});
	});
	leftArrowEl.click(function(){
		containerUlEl.stop();
		scrollIndex--;
		if(scrollIndex <= 0){
			leftArrowEl.hide();
		}
		rightArrowEl.show();
		containerUlEl.animate( {"left":-scrollIndex * (liWidth+liRightM)} );
	});
	rightArrowEl.click(function(){
		containerUlEl.stop();
		scrollIndex++;
		leftArrowEl.show();
		if( scrollIndex >= (totalItem-viewCount) ){ 
			rightArrowEl.hide();
		}
		containerUlEl.animate( {"left":-scrollIndex * (liWidth+liRightM)} );
	});
	
	var rateX,rateY,bordeWidth,bordeHeight,mWidth,mHeight,isMobileStatus;
	mouseAreaEl.mouseenter(function(e){
		isMobileStatus = !topBarEl.is(":visible");
		if( isMobileStatus ){return; }
		viewMaskEl.show();
		viewAreaEl.show();
		partViewBorderEl.show();
		mWidth = el.width();
		mHeight = el.height();
		rateX =  mWidth / partViewImgEl.eq(viewIndexM).width() ; 
		rateY =  mHeight / partViewImgEl.eq(viewIndexM).height() ; 
		bordeWidth = rateX * partViewEl.width();
		bordeHeight = rateY * partViewEl.height();
		
		viewAreaEl.width(bordeWidth).height(bordeHeight);
		viewAreaImgEl.width(mWidth).height(mHeight);
		
		updateViewArea(e.pageX,e.pageY);
	}).mouseleave(function(){
		if( isMobileStatus ){return;}
		viewMaskEl.hide();
		viewAreaEl.hide();
		partViewBorderEl.hide();
	}).mousemove(function(e){
		if( isMobileStatus ){return;}
		updateViewArea(e.pageX,e.pageY);
	});
	
	var isTouch = false;
	var touchX = 0;
	mouseAreaEl.bind("mousedown touchstart",function(e){
		isMobileStatus = topBarEl.is(":visible");
		if( !isMobileStatus ){return; }
		isTouch = true;
		var touch = null;
		if( e.originalEvent.touches || e.originalEvent.changedTouches){
			touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		}
		if( touch ){
			e.pageX = touch.pageX;
		}
		touchX = e.pageX;
		if (window.captureEvents) {
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        } else if (el[0].setCapture) {
            el[0].setCapture();
        }    
	});
	docEl.bind("mouseup touchend", function(e){ 
		if( !isTouch ){ return; }
		isTouch = false;
		var touch = null;
		if( e.originalEvent.touches || e.originalEvent.changedTouches){
			touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
		}
		if( touch ){
			e.pageX = touch.pageX;
		}
		var offsetX =  touchX - e.pageX;
		if( Math.abs(offsetX) < 50 ){
			return;
		}
		var index =  viewIndexM + (offsetX<0?1:-1);
		if(index<0){index= mainViewImgEl.length-1;}
		if( index >= mainViewImgEl.length ){
			index = 0;
		}
		setMainViewIndex(index);
		if (window.releaseEvents) {
            window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        } else if (el[0].releaseCapture) {
            el[0].releaseCapture();
        }        
	});
	function updateViewArea(pX,pY){
		var mainPos = el.offset();
		var mouseX =  pX - mainPos.left;  
		var mouseY =  pY - mainPos.top;  
		var tX = mouseX - bordeWidth/2;
		var tY = mouseY - bordeHeight/2;
		if(tX < 0){ tX=0; }
		if(tY < 0){ tY=0; }
		if(tX > mWidth - bordeWidth){ tX = mWidth - bordeWidth;}
		if(tY > mHeight - bordeHeight){ tY = mHeight- bordeHeight;}
		viewAreaEl.css( {"left":tX,"top": tY} );
		viewAreaImgEl.css({"left":-tX,"top": -tY} );
		partViewImgEl.css( {"left":-tX/rateX + "px","top": -tY/rateY + "px"} );
	};
	
	function updateViewListCountBySize(){
		var lWidth = listEl.width();
		var mWidth = lWidth - 30;
		viewCount = Math.floor( mWidth/liWidth );
		var remain = mWidth % liWidth;
		var spacer = remain;
		if( remain == 0){
			spacer = liWidth;
			viewCount--;
		}else if( remain < 4){
			spacer = liWidth+remain;
			viewCount--;
		}
		liRightM = viewCount ==0?0:spacer/(viewCount-1);
		if( liRightM > 20){
			liRightM = 20;
		}
		containerUlEl.width( totalItem * ( liWidth + liRightM) );
		containerLiEl.css("marginRight",liRightM);
		var nWidth = viewCount*liWidth + (viewCount-1)*liRightM;
		var sideSpacer = (lWidth - nWidth)/2;
		containerEl.css({"left":sideSpacer,"right":sideSpacer});
		if(scrollIndex + viewCount > totalItem){
			scrollIndex = totalItem - viewCount;
			containerUlEl.css("left",-scrollIndex * 141);
		}	
		if( scrollIndex >= (totalItem-viewCount) ){ 
			rightArrowEl.hide();
		}else if( scrollIndex + viewCount < totalItem){
			rightArrowEl.show();
		}	
		containerUlEl.css( "left",-scrollIndex * (liWidth+liRightM));
	}
	function setMainViewIndex(value){ 
		if( value ==  viewIndexM){return;}
		mainViewImgEl.stop();
		if( viewIndexM != -1){
			mainViewImgEl.eq( viewIndexM).css("zIndex",1).fadeOut();
		}
		viewIndexM = value;
		mainViewImgEl.eq( viewIndexM).css("zIndex",2).fadeIn();
		
		viewAreaImgEl.attr( "src",mainViewImgEl.eq(value).attr("src") );
		partViewImgEl.hide();
		partViewImgEl.eq(value).show();
		
		phoneNavLiEls.removeClass("selected");
		phoneNavLiEls.eq(value).addClass("selected");
	}
	var initIndex = containerLiEl.filter(".checked").index();
	function updateInitNavPosByIndex(val){
		if( val > 3 ){
			containerUlEl.css( "left", -(val -3) * (liWidth+liRightM));
			leftArrowEl.show();
			if( val == totalItem-1){
				rightArrowEl.hide();
			}
		}


	};

	if( holderEl.prop("complete") ){
		isInit = true;
		updateViewListCountBySize();
		setMainViewIndex(initIndex);
		updateInitNavPosByIndex(initIndex);
	}else{
		isInit = true;
		holderEl[0].onload = updateViewListCountBySize;
		setMainViewIndex(initIndex);
		updateInitNavPosByIndex(initIndex);
	}
	winEl.resize(function(){
		if(!isInit){return;}
		updateViewListCountBySize();
	});
};

var EBE_AppendManager = function(sizeError,toWishHandler,toCarHandler){
	var nameEl = $(".mainParamBlock h2");
	var numcheck = /\d/;
	var qtyInputEl = $(".mainParamBlock .QtyRow input");
	qtyInputEl.keypress(function(e){
		var keynum;
		if(window.event){
		  keynum = e.keyCode;
		}else if(e.which){
		  keynum = e.which;
		}
		if(keynum==8){
			return true;
		}
		var keychar = String.fromCharCode(keynum);
		return numcheck.test(keychar);
	}).keyup(function(){
		var val = parseInt( qtyInputEl.val() );
		if( isNaN(val) ||  val < 1){
			qtyInputEl.val(1);
			return;
		}
		if( val > 999 ){
			qtyInputEl.val(999);
			return;
		}
	});
	var numStepBtnEls = $(".mainParamBlock .QtyRow a");
	numStepBtnEls.click(function(){
		var val = parseInt( qtyInputEl.val() );
		if( numStepBtnEls.index(this) == 1){
			val++;
		}else{
			val--;
		}
		if(val>999){val=999;}
		if(val<1){val=1;}
		qtyInputEl.val(val);
	});
	
	var currentColorEl = $(".mainParamBlock .colorGroup .current");
	var sizeAllEls = $(".mainParamBlock .sizeGroup li a");
	var sizeEls = sizeAllEls.not(".unable");
	var inventoriesEl = $(".mainParamBlock .inventory");
	var inventoriesTextEl = inventoriesEl.find("b");
	var priceEl = $(".mainParamBlock h1");
	var currentSizeEl = $(".mainParamBlock .sizeGroup li .checked ");
	
	
	if( currentSizeEl.length > 0 ){
		priceEl.text( currentSizeEl.attr("price") );
		inventoriesEl.css("visibility","visible");
		inventoriesTextEl.text( currentSizeEl.attr("qty") );
	}else{
		currentSizeEl = null;
	}
	sizeEls.click(function(){
		var sizeEl = sizeEls.eq(sizeEls.index(this));
		if( currentSizeEl && (sizeEl[0] == currentSizeEl[0] ) ){
			return;
		}
		currentSizeEl = sizeEl;
		sizeEls.removeClass("checked");
		currentSizeEl.addClass("checked");
		inventoriesEl.css("visibility","visible");
		inventoriesTextEl.text( currentSizeEl.attr("qty") );
		priceEl.text( currentSizeEl.attr("price") );
	});
	$(".mainParamBlock .actionRow .toWish").click(function(){
		if( sizeAllEls.length != 0 && currentSizeEl == null ){
			alert(sizeError);
			return;
		}
		toWishHandler( getData() );
	});
	$(".mainParamBlock .actionRow .toShoppingcar").click(function(){
		if( sizeAllEls.length != 0 && currentSizeEl == null ){
			alert(sizeError);
			return;
		}
		toCarHandler( getData() );
	});
	function getData(){
		return {
			"name":nameEl.text(),
			"colorID":currentColorEl.length==0?"":currentColorEl.attr("iid"),
			"sizeID":currentSizeEl==null?"":currentSizeEl.attr("iid"),
			"qty":qtyInputEl.val()
		};
	}
	
	var messageIndex = 0;
	var messageNavEls = $(".mainParamBlock .messageNavBar a");
	var messageContentEls = $(".mainParamBlock .messageContentBlock .block");	
	messageNavEls.click(function(){
		var tIndex = messageNavEls.index(this);
		var navEl = messageNavEls.eq(tIndex);
		if( navEl.hasClass("current") ){
			return;
		}
		messageNavEls.removeClass("current");
		navEl.addClass("current");
		messageContentEls.hide();
		messageContentEls.eq(tIndex).show();		
	});
};

var EBE_RecommendManager = function(toWishFn){
	var el = $(".mainPanel .recommendPanel");
	this.liEls = el.find("li");
	var nameEls = el.find("h3");	
	this.toWishBtnEls = el.find("i");
	var that = this;
	this.toWishBtnEls.click(function(){
		var tIndex = that.toWishBtnEls.index(this);
		var btnEl = that.toWishBtnEls.eq(tIndex);
		if( btnEl.hasClass("added") ){return;}
		toWishFn(  that.liEls.eq(tIndex).attr("iid") ,nameEls.eq(tIndex).text() );
	});
};
(function(){
	this.toWish = function( id ){
		var i,itemEl;
		for( i=0; i < this.liEls.length ;i++){
			itemEl = this.liEls.eq(i);
			if( itemEl.attr("iid") == id){
				this.toWishBtnEls.eq(i).addClass("added")
				break;
			}
		}
	};

}).call(EBE_RecommendManager.prototype);

var EBE_SizePopManager = function(){
	var winEl = $(window);
	var popWinEl = $(".popSizeWindow");
	var blockEl = popWinEl.find(".viewBlock");
	var imgEl = blockEl.find("img");
	var imgWidth =0,  imgHeight = 0;
	var openEl = $(".mainParamBlock .borderBlock .label a");
	var closeEl = popWinEl.find("a");
	var isPop = false;
	
	if(imgEl.prop("complete")){
		init();
	}else{
		imgEl[0].onload = init;
	}
	function init(){
		imgWidth = imgEl.width();
		imgHeight = imgEl.height();
		popWinEl.css("visibility","visible").hide();
	}
	function updateView(){
		if( !isPop ){return;}
		var wWidth = winEl.width();
		var wHeight = winEl.height();

		var rate = Math.max( imgWidth/wWidth, imgHeight/wHeight );
		if( rate < 1){
			rate = 1;
		}
		var nWidth = imgWidth/rate,nHeight=imgHeight/rate;
		blockEl.css({"width":nWidth,"height":nHeight,"left": (wWidth-nWidth)/2,"top":(wHeight-nHeight)/2});
	};
	openEl.click(function(){
		isPop = true;
		popWinEl.show().css("visibility","visible");
		updateView();
	});
	closeEl.click(function(){
		isPop = false;
		popWinEl.hide();
	});	
	
};

$(function(){
	new EBE_GoodsViewManager();
	new EBE_SizePopManager();
	
	new EBE_AppendManager("请选择尺寸！",function(data){
		console.log("添加到搜藏",data);
		//请求服务器
		alert("已收藏:"+data.name);
	},function(data){
		console.log("添加到购物车",data);
		//请求服务器
		
		//服务器添加成功后，更新到购物车
		G_shoppingCar.addGoods({
			"imgUrl":"public/source/shoppingCar/001.jpg",
			"name":"xxx",
			"size":"尺寸:M",
			"price":"￥11",
			"num":"数量:2",
			"color":"颜色:Red",
			"id":"id__01"
		});
	});
	var recommend = new EBE_RecommendManager(function(id,name){
		console.log("推荐/添加到收藏(id,名称)",id,name);
		//请求服务器
		alert("已收藏:"+name);

		recommend.toWish(id);
	});
	
	
});
