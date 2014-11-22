var CommentManger = function(errMessage){
    var formEl = $(".mainPanel form:eq(0)");
    var fInputEls = formEl.find("input");

    var textareaEls = $(".mainPanel textarea");
    var btnEls = $(".mainPanel .btnRow a");

    btnEls.click(function(){
        var index  = btnEls.index(this);
        var taEl = textareaEls.eq(index);
        if( $.trim(taEl.val()) == "" ){
            taEl.addClass("warn");
            alert(errMessage);
            return false;
        }else{
            taEl.removeClass("warn");
        }
        fInputEls.eq(0).val( taEl.attr("iid") );
        fInputEls.eq(1).val( taEl.val() );
        formEl.submit();
    });
};

$(function(){
    new CommentManger("请不要留空！");
});