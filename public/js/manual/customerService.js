var EBE_FormManager = function(){
    var eMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var contactUsForm = $(".comm_contentMainPanel form");
    var inputEl = contactUsForm.find("input,textarea");
    var borderEl = contactUsForm.find(".inputText,.inputTextarea");
    contactUsForm.submit(function(){
        var hasErr= false;
        if(  $.trim(inputEl.eq(0).val()) == "" ){
            hasErr = true;
            borderEl.eq(0).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(0).removeClass("comm_form_validationFailed");
        }
        if( !eMailReg.test( $.trim(inputEl.eq(1).val()) ) ){
            hasErr = true;
            borderEl.eq(1).addClass("comm_form_validationFailed");

        }else{
            borderEl.eq(1).removeClass("comm_form_validationFailed");
        }

        if(  $.trim(inputEl.eq(3).val()) == "" ){
            hasErr = true;
            borderEl.eq(3).addClass("comm_form_validationFailed");
        }else{
            borderEl.eq(3).removeClass("comm_form_validationFailed");
        }
        return !hasErr;
    });
};

$(function(){
    new EBE_FormManager();
});