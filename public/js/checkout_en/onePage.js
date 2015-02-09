var EBE_ModuleBase = function(clazzname){
    this.el = $(".mainPanel .checkoutProcessBlock "+clazzname );
    this.editBtnEl = this.el.find(".titleBar a");
    this.loadingEl = this.el.find(".operationBlock .loadingRow");
    this.index = -1;
    this.enable = true;
    this.editBtnClickFn = null;
    this.nextFn = null;
};
(function(){
    this.superInit = function(){
        var that = this;
        this.editBtnEl.click(function(){
            that.editBtnClickFn( that.index );
        });
    };
    this.getData = function(){
        return null;
    };
    this.setAllow = function(){
        this.el.removeClass("action");
        this.el.addClass("allow");
    };
    this.setDefault = function(){
        this.el.removeClass("action");
        this.el.removeClass("allow");
    };
    this.setAction = function(){
        this.loadingEl.css("visibility","hidden");
        this.el.removeClass("allow");
        this.el.addClass("action");
    };

}).call(EBE_ModuleBase.prototype);
//--
var EBE_LoginModule = function(editClickFn,patterns){
    EBE_ModuleBase.call(this,".login");
    this.editBtnClickFn = editClickFn;
    this.role = "";//guest register
    this.leftErrMessage = "";
    this.loginFn = null;
    this.patterns = patterns;
    this.init();
};
EBE_LoginModule.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        if( this.el.length == 0){
            this.enable = false;
            return;
        }
        this.build();
        this.superInit();
        if( this.leftInputEls.eq(0).prop("checked") ){
            this.role = "guest";
        }
        if( this.leftInputEls.eq(1).prop("checked") ){
            this.role = "register";
        }
        var that = this;
        this.leftInputEls.change(function(){
            var tIndex = that.leftInputEls.index(this);
            that.role = tIndex==0?"guest":"register";
        });
        this.leftInputLabelEls.click(function(){
            var tIndex = that.leftInputLabelEls.index(this);
            that.leftInputEls.eq(tIndex).prop("checked",true);
            that.role = tIndex==0?"guest":"register";
        });
        this.leftContinueEl.click(function(){
            if( that.role == ""){
                alert( that.leftErrMessage );
                return;
            }else{
                that.loadingEl.show();
                that.nextFn( that.role );
                that.loadingEl.css("visibility","visible");
            }
        });
        this.loginFormEl.submit(function(){
            var result = true;
            var name = $.trim( that.loginInputEls.eq(0).val() );
            var password = $.trim( that.loginInputEls.eq(1).val() );
            if( !that.patterns.email.test( name ) ){
                result = false;
                that.loginWarnEls.eq(0).css("visibility","visible");
            }else{
                that.loginWarnEls.eq(0).css("visibility","hidden");
            }
            if( !that.patterns.password.test( password ) ){
                result = false;
                that.loginWarnEls.eq(1).css("visibility","visible");
            }else{
                that.loginWarnEls.eq(1).css("visibility","hidden");
            }
            return result;
        });
    };
    this.setLoginError = function(err){
        this.errEl.show();
        this.errTextEl.text(err);
    };
    this.build = function(){
        this.leftInputEls = this.el.find(".registerBlock ul input");
        this.leftInputLabelEls = this.el.find(".registerBlock ul span");
        this.leftContinueEl = this.el.find(".registerBlock a");

        this.errEl = this.el.find(".loginBlock .error");
        this.errTextEl = this.el.find(".loginBlock .error span");

        this.loginFormEl = this.el.find("form");
        this.loginInputEls = this.el.find(".inputUnit input");
        this.loginWarnEls = this.el.find(".inputUnit .warn");

    };
}).call(EBE_LoginModule.prototype);

var EBE_BillingModule_Unlogined = function(editClickFn,patterns){
    EBE_ModuleBase.call(this,".billingInformation");
    this.editBtnClickFn = editClickFn;
    this.patterns = patterns;
    this.role= "";
    this.shipTo = ""; //billing different
    this.init();
};
EBE_BillingModule_Unlogined.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        if( this.shipRadioEls.eq(0).prop("checked") ){
            this.shipTo = "billing";
        }
        if( this.shipRadioEls.eq(1).prop("checked") ){
            this.shipTo = "different";
        }
        var that = this;
        this.shipRadioEls.change(function(){
            var tIndex = that.shipRadioEls.index(this);
            that.shipTo = tIndex==0?"billing":"different";
        });
        this.shipRadioLabelEls.click(function(){
            var tIndex = that.shipRadioLabelEls.index(this);
            that.shipRadioEls.eq(tIndex).prop("checked",true);
            that.shipTo = tIndex==0?"billing":"different";
        });
        this.continueEl.click(function(){
            if( !that.verify() ){ return;}
            var tData = that.getData();
            tData[ that.shipRadioEls.attr("name") ] = that.shipRadioEls.filter(":checked").val();
            that.nextFn( tData , that.shipRadioEls.eq(0).prop("checked")  ,false );
            that.loadingEl.css("visibility","visible");
        });
    };
    this.getCopyData = function(){
        var data = {};
        var i,name,inputEl;
        var length = this.inputEls.length - (this.role=="register"?0:2);
        for(var i=0; i< length;i++){
            inputEl = this.inputEls.eq(i);
            name = inputEl.attr("name");
            name = name.substring( name.indexOf("[")+1, name.lastIndexOf("]")  );
            data[ name ] = inputEl.val();
        }
        return data;
    };
    this.getData = function(){
        var data = {};
        var i,inputEl;
        var length = this.inputEls.length - (this.role=="register"?0:2);
        for(i=0; i< length;i++){
            inputEl = this.inputEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        for( i = 0; i < this.inputHiddenEls.length ;i++){
            inputEl = this.inputHiddenEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        return data;
    };
    this.verify = function(){
        var i,index,result = true;
        var inputIndexs = [0,1,4,5,6,7,8,9];
        for( i=0; i < inputIndexs.length ;i++ ){
            index = inputIndexs[i];
            if( $.trim( this.inputEls.eq(index).val()) == "" ){
                result = false;
                this.warnEls.eq(index).css("visibility","visible");
            }else{
                this.warnEls.eq(index).css("visibility","hidden");
            }
        }
        if( !this.patterns.email.test( this.inputEls.eq(3).val()) ){
            result = false;
            this.warnEls.eq(3).css("visibility","visible");
        }else{
            this.warnEls.eq(3).css("visibility","hidden");
        }
        if( this.role == "guest"){ return result;}
        var pw = true;
        if( !this.patterns.password.test( this.inputEls.eq(11).val())  ){
            pw = false;
            this.warnEls.eq(11).css("visibility","visible");
        }else{
            this.warnEls.eq(11).css("visibility","hidden");
        }
        if( $.trim( this.inputEls.eq(12).val()) !=  $.trim( this.inputEls.eq(11).val()) ){
            pw = false;
            this.warnEls.eq(12).css("visibility","visible");
        }else{
            this.warnEls.eq(12).css("visibility","hidden");
        }
        return result & pw;
    };
    this.setRole = function(role){
        this.role = role;
        if(this.role == "guest"){
            this.registerEls.hide();
        }else{
            this.registerEls.show();
        }
    };
    this.build = function(){
        this.inputEls = this.el.find("input[type=text],input[type=password],select");
        this.inputHiddenEls = this.el.find("input[type=hidden]");
        this.warnEls = this.el.find(".inputUnit .warn");
        this.registerEls = this.el.find(".register");
        this.shipRadioEls = this.el.find("input[type=radio]");
        this.shipRadioLabelEls = this.el.find(".addressRow span");
        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_BillingModule_Unlogined.prototype);
var EBE_BillingModule_Logined = function(editClickFn,patterns){
    EBE_ModuleBase.call(this,".billingInformation");
    this.editBtnClickFn = editClickFn;
    this.patterns = patterns;
    this.shipTo = ""; //billing different
    this.init();
};
EBE_BillingModule_Logined.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        this.updateStatus();
        var that = this;
        this.addressSelectorEl.change(function(){
            that.updateStatus();
        });
        this.continueEl.click(function(){
            if( that.addressSelectorEl.val() == "" ){
                if( !that.verify() ){ return;}
                that.nextFn( that.getAllData() , that.shipRadioEls.eq(0).prop("checked"),
                    that.saveInputEl.prop("checked") );
                that.loadingEl.css("visibility","visible");
            }else{
                that.nextFn( that.getAllData(), that.shipRadioEls.eq(0).prop("checked"),false );
                that.loadingEl.css("visibility","visible");
            }
        });
    };
    this.getData = function(){
        var selectValue = this.addressSelectorEl.val();
        if( selectValue == ""){
            var data = {};
            var i,inputEl;
            for( i=0; i< this.inputEls.length;i++){
                inputEl = this.inputEls.eq(i);
                data[ inputEl.attr("name") ] = inputEl.val();
            }
            return data;
        }
        return selectValue;
    };
    this.getAllData = function(){
        var data = {};
        var i,inputEl;
        for( i=0; i< this.inputEls.length;i++){
            inputEl = this.inputEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        for( i = 0; i < this.inputHiddenEls.length ;i++){
            inputEl = this.inputHiddenEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        data[this.addressSelectorEl.attr("name")]= this.addressSelectorEl.val();
        data[this.saveInputEl.attr("name")]= this.saveInputEl.prop("checked");
        data[this.shipRadioEls.attr("name") ] = this.shipRadioEls.filter(":checked").val();
        return data;
    };
    this.getCopyData = function(){
        var selectValue = this.addressSelectorEl.val();
        if( selectValue == ""){
            var data = {};
            var i,name,inputEl;
            for( i=0; i< this.inputEls.length;i++){
                inputEl = this.inputEls.eq(i);
                name = inputEl.attr("name");
                name = name.substring( name.indexOf("[")+1, name.lastIndexOf("]")  );
                data[ name ] = inputEl.val();
            }
            for( i = 0; i < this.inputHiddenEls.length ;i++){
                inputEl = this.inputHiddenEls.eq(i);
                data[ inputEl.attr("name") ] = inputEl.val();
            }
            return data;
        }
        return selectValue;
    };
    this.verify = function(){
        var i,index,result = true;
        var inputIndexs = [0,1,3,4,5,6,7,8];
        for( i=0; i < inputIndexs.length ;i++ ){
            index = inputIndexs[i];
            if( $.trim( this.inputEls.eq(index).val()) == "" ){
                result = false;
                this.warnEls.eq(index).css("visibility","visible");
            }else{
                this.warnEls.eq(index).css("visibility","hidden");
            }
        }
        return result;
    };
    this.updateStatus = function(){
        if( this.addressSelectorEl.val() == "" ){
            this.inputUnitEls.show();
            this.saveEl.show();
        }else{
            this.inputUnitEls.hide();
            this.saveEl.hide();
        }
    };
    this.build = function(){
        this.addressSelectorEl = this.el.find("select:eq(0)");
        this.inputEls = this.el.find("input[type=text],input[type=password],select:gt(0)");
        this.inputHiddenEls = this.el.find("input[type=hidden]");
        this.warnEls = this.el.find(".inputUnit .warn:gt(0)");

        this.inputUnitEls = this.el.find(".inputUnit:gt(0)");

        this.saveEl = this.el.find(".saveRow");
        this.saveInputEl = this.el.find(".saveRow input");
        this.saveLabelEl = this.el.find(".saveRow span");

        this.shipRadioEls = this.el.find("input[type=radio]");
        this.shipRadioLabelEls = this.el.find(".addressRow span");
        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_BillingModule_Logined.prototype);

var EBE_ShippingModule_Unlogined = function(editClickFn,patterns){
    EBE_ModuleBase.call(this,".shippingInformation");
    this.editBtnClickFn = editClickFn;
    this.patterns = patterns;
    this.copyFn = null;
    this.init();
};
EBE_ShippingModule_Unlogined.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        var that = this;
        this.useCheckboxLabelEl.click(function(){
            that.copyInputEl.prop("checked", !that.copyInputEl.prop("checked") );
            that.copyByBilling();
        });
        this.copyInputEl.change(function(){
            that.copyByBilling();
        });
        this.continueEl.click(function(){
            if( !that.verify() ){ return;}
            var tData =  that.getData();
            tData[that.copyInputEl.attr("name")] = that.copyInputEl.prop("checked");
            that.nextFn( tData,false );
            that.loadingEl.css("visibility","visible");
        });
    };
    this.copyByBilling = function(){
        if( this.copyInputEl.prop("checked") ){
            this.setCopyData( this.copyFn() );
        }
    };
    this.setCopyData = function(data){
        var i,name,inputEl;
        for(i=0; i < this.inputEls.length ;i++ ){
            inputEl = this.inputEls.eq(i);
            name = inputEl.attr("name");
            name = name.substring( name.indexOf("[")+1, name.lastIndexOf("]") );
            inputEl.val( data[name ] );
        }
    };
    this.getData = function(){
        var data = {};
        var i,inputEl;
        var length = this.inputEls.length;
        for(var i=0; i< length;i++){
            inputEl = this.inputEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        return data;
    };
    this.getAllData = function(){
        var tData =  this.getData();
        tData[this.copyInputEl.attr("name")] = this.copyInputEl.prop("checked");
        return tData;
    };
    this.verify = function(){
        var i,index,result = true;
        var inputIndexs = [0,1,3,4,5,6,7,8];
        for( i=0; i < inputIndexs.length;i++){
            index = inputIndexs[i];
            if( $.trim( this.inputEls.eq(index).val()) == "" ){
                result = false;
                this.warnEls.eq(index).css("visibility","visible");
            }else{
                this.warnEls.eq(index).css("visibility","hidden");
            }
        }
        return result;
    };
    this.build = function(){
        this.inputEls = this.el.find("input[type=text],select");
        this.warnEls = this.el.find(".inputUnit .warn");
        this.copyInputEl = this.el.find("input[type=checkbox]");
        this.useCheckboxLabelEl = this.el.find(".operationRow span");
        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_ShippingModule_Unlogined.prototype);
var EBE_ShippingModule_Logined = function(editClickFn,patterns){
    EBE_ModuleBase.call(this,".shippingInformation");
    this.editBtnClickFn = editClickFn;
    this.patterns = patterns;
    this.copyFn = null;
    this.init();
};
EBE_ShippingModule_Logined.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        this.updateStatus();
        var that = this;
        this.addressSelectorEl.change(function(){
            that.updateStatus();
            that.copyInputEl.prop("checked",false);
        });
        this.copyInputEl.change(function(){
            that.copyByBilling();
        });
        this.continueEl.click(function(){
            if( that.addressSelectorEl.val() == "" ){
                if( !that.verify() ){ return;}
                that.nextFn( that.getAllData(),that.saveInputEl.prop("checked") );
                that.loadingEl.css("visibility","visible");
            }else{
                that.nextFn( that.getAllData(),false );
                that.loadingEl.css("visibility","visible");
            }
        });
    };
    this.copyByBilling = function(){
        if( this.copyInputEl.prop("checked") ){
            this.setCopyData( this.copyFn() );
        }
    };
    this.setCopyData = function(data){
        if( $.type(data) === "string" ){
            this.addressSelectorEl.val(data);
        }else{
            this.addressSelectorEl.val("");
            var i,name,inputEl;
            for(i=0; i < this.inputEls.length ;i++ ){
                inputEl = this.inputEls.eq(i);
                name = inputEl.attr("name");
                name = name.substring( name.indexOf("[")+1, name.lastIndexOf("]") );
                inputEl.val( data[ name ] );
            }
        }
        this.updateStatus();
    };
    this.updateStatus = function(){
        if( this.addressSelectorEl.val() == "" ){
            this.inputUnitEls.show();
            this.saveEl.show();
        }else{
            this.inputUnitEls.hide();
            this.saveEl.hide();
        }
    };
    this.getData = function(){
        var selectValue = this.addressSelectorEl.val();
        if( selectValue == ""){
            var data = {};
            var i,inputEl;
            for( i=0; i< this.inputEls.length;i++){
                inputEl = this.inputEls.eq(i);
                data[ inputEl.attr("name") ] = inputEl.val();
            }
            return data;
        }
        return selectValue;
    };
    this.getAllData = function(){
        var data = {};
        var i,inputEl;
        for( i=0; i< this.inputEls.length;i++){
            inputEl = this.inputEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        data[this.addressSelectorEl.attr("name")]= this.addressSelectorEl.val();
        data[this.saveInputEl.attr("name")]= this.saveInputEl.prop("checked");
        data[this.copyInputEl.attr("name")] = this.copyInputEl.prop("checked");
        return data;
    };
    this.verify = function(){
        var i,index,result = true;
        var inputIndexs = [0,1,3,4,5,6,7,8];
        for( i=0; i < inputIndexs.length ;i++ ){
            index = inputIndexs[i];
            if( $.trim( this.inputEls.eq(index).val()) == "" ){
                result = false;
                this.warnEls.eq(index).css("visibility","visible");
            }else{
                this.warnEls.eq(index).css("visibility","hidden");
            }
        }
        return result;
    };
    this.build = function(){
        this.addressSelectorEl = this.el.find("select:eq(0)");
        this.inputUnitEls = this.el.find(".inputUnit:gt(0)");
        this.inputEls = this.el.find("input[type=text],select:gt(0)");
        this.warnEls = this.el.find(".inputUnit .warn:gt(0)");

        this.saveEl = this.el.find(".operationRow div:eq(0)");
        this.saveInputEl = this.saveEl.find("input");
        this.saveLabelEl = this.saveEl.find("span");

        this.copyEl = this.el.find(".operationRow div:eq(1)");
        this.copyInputEl = this.copyEl.find("input");
        this.copyLabelEl = this.copyEl.find("span");

        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_ShippingModule_Logined.prototype);

var EBE_ShippingMethodModule = function(editClickFn){
    EBE_ModuleBase.call(this,".shippingMethod");
    this.editBtnClickFn = editClickFn;
    this.data = null;
    this.init();
};
EBE_ShippingMethodModule.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        var that = this;
        this.continueEl.click(function(){
            var inputEl = that.descriptEl.find("input[type=radio]:checked");
            if( inputEl.length == 0){
                alert( that.errMessage);
                return;
            }
            var data = {};
            data[ inputEl.attr("name") ] = inputEl.val();
            that.nextFn( data );
            that.loadingEl.css("visibility","visible");
        });
    };
    this.setData = function( data ){
        this.data = data;
        this.descriptEl.html( data );
    };
    this.build = function(){
        this.descriptEl = this.el.find(".descript");
        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_ShippingMethodModule.prototype);

var EBE_PaymentModule = function(editClickFn){
    EBE_ModuleBase.call(this,".paymentInformation");
    this.editBtnClickFn = editClickFn;
    this.isPop = false;
    this.typeIndex = -1;
    this.init();
};
EBE_PaymentModule.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        for(var i=0; i < this.typeEls.length;i++){
            if(  this.typeEls.eq(i).is(":checked") ){
                this.typeIndex = i;
                break;
            }
        }
        this.updateParamBlock();

        var that = this;
        this.typeLabelEls.click(function(){
            var tIndex = that.typeLabelEls.index(this);
            if(tIndex == that.typeIndex){return;}
            that.typeIndex = tIndex;
            that.typeEls.eq(tIndex).prop("checked",true);
            that.updateParamBlock();
        });
        this.typeEls.change(function(){
            that.typeIndex = that.typeEls.index(this);
            that.updateParamBlock();
        });

        this.continueEl.click(function(){
            if( that.typeIndex == -1 ){
                alert( that.errMessage );
                return;
            }
            if( that.typeIndex ==1 && !that.verify() ){return;}
            var typeEl = that.typeEls.filter(":checked");
            var tData = that.getData();
            if( typeEl.length > 0 ){
                tData[typeEl.attr("name")] = typeEl.val();
            }
            that.nextFn( tData );
            that.loadingEl.css("visibility","visible");
        });
        this.winEl.mousedown(function(){
            if( !that.isPop ){return;}
            that.popWindowEl.hide();
            that.isPop = false;
        }).resize(function(){
            if( !that.isPop ){return;}
            that.popWindowEl.hide();
            that.isPop = false;
        });
        this.popBtnEl.click(function(e){
            var offset = that.popBtnEl.offset();
            var top = offset.top + 20;
            var left = offset.left + 5;
            var winWidth = that.winEl.width();
            that.popWindowEl.show().css({"top":top,"left":left});
            that.isPop = true;
        });
    };
    this.updateParamBlock = function(){
        if( this.typeIndex == -1){return;}
        if( this.typeIndex == 0){
            this.creditParamEl.hide();
        }else{
            this.creditParamEl.show();
        }
    };
    this.getData = function(){
        var data = {};
        var i,inputEl;
        for(i=0; i < this.inputEls.length;i++){
            inputEl = this.inputEls.eq(i);
            data[ inputEl.attr("name") ] = inputEl.val();
        }
        return data;
    };
    this.verify = function(){
        var i,inputVal,result = true;
        for( i=0; i < this.inputEls.length;i++){
            inputVal = this.inputEls.eq(i).val();
            if( $.trim( inputVal ) == "" ){
                result = false;
                this.warnEls.eq(i).css("visibility","visible");
            }else{
                this.warnEls.eq(i).css("visibility","hidden");
            }
        }
        return result;
    };
    this.build = function(){
        this.bodyEl = $("body");
        this.winEl = $(window);

        this.typeEls = this.el.find(".typeBlock input[type=radio]");
        this.typeLabelEls = this.el.find(".typeBlock span");

        this.creditParamEl = this.el.find(".credit");
        this.inputEls = this.el.find(".paramBlock input[type=text],select");
        this.warnEls = this.el.find(".paramBlock .inputUnit .warn");

        this.continueEl = this.el.find(".continueButton");

        this.popBtnEl = this.el.find(".inputUnit .descript");
        this.popWindowEl = $(".popWindow");
    };
}).call(EBE_PaymentModule.prototype);

var EBE_ReviewModule = function(editClickFn){
    EBE_ModuleBase.call(this,".orderReview");
    this.editBtnClickFn = editClickFn;
    this.init();
};
EBE_ReviewModule.prototype = Object.create(EBE_ModuleBase.prototype);
(function(){
    this.init = function(){
        this.build();
        this.superInit();
        var that = this;
        this.continueEl.click(function(){
            that.loadingEl.css("visibility","visible");
            that.nextFn();
        });
    };
    this.stop = function(){
        this.loadingEl.css("visibility","hidden");
    };
    this.setData = function(data){
        this.listEls.find("li:gt(0)").remove();
        var i,tdEls,tdEl;
        var tableEl = $(data);
        var trEls = tableEl.find("tbody tr");
        for( i=0; i < trEls.length;i++ ){
            tdEls = trEls.eq(i).find("td");
            $("<li><div class='paramCol'><h1>"+ tdEls.eq(0).text() +"</h1>"+
            "<div>"+tdEls.eq(1).text()+"</div></div><div class='quantityCol'>"+ tdEls.eq(2).text() +"</div>"+
            "<div class='price'><b>"+tdEls.eq(3).text()+"</b></div></li>").appendTo(this.listEls);
        }
        trEls =  tableEl.find("tfoot tr");

        for(i=0; i <trEls.length-1 ;i++){
            tdEls = trEls.eq(i).find("td");
            if(tdEls.length!=2){
                $('<li><div class="label">'+ trEls.eq(i).find("th").text() +'</div><div class="priceCol">'+
                tdEls.eq(0).text() +'</div></li>').appendTo(this.totalBlockEl);
            }else{
                $('<li><div class="label">'+ tdEls.eq(0).text() +'</div><div class="priceCol">'+
                tdEls.eq(1).text() +'</div></li>').appendTo(this.totalBlockEl);
            }
        }
        tdEls = trEls.eq(trEls.length-1).find("td");
        $('<li><div class="label"><b>'+tdEls.eq(0).text()+'</b></div><div class="priceCol"><b>'+
        tdEls.eq(1).text()+'</b></div></li>').appendTo(this.totalBlockEl);
    };
    this.build = function(){
        this.listEls = this.el.find(".listBlock");
        this.totalBlockEl = this.el.find(".totalBlock");
        this.continueEl = this.el.find(".continueButton");
    };
}).call(EBE_ReviewModule.prototype);

var EBE_CheckOutManager = function(patterns){
    var i,modules = [];
    var currentIndex = 0;

    var loginModule = new EBE_LoginModule(changeModuleByEdit,patterns);
    var logined = !loginModule.enable;
    if( !logined ){
        modules.push(loginModule);
    }
    var billingModule = logined?new EBE_BillingModule_Logined(changeModuleByEdit,patterns):
        new EBE_BillingModule_Unlogined(changeModuleByEdit,patterns);
    modules.push(billingModule);
    var shippingModule = logined? new EBE_ShippingModule_Logined(changeModuleByEdit,patterns):
        new EBE_ShippingModule_Unlogined(changeModuleByEdit,patterns);
    modules.push(shippingModule);
    var shippingMethodModule = new EBE_ShippingMethodModule(changeModuleByEdit);
    modules.push(shippingMethodModule);
    var paymentModule = new EBE_PaymentModule(changeModuleByEdit);
    modules.push(paymentModule);
    var reviewModule = new EBE_ReviewModule(changeModuleByEdit);
    modules.push(reviewModule);

    for(i=0;i<modules.length;i++){
        modules[i].index = i;
    }
    shippingModule.copyFn = function(){
        return billingModule.getCopyData();
    };
    function changeModuleByEdit(index){
        currentIndex = index;
        for(var i=0; i < modules.length;i++){
            if( i < currentIndex){
                modules[i].setAllow();
            }else if( i > currentIndex ){
                modules[i].setDefault();
            }else{
                modules[i].setAction();
            }
        }
    };
    function nextModule(){
        if( !logined && currentIndex == 0){
            billingModule.setRole( loginModule.role );
        }
        changeModuleByEdit( currentIndex + 1);
    }
    function setError(err01,err02,err03){
        loginModule.leftErrMessage = err01;
        shippingMethodModule.errMessage = err02;
        paymentModule.errMessage = err03;
    }
    function setLoginError(err){
        loginModule.setLoginError(err);
    };

    function setUnloginedHandler(fn){
        loginModule.nextFn = fn;
    }
    function setBillingHandler(fn){
        billingModule.nextFn = fn;
    }
    function setShippingHandler(fn){
        shippingModule.nextFn = fn;
    }
    function setShippingMethodHandler(fn){
        shippingMethodModule.nextFn = fn;
    }
    function setPaymentHandler(fn){
        paymentModule.nextFn = fn;
    }
    function setSaveHandler(fn){
        reviewModule.nextFn = fn;
    }

    function setShippingMethodData(data){
        shippingMethodModule.setData(data);
    }
    function setReviewData(data){
        reviewModule.setData(data);
    }
    function copyBillingToShipping(){
        shippingModule.setCopyData(billingModule.getCopyData());
        shippingModule.copyInputEl.prop("checked",true);
    }
    function shippingGetData(){
        return shippingModule.getAllData();
    }
    function reviewStop(){
        reviewModule.stop();
    }

    return {
        "setError":setError,
        "setLoginError":setLoginError,
        "setUnloginedHandler":setUnloginedHandler,
        "setBillingHandler":setBillingHandler,
        "setShippingHandler":setShippingHandler,
        "setShippingMethodHandler":setShippingMethodHandler,
        "setPaymentHandler":setPaymentHandler,
        "setSaveHandler":setSaveHandler,
        "nextModule":nextModule,
        "setShippingMethodData":setShippingMethodData,
        "setReviewData":setReviewData,
        "copyBillingToShipping":copyBillingToShipping,
        "shippingGetData":shippingGetData,
        "reviewStop":reviewStop
    };
};

var countID =600;

var rateData = "<dl class='sp-methods'><dt>Flat Rate</dt><dd><ul><li><span class='no-display'><input name='shipping_method' type='radio' value='flatrate_flatrate' id='s_method_flatrate_flatrate' checked='checked'></span><label for='s_method_flatrate_flatrate'>Fixed<span class='price'>US$5.00</span></label></li></ul></dd></dl>";
var reviewData ='<table class="data-table" id="checkout-review-table"><colgroup><col>      <col width="1"><col width="1"><col width="1"></colgroup><thead><tr class="first last"><th rowspan="1">产品名</th><th colspan="1" class="a-center">价格</th><th rowspan="1" class="a-center">数量</th><th colspan="1" class="a-center">小计</th></tr></thead>      <tfoot><tr class="first"><td style="" class="a-right" colspan="3">小计</td><td style="" class="a-right last"><span class="price">US$4,446.00</span></td></tr><tr><th colspan="3" style="" class="a-right totals-rewards">折扣（75 points used）</th><td style="" class="a-right last"><span class="price">-US$1.50</span></td></tr><tr><td style="" class="a-right" colspan="3">运费和手续费 (Flat Rate - Fixed)</td><td style="" class="a-right last"><span class="price">US$20.00</span></td></tr><tr class="last"><td style="" class="a-right" colspan="3"><strong>总计</strong></td>  <td style="" class="a-right last"> <strong><span class="price">US$4,464.50</span></strong></td></tr></tfoot><tbody><tr class="first odd">  <td><h3 class="product-name">test---</h3></td>      <td class="a-right"><span class="cart-price"><span class="price">US$1.00</span>                  </span></td><td class="a-center">2</td>      <td class="a-right last"><span class="cart-price"><span class="price">US$2.00</span></span></td>      </tr><tr class="last even">  <td><h3 class="product-name">绿野仙踪组连体泳衣llll</h3></td>      <td class="a-right"><span class="cart-price"><span class="price">US$2,222.00</span>                  </span></td><td class="a-center">2</td>      <td class="a-right last"><span class="cart-price">                          <span class="price">US$4,444.00</span></span></td></tr></tbody></table>';



function getReviewData( size ){
    var i,arr = [];
    for( i=0; i < size;i++ ){
        arr.push({
            "name":"ABBY DEEP V TOP__" + countID,
            "color":"Color BLACK",
            "size":"Size S",
            "price":"$1,333.00",
            "QTY":"999",
            "subtotal":"$888,333.00"
        });
        countID++;
    }
    var totalData = [
        ["Subtotal","$5,919.00 "],
        ["Shipping & Handling (Select Shipping Method - FedEx 2-Day)","$9.00"],
        ["Grand Total","$939.00"]
    ];
    return {"list":arr,"total":totalData};
}

$(function(){
    var checkOutManager = new EBE_CheckOutManager({
        "email":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        "password": /^[a-zA-Z0-9!@#$%^&*]{1,16}$/i
    });

    checkOutManager.setError("请选择地区或以来宾身份结账!","请选择税率!","请选择支付方式!");

    checkOutManager.setUnloginedHandler(function(role){
        console.log( "未登录访问方式", role);
        //
        checkOutManager.nextModule();
    });
    checkOutManager.setBillingHandler(function(data,sameddress,isSave){
        console.log( "账单信息(数据/是否送货到同一地方/是否保存)", data,sameddress,isSave);
        //请求服务器
        if( sameddress ){
            checkOutManager.setShippingMethodData(rateData);
            checkOutManager.nextModule();
            checkOutManager.copyBillingToShipping();

            console.log("获取送货地址数据",checkOutManager.shippingGetData());
            //请求服务器
            checkOutManager.nextModule();
        }else{
            checkOutManager.nextModule();
        }
    });
    checkOutManager.setShippingHandler(function(data,isSave){
        console.log("送货地址信息(数据/是否保存)", data,isSave);
        //请求服务器

        checkOutManager.setShippingMethodData(rateData);
        checkOutManager.nextModule();
    });
    checkOutManager.setShippingMethodHandler(function(value){
        console.log("送货方式",value);
        if( value == undefined ){
            alert("请选择送货方式");
            return;
        }
        //
        checkOutManager.nextModule();
    });
    checkOutManager.setPaymentHandler(function(data){
        console.log("支付方式",data);
        //
        checkOutManager.setReviewData( reviewData );
        checkOutManager.nextModule();
    });
    checkOutManager.setSaveHandler(function(){
        console.log("流程完成");
        //
        checkOutManager.reviewStop();
    });
});