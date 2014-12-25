var EBE_ModuleSwitchManage = function( infos){
    var switchBtnEl = $(".toQuestion a");
    var moduleEl01 = $(".module01");
    var moduleEl02 = $(".module02");
    var index  = 0;

    switchBtnEl.click(function(){
        if(index == 0){
            index = 1;
            moduleEl01.hide();
            moduleEl02.show();
        }else{
            index = 0;
            moduleEl01.show();
            moduleEl02.hide();
        }
        switchBtnEl.text( infos[index] );
    });
}
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
    var formEl = $(".module02 form");
    var inputEls = formEl.find("select,textarea,input[type='text']");
    var warnBorderEls = formEl.find(".inputBorder,.inputText,.inputTextarea");

    console.log( inputEls );

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
        for(var i=0; i < 4;i++){
            if( $.trim( inputEls.eq(i).val() ) == "" ){
                hasError = true;
                warnBorderEls.eq(i).addClass("warn");
            }else{
                warnBorderEls.eq(i).removeClass("warn");
            }
        }
        return !hasError;
    });
};

$(function(){
    new EBE_ModuleSwitchManage(["创建工单","查看列表"]);
    new EBE_FileUploadManager();
    new EBE_FormManager();
});