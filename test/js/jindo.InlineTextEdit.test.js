var oInlineTextEdit1 = new jindo.InlineTextEdit({});
var oInlineTextEdit2 = new jindo.InlineTextEdit({ elInput : jindo.$("<textarea>")});

module("input[type=text]", {
	setup : function() {
		this.oInlineTextEdit = oInlineTextEdit1;
	}
});
test("getTextInput()", function(){
	ok(jindo.$$.test(oInlineTextEdit1.getTextInput(), "input[type=text]"),"getTextInput()은 input[type=text] 엘리먼트를 리턴한다.");
});
test("edit() / isEditing() / cancel() / apply()", function(){
	var welEdit = jindo.$Element("p1");
	var sPrevValue = welEdit.text();
	ok(!this.oInlineTextEdit.isEditing(), "수정중이 아닐때에는  isEditing()이 false를 리턴한다."); 
	this.oInlineTextEdit.edit(welEdit.$value());
	ok(this.oInlineTextEdit.isEditing(), "수정중일때에는  isEditing()이 true를 리턴한다.");
	this.oInlineTextEdit.getTextInput().value = "1234";
	this.oInlineTextEdit.cancel();
	ok(welEdit.text() == sPrevValue, "cancel() 수행시 수정 이전값으로 변경된다.");
	this.oInlineTextEdit.edit(welEdit.$value());
	this.oInlineTextEdit.getTextInput().value = "1234";
	this.oInlineTextEdit.apply();
	ok(welEdit.text() == "1234", "apply() 수행시 수정된값으로 변경된다.");
	this.oInlineTextEdit.edit(welEdit.$value());
	this.oInlineTextEdit.getTextInput().value = sPrevValue;
	this.oInlineTextEdit.apply();
});
test("edit() / isEditing() / cancel() / apply() (Handle Event)", function(){
	var welEdit = jindo.$Element("p1");
	var welInput = jindo.$Element(this.oInlineTextEdit.getTextInput());
	var sPrevValue = welEdit.text();
	ok(!this.oInlineTextEdit.isEditing(), "수정중이 아닐때에는  isEditing()이 false를 리턴한다.");
	 
	welEdit.fireEvent("click");
	ok(this.oInlineTextEdit.isEditing(), "클릭시 수정하고, 수정중일때에는  isEditing()이 true를 리턴한다.");
	this.oInlineTextEdit.getTextInput().value = "1234";
	welInput.fireEvent("keydown", {keyCode:27,alt:false,shift:false,meta:false,ctrl:true});
	ok(welEdit.text() == sPrevValue, "esc키 입력시 cancel() 수행되고 수정 이전값으로 변경된다.");
	
	welEdit.fireEvent("click");
	this.oInlineTextEdit.getTextInput().value = "1234";
	welInput.fireEvent("keydown", {keyCode:13,alt:false,shift:false,meta:false,ctrl:true});
	ok(welEdit.text() == "1234", "enter키 입력시 apply() 수행되고 수정된값으로 변경된다.");
	
	welEdit.fireEvent("click"); 
	this.oInlineTextEdit.getTextInput().value = sPrevValue;
	this.oInlineTextEdit.getTextInput().blur();
});

module("textarea", {
	setup : function() {
		this.oInlineTextEdit = oInlineTextEdit2;
	}
});
test("getTextInput()", function(){
	ok(jindo.$$.test(oInlineTextEdit2.getTextInput(), "textarea"),"getTextInput()은 textarea 엘리먼트를 리턴한다.");
});
test("edit() / isEditing() / cancel() / apply()", function(){
	var welEdit = jindo.$Element("p2");
	var sPrevValue = welEdit.text();
	ok(!this.oInlineTextEdit.isEditing(), "수정중이 아닐때에는  isEditing()이 false를 리턴한다."); 
	this.oInlineTextEdit.edit(welEdit.$value());
	ok(this.oInlineTextEdit.isEditing(), "수정중일때에는  isEditing()이 true를 리턴한다.");
	this.oInlineTextEdit.getTextInput().value = "1234";
	this.oInlineTextEdit.cancel();
	ok(welEdit.text() == sPrevValue, "cancel() 수행시 수정 이전값으로 변경된다.");
	this.oInlineTextEdit.edit(welEdit.$value());
	this.oInlineTextEdit.getTextInput().value = "1234";
	this.oInlineTextEdit.apply();
	ok(welEdit.text() == "1234", "apply() 수행시 수정된값으로 변경된다.");
	this.oInlineTextEdit.edit(welEdit.$value());
	this.oInlineTextEdit.getTextInput().value = sPrevValue;
	this.oInlineTextEdit.apply();
});
test("edit() / isEditing() / cancel() / apply() (Handle Event)", function(){
	var welEdit = jindo.$Element("p2");
	var welInput = jindo.$Element(this.oInlineTextEdit.getTextInput());
	var sPrevValue = welEdit.text();
	ok(!this.oInlineTextEdit.isEditing(), "수정중이 아닐때에는  isEditing()이 false를 리턴한다."); 
	welEdit.fireEvent("click");
	ok(this.oInlineTextEdit.isEditing(), "클릭시 수정하고, 수정중일때에는  isEditing()이 true를 리턴한다.");
	this.oInlineTextEdit.getTextInput().value = "1234";
	welInput.fireEvent("keydown", {keyCode:27,alt:false,shift:false,meta:false,ctrl:true});
	ok(welEdit.text() == sPrevValue, "esc키 입력시 cancel() 수행되고 수정 이전값으로 변경된다.");
	welEdit.fireEvent("click");
	this.oInlineTextEdit.getTextInput().value = "1234";
	welInput.fireEvent("keydown", {keyCode:13,alt:false,shift:false,meta:false,ctrl:true});
	ok(this.oInlineTextEdit.isEditing(), "enter키 입력시에도 apply() 수행되지 않고 계속 수정중이다.");
	this.oInlineTextEdit.getTextInput().value = sPrevValue;
	this.oInlineTextEdit.getTextInput().blur();
});
