var EBE_RegisterManager = function(eMailReg,passwordReg){
    var formEl = $(".mainPanel form");
    var inputEls = formEl.find("input");
    var borderEl = formEl.find(".inputText");
    formEl.submit(function(){
        var hasErr= false;
        if(  $.trim(inputEls.eq(0).val()) == "" ){
            hasErr = true;
            borderEl.eq(0).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(0).removeClass("comm_form_validationFailed");
        }
        if(  $.trim(inputEls.eq(1).val()) == "" ){
            hasErr = true;
            borderEl.eq(1).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(1).removeClass("comm_form_validationFailed");
        }
        if( !eMailReg.test( $.trim(inputEls.eq(2).val()) ) ){
            hasErr = true;
            borderEl.eq(2).addClass("comm_form_validationFailed");

        }else{
            borderEl.eq(2).removeClass("comm_form_validationFailed");
        }
        var pw01 = $.trim(inputEls.eq(3).val());
        var pw02 = $.trim(inputEls.eq(4).val());
        if( !passwordReg.test(pw01) ){
            hasErr = true;
            borderEl.eq(3).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(3).removeClass("comm_form_validationFailed");
        }
        if( !passwordReg.test(pw02) ){
            hasErr = true;
            borderEl.eq(4).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(4).removeClass("comm_form_validationFailed");
        }

        if( passwordReg.test(pw01) && passwordReg.test(pw02) && pw01 != pw02 ){
            hasErr = true;
            borderEl.eq(3).addClass("comm_form_validationFailed");
            borderEl.eq(4).addClass("comm_form_validationFailed");
        }
        return !hasErr;
    });
};

$(function(){
    new EBE_RegisterManager(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,/^[a-zA-Z0-9!@#$%^&*]{6,16}$/i);
});