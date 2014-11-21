var EBE_RadioManager = function(){
    var liEls = $(".mainPanel li>div");
    var inputEls = $(".mainPanel input[type='radio']");

    liEls.click(function(){
        inputEls.eq(liEls.index(this)).prop("checked",true);
    });
};
$(function(){
    new EBE_RadioManager();
})