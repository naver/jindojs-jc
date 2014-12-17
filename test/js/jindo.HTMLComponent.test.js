var nClassInitialized = 0;

jindo.Test = jindo.$Class({
	$init : function(){
		this.nPaintCount = 0;
		this.activate();
	},
	_onPaint : function(){
		this.nPaintCount ++;
	}
}).extend(jindo.HTMLComponent);

var oHTMLComponent1 = new jindo.Test();
nClassInitialized++;
var oHTMLComponent2 = new jindo.Test();
nClassInitialized++;
var oHTMLComponent3 = new jindo.Test();
nClassInitialized++;

module("jindo.HTMLComponent", {
});
test("paint() (인스턴스 메소드)", function(){
	ok(typeof oHTMLComponent1.paint == "function", "HTMLComponent를 상속한 클래스의 인스턴스는 paint 메소드를 가져야한다.");
	oHTMLComponent1.paint();
	ok(oHTMLComponent1.nPaintCount == 1, "paint();를 수행하면 _onPaint 메소드가 수행되어야 한다.");
});
test("jindo.HTMLComponent.paint() (스태틱 메소드)", function(){
	ok(typeof jindo.HTMLComponent.paint == "function", "jindo.HTMLComponent는  paint 스태틱메소드를 가진다.");
	jindo.Test.paint();
	//ok(oHTMLComponent1.nPaintCount == 1 && oHTMLComponent2.nPaintCount == 1 && oHTMLComponent3.nPaintCount == 1, "jindo.Test.paint() 스태틱 메소드를 수행하면 모든 jindo.Test의 인스턴스의 paint 메소드가 수행되어야 한다.");
});
test("getInstance()", function(){
	var aInstance = jindo.Test.getInstance();
	ok(aInstance, "getInstance 메소드는 해당 컴포넌트로 초기화된 모든 인스턴스를 배열로 리턴한다.");
	ok(aInstance.length === nClassInitialized, "TestClass로 총 "+nClassInitialized+"개의 인스턴스를 생성했으므로 배열의 길이는 "+nClassInitialized+"이다.");
	for (var i = 0; i < aInstance.length; i++) {
		ok(aInstance[i] instanceof jindo.Test, "배열의  "+i+"번째 요소는 TestClass의 인스턴스여야 한다.");
	}
});
