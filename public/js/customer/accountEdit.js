var EBE_EditManager = function(){
    var eMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var passwordReg = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/i;
    var tInputEls =$(".comm_form_formList input[type='text'],input[type='password']");
    var tBorderEls =$(".comm_form_formList .inputText");
    var fNameEl = tInputEls.eq(0);
    var fNameBorderEl = tBorderEls.eq(0);
    var lNameEl = tInputEls.eq(1);
    var lNameBorderEl = tBorderEls.eq(1);
    var eMailEl = tInputEls.eq(2);
    var eMailBorderEl = tBorderEls.eq(2);
    var curPasswordEl = tInputEls.eq(3);
    var curPasswordBorderEl = tBorderEls.eq(3);
    var passwordEl = tInputEls.eq(4);
    var passwordBorderEl = tBorderEls.eq(4);
    var conPasswordEl = tInputEls.eq(5);
    var conPasswordBorderEl = tBorderEls.eq(5);

    var extraPanelEl = $(".extraPanel");
    var extraBtnEl = $(".comm_form_formList input[type='checkbox']");
    if( extraBtnEl.prop("checked") ){
        extraPanelEl.show();
    }else{
        extraPanelEl.hide();
    }
    extraBtnEl.change(function(){
        if( extraBtnEl.prop("checked") ){
            extraPanelEl.show();
        }else{
            extraPanelEl.hide();
        }
    });

    $(".comm_contentMainPanel form").submit(function(){
        var hasErr= false;
        if( $.trim(fNameEl.val()) == "" ){
            hasErr = true;
            fNameBorderEl.addClass("comm_form_validationFailed");
        }else{
            fNameBorderEl.removeClass("comm_form_validationFailed");
        }
        if( $.trim(lNameEl.val()) == "" ){
            hasErr = true;
            lNameBorderEl.addClass("comm_form_validationFailed");
        }else{
            lNameBorderEl.removeClass("comm_form_validationFailed");
        }
        if( !eMailReg.test( $.trim(eMailEl.val()) ) ){
            hasErr = true;
            eMailBorderEl.addClass("comm_form_validationFailed");
        }else{
            eMailBorderEl.removeClass("comm_form_validationFailed");
        }

        if( extraBtnEl.prop("checked") ){
            if( !passwordReg.test( curPasswordEl.val() ) ){
                hasErr = true;
                curPasswordBorderEl.addClass("comm_form_validationFailed");
            }else{
                curPasswordBorderEl.removeClass("comm_form_validationFailed");
            }
            var tErr = false;
            if( !passwordReg.test( passwordEl.val() ) ){
                tErr = true;
                passwordBorderEl.addClass("comm_form_validationFailed");
            }else{
                passwordBorderEl.removeClass("comm_form_validationFailed");
            }
            if( !passwordReg.test( conPasswordEl.val())  ){
                tErr = true;
                conPasswordBorderEl.addClass("comm_form_validationFailed");
            }else{
                conPasswordBorderEl.removeClass("comm_form_validationFailed");
            }
            if( !tErr ){
                if( conPasswordEl.val() != passwordEl.val() ){
                    tErr = true;
                    conPasswordBorderEl.addClass("comm_form_validationFailed");
                }else{
                    conPasswordBorderEl.removeClass("comm_form_validationFailed");
                }
            }
            hasErr |= tErr;
        }
        return !hasErr;
    });
};

$(function(){
    new EBE_EditManager();
});
