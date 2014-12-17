var oNumberFormatter = new jindo.NumberFormatter(jindo.$('foo'));

module("", {
	setup : function() {
	}
});
test("3자리마다 ,찍힌 숫자 형태로 변경", function(){
	oNumberFormatter.attach({
		'beforeChange' : function(oCustomEvent) {
			//oCustomEvent.sText = oCustomEvent.sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
		},
		'change' : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(oCustomEvent.elInput.value == "123,456,789", "'0test12a34으하하56789'를 입력하면 숫자가아닌 문자는 모두 제거 되고 '123,456,789'로 변경된다.")
			start();
		}
	});
	
	stop();
	jindo.$("foo").focus();
	jindo.$("foo").value = "0test12a34으하하56789";
	jindo.$Element("foo").fireEvent("keydown", { keyCode : 13 }).fireEvent("keyup", { keyCode : 13 }).fireEvent("input", { keyCode : 13 });
});

test("3자리마다 ,찍힌 숫자 형태로 변경 (소수점 2째자리까지 표시. 입력값에는 소수점 없음)", function(){
	oNumberFormatter.option("nDecimalPoint", 2);
	oNumberFormatter.attach({
		'beforeChange' : function(oCustomEvent) {
			//oCustomEvent.sText = oCustomEvent.sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
		},
		'change' : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(oCustomEvent.elInput.value == "12,345", "'000test12a34으하하5'를 입력하면 숫자가아닌 문자는 모두 제거 (앞부분의 0 제거)되고 '12,345'로 변경된다.")
			start();
		}
	});
	
	stop();
	jindo.$("foo").focus();
	jindo.$("foo").value = "000test12a34으하하5";
	jindo.$Element("foo").fireEvent("keydown", { keyCode : 13 }).fireEvent("keyup", { keyCode : 13 }).fireEvent("input", { keyCode : 13 });
});

test("3자리마다 ,찍힌 숫자 형태로 변경 (소수점 2째자리까지 표시)", function(){
	oNumberFormatter.option("nDecimalPoint", 2);
	oNumberFormatter.attach({
		'beforeChange' : function(oCustomEvent) {
			//oCustomEvent.sText = oCustomEvent.sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
		},
		'change' : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(oCustomEvent.elInput.value == "123,456,789.25", "'000test12a34으하하56789.25'를 입력하면 숫자가아닌 문자는 모두 제거 (앞부분의 0 제거)되고 '123,456,789.25'로 변경된다.")
			start();
		}
	});
	
	stop();
	jindo.$("foo").focus();
	jindo.$("foo").value = "000test12a34으하하56789.25.15";
	jindo.$Element("foo").fireEvent("keydown", { keyCode : 13 }).fireEvent("keyup", { keyCode : 13 }).fireEvent("input", { keyCode : 13 });
});
test("앞자리가 0으로 시작한 경우 정상적으로 동작해야 한다.", function(){
	oNumberFormatter.option("nDecimalPoint", 2);
	oNumberFormatter.attach({
		'beforeChange' : function(oCustomEvent) {
			//oCustomEvent.sText = oCustomEvent.sText.replace(new RegExp('[^0-9' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
		},
		'change' : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(oCustomEvent.elInput.value == "0.2", "0.2가 나와야 한다.")
			start();
		}
	});
	
	stop();
	jindo.$("foo").focus();
	jindo.$("foo").value = "0.2";
	jindo.$Element("foo").fireEvent("keydown", { keyCode : 13 }).fireEvent("keyup", { keyCode : 13 }).fireEvent("input", { keyCode : 13 });
});
