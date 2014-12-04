var EBE_OrderFilterItemsManager = function(){
	this.data = -1;
	this.index = -1;
	this.init();
};
(function(){
	this.init = function(){
		this.build();
		var defaultOption = this.optionEls.filter("[class='current']");
		this.index = this.optionEls.index( defaultOption );
		this.data = parseInt( defaultOption.attr("iid") ) ;
		this.labelEl.text( defaultOption.text() );
		var that = this;
		this.optionEls.click(function(){
			var tIndex = that.optionEls.index(this);
			var optionEl = that.optionEls.eq(tIndex);
			if( optionEl.hasClass("current") ){
				return;
			}
			if( that.index != -1){
				that.optionEls.eq(that.index).removeClass("current");
			}
			that.index = tIndex;
			that.data =   parseInt( optionEl.attr("iid") );
			that.labelEl.text( optionEl.text() );
			that.optionEls.eq(that.index).addClass("current");
			
			that.chanageFn();
		});
	};
	this.build = function(){
		this.el = $(".mainPanel .filterPanel .comboxRow .order");
		this.labelEl = this.el.find(".labelBlock span");
		this.optionEls = this.el.find(".popBlock a");
	};
}).call(EBE_OrderFilterItemsManager.prototype);

var EBE_FilterItemsManager = function(changeFn){
	this.changeFn = changeFn;
	this.count = 0;
	this.items;
	this.init();	
};
(function(){
	this.init = function(){
		this.build();
		this.items = [];	
		var that = this;
		this.containerEls.each(function(index,node){
			that.items[index] = [];
		});	
		this.orderManager.chanageFn = function(){
			that.changeFn( that.getData() );
		};
	};
	this.insertItem = function(item){
		this.count++;
		this.containerEls.eq(item.moduleIndex).append(item.el);
		this.el.show();
		var moduleItems =this.items[item.moduleIndex]; 
		moduleItems.push(item);	
		
		this.changeFn( this.getData() );
	};
	this.removeItem = function(item){
		this.count--;
		var moduleItems =this.items[item.moduleIndex];
		var i,tItem;
		for( i=0; i< moduleItems.length;i++ ){
			tItem = moduleItems[i];
			if( tItem.data.toString() == item.data.toString() ){
				moduleItems.splice(i,1);
				break;
			}
		}
		item.setCache(true);
		if(this.count==0){
			this.el.hide();
		}
		this.changeFn( this.getData() );
	};	
	this.getData = function(){
		var i,k,moduleData,modelItems,modelItem,data = [];
		var hasFilter = false;
		for( i=0; i < this.items.length;i++ ){
			moduleData = [];
			modelItems = this.items[i];
			if( modelItems.length > 0 ){
				hasFilter = true;
			}
			for( k=0; k < modelItems.length ;k++){
				modelItem = modelItems[k];
				moduleData.push( modelItem.data  );
			}
			data.push(moduleData);
		}
		if( this.orderManager.data != -1 ){
			hasFilter = true;
			data.push( this.orderManager.data );
		}else if( hasFilter ){
			data.push(-1);
		}
		return hasFilter?data:null;
	};
	this.build = function(){
		this.el = $(".mainPanel .filterPanel .keyRow");
		this.containerEls = this.el.find(".keyCol");
		this.orderManager = new EBE_OrderFilterItemsManager();
	};
}).call(EBE_FilterItemsManager.prototype);

var EBE_FilterItem = function(){
	this.id = "";
	this.moduleIndex = -1;
	this.date = null;
	this.isCache = false;
	this.init();
};
(function(){
	this.init = function(){
		this.build();
		var that = this;
		this.delEl.click(function(){
			that.delHandler( that );
		});
	};
	this.setCache = function( val ){
		this.isCache = val;
		if( val ){
			this.id = "";
			this.moduleIndex = -1;
			this.index = -1;
			this.date = null;
			this.el.detach();
		}
	};	
	this.setData = function(textVal,data){
		this.textEl.text(textVal);
		this.data = data  ;
	};
	this.build = function(){
		this.el = $("<div class='border'></div>");
		this.textEl = $("<span></span>").appendTo( this.el );
		this.delEl = $("<a href='javascript:;'></a>").appendTo(this.el);
	};
}).call(EBE_FilterItem.prototype);

var EBE_FilterBlockBase = function(index,filterItemsManager){
	this.index = index;
	this.filterItemsManager = filterItemsManager;
	this.itemRender = EBE_FilterItem;
	this.used = [];
	this.items = [];
};
(function(){
	this.clearItem = function(){
		for(var i=0; i < this.used.length ;i++){
			this.filterItemsManager.removeItem( this.used[i] );
		}
		this.used = [];
	};
	this.insertItem = function(item){
		item.moduleIndex = this.index;
		this.used.push(item);
		this.filterItemsManager.insertItem( item );
	};
	this.removeItem = function(item){
		this.filterItemsManager.removeItem( item );
		var i,tItem;
		for( i=0;i<this.used.length;i++){
			tItem = this.used[i];
			if( item.data ==  tItem.data ){
				this.used.splice(i,1);
				break;
			}
		}
	};
	this.removeItemByData = function(val){
		var i,tItem;
		for( i=0;i<this.used.length;i++){
			tItem = this.used[i];
			if( tItem.data == val ){
				this.used.splice(i,1);
				this.filterItemsManager.removeItem( tItem );
				break;
			}
		}	
	};
	this.getItem = function(){
		var i,item;
		for(i=0;i<this.items.length;i++){
			item = this.items[i];
			if( item.isCache ){
				item.setCache(false);
				return item;
			}
		}
		item = new this.itemRender();
		item.delHandler = $.proxy(this.removeItem,this);
		this.items.push(item);		
		return item;
	};
}).call(EBE_FilterBlockBase.prototype);

var EBE_PriceFilter = function(index,filterItemsManager){
	EBE_FilterBlockBase.call(this,index,filterItemsManager);
	this.numReg = /\d/;
	this.init();
};
EBE_PriceFilter.prototype = Object.create(EBE_FilterBlockBase.prototype);
(function(){
	this.init = function(){
		this.build();
		this.popInputEls.keypress($.proxy(this._inputKeypressHandler,this)).keyup($.proxy(this._inputKeyupHandler,this));
		var that = this;
		this.popSureBtnEl.click(function(){
			that.clearItem();
			var item = that.getItem();
			var minVal = parseInt( that.popInputEls.eq(0).val() );
			var maxVal = parseInt( that.popInputEls.eq(1).val() );
			item.setData(minVal+"-"+maxVal ,[minVal,maxVal]  );
			that.insertItem( item );
		});
	};
	this._inputKeypressHandler = function(e){
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
		return this.numReg.test(keychar);
	};
	this._inputKeyupHandler = function(e){
		var tIndex = this.popInputEls.index(e.target);
		var inputEl =  this.popInputEls.eq(tIndex);
		var val = parseInt( inputEl.val() );
		inputEl.val(val);
		if( isNaN(val) ||  val < 1){
			inputEl.val(1);
			return;
		}
		if( val > 9999999 ){
			inputEl.val(9999999);
		}
		//var val01 = parseInt( this.popInputEls.eq(0).val() );
		//var val02 = parseInt( this.popInputEls.eq(1).val() );
		//if( tIndex == 1 && (val02 < val01) ){
		//	inputEl.val(val01);
		//}else if( tIndex == 0 && (val02 < val01) ){
		//	inputEl.val(val02);
		//}
	};
	this.build = function(){
		this.el = $(".mainPanel .filterPanel .comboxRow .price");
		this.popInputEls = this.el.find("input");
		this.popSureBtnEl = this.el.find("a");
	};	
}).call(EBE_PriceFilter.prototype);


var EBE_Size7StyleFilter = function(index,filterItemsManager,type){
	this.type = type;
	EBE_FilterBlockBase.call(this,index,filterItemsManager);
	this.init();
};
EBE_Size7StyleFilter.prototype = Object.create(EBE_FilterBlockBase.prototype);
(function(){
	this.init = function(){
		this.build();
		var that = this;
		this.popItemEls.click(function(){
			var tIndex = that.popItemEls.index(this);
			var itemEl = that.popItemEls.eq(tIndex);
			if( itemEl.hasClass("selected") ){
				itemEl.removeClass("selected");
				that.removeItemByData( parseInt( itemEl.attr("iid") ) );
			}else{
				itemEl.addClass("selected");
				var item = that.getItem();
				item.setData( itemEl.text() , parseInt( itemEl.attr("iid") ) );
				that.insertItem( item );	
			}
		});
	};
	this.removeItem = function(item){
		var i,popItem,iid = item.data;
		for(var i=0; i< this.popItemEls.length;i++){
			popItem = this.popItemEls.eq(i);
			if(parseInt( popItem.attr("iid") ) == iid ){
				popItem.removeClass("selected");
				break;
			}
		}
		EBE_FilterBlockBase.prototype.removeItem.call(this,item);	
	};
	this.build = function(){
		this.popEl = $(".mainPanel .filterPanel .comboxRow ."+this.type+" .popBlock");
		this.popItemEls = this.popEl.find(">.border a[class!=unable]");	
	};
}).call(EBE_Size7StyleFilter.prototype);


var EBE_FilterColorItem = function(){
	EBE_FilterItem.call(this);
};
EBE_FilterColorItem.prototype = Object.create(EBE_FilterItem.prototype);
(function(){
	this.setData = function(imgUrl,textVal,data){
		this.textEl.text(textVal);
		this.data = parseInt( data) ;
		this.imgEl.attr("src",imgUrl);
	};
	this.build = function(){
		this.el = $("<div class='border'></div>");
		this.imgEl = $("<img src=''/>").appendTo(this.el);
		this.textEl = $("<span></span>").appendTo( this.el );		
		this.delEl = $("<a href='javascript:;'></a>").appendTo(this.el);
	};	
}).call(EBE_FilterColorItem.prototype);
var EBE_ColorFilter = function(index,filterItemsManager){
	EBE_Size7StyleFilter.call(this,index,filterItemsManager,"color"  );
	this.itemRender = EBE_FilterColorItem;
};
EBE_ColorFilter.prototype = Object.create(EBE_Size7StyleFilter.prototype);
(function(){
	this.init = function(){
		this.build();
		var that = this;
		this.popItemEls.click(function(){
			var tIndex = that.popItemEls.index(this);
			var itemEl = that.popItemEls.eq(tIndex);
			var imgEl = that.imgEls.eq(tIndex);
			
			if( itemEl.hasClass("selected") ){
				itemEl.removeClass("selected");
				that.removeItemByData( itemEl.attr("iid") );
			}else{
				itemEl.addClass("selected");
				var item = that.getItem();
				item.setData( imgEl.attr("src") ,itemEl.text() , itemEl.attr("iid") );
				that.insertItem( item );	
			}
		});
	};	
	this.build = function(){
		this.popEl = $(".mainPanel .filterPanel .comboxRow ."+this.type+" .popBlock");
		this.popItemEls = this.popEl.find(">.border a[class!=unable]");	
		this.imgEls = this.popItemEls.find("img");
	};
}).call(EBE_ColorFilter.prototype);

var EBE_FilterManager = function(changeFn){
	var filterItemsManager = new EBE_FilterItemsManager(changeFn);
	new EBE_PriceFilter( 0,filterItemsManager );
	new EBE_Size7StyleFilter( 1,filterItemsManager,"size" );
	new EBE_Size7StyleFilter( 2,filterItemsManager,"style" );
	new EBE_ColorFilter(3,filterItemsManager);
	
	return {"update":function(){
		changeFn(filterItemsManager.getData());
	}};
};

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
		this.QtylEl.text(Qty);
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
		this.QtylEl = $(".mainPanel .catagoryNameBar span u");
		this.loadingEl = $(".mainPanel .loadingRow");
	};
}).call(EBE_List.prototype);


$(function(){
	var cacheFilterData = null;
	
	var list = new EBE_List(function(page){
		console.log("请求数据页面[页]",page);
		//请求服务器  过滤条件 cacheFilterData 页数:page

	//	list.appendData( getPageData(5), page );
		list.appendData([],0);

	},function(id,name){
		//console.log("添加收藏[id,名称]",id,name);
		//请求服务器
		alert("添加"+name+"到收藏成功!");
		//list.toWish( id );
	},window.totalPage,"public/images/holder_230_335.png");
	var filter = new EBE_FilterManager(function(data){
		console.log("过滤条件",data);
		cacheFilterData = data;
		//请求服务器  过滤条件 cacheFilterData 页数:1
		//list.setData( getPageData(2), 5 , 888 );

		list.setData( 0,0,0);
	});
	filter.update();
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








