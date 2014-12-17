oBrowseButton = new jindo.BrowseButton(jindo.$('browse-button')).attach({
	sourceChange : function() {
		jindo.$('output').innerHTML = this.getFileSelect().value
	}
});

module("", {
	setup : function() {
	}
});
test("getBox()", function(){
	ok(oBrowseButton.getBox() === jindo.$$.getSingle(".browse-box", jindo.$("ui")), "getBox() 메소드는 찾아보기 버튼에 겹쳐서 표시되는 box엘리먼트를 리턴한다.");
});

test("getBrowseButton()", function(){
	ok(oBrowseButton.getBrowseButton() === jindo.$$.getSingle(".browse-button", jindo.$("ui")), "getBrowseButton() 메소드는 화면에 보이게 되는 디자인된 찾아보기 버튼 엘리먼트를 리턴한다.");
});

test("getFileSelect()", function(){
	ok(oBrowseButton.getFileSelect() === jindo.$$.getSingle(".browse-file-input", jindo.$("ui")), "getFileSelect() 메소드는 실제 클릭되는 File Select 엘리먼트를 리턴한다.");
});

test("box와 browse button의 위치, 크기", function(){
	var welBrowseBox = jindo.$Element(oBrowseButton.getBox());
	var welBrowseButton = jindo.$Element(oBrowseButton.getBrowseButton());
	var htOffset1 = welBrowseBox.offset();
	var htOffset2 = welBrowseButton.offset();
	
	ok(welBrowseBox.parent().$value() == welBrowseButton.parent().$value(), "getBrowseBox()와 getBrowseButton()는 같은 부모 엘리먼트를 가진다.");
	ok(htOffset1.left == htOffset2.left && htOffset1.top == htOffset2.top, "getBrowseBox()와 getBrowseButton()의 위치가 같아야 한다.");
	ok(welBrowseBox.width() == welBrowseButton.width() && welBrowseBox.height() == welBrowseButton.height(), "getBrowseBox()와 getBrowseButton()의 크기가 같아야 한다.");
});

test("mouseover, move, out", function(){
	var welBox = jindo.$Element(oBrowseButton.getBox());
	var welBrowseButton = jindo.$Element(oBrowseButton.getBrowseButton());
	welBox.fireEvent("mouseover");
	ok(welBrowseButton.hasClass("browse-over"), "마우스오버시 'over' 클래스명이 추가된다");
	welBox.fireEvent("mousemove", {
	});
	welBox.fireEvent("mouseout", {
	});
	ok(!welBrowseButton.hasClass("browse-over"), "마우스아웃시 'over' 클래스명이 제거된다");
});
