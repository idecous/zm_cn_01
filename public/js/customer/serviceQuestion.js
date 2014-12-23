var EBE_FileUploadManager = function(){
    var fileInputEl = $(".comm_form_formList input[type='file']");
    var fileBtnEl = $(".comm_form_formList .fileBtn");
    var pathEl = $(".comm_form_formList .inputFile .filePathBlock span");

    fileBtnEl.click(function(){
        fileInputEl.click();
    });
    fileInputEl.change(function(){
        pathEl.text( fileInputEl.val() );
    });
};
var EBE_FormManager  = function(){
    var formEl = $(".comm_contentMainPanel form");
    var inputEls = formEl.find("select,textarea,input[type='text']");
    var warnBorderEls = formEl.find(".inputBorder,.inputText,.inputTextarea");

    var contactInputEls = formEl.find(".contact input");
    var contactSpanEls = formEl.find(".contact span");

    contactInputEls.focus(function(){
        var index  = contactInputEls.index(this);
        contactSpanEls.eq(index).hide();
    }).blur(function(){
        var index  = contactInputEls.index(this);
        if($.trim(  contactInputEls.eq(index).val() ) == "" ){
            contactSpanEls.eq(index).show();
        }
    });
    formEl.submit(function(){
        var hasError = false;
        for(var i=0; i < 5;i++){
            if( $.trim( inputEls.eq(i).val() ) == "" ){
                hasError = true;
                warnBorderEls.eq(i).addClass("warn");
            }else{
                warnBorderEls.eq(i).removeClass("warn");
            }
        }
        return !hasError;
    });
}


$(function(){
    new EBE_FileUploadManager();
    new EBE_FormManager();
});