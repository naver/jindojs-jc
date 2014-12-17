var oDefaultTextValue1 = new jindo.DefaultTextValue(jindo.$("test1"), { sValue : "입력해주세요"	});
var oDefaultTextValue2 = new jindo.DefaultTextValue(jindo.$("test2"), { sValue : "입력해주세요"	});
			
module("", {
	setup : function() {
	}
});
test("getBaseElement()", function(){
	ok(oDefaultTextValue1.getBaseElement() === jindo.$("test1"), "getBaseElement() 메소드는 input 엘리먼트를 리턴한다.");
});
test("getDefaultValue() / setDefaultValue()", function(){
	ok(oDefaultTextValue1.getDefaultValue() === oDefaultTextValue1.option("sValue"), "getDefaultValue() 메소드는 input창에 표시할 디폴트 값(sValue 옵션값)을 리턴한다.");
	oDefaultTextValue1.setDefaultValue("디폴트값 변경");
	ok(oDefaultTextValue1.getDefaultValue() === "디폴트값 변경", "setDefaultValue() 메소드는 input창에 표시할 디폴트 값을 설정한다.");
});
test("setDefault()", function(){
	jindo.$("test1").value = "테스트";
	oDefaultTextValue1.setDefault();
	ok(jindo.$("test1").value === "디폴트값 변경", "setDefault() 메소드는 input창에 값을 디폴트값으로 즉시 변경한다.");
});

asyncTest("deactivate() / activate()", function() {
	ok(oDefaultTextValue1.isActivating() === true, "activate()시 isActivating()은 true를 리턴한다.");
	oDefaultTextValue1.setDefault();
	oDefaultTextValue1.deactivate();
	oDefaultTextValue1.getBaseElement().focus();
	setTimeout(function(){
		ok(oDefaultTextValue1.getBaseElement().value === oDefaultTextValue1.option("sValue"), "deactivate()시 focus되어도 값의 변화가 없어야한다.");			
		ok(oDefaultTextValue1.isActivating() === false, "deactivate()시 isActivating()은 false를 리턴한다.");
		oDefaultTextValue1.getBaseElement().blur();
		setTimeout(function(){
			oDefaultTextValue1.activate();
			start();
		}, 100);
	}, 100);
});

asyncTest("focus후 값 변경 없이 blur되는 경우", function(){
	oDefaultTextValue1.setDefault();
	oDefaultTextValue1.getBaseElement().focus();
	setTimeout(function(){
		ok(oDefaultTextValue1.getBaseElement().value === "", "focus되었을 때 디폴트값과 현재값이 같을 경우에는 input의 값을 비워서 입력가능한 상태가 되도록 한다.");
		oDefaultTextValue1.getBaseElement().blur();
		setTimeout(function(){
			ok(oDefaultTextValue1.getBaseElement().value === oDefaultTextValue1.option("sValue"), "blur되었을 때 입력값이 없는 경우에는 input의 값을 디폴트 값으로 되돌린다.");
			start();
		}, 100);
	}, 100);
});
asyncTest("focus후 값 변경 후 blur되는 경우", function(){
	oDefaultTextValue1.setDefault();
	oDefaultTextValue1.getBaseElement().focus();
	setTimeout(function(){
		ok(oDefaultTextValue1.getBaseElement().value === "", "focus되었을 때 디폴트값과 현재값이 같을 경우에는 input의 값을 비워서 입력가능한 상태가 되도록 한다.");
		oDefaultTextValue1.getBaseElement().value = "test";
		oDefaultTextValue1.getBaseElement().blur();
		setTimeout(function(){
			ok(oDefaultTextValue1.getBaseElement().value === "test", "blur되었을 때 입력값이 있을 경우에는 input의 값에는 입력된 값이 남아있게된다.");
			start();
		}, 100);
	}, 100);
});
asyncTest("input의 value 속성이 설정된 상태로 초기화된 경우", function(){
	oDefaultTextValue2.setDefault();
	oDefaultTextValue2.getBaseElement().focus();
	setTimeout(function(){
		ok(oDefaultTextValue2.getBaseElement().value != oDefaultTextValue2.option("sValue"), "focus되었을 때 값의 변화가 없다. (디폴트 값과 달라야한다.)");
		oDefaultTextValue2.getBaseElement().value = ""
		oDefaultTextValue2.getBaseElement().blur();
		setTimeout(function(){
			ok(oDefaultTextValue2.getBaseElement().value === oDefaultTextValue2.option("sValue"), "blur되었을 때 입력값이 없는 경우에는 input의 값을 디폴트 값으로 되돌린다.");
			start();
		}, 100);
	}, 100);
});
