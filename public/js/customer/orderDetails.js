var EBE_DeleteManager = function( errorMeg ){
    var formEl = $(".comm_contentMainPanel>form");
    var inputEl = formEl.children("input[type='hidden']");
    var aEls = $( ".comm_contentMainPanel a[href='#return']" );
    aEls.attr("href","javascript:;");
    aEls.click(function(){
        var aEl = aEls.eq(  aEls.index(this) );
        if(window.confirm( aEl.attr("iid") + "  " + errorMeg )) {
            inputEl.val( aEl.attr("iid") );
            formEl.submit();
        }
    });
};

$(function(){
    new EBE_DeleteManager("是否退货？");
});