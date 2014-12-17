var oTextRange = new jindo.TextRange(jindo.$("foo"));
		
module("", {
	setup : function() {
		jindo.$("foo").value = "0123456789";
	}
});
test("hasFocus()", function(){
	ok(oTextRange.hasFocus() == false, "hasFocus()는 Text Input의 현재 포커스 여부를 리턴한다.");
	jindo.$("foo").focus();
	stop();
	setTimeout(function(){
		start();
		ok(oTextRange.hasFocus() == true, "hasFocus()는 Text Input의 현재 포커스 여부를 리턴한다.");
	}, 50);
});
test("getSelection()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		start();
		var aSelection = oTextRange.getSelection();
		ok(aSelection instanceof Array, "getSelection() 메소드는 배열을 리턴한다.");
		ok(aSelection.length == 2, "배열의 길이는 2이다.");
		ok(typeof aSelection[0] == "number" && typeof aSelection[1] == "number", "배열의 각 요소는 number 타입이다.");
	}, 50);
});
test("setSelection()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		start();
		oTextRange.setSelection(0, 10);
		var aSelection = oTextRange.getSelection();
		ok(aSelection[0] == 0 && aSelection[1] == 10, "setSelection(0, 10)을 수행후 getSelection()의 리턴값은 [0, 10] 이다.");
	}, 50);
});
test("copy()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		start();
		oTextRange.setSelection(1, 6);
		ok(oTextRange.copy() == "12345", "setSelection(1, 6)을 수행후 copy()의 리턴값은 '12345' 이다.");
	}, 50);
});
test("cut()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		start();
		oTextRange.setSelection(1, 6);
		ok(oTextRange.cut() == "12345" && jindo.$("foo").value == "06789", "setSelection(1, 6)을 수행후 cut()의 리턴값은 '12345'이고 변경된 값은 '06789' 이다.");
	}, 50);
});
test("paste()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		start();
		oTextRange.setSelection(1, 6);
		oTextRange.paste("abcde");
	ok(jindo.$("foo").value == "0abcde6789", "setSelection(1, 6)을 수행후 paste('abcde'를 수행하면 변경된 값은 '0abcde6789' 이다.");
	}, 50);
});
test("deactivate()", function(){
	stop();
	jindo.$("foo").blur();
	setTimeout(function(){
		oTextRange.deactivate();
		jindo.$("foo").focus();
		start();
		ok(oTextRange.hasFocus() == false, "deactivate()가 수행되면 더이상 focus, blur에 대한 이벤트핸들러가 수행되지 않는다.");
	}, 50);
});
