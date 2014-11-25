var CEvent = function(name,data){
    this.name = name;
    this.data = data === undefined ? null : data;
    this.target = null;
};
var ScrollBarV = function(el){
    this._eventCollection = {};
    this.el = el;
    this.rate = 1;
    this.value = 0;
    this.maximum = 0;
    this.thumbSize = 0;
    this.extraPos = 0;
    this.startPos = 0;
    this.minThumbSize = 20;
    this.isDraging = false;
    this.dragStartValue = 0;
    this.changeEvent = new CEvent("VALUE_CHANGE_EVENT");
    this.dragEvent = new CEvent("DRAG_EVENT",[]);
    this.init();
};
(function(){
    this.init = function() {
        this.build();
        this.thumb.mousedown($.proxy(this._startDrag, this));
        this.el.mousedown($.proxy(this._trackClickHandler, this));
    };
    this._trackClickHandler = function(e) {
        if (this.isDraging) {
            return;
        }
        var mousePosY = e.pageY - this.el.offset().top;
        var thumbY = parseInt(this.thumb.css("top"));
        var thumbHeight = parseInt(this.thumb.css("height"));
        var tY = mousePosY <= thumbY ? mousePosY : mousePosY - thumbHeight;
        this.thumb.css("top", tY + "px");
        var value = this._posToValue(tY, this.thumbSize - thumbHeight);
        if (this.value == value) {
            return;
        }
        this.value = value;
        this.changeEvent.data = value;
        this.dispatchEvent(this.changeEvent);
    };
    this._startDrag = function(e) {
        this.extraPos = e.pageY - this.thumb.offset().top;
        this.startPos = e.pageY;
        this.documentEl.bind("mousemove", $.proxy(this._mouseMoveFn, this));
        this.documentEl.bind("mouseup", $.proxy(this._mouseUpFn, this));
        if (window.captureEvents) {
            window.addEventListener(Event.MOUSEMOVE, null, true);
            window.addEventListener(Event.MOUSEUP, null, true);
        } else if (this.thumb[0].setCapture) {
            this.thumb[0].setCapture();
        }
        this.isDraging = true;
        this.dragStartValue = this.value;
        this.dragEvent.data[0] = "BEGIN";
        this.dragEvent.data[1] = 0;
        this.dispatchEvent(this.dragEvent);
        return false;
    };
    this._mouseMoveFn = function(e) {
        var tY = e.pageY - this.el.offset().top - this.extraPos;
        if (tY < 0) {
            tY = 0;
        }
        var thumbH = parseInt(this.thumb.css("height")) ;
        if (tY + thumbH > this.maximum * this.rate) {
            tY = this.maximum * this.rate - thumbH;
        }
        this.thumb.css("top", tY );
        var value = this._posToValue(tY,this.maximum* this.rate - thumbH);
        if (this.value == value) {
            return;
        }
        this.value = value;
        this.changeEvent.data = value;
        this.dispatchEvent(this.changeEvent);
    };
    this._mouseUpFn = function(e) {
        this.documentEl.unbind();
        if (window.releaseEvents) {
            window.removeEventListener(Event.MOUSEMOVE, null, true);
            window.removeEventListener(Event.MOUSEUP, null, true);
        } else if (this.thumb[0].releaseCapture) {
            this.thumb[0].releaseCapture();
        }
        this.isDraging = false;
        this.dragEvent.data[0] = "END";
        this.dragEvent.data[1] = this.value - this.dragStartValue ;
        this.dispatchEvent(this.dragEvent);
    };
    this.setMaximum = function(value) {
        this.rate = this.el.height() / value;
        this.maximum = value;
        this.value = this.value > this.maximum ? this.maximum : this.value;
        var thumbH = this.thumbSize / this.maximum * this.thumbSize;
        if (isNaN(thumbH) || thumbH < this.minThumbSize) {
            thumbH = this.minThumbSize;
        }
        this.thumb.css("height", thumbH * this.rate );
    };
    this.setThumbSize = function(value) {
        this.thumbSize = value;
        this.thumb.css("height", this.thumbSize * this.rate );
    };
    this.setValue = function(value) {
        this.value = value;
        this.value = this.value > this.maximum  ? this.maximum  : this.value;
        this.value = this.value < 0 ? 0 : this.value;
        var tY = (this.value / this.maximum) * (this.maximum - this.thumbSize);
        this.thumb.css("top", tY * this.rate);
    };
    this.build = function() {
        this.documentEl = $(document);
        this.thumb = $("<a class='thumb'></a>").appendTo(this.el);
        this.setVisible(false);
    };
    this.setVisible = function(value) {return;
        if (value) {
            this.el.css("display", "block");
        } else {
            this.el.css("display", "none");
        }
    };
    this._posToValue = function(posVlaue, posMax) {
        return posVlaue / posMax * this.maximum ;
    };
    this.dispatchEvent = function(event) {
        for (var key in this._eventCollection ) {
            if (key.toString() == event.name) {
                var handleFns = this._eventCollection[key];
                event.target = this;
                for (var i = 0; i < handleFns.length; i++) {
                    handleFns[i].call(this, event);
                }
            }
        }
    };
    this.addEventListener = function(eventName, eventFn) {
        if (this._eventCollection[eventName]) {
            this._eventCollection[eventName].push(eventFn);
        } else {
            this._eventCollection[eventName] = [eventFn];
        }
    };
}).call(ScrollBarV.prototype);

var EBE_TopGroupNavigationManager = function(initFn){
    var isIe8 = !$.support.leadingWhitespace;
    var mainViewEl = $(".mainViewArea");
    var el = $(".mainViewArea .navGroupPanel");
    var viewEl = el.find(".viewBlock");
    var holderEl = el.find(".placeholderBG");
    var navImgEls = el.find("li,.placeholderBG");

    var overBlockEl = el.find("li");
    var overBlocCoverEl = overBlockEl.find(".cover");
    var pitch = 0;
    var liCount = overBlockEl.length;
    var viewBlockWidth = 0;

    overBlockEl.mouseenter(function(){
        overBlocCoverEl.stop();
        overBlocCoverEl.fadeOut();
        var oIndex  = overBlockEl.index(this);
        overBlockEl.stop().each(function(index){
            var liEl = overBlockEl.eq(index);
            if(  index < oIndex){
                liEl.animate({"left":0});
            }else if( index > oIndex){
                liEl.animate({"left":viewBlockWidth  });
            }else{
                liEl.animate({"left": 0 });
            }
        });
    });
    el.mouseleave(function(){
        overBlocCoverEl.stop();
        overBlocCoverEl.fadeIn();
        overBlockEl.stop().each(function(index){
            overBlockEl.eq(index).animate({"left":index * pitch});
        });
    });
    function resizeHandler(screenWidth,screenHeight){
        viewBlockWidth = viewEl.width();
        el.css( {"top":100 + (screenHeight - 100 - 90 - viewEl.height())/2,
            "height": viewEl.height() + 18 }  );
        viewEl.css("left", (screenWidth - viewBlockWidth )/2 );

        pitch = viewBlockWidth/liCount ;
        for(var i=0; i < overBlockEl.length;i++){
            overBlockEl.eq(i).css("left",i * pitch);
        }
    };
    function setOpacityHandler(val){
        el.css( {"opacity": val} );
        if(isIe8){
            navImgEls.css( {"opacity": parseFloat(val) });
        }
    }
    if(holderEl.prop("complete")){
        setTimeout(initFn,10);
    }else{
        holderEl[0].onload = initFn;
    }
    return {"resizeHandler":resizeHandler,"setOpacity":setOpacityHandler};
};
var EBE_TopMenuModule = function(el,index){
    var mianWidth = 200;
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
        var canvasWidth = blockWidth-mianWidth-subMunWidth - 20;
        var canvasHeight = blockHeight - 20;

        var rate = Math.min( canvasWidth/imgWidth ,canvasHeight/imgHeight );
        var niWidth = imgWidth * rate,niHeight = imgHeight * rate;
        if(niWidth>imgWidth){niWidth=imgWidth;}
        if(niHeight>imgHeight){niHeight=imgHeight;}
        propagandaEl.width(niWidth).height(niHeight);
        propagandaEl.css({"top": ( canvasHeight - niHeight) /2 + 10,"left":mianWidth+subMunWidth +  (canvasWidth-niWidth)/2 + 10});
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
        if(hasSub){
            subBlockEl.addClass("open");
        }else{
            subBlockEl.removeClass("open");
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
        subBlockEl.removeClass("open");
        centerImg();
    });
};

var EBE_ContentBlockManage = function( initFn ){
    var el = $(".mainViewArea .contentBlock");
    var topNavModuleEl = el.find(".navigationBlock .normalMenu .topNavModule");
    var navModuleBlockEls = topNavModuleEl.children("li");
    navModuleBlockEls.each( function( index ){
      new EBE_TopMenuModule( navModuleBlockEls.eq(index) ,index);
    } );
    var middleBlockEl = el.find(".middleBlock").fadeOut(0);
    var footerEl = el.find(".footer");

    var aboutEls = middleBlockEl.find("a");
    var aboutImgEls = aboutEls.find("img");
    var aboutImgWidth = 0;
    var aboutImgHeight = 0;

    var img = new Image();
    img.onload = initFn;
    img.src = aboutImgEls.eq(0).attr("src");

    aboutEls.mouseenter(function(){
        var tIndex = aboutEls.index(this);
        aboutImgEls.eq( tIndex * 2).fadeOut();
    }).mouseleave(function(){
        var tIndex = aboutEls.index(this);
        aboutImgEls.eq( tIndex * 2).fadeIn();
    });

    function resizeHandler(screenWidth,screenHeight){
        el.height( screenHeight - 120);
        footerEl.css("left",   (screenWidth - footerEl.width())/2 );

        var mbHeight = middleBlockEl.height();
        var nHeight = aboutImgHeight;
        if( nHeight >  mbHeight - 20 ){
            nHeight = mbHeight - 20;
        }
        if( nHeight < 0 ){
            nHeight = 0;
        }
        if( nHeight > aboutImgHeight ){
            nHeight = aboutImgHeight;
        }

        var mbWidth = middleBlockEl.width();
        var nWidth = aboutImgWidth * 2 + 40 ;
        if( nWidth > mbWidth - 20 ){
            nWidth = mbWidth - 20;
        }
        if(nWidth < 0 ){
            nWidth = 0;
        }
        if( nWidth >  aboutImgWidth * 2 + 40 ){
            nWidth =  aboutImgWidth * 2 + 40;
        }
        nWidth = (nWidth-40)/2;

        var rate = Math.min(nWidth/aboutImgWidth, nHeight/aboutImgHeight );
        nWidth = aboutImgWidth*rate;
        nHeight = aboutImgHeight*rate;
        aboutEls.css({"width":nWidth,"height":nHeight,"top": (mbHeight - nHeight)/2});
        aboutEls.eq(0).css("left", mbWidth/2 - 20 - nWidth );
        aboutEls.eq(1).css("left", mbWidth/2 + 20 );
    }

    function initHandler() {
        aboutImgWidth = img.width;
        aboutImgHeight = img.height;
        aboutImgEls.css("width","100%");
    }
    function updatePos(screenHeight,rate){
        var topVal = 120 + rate * (screenHeight -120 - 40);
        el.css("top",topVal);
    };
    function fadeIn(){
        middleBlockEl.stop();
        middleBlockEl.fadeIn(1000);
    }
    function fadeOut(){
        middleBlockEl.stop();
        middleBlockEl.fadeOut(1000);
    }
    return {"updatePos":updatePos,
        "resizeHandler":resizeHandler,
        "initHandler":initHandler,
        "fadeIn":fadeIn,"fadeOut":fadeOut};
};


var EBE_ScrollManager = function(){
    var winEl = $(window);
    var moduleInitCount = 0;

    var el = $(".mainViewArea");
    var logoBlockEl = el.find(".logoBlock");
    var searchEl = el.find(".searchBlock");
    var searchFormEl = el.find("form");
    var searchBlockEl = searchFormEl.find(".searchBlock");
    var searchInputEl = searchFormEl.find("input[type='text']");
    searchFormEl.submit(function(){
        if( $.trim(searchInputEl.val()) == "" ){
            searchBlockEl.addClass("warn");
            return false;
        }
    });

    var screenWidth = 0;
    var screenHeight = 0;
    var topPadding = 150;

    var scrollBar = new ScrollBarV( $(".mainViewArea .scrollBar") );
    scrollBar.setThumbSize( 20 );
    var autoScrollTimeID=0,scrollDirection="UP",tDirection,animScrollTarget,animScrollSpeed,animScrollValue;
    if ( navigator.userAgent.toLowerCase().indexOf("firefox")!=-1 ) {
        el.get(0).addEventListener('DOMMouseScroll', function(e) {
            tDirection = e.detail;
            if (Math.abs(tDirection) == 3) {
                tDirection = tDirection < 0 ? -1 : 1;
            } else {
                tDirection = tDirection > 0 ? -1 : 1;
            }
            e.stopPropagation();
            e.preventDefault();
            _mouseScrollHandler(tDirection);
        }, false);
    } else {
        el.get(0).onmousewheel = function(e) {
            e = e || window.event;
            e.returnValue = false;
            tDirection = e.wheelDelta > 0 ? -1 : 1;
            _mouseScrollHandler(tDirection);
        };
    }
    scrollBar.addEventListener("VALUE_CHANGE_EVENT",updateScrollHandler);
    function _mouseScrollHandler(direction){
        scrollBar.setValue( scrollBar.value + direction * 10 );
        updateScrollHandler();
        animScrollHandler(direction);
    }
    function animScrollHandler(direction){
        animScrollTarget = direction > 0? 100:0;
        animScrollSpeed =  direction * 2;
        animScrollValue = scrollBar.value;
        clearTimeout(autoScrollTimeID);
        _animScrollHandler();
        if(direction==1){
            contentBlock.fadeIn();
        }else{
            contentBlock.fadeOut();
        }
    }
    function _animScrollHandler(){
        autoScrollTimeID = setTimeout(function() {
            if( Math.abs( animScrollTarget - animScrollValue ) > Math.abs(animScrollSpeed)*3 ){
                animScrollValue += animScrollSpeed;
            }else{
                animScrollValue += (animScrollTarget - animScrollValue)/3;
            }
            if (animScrollSpeed > 0 && animScrollTarget-0.5 <= animScrollValue) {
                animScrollValue = animScrollTarget;
            } else if (animScrollSpeed < 0 && animScrollTarget+0.5 >= animScrollValue) {
                animScrollValue = animScrollTarget;
            } else {
                _animScrollHandler();
            }
            scrollBar.setValue(animScrollValue);
            updateScrollHandler();
        }, 10);
    };

    var topNavBlock = new EBE_TopGroupNavigationManager(moduleInitFn);
    var contentBlock = new EBE_ContentBlockManage(moduleInitFn);

    function resizeHandler(){
        screenWidth  = el.width();
        screenHeight = el.height();
        scrollBar.el.height( screenHeight - 16 );
        scrollBar.setMaximum( 100 );
        scrollBar.setValue( scrollBar.value );

        topNavBlock.resizeHandler(screenWidth,screenHeight);
        contentBlock.resizeHandler(screenWidth,screenHeight);

        contentBlock.updatePos(screenHeight,(100-scrollBar.value)/100 );
    };
    function moduleInitFn(){
        moduleInitCount++;
        if( moduleInitCount < 2){return;}
        scrollBar.addEventListener("VALUE_CHANGE_EVENT",updateScrollHandler);
        el.css("visibility","visible");
        contentBlock.initHandler();

        winEl.resize(resizeHandler);
        resizeHandler();
    };
    function updateScrollHandler(){
        var rate = (100-scrollBar.value)/100;
        logoBlockEl.css("top",22 + (70-43)*(1-rate) );
        searchEl.css("top",45 + (70-43)*(1-rate) );
        topNavBlock.setOpacity(  Math.pow(rate,3).toFixed(2) );
        contentBlock.updatePos(screenHeight,rate );
    }
};

var EBE_MobileMenuManager = function(){
    var winEl = $(window);
    var bodyEl = $("body");
    var el = $(".mobileMenu");
    var navEl = $(".mainViewArea .contentBlock .topNavModule").clone();
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

$(function(){
    new EBE_MobileMenuManager();
    new EBE_ScrollManager();
});





























