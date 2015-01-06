var EBE_ListItem = function(toWishHandler,el,bg){
    this.toWishHandler = toWishHandler;
    this.el = el;
    this.isCache = false;
    this.id = "";
    this.data = null;
    this.holderBg = bg;
    this.init();
};
(function(){
    this.init = function(){
        if( this.el ){
            this.buildByEl();
        }else{
            this.build();
        }
        var that = this;
        this.wishBtnEl.click(function(){
            if( that.data.isWish ){return;}
            that.toWishHandler( that.data );
        });
    };
    this.toWish = function(){
        this.wishBtnEl.addClass("added");
        this.data.isWish = true;
    };
    this.setData = function(data){
        this.data = data;
        this.el.attr("iid",data.id),
            this.aEl.attr("href",data.url);
        this.imgEl.attr("src",data.img);
        this.nameEl.text( data.name );
        this.priceEl.text( data.price );
    };
    this.setCache = function(val){
        this.isCache = val;
        if( val ){
            this.id = "";
            this.data = null;
            this.el.detach();
            this.wishBtnEl.removeClass("added");
        }
    };
    this.build = function(){
        this.el = $("<li></li>");
        var borderEl = $("<div class='border'></div>").appendTo(this.el);
        this.aEl = $("<a href='#'></a>").appendTo(borderEl);
        $("<img src='"+ this.holderBg +"' class='bg'/>").appendTo(this.aEl);
        this.imgEl = $("<img src=''/>").appendTo(this.aEl);
        this.wishBtnEl = $("<i></i>").appendTo(borderEl);
        var descriptEl = $("<div class='descriptBlock'></div>").appendTo(borderEl);
        this.nameEl = $("<h3></h3>").appendTo(descriptEl);
        this.priceEl = $("<h1></h1>").appendTo(descriptEl);
    };
    this.buildByEl = function(){
        this.imgEl = this.el.find("img");
        this.wishBtnEl = this.el.find(".border i");
        this.nameEl =  this.el.find(".descriptBlock h3");
        this.priceEl = this. el.find(".descriptBlock h1");
        this.aEl = this.el.find("a");
        this.data ={
            "id":this.el.attr("iid"),
            "url":this.aEl.attr("href"),
            "img":this.imgEl.attr("src"),
            "isWish":this.wishBtnEl.hasClass("added"),
            "name":this.nameEl.text(),
            "price":this.priceEl.text()
        };
    };

}).call(EBE_ListItem.prototype);

var EBE_List = function( pageHandler,toWishFn,totalPage,holderBg ){
    if(totalPage){
        this.page = 1;
        this.totalPage = totalPage;
    }else{
        this.page = 0;
        this.totalPage = 0;
    }
    this.pageHandler = pageHandler;
    this.toWishFn = toWishFn;
    this.isLoading = false;
    this.used = [];
    this.items = [];
    this.holderBg = holderBg;
    this.init();
};
(function(){
    this.init = function(){
        this.build();
        this.initItems();
        this.winEl.resize($.proxy( this.scroll7ResizeHandler ,this)).
            scroll( $.proxy( this.scroll7ResizeHandler,this) );
    };
    this.appendData = function(data,newPage){
        var i,item;
        for( i=0;i<data.length;i++){
            item = this.getItem();
            item.setData( data[i] );
            this.used.push( item );
            this.el.append( item.el);
        }
        this.page = newPage;
        this.setIsLoading(false);
        G_screenHeightManager.update();
    };
    this.setData = function(data,totalPage,Qty){
        this.clear();
        this.page = totalPage==0?0:1;
        this.totalPage = totalPage;
        this.appendData(data,this.page);
    };
    this.itemToWishHandler = function(data){
        this.toWishFn( data.id , data.name);
    };
    this.toWish = function( id ){
        var i,item;
        for( i=0; i < this.used.length ;i++){
            item =  this.used[i];
            if( item.data && item.data.id== id ){
                item.toWish();
                break;
            }
        }
    };
    this.scroll7ResizeHandler = function(){
        if( this.isLoading || this.page == this.totalPage){return;}
        var offsetTop = this.el.offset().top;
        var scrollTop = this.winEl.scrollTop();
        var viewHeigth = this.winEl.height();
        var bottom = this.loadingEl.offset().top;
        if( scrollTop + viewHeigth > bottom + 20){
            this.setIsLoading( true );
            this.pageHandler( this.page + 1 );
        }
    };
    this.firstFill = function(){
        this.setIsLoading( true );
        this.pageHandler(  1 );
    };
    this.setIsLoading = function(val){
        this.isLoading = val;
        this.loadingEl.css("visibility",val?"visible":"hidden");
    };

    this.getItem = function(){
        var i,item;
        for( i=0;i<this.items.length;i++ ){
            item = this.items[i];
            if(item.isCache){
                item.setCache(false);
                return  item;
            }
        }
        item = new EBE_ListItem( $.proxy(this.itemToWishHandler,this) ,null,this.holderBg );
        this.items.push(item);
        return item;
    };
    this.clear = function(){
        var i,item;
        for( i=0; i < this.used.length;i++ ){
            item = this.used[i];
            item.setCache(true);
        }
        this.used = [];
    };
    this.initItems = function(){
        var liEls = this.el.find("li");
        var that = this;
        liEls.each(function(index){
            var liEl =  liEls.eq(index);
            var item = new EBE_ListItem( $.proxy(that.itemToWishHandler,that),liEl ,that.holderBg );
            that.used.push(item);
            that.items.push(item);
        });
    };
    this.build = function(){
        this.winEl = $(window);
        this.el = $(".mainPanel .listPanel");
        this.loadingEl = $(".mainPanel .loadingRow");
    };
}).call(EBE_List.prototype);

$(function(){
    var cacheFilterData = null;

    var list = new EBE_List(function(page){
        console.log("请求数据页面[页]",page);
        //请求服务器  过滤条件 cacheFilterData 页数:page
        list.appendData( getPageData(5), page );
    },function(id,name){
        //console.log("添加收藏[id,名称]",id,name);
        //请求服务器
        alert("添加"+name+"到收藏成功!");
        //list.toWish( id );
    },window.totalPage,"public/images/holder_230_335.png");


    list.firstFill();
});

var countID = 100;
function getPageData(size){
    var i,arr=[];
    for( i=0; i < size;i++ ){
        arr.push({"id":"i_"+countID,
            "img":"public/source/catagory/001.jpg",isWish:false,
            "url":"##",
            "name":"Short++"+countID,"price":"￥999" });
        countID++;
    }
    return arr;
};