var oFormatter = new jindo.Formatter(jindo.$('foo'));

module("", {
	setup : function() {
		
	}
});
test("Text Input의 문자열을 숫자만 남기고 제거하는 동작", function(){
	oFormatter.attach({
		'beforeChange' : function(oCustomEvent) {
			oCustomEvent.sText = oCustomEvent.sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
		},
		'change' : function(oCustomEvent) {
			ok(oCustomEvent.elInput.value == "1234", "'test12a34으하하'를 입력하면 숫자가아닌 문자는 모두 제거되고 '1234'로 변경된다.")
			start();
		}
	});
	
	stop();
	jindo.$("foo").focus();
	jindo.$("foo").value = "a333sdfasdfㅁㄴㅇㄹ";
	jindo.$("foo").value = "asㄴㄴㄴㄴ777fasdfㅁㄴㅇㄹ";
	jindo.$("foo").value = "test12a34으하하";
	jindo.$Element("foo").fireEvent("keydown", { keyCode : 13 }).fireEvent("keyup", { keyCode : 13 }).fireEvent("input", { keyCode : 13 });
});
