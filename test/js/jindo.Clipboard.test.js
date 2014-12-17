var bLoaded = false;
var sClipboard, sClipboard2 = "";
var sCustomEvent = "";
var oClipboard = new jindo.Clipboard('../demo/jindo.Clipboard/clipboard.swf').attach({
	load : function(oCustomEvent) {
		bLoaded = true;
		this.setData(jindo.$('foo'), 'http://naver.com/');
	},
	copy : function(oCustomEvent){
		sClipboard = "copied";
	},
	failure : function(oCustomEvent){
		sClipboard = "";
	},
	over : function(oCustomEvent){
		sCustomEvent = oCustomEvent.sType;
	},
	out : function(oCustomEvent){
		sCustomEvent = oCustomEvent.sType;
	},
	down : function(oCustomEvent){
		sCustomEvent = oCustomEvent.sType;
	},
	up : function(oCustomEvent){
		sCustomEvent = oCustomEvent.sType;
	}
});

var oClipboard2 = new jindo.Clipboard('../demo/jindo.Clipboard/clipboard.swf').attach({
	load : function(oCustomEvent) {
		this.setData(jindo.$('bar'), 'http://daum.net/');
	},
	failure : function(oCustomEvent){
		sClipboard2 = "";
	}
});

module("Clipboard", {
});
test("swf파일이 로드가되면 load 커스텀 이벤트가 발생된다.", function(){
	if (!document.domain) { ok(true); return; }
	stop();
	setTimeout(function(){
		ok(bLoaded, "load 커스텀 이벤트가 발생되면 bLoaded는 true이다.");
		start();
	}, 1000)
});
test("setData에 설정된 엘리먼트에 mouseover/move 되는 경우에", function(){
	if (!document.domain) { ok(true); return; }
	jindo.$Element(jindo.$("foo")).fireEvent("mousemove");
	
	var htOffsetButton = jindo.$Element(jindo.$("foo")).offset();
	var htOffsetFlash = jindo.$Element(oClipboard._elDummy).offset();
	var htButtonWidth = jindo.$Element(jindo.$("foo")).width();
	var htButtonHeight = jindo.$Element(jindo.$("foo")).height();
	
	ok(htOffsetButton.left == htOffsetFlash.left && htOffsetButton.top == htOffsetFlash.top, "클릭될 플래시객체의 위치가 버튼의 위치와 같아야한다.");
	ok(htButtonWidth == oClipboard._getFlash().width && htButtonHeight == oClipboard._getFlash().height, "클릭될 플래시객체의 크기가 버튼의 크기와 같아야한다.");
});
test("정상적인 설정 동작", function(){
	ok(!sClipboard, "플래시객체가 클릭되기전에는 sClipboard값은 비어있다.");
	jindo.$Element(oClipboard._elDummy).fireEvent("click");
	oClipboard._onFlashClick();
	ok(sClipboard == "copied", "위치설정된 플래시객체가 클릭되면 copy 커스텀이벤트가 발생(sClipboard == 'copied')되어야한다.");
});
test("플래시가 제대로 로드되었어도 swf파일의 도메인이 다를 경우의 설정동작", function(){
	ok(!sClipboard2, "플래시객체가 클릭되기전에는 sClipboard2값은 비어있다.");
	jindo.$Element(oClipboard2._elDummy).fireEvent("click");
	ok(sClipboard == "copied", "위치설정된 플래시객체가 클릭되면 failure 커스텀이벤트가 발생한다.");
});

test("setData", function(){
	oClipboard.setData(jindo.$('foo'), 'test');
	ok(oClipboard._getData(jindo.$('foo')) == 'test', "setData(jindo.$('foo'), 'test')를 수행하면 설정될 텍스트값은 'test'로 바뀌어야 한다.");
	
	oClipboard.setData(jindo.$('foo'), null);
	ok(jindo.$A(oClipboard._aElement).indexOf(jindo.$('foo')) == -1 && oClipboard._getFlash().width == 1 && oClipboard._getFlash().height == 1, "setData(jindo.$('foo'), null)를 수행하면 해당 엘리먼트에 대한 설정이 해제된다.");
});

test("커스텀 이벤트 over", function(){
	oClipboard._onFlashMouseOver();
	ok(sCustomEvent == 'over', "플래시객체에 마우스오버가 되면 over 커스텀이벤트가 발생된다. (sCustomEvent == 'over')");
});
test("커스텀 이벤트 down", function(){
	oClipboard._onFlashMouseDown();
	ok(sCustomEvent == 'down', "플래시객체에 마우스오버가 되면 down 커스텀이벤트가 발생된다. (sCustomEvent == 'down')");
});
test("커스텀 이벤트 up", function(){
	oClipboard._onFlashMouseUp();
	ok(sCustomEvent == 'up', "플래시객체에 마우스오버가 되면 up 커스텀이벤트가 발생된다. (sCustomEvent == 'up')");
});
test("커스텀 이벤트 out", function(){
	oClipboard._onFlashMouseOut();
	ok(sCustomEvent == 'out', "플래시객체에 마우스오버가 되면 out 커스텀이벤트가 발생된다. (sCustomEvent == 'out')");
});
