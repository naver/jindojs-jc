var aCheckBox = jindo.CheckBox.factory(jindo.$$('.ajax_checkbox'), { sClassPrefix : 'checkbox-' });
var aRadioButton  = jindo.CheckBox.factory(jindo.$$('.ajax_radio'));

//세번째 체크박스는 항상 체크되도록 (수정할 수 없음)
aCheckBox[2].attach("beforeChange", function(oCustomEvent){
	this.setChecked(true);
	oCustomEvent.stop();
});

module("CheckBox");
test("input[type=checkbox]", function(){
	ok(aCheckBox instanceof Array === true, "생성된 체크박스의 인스턴스는 Array여야 한다.");
	ok(aCheckBox[0].getInput() === jindo.$$.getSingle("input[type=checkbox]", jindo.$("ui")), "getInput() 메소드는  HTMLInputElement을  return한다.");
	ok(aCheckBox[0].getChecked() === false, "getChecked(), 첫번째 체크박스의 체크 여부는 false이다.");
	ok(aCheckBox[0].setChecked(true) instanceof jindo.CheckBox === true, "setChecked(true)를 실행하면  인스턴스 자신을 return 한다.");
	ok(aCheckBox[0].getChecked() === true, "getChecked(), 첫번째 체크박스의 체크 여부는 true로 변경되어야 한다.");
	
	aCheckBox[0].deactivate();
	ok(aCheckBox[0]._welWrapper.hasClass(aCheckBox[0].option('sClassPrefix') + 'applied') === false, "deactivate() 메소드가 수행되면 기준 엘리먼트에 applied 클래스명이 제거된다.");
	
	aCheckBox[0].activate();
	ok(aCheckBox[0]._welWrapper.hasClass(aCheckBox[0].option('sClassPrefix') + 'applied') === true, "activate() 메소드가 수행되면 기준 엘리먼트에 applied 클래스명이 추가된다.");
	
	aCheckBox[3].disable();
	ok(aCheckBox[3]._welWrapper.hasClass(aCheckBox[3].option('sClassPrefix') + 'disabled') === true, "disable()는enabled상태에서 호출하면, mark element에서 disabled 클래스명이 추가된다.");
	aCheckBox[3].enable(); 
	ok(aCheckBox[3]._welWrapper.hasClass(aCheckBox[3].option('sClassPrefix') + 'disabled') === false, "enable()는 disabled상태에서 호출하면, mark element에서 disabled 클래스명이 삭제된다.");
});

test("CheckBox Interaction", function(){
	var elInput = aCheckBox[0].getInput();
	var bChecked = elInput.checked;
	jindo.$Element(elInput).fireEvent("click");
	stop();
	
	setTimeout(function(){
		start();	
		ok(elInput.checked === !bChecked, "첫번째 체크박스의 input[type=checkbox] 엘리먼트를 클릭하면 체크 값이 반전된다.");
	}, 10);
});

test("input[type=radio]", function(){
	ok(aRadioButton instanceof Array === true, "생성된 라디오버튼의 인스턴스는 Array여야 한다.");
	ok(aRadioButton[0].getInput() === jindo.$$.getSingle("input[type=radio]"), "getInput() 메소드는  HTMLInputElement을  return한다.");
	ok(aRadioButton[0].getChecked() === false, "getChecked(), 첫번째 체크박스의 체크 여부는 false이다.");
	ok(aRadioButton[0].setChecked(true) instanceof jindo.CheckBox === true, "setChecked(true)를 실행하면  인스턴스 자신을 return 한다.");
	ok(aRadioButton[0].getChecked() === true, "getChecked(), 첫번째 체크박스의 체크 여부는 true로 변경되어야 한다.");
	
	aRadioButton[0].deactivate();
	ok(aRadioButton[0]._welWrapper.hasClass(aRadioButton[0].option('sClassPrefix') + 'applied') === false, "deactivate() 메소드가 수행되면 기준 엘리먼트에 applied 클래스명이 제거된다.");
	
	aRadioButton[0].activate();
	ok(aRadioButton[0]._welWrapper.hasClass(aRadioButton[0].option('sClassPrefix') + 'applied') === true, "activate() 메소드가 수행되면 기준 엘리먼트에 applied 클래스명이 추가된다.");
	
	aRadioButton[3].disable();
	ok(aRadioButton[3]._welWrapper.hasClass(aRadioButton[3].option('sClassPrefix') + 'disabled') === true, "disable()는enabled상태에서 호출하면, mark element에서 disabled 클래스명이 추가된다.");
	aRadioButton[3].enable(); 
	ok(aRadioButton[3]._welWrapper.hasClass(aRadioButton[3].option('sClassPrefix') + 'disabled') === false, "enable()는 disabled상태에서 호출하면, mark element에서 disabled 클래스명이 삭제된다.");
});
test("RadioButton Interaction", function(){
	var elInput = aRadioButton[2].getInput();
	var bChecked = elInput.checked;
	jindo.$Element(elInput).fireEvent("click");
	stop();
	
	setTimeout(function(){
		start();	
		ok(elInput.checked === !bChecked, "input[type=radio] 엘리먼트를 클릭하면 체크 값이 반전된다.");
	}, 10);
});
test("beforeChange 커스텀 이벤트", function(){
	var elInput = aCheckBox[2].getInput();
	var bChecked = elInput.checked;
	jindo.$Element(elInput).fireEvent("click");
	stop();
	
	setTimeout(function(){
		start();	
		ok(elInput.checked === bChecked, "세번째 체크박스의 input[type=checkbox] 엘리먼트는 클릭해도 체크 값이 반전되지 않는다.");
	}, 10);
});
