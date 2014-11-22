$(function(){
    var eMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var eMailEl = $(".mainPanel input[type='text']");
    var eMailBorderEl = $(".mainPanel .inputText");
    $(".mainPanel form").submit(function(){
        var hasErr= false;
        if( !eMailReg.test( eMailEl.val() ) ){
            hasErr = true;
            eMailBorderEl.addClass("comm_form_validationFailed");
        }else{
            eMailBorderEl.removeClass("comm_form_validationFailed");
        }
        return !hasErr;
    });
});