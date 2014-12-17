var oNumericStepper = new jindo.NumericStepper(jindo.$("number_stepper"), {
	nStep : 1,
	nMin : -5,	
	nMax : 5,
	nDefaultValue : 0,
	bUseMouseWheel : true
});
/*
.attach({
	overLimit : function(oCustomEvent) {
		alert("입력 가능 범위를 벗어났습니다.");
	}
});*/
			
module("", {
	setup : function() {
		oNumericStepper.reset();
	},
	teardown : function() {
		oNumericStepper.getInputElement().blur();
	}
});
test("getBaseElement()", function(){
	equal(oNumericStepper.getBaseElement(), jindo.$("number_stepper"), "getBaseElement() 메소드는 기준 엘리먼트를 리턴한다");
});
test("getInputElement()", function(){
	equal(oNumericStepper.getInputElement(), jindo.$$.getSingle("." + oNumericStepper.option("sClassPrefix") + "input"), "getInputElement() 메소드는 'input' 클래스명을 가지는 엘리먼트를 리턴한다");
});
test("getPlusElement()", function(){
	equal(oNumericStepper.getPlusElement(), jindo.$$.getSingle("." + oNumericStepper.option("sClassPrefix") + "plus"), "getPlusElement() 메소드는 'plus' 클래스명을 가지는 엘리먼트를 리턴한다");
});
test("getMinusElement()", function(){
	equal(oNumericStepper.getMinusElement(), jindo.$$.getSingle("." + oNumericStepper.option("sClassPrefix") + "minus"), "getMinusElement() 메소드는 'plus' 클래스명을 가지는 엘리먼트를 리턴한다");
});
test("getValue() / setValue() / reset()", function(){
	equal(oNumericStepper.getValue(), oNumericStepper.option("nDefaultValue"), "getValue()는 현재 설정된 input의 값을 가져온다.");
	oNumericStepper.setValue(5);
	equal(oNumericStepper.getValue(), 5, "setValue()는 input의 값을 설정한다.");
	oNumericStepper.reset();
	equal(oNumericStepper.getValue(), oNumericStepper.option("nDefaultValue"), "reset()는 현재 설정된 input의 값을 'nDefaultValue'옵션으로 설정된 값으로 초기화한다.");
});
asyncTest("isFocused()", function(){
	equal(oNumericStepper.isFocused(), false, "isFocused()는 input 엘리먼트의 포커스 여부를 가져온다.");
	oNumericStepper.getInputElement().focus();
	setTimeout(function(){
		start();
		equal(oNumericStepper.isFocused(), true, "isFocused()는 input 엘리먼트의 포커스 여부를 가져온다.");
		oNumericStepper.getInputElement().blur();
	});
});
asyncTest("deactivate()", function(){
	oNumericStepper.deactivate();
	oNumericStepper.getInputElement().focus();
	setTimeout(function(){
		start();
		equal(oNumericStepper.isFocused(), false, "deactivate() 되었을때에는 focus 이벤트 핸들러가 동작하지 않는다.");
		oNumericStepper.activate();
	});
});
test("plus 버튼 클릭", function(){
	var welPlus = jindo.$Element(oNumericStepper.getPlusElement());
	var welMinus = jindo.$Element(oNumericStepper.getMinusElement());
	var nValueExpected;
	
	nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
	welPlus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
	welPlus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
	welPlus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
	welPlus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
	welPlus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
});

test("minus 버튼 클릭", function(){
	var welMinus = jindo.$Element(oNumericStepper.getMinusElement());
	var nValueExpected;
	
	nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
	welMinus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
	welMinus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
	welMinus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
	welMinus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
	
	nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
	welMinus.fireEvent("click");
	equal(oNumericStepper.getValue(), nValueExpected);
});

asyncTest("마우스 휠 up", function(){
	var weUp = {
		stop : function(){},
		mouse : function() {
			return {
				delta : 1
			}
		}
	};
	var weDown = {
		stop : function(){},
		mouse : function() {
			return {
				delta : -1
			}
		}
	};
	
	var nValueExpected;
	
	oNumericStepper.getInputElement().focus();
	setTimeout(function(){
		start();
		
		nValueExpected = oNumericStepper.getValue() + oNumericStepper.option("nStep");
		oNumericStepper._onWheel(weUp);
		equal(oNumericStepper.getValue(), nValueExpected);
		
		nValueExpected = oNumericStepper.getValue() - oNumericStepper.option("nStep");
		oNumericStepper._onWheel(weDown);
		equal(oNumericStepper.getValue(), nValueExpected);
	});
	
});

test("beforeChange 커스텀이벤트", function(){
	
	var occured;
	
	oNumericStepper.attach("beforeChange", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		occured = true;
		oCustomEvent.stop();
	});
	
	occured = false;
	oNumericStepper.setValue(5);
	ok(oNumericStepper.getValue() == oNumericStepper.option("nDefaultValue"), "beforeChange 커스텀이벤트 핸들러에서 stop()을 수행했으므로 setValue()는 false를 리턴하고, 값이 바뀌지 않는다.");
	ok(occured, "setValue가 수행될 때 beforeChange 커스텀이벤트가 발생해야한다.");

	///
	oNumericStepper.attach("beforeChange", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		occured = true;
	});
	
	occured = false;
	oNumericStepper.setValue(oNumericStepper.option("nMax") + 1);
	ok(oNumericStepper.getValue() == oNumericStepper.option("nMax"), "범위를 넘긴 값을 setValue 하면 범위 안 쪽의 값으로 셋팅 되어야한다.");
	ok(occured, "범위를 넘긴 값을 setValue 해도 beforeChange 커스텀이벤트는 발생해야한다.");

	///
	oNumericStepper.attach("beforeChange", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		occured = true;
	});
	
	occured = false;
	oNumericStepper.setValue(null);
	ok(oNumericStepper.getValue() == oNumericStepper.option("nDefaultValue"), "잘못된 값을 setValue 하면 디폴트 값으로 셋팅 되어야한다.");
	ok(occured, "잘못된 값을 setValue 해도 beforeChange 커스텀이벤트는 발생해야한다.");

	
});

test("change 커스텀이벤트", function(){
	
	var occured;
	
	oNumericStepper.attach("change", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		occured = true;
	});
	
	occured = false;
	oNumericStepper.setValue(oNumericStepper.option("nMax") + 1);
	ok(occured, "범위를 넘긴 값을 setValue 해도 change 커스텀이벤트는 발생해야한다.");

	///
	oNumericStepper.attach("change", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		occured = true;
	});
	
	occured = false;
	oNumericStepper.setValue(null);
	ok(occured, "잘못된 값을 setValue 해도 change 커스텀이벤트는 발생해야한다.");

	
});

asyncTest("overLimit 커스텀이벤트", function(){
	oNumericStepper.attach("overLimit", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		
		start();
		ok(true, "setValue가 수행될 때 최대 값을 넘어서는 경우 overlimit 커스텀이벤트가 발생해야한다.");
		oCustomEvent.stop();
	});
	oNumericStepper.setValue(oNumericStepper.option("nMax") + 1);
	ok(oNumericStepper.getValue() == oNumericStepper.option("nMax"), "최대값 초과의 값을 선언했으므로 setValue()는 false를 리턴하고, 값이 최대값으로 바뀐다.");
});

asyncTest("overLimit 커스텀이벤트", function(){
	oNumericStepper.attach("overLimit", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		
		start();
		ok(true, "setValue가 수행될 때 최소 값보다 작은 경우 overlimit 커스텀이벤트가 발생해야한다.");
		oCustomEvent.stop();
	});
	oNumericStepper.setValue(oNumericStepper.option("nMin") - 1);
	ok(oNumericStepper.getValue() == oNumericStepper.option("nMin"), "최소값 미만의 값을 선언했으므로 setValue()는 false를 리턴하고, 값이 최소값으로 바뀐다.");
});
