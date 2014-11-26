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
        if(value < 1){ value = 1;}
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
            value = 99;
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
var EBE_UpdateManager = function(){
    var codeFormEl = $(".mainPanel .updateRow form:eq(0)");
    var codeInputEl = codeFormEl.find("input[type=text]");
    var submitEls = codeFormEl.find("input[type=submit]");
    var codeHiddenEl = codeFormEl.find("input[type=hidden]");

    submitEls.mousedown(function(){
        var tIndex = submitEls.index(this);
        codeHiddenEl.val(  tIndex==0?"0":"1" );
    });
    codeFormEl.submit(function(e){
        var code= $.trim( codeInputEl.val() );
        if( code == "" ){
            codeInputEl.addClass("warn");
            return false;
        }
    });
    var formEl = $(".mainPanel form:eq(0)");
    var updateSubmitEl= $(".mainPanel .updateRow .comm_form_button:eq(2)");
    updateSubmitEl.click(function(){
        formEl.submit();
    });
};

$(function(){
    new EBE_QuantityInputManager();
    new EBE_UpdateManager();

});