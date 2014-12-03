var EBE_AppendToShoppingcarManager = function(appendFn){
    var goodsNoEls = $(".mainPanel table tbody tr").find("td:eq(1)");
    var appendNormalBtnEls = $(".mainPanel table tbody tr td ").find("a:eq(0)");
    var appendMobileBtnEls = $(".mainPanel .mobileBlock .bottomRow").find("a:eq(1)");

    appendNormalBtnEls.click(function(){
        appendHandler(  appendNormalBtnEls.index(this) );
    });
    appendMobileBtnEls.click(function(){
        appendHandler(  appendMobileBtnEls.index(this) );
    });


    function appendHandler(index){
        appendFn(goodsNoEls.eq(index).text(),appendNormalBtnEls.eq(index).attr("iid"));
    }
};

$(function(){
    new EBE_AppendToShoppingcarManager(function(orderID,iid){
        if( confirm("是否把商品："+orderID+" 加入购物车?") ){
            console.log("商品ID",iid);
            //请求服务器

            //服务器添加成功后，更新到购物车
            G_shoppingCar.addGoods({
                "imgUrl":"../public/source/shoppingCar/001.jpg",
                "name":"xxx",
                "size":"尺寸:M",
                "price":"￥11",
                "num":"数量:2",
                "color":"颜色:Red",
                "id":"id__01"
            });
        }
    });

});