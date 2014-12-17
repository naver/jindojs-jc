var oAccordion = new jindo.Accordion("panel");
var oAccordion2 = new jindo.Accordion("panel2", { sDirection : "horizontal", nDefaultIndex : 0, bToggle : true });
	
module("Public Method", {
	setup : function() {
	}
});
test("getAllBlocks()", function(){
	ok(oAccordion.getAllBlocks() instanceof Array, "getAllBlocks() 메소드는 블록의 배열을 리턴한다.");
	ok(oAccordion.getAllBlocks().length == jindo.$$(".accordion-block", jindo.$("panel")).length, "getAllBlocks() 배열의 길이는 '.accordion-block'의 개수와 같다.");
});
test("getBlock()", function(){
	ok(oAccordion.getBlock(0) == jindo.$$(".accordion-block")[0], "getBlock(0) 메소드의 리턴값은 '.accordion-block'클래스명을 가지는 첫번째 블록이다.");
});
test("getHead()", function(){
	ok(oAccordion.getHead(0) == jindo.$$(".accordion-block dt")[0], "getHead(0) 메소드의 리턴값은 '.accordion-block'클래스명을 가지는 첫번째 블록의 자식엘리먼트중 dt엘리먼트이다.");
});
test("getBody()", function(){
	ok(oAccordion.getBody(0) == jindo.$$(".accordion-block dd")[0], "getBody(0) 메소드의 리턴값은 '.accordion-block'클래스명을 가지는 첫번째 블록의 자식엘리먼트중 dd엘리먼트이다.");
});
test("getHandler()", function(){
	ok(oAccordion.getHandler(0) == oAccordion.getHead(0), "getHandler(0) 메소드의 리턴값은 첫번째 헤드내에 .accordion-handler 클래스명을 가지는 엘리먼트가 없으므로 헤드엘리먼트를 리턴한다.");
	ok(oAccordion.getHandler(4) == jindo.$$(".accordion-handler", oAccordion.getHead(4))[0], "getHandler(4) 메소드의 리턴값은 첫번째 헤드내에 .accordion-handler 클래스명을 가지는 엘리먼트이다.");
});
test("getTransition()", function(){
	ok(oAccordion.getTransition() instanceof jindo.Transition, "getTransition() 메소드는 jindo.Transition 컴포넌트의 인스턴스를 리턴한다.");
});
asyncTest("expand() / getExpanded()", function(){
	ok(!oAccordion.getExpanded(), "getExpanded()는 null을 리턴한다.");
	oAccordion.attach("expand", function(oCustomEvent){
		this.detach(oCustomEvent.sType, arguments.callee);
		
		start();
		ok(oAccordion.getExpanded() === 0, "getExpanded()는 0을 리턴한다.");
		ok(oAccordion.expand(0) == oAccordion, "이미 확장된 블록을 다시 expand시 this를 리턴한다.");	
	});
	oAccordion.expand(0);
});

asyncTest("contractAll() / getExpanded()", function(){
	ok(oAccordion.getExpanded() === 0, "getExpanded()는 0을 리턴한다.");
	oAccordion.attach("contract", function(oCustomEvent){
		this.detach(oCustomEvent.sType, arguments.callee);
		
		start();
		ok(!oAccordion.getExpanded(), "getExpanded()는 null을 리턴한다.");	
	});
	oAccordion.contractAll();
});

asyncTest("deactivate(), activate()", function(){
	ok(!oAccordion.getExpanded(), "getExpanded()는 null을 리턴한다.");
	oAccordion.attach("expand", function(oCustomEvent){
		this.detach(oCustomEvent.sType, arguments.callee);
		
		start();
		ok(oAccordion.getExpanded() === 1, "getExpanded()는 1을 리턴한다.");
		oAccordion.deactivate();
		
		jindo.$Element(oAccordion.getHead(0)).fireEvent("mouseover").fireEvent("click").fireEvent("mouseout");
		setTimeout(function(){
			ok(oAccordion.isActivating() === false, "isActivating()은 false를 리턴한다.");
			ok(oAccordion.getExpanded() === 1, "클릭에 반응하지 않으므로 여전히 getExpanded()는 1을 리턴한다.");
		}, 1000)
	});
	jindo.$Element(oAccordion.getHead(1)).fireEvent("mouseover").fireEvent("click").fireEvent("mouseout");
});

test("expandAll() (deprecated)", function(){
	ok(oAccordion.expandAll() == oAccordion);
});

asyncTest("가로방향 expand() / getExpanded() / toggle", function(){
	ok(oAccordion2.getExpanded() === 0, "getExpanded()는 0을 리턴한다.");
	oAccordion2.attach("expand", function(oCustomEvent){
		this.detach(oCustomEvent.sType, arguments.callee);
		
		ok(oAccordion2.getExpanded() === 1, "getExpanded()는 1을 리턴한다.");
		
		jindo.$Element(oAccordion2.getHandler(1)).fireEvent("mouseover").fireEvent("click").fireEvent("mouseout");
		setTimeout(function(){
			start();
			ok(!oAccordion2.getExpanded(), "bToggle 옵션이 true인경우 expand되 블록을 다시 클릭하면 모두 축소되어 getExpanded()는 null을 리턴한다.");
		}, 1000)
	});
	oAccordion2.expand(1);
});
