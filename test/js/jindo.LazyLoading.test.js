module("", {
	setup : function() {
	}
});
asyncTest("getLoaded() / load() / getScriptElement() / abort()", function(){
	var aLoaded = jindo.LazyLoading.getLoaded();
	ok(aLoaded instanceof Array, "getLoaded()는 배열을 리턴한다.");
	ok(aLoaded.length == 0, "로드된 js파일이 없으므로 배열의 길이는 0이다.");
	ok(typeof a == "undefined", "function.js 내에서 선언된 a함수를 가져올수 없다.");
	ok(jindo.LazyLoading.load("../demo/jindo.LazyLoading/function.js", function(){
		aLoaded = jindo.LazyLoading.getLoaded();
		ok(aLoaded instanceof Array, "getLoaded()는 배열을 리턴한다.");
		ok(aLoaded.length == 1, "function.js파일이 로드 배열의 길이는 1이다.");
		ok(aLoaded[0] == "../demo/jindo.LazyLoading/function.js", "배열의 첫번째 값은 'function.js'이다.");
		ok(typeof a == "function", "function.js 내에서 선언된 a함수를 가져올수 있다.");
		
		jindo.LazyLoading.load("../demo/jindo.LazyLoading/function.js", function(){
			start();
			aLoaded = jindo.LazyLoading.getLoaded();
			ok(aLoaded instanceof Array, "getLoaded()는 배열을 리턴한다.");
			ok(aLoaded.length == 1, "function.js파일이 로드 배열의 길이는 1이다.");
			ok(aLoaded[0] == "../demo/jindo.LazyLoading/function.js", "배열의 첫번째 값은 'function.js'이다.");
			ok(typeof a == "function", "function.js 내에서 선언된 a함수를 가져올수 있다.");
			ok(jindo.LazyLoading.getScriptElement("../demo/jindo.LazyLoading/function.js").tagName.toLowerCase() == "script", "getScriptElement는 script 엘리먼트를 리턴한다.");
			ok(!jindo.LazyLoading.abort("../demo/jindo.LazyLoading/function.js"), "function.js는 제대로 로드가 완료되었기 때문에 중단되지 않고 false를 리턴한다.");
		});
		
	}), "load() 메소드는 true를 리턴한다.");
});
asyncTest("콜백없이 load()시", function() {
	jindo.LazyLoading.load("../demo/jindo.LazyLoading/test.js", function() {
		//start(); -> test.js안에서 수행 
		ok(jindo.$A(jindo.LazyLoading.getLoaded()).has("../demo/jindo.LazyLoading/test.js"), true, "test.js파일은 getLoaded()로 리턴된 배열에 포함되어야한다.");
	});
});
asyncTest("잘못된 경로 load() / getLoading() / 로딩중인파일 다시 load() / abort()", function() {
	jindo.LazyLoading.load("http://wtfthereisnourllikethis/xxx.js");
	
	setTimeout(function(){
		start();
//		ok(!jindo.$A(jindo.LazyLoading.getLoaded()).has("http://wtfthereisnourllikethis/xxx.js"), "xxx.js파일은 getLoaded()로 리턴된 배열에 포함되어있지 않아야한다.");
		ok(jindo.$A(jindo.LazyLoading.getLoading()).has("http://wtfthereisnourllikethis/xxx.js"), "xxx.js파일은 getLoading()로 리턴된 배열에 포함되어야한다.");
		ok(!jindo.LazyLoading.load("http://wtfthereisnourllikethis/xxx.js"), "로딩중인 파일을 다시 load 수행시 false를 리턴한다.");
		ok(jindo.LazyLoading.abort("http://wtfthereisnourllikethis/xxx.js"), "로딩중인 파일을 abort()하면 true를 리턴한다.");
		ok(!jindo.$A(jindo.LazyLoading.getLoading()).has("http://wtfthereisnourllikethis/xxx.js"), "xxx.js파일은 getLoading()로 리턴된 배열에 포함되어있지 않아야한다.");
	}, 200);
});
