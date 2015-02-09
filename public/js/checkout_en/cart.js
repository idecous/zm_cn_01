var EBE_DeleteManager = function(delHandler){
    var nameEls = $(".comm_centerBlock table tbody tr td .descriptBlock h3");
    var tableDelEls = $(".comm_centerBlock table tbody tr td .delBtn");
    var mobileDelEls = $(".comm_centerBlock .mobileBlock li .delBtn");

    tableDelEls.each(function(index){
        var btnEl = tableDelEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    tableDelEls.click(function(){
        var tIndex = tableDelEls.index(this);
        var btnEl = tableDelEls.eq( tIndex );
        if( delHandler(nameEls.eq(tIndex).text()) ){
            window.location.href = btnEl.data("url");
        };
    });

    mobileDelEls.each(function(index){
        var btnEl = mobileDelEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    mobileDelEls.click(function(){
        var tIndex = mobileDelEls.index(this);
        var btnEl = mobileDelEls.eq( tIndex );
        if( delHandler(nameEls.eq(tIndex).text()) ){
            window.location.href = btnEl.data("url");
        }
    });
};
var EBE_QuantityInput = function(el){
    var reduceEl = el.find(".reduce");
    var increaseEl = el.find(".increase");
    var inputEl = el.find("input");
    var bindTarget = null;
    var numcheck = /\d/;

    var value = parseInt( inputEl.val() );
    if( isNaN(value) ||  value < 1){
        value=1;
        inputEl.val(value);
    }
    reduceEl.click(function(){
        value--;
        if(value < 1){ value =1;}
        inputEl.val(value);
        bindTarget.setValue(value);
    });
    increaseEl.click(function(){
        value++;
        if(value > 99){ value =99;}
        inputEl.val(value);
        bindTarget.setValue(value);
    });
    inputEl.keypress(function(e){
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
        value = parseInt( inputEl.val() );
        if( isNaN(value) ||  value < 1){
            value=1;
        }
        if( value > 99 ){
            value=99;
        }
        inputEl.val(value);
        bindTarget.setValue(value);
    });

    function setValue( val ){
        value = val;
        if( isNaN(value)){
            value=1;
        }
        if(value < 1){ value =1;}
        if(value > 99){ value =99;}
        inputEl.val(value);
    }
    function setBind(target){
        bindTarget = target;
    }
    return {
        "setValue":setValue,
        "setBind":setBind
    };
};
var EBE_QuantityGroup = function(tQuantityEl,mQuantityEl){
    var tQuantity = new EBE_QuantityInput(tQuantityEl);
    var mQuantity = new EBE_QuantityInput(mQuantityEl);

    tQuantity.setBind(mQuantity);
    mQuantity.setBind(tQuantity);
};
var EBE_QuantityInputManager = function(){
    var tableQuantityEls = $(".mainPanel table .quantitySelector");
    var mobileQuantityEls = $(".mainPanel .mobileBlock .quantitySelector");
    for(var i=0; i < tableQuantityEls.length ;i++){
        new EBE_QuantityGroup(  tableQuantityEls.eq(i), mobileQuantityEls.eq(i));
    }
};

var EBE_AddToWishList = function(addHandler){
    var nameEls = $(".comm_centerBlock table tbody tr td .descriptBlock h3");
    var tableAddEls = $(".comm_centerBlock table tbody tr td .toWish");
    var mobileAddEls = $(".comm_centerBlock .mobileBlock li .toWish");

    tableAddEls.each(function(index){
        var btnEl = tableAddEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    tableAddEls.click(function(){
        var tIndex = tableAddEls.index(this);
        var btnEl = tableAddEls.eq(tIndex);
        if( addHandler(nameEls.eq(tIndex).text()) ){
            window.location.href = btnEl.data("url");
        };
    });
    mobileAddEls.each(function(index){
        var btnEl = mobileAddEls.eq(index);
        btnEl.data("url",btnEl.attr("href"));
        btnEl.attr("href","javascript:;");
    });
    mobileAddEls.click(function(){
        var tIndex = mobileAddEls.index(this);
        var btnEl = mobileAddEls.eq(tIndex);
        if( addHandler(nameEls.eq(tIndex).text()) ){
            window.location.href = btnEl.data("url");
        }
    });
};

var EBE_UpdateManager = function(){
    var codeFormEl = $(".mainPanel .updateRow form:eq(0)");
    var codeInputEl = codeFormEl.find("input[type=text]");
    var submitEls = codeFormEl.find("input[type=submit]");
    var hiddenEl = codeFormEl.find("input[type=hidden]");

    submitEls.click(function(){
        var tIndex = submitEls.index(this);
        hiddenEl.val(  tIndex==0?"0":"1" );
    });
    codeFormEl.submit(function(e){
        var code= $.trim( codeInputEl.val() );
        if( code == "" ){
            codeInputEl.addClass("warn");
            return false;
        }
    });
    var formEl = $(".mainPanel form:eq(0)");
    var updateSubmitEl= $(".mainPanel .updateRow .updateBtn");
    updateSubmitEl.click(function(){
        formEl.submit();
    });
};

var EBE_ShippingTaxManager = function(){
    var addressFormEl = $(".mainPanel .shippingTaxBlock form");
    var addressRowEl = $(".mainPanel .shippingTaxBlock .addressRow");
    var addressInputEls = addressRowEl.find("select,input[type=text]");
    var warnEls = addressRowEl.find(".warn");

    addressFormEl.submit(function(){
        var result = true;
        if( $.trim( addressInputEls.eq(0).val()) == "" ){
            result = false;
            warnEls.eq(0).css("visibility", "visible");
        }else{
            warnEls.eq(0).css("visibility", "hidden");
        }
        if( $.trim( addressInputEls.eq(1).val()) == "" ){
            result = false;
            warnEls.eq(1).css("visibility", "visible");
        }else{
            warnEls.eq(1).css("visibility", "hidden");
        }
        if( $.trim( addressInputEls.eq(2).val()) == "" ){
            result = false;
            warnEls.eq(2).css("visibility", "visible");
        }else{
            warnEls.eq(2).css("visibility", "hidden");
        }
        return result;
    });

    var shippingRowEl = $(".mainPanel .shippingTaxBlock .shippingRow");
    var radioEls = shippingRowEl.find("input[type=radio]");
    var labelEls = shippingRowEl.find("li span");
    labelEls.click(function(){
        var tIndex = labelEls.index(this);
        radioEls.prop("checked",false);
        radioEls.eq(tIndex).prop("checked",true);
    });
};
$(function(){
    new EBE_QuantityInputManager();
    new EBE_UpdateManager();
    new EBE_ShippingTaxManager();

    new EBE_DeleteManager(function(name){
        return confirm("是否删除："+ name+" ?");;
    });

    new EBE_AddToWishList(function(name){
        return confirm("是否收藏："+ name+" ?");;
    });
});