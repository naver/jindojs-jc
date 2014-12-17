var oTabControl = new jindo.TabControl(jindo.$('test'));

module("", {
	setup : function() {
	}
});
test("getBaseElement()", function(){
	ok(oTabControl.getBaseElement() === jindo.$("test"), "getBaseElement() 메소드는 기준 엘리먼트를 리턴한다.");
});
test("getCurrentIndex()", function(){
	ok(oTabControl.getCurrentIndex() === 0, "getCurrentIndex() 메소드는 현재 선택된 탭의 인덱스를 리턴한다.");
});

test("getTab() / getTabs()", function(){
	var aTabs = oTabControl.getTabs();
	var a = jindo.$$(".tc-tab", jindo.$("test"));
	ok(aTabs.length === 3, "getTabs()는 탭 엘리먼트의 배열을 리턴하고 그 길이는 3이다.");
	ok(aTabs[0] == a[0] && aTabs[1] == a[1] && aTabs[2] == a[2], "getTab(n) 메소드는 n번째 탭 엘리먼트를 리턴한다.");
});

test("getPanel() / getPanels()", function(){
	var aPanels = oTabControl.getPanels();
	var a = jindo.$$(".tc-panel", jindo.$("test"));
	ok(aPanels.length === 3);
	ok(aPanels[0] == a[0] && aPanels[1] == a[1] && aPanels[2] == a[2]);
});

test("getIndex()", function(){
	var aTabs = oTabControl.getTabs();
	ok(oTabControl.getIndex(aTabs[0]) === 0);
	ok(oTabControl.getIndex(aTabs[1]) === 1);
	ok(oTabControl.getIndex(aTabs[2]) === 2);
});

test("selectTab()", function(){
	oTabControl.selectTab(2);
	ok(oTabControl.getCurrentIndex() === 2);
	oTabControl.selectTab(1);
	ok(oTabControl.getCurrentIndex() === 1);
	oTabControl.selectTab(0);
	ok(oTabControl.getCurrentIndex() === 0);
});

test("탭 클릭", function(){
	jindo.$Element(oTabControl.getTab(2)).fireEvent("click");
	ok(oTabControl.getCurrentIndex() === 2);
	jindo.$Element(oTabControl.getTab(1)).fireEvent("click");
	ok(oTabControl.getCurrentIndex() === 1);
	jindo.$Element(oTabControl.getTab(0)).fireEvent("click");
	ok(oTabControl.getCurrentIndex() === 0);
});

test("deactivate() / activate()", function(){
	ok(oTabControl.getCurrentIndex() === 0);
	oTabControl.deactivate();
	jindo.$Element(oTabControl.getTab(2)).fireEvent("click");
	ok(oTabControl.getCurrentIndex() === 0);
	oTabControl.activate();
	jindo.$Element(oTabControl.getTab(2)).fireEvent("click");
	ok(oTabControl.getCurrentIndex() === 2);
	oTabControl.selectTab(0);
});

asyncTest("탭 클릭", function(){
	oTabControl.attach("beforeSelect", function(oCustomEvent) {
		this.detach(oCustomEvent.sType, arguments.callee);
		start();
		oCustomEvent.stop();
		ok(this.getCurrentIndex() === 0);
		this.selectTab(0);
	});
	
	oTabControl.selectTab(2);
});
