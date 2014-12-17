var htAjax1 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/1.js",
	htOption: {
		type: "xhr",
		method: "get"
	}
};

var htAjax2 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/2.js",
	htOption: {
		type: "xhr",
		method: "get"
	}
};

var htAjax3 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/3.js",
	htOption: {
		type: "xhr",
		method: "get"
	},
	htParameter: {
		foo: "bar"
	}
};

var htAjax4 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/4.js",
	htOption: {
		type: "xhr",
		method: "get"
	}
};

var htAjax5 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/5.js",
	htOption: {
		type: "xhr",
		method: "get"
	}
};

var htAjax6 = {
	sUrl: "../demo/jindo.MultipleAjaxRequest/6.js",
	htOption: {
		type: "xhr",
		method: "get"
	},
	htParameter: {
		foo: "bar"
	}
};
		
var oMultipleAjaxRequest = new jindo.MultipleAjaxRequest();		
			
module("", {
	setup : function() {
	}
});

test("잘못된 sMode 옵션 설정시 request()", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "bad");
	oMultipleAjaxRequest.detachAll();
	
	ok(!oMultipleAjaxRequest.request(htAjax1), "request()는 false를 리턴한다.");
	ok(!oMultipleAjaxRequest.isRequesting(), "요청중이 아니어야한다.");
});

test("request() (serial)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "serial");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		start: function(oCustomEvent) {
			ok(this.isRequesting() && !this.request(htAjax1), "요청중에는 새로운 요청을 시작할 수 없다. (request()는 false를 리턴한다.)");
		},
		beforeEachRequest: function(oCustomEvent){
		},
		afterEachResponse: function(oCustomEvent){
			aResponseAjax.push(oCustomEvent.oAjax);
		},
		complete: function(oCustomEvent){
			start();
			ok(!oMultipleAjaxRequest.isRequesting(), "complete 커스텀이벤트 발생시 isRequesting은 false를 리턴. (요청중이 아니어야한다.)");
			ok(aResponseAjax.length == 6, "6개의 응답을 받아야한다.");
			ok(aResponseAjax[0]._url == htAjax1.sUrl && 
			aResponseAjax[1]._url == htAjax2.sUrl && 
			aResponseAjax[2]._url == htAjax3.sUrl && 
			aResponseAjax[3]._url == htAjax4.sUrl && 
			aResponseAjax[4]._url == htAjax5.sUrl && 
			aResponseAjax[5]._url == htAjax6.sUrl, "6개의 응답이 모두 요청된 순서대로 받아져야한다.");
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("request() (parallel)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "parallel");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		start: function(oCustomEvent) {
			//console.log(oCustomEvent);
		},
		beforeEachRequest: function(oCustomEvent){
			//console.log(oCustomEvent);
		},
		afterEachResponse: function(oCustomEvent){
			aResponseAjax.push(oCustomEvent.oAjax);
		},
		complete: function(oCustomEvent){
			//console.log(oCustomEvent);
			//jindo.$Element("log").append(jindo.$Element("<h5>").html("Total : " + (jindo.$Date().time() - nStart) + "ms, " + oCustomEvent.aResponse.length + "개의 응답완료"));
			start();
			ok(aResponseAjax.length == 6, "6개의 응답을 받아야한다.");
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 start stop() (serial)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "serial");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		start: function(oCustomEvent){
			ok(true);
			oCustomEvent.stop();
			start();
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 beforeEachRequest stop()(serial)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "serial");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		beforeEachRequest: function(oCustomEvent){
			if (oCustomEvent.nIndex == 2){
				ok(true);
				oCustomEvent.stop();
				start();
			}
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 afterEachResponse stop()(serial)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "serial");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		afterEachResponse: function(oCustomEvent){
			if (oCustomEvent.nIndex == 2){
				ok(true);
				oCustomEvent.stop();
				start();
			}
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 start stop() (parallel)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "parallel");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		start: function(oCustomEvent){
			ok(true);
			oCustomEvent.stop();
			start();
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 beforeEachRequest stop()(parallel)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "parallel");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		beforeEachRequest: function(oCustomEvent){
			if (oCustomEvent.nIndex == 2){
				ok(true);
				oCustomEvent.stop();
				start();
			}
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});

test("커스텀이벤트 afterEachResponse stop()(parallel)", function(){
	var aResponseAjax = [];
	oMultipleAjaxRequest.option("sMode", "parallel");
	oMultipleAjaxRequest.detachAll();
	oMultipleAjaxRequest.attach({
		afterEachResponse: function(oCustomEvent){
			if (oCustomEvent.nIndex == 2){
				ok(true);
				oCustomEvent.stop();
				start();
			}
		}
	});
	
	stop();
	oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjax3, htAjax4, htAjax5, htAjax6], { sRequestName : "three request" });
});
