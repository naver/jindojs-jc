var oRolling = new jindo.Rolling(jindo.$('horz_wrap'), {
	nDuration : 400,
	sDirection : 'horizontal',
	fEffect : jindo.Effect.cubicEase
});	
		
module("", {
	setup : function() {
	}
});
test("getIndex()", function(){
	ok(oRolling.getIndex() === 0, "getIndex()는 현재 표시되고 있는 LI의 인덱스를 구한다.");
});
test("getList()", function(){
	ok(oRolling.getList().tagName === "UL", "getList()는 UL엘리먼트를 리턴한다.");
});
test("getItems()", function(){
	ok(oRolling.getItems().length === 10, "li가 10개 이므로 getItems()의 길이는 10이다.");
});
test("getDisplayedItemCount()", function(){
	ok(oRolling.getDisplayedItemCount() == 3, "getDisplayedItemCount()는 한번에 보여지는 아이템의 개수를 리턴한다.");
});
test("isOverflowed()", function(){
	ok(oRolling.isOverflowed(), "isOverflowed()의 리턴값은 true이다.");
});
test("getTransition()", function(){
	ok(oRolling.getTransition() instanceof jindo.Transition, "getTransition()의 리턴값은 jindo.Transition의 인스턴이다.");
});
asyncTest("moveTo()", function(){
	oRolling.attach({
		afterMove : function(oCustomEvent){
			this.detach(oCustomEvent.sType, arguments.callee);
			start();
			ok(this.getIndex() === 4, "롤링된 인덱스는 4이다.")
		}
	});
	ok(oRolling.moveTo(4), "moveTo(4)는 지정된 인덱스로 롤링한다.");
});
asyncTest("moveLastTo()", function(){
	oRolling.attach({
		afterMove : function(oCustomEvent){
			this.detach(oCustomEvent.sType, arguments.callee);
			start();
			ok(this.getIndex() === 0, "롤링된 인덱스는 0이다.")
		}
	});
	ok(oRolling.moveLastTo(9), "moveLastTo(9)는 뒤에서부터 9번째의 인덱스로 롤링한다.");
});
asyncTest("moveBy()", function(){
	oRolling.attach({
		afterMove : function(oCustomEvent){
			this.detach(oCustomEvent.sType, arguments.callee);
			start();
			ok(this.getIndex() === 1, "롤링된 인덱스는 1이다.")
		}
	});
	ok(oRolling.moveBy(1), "moveBy(1)은 +1의 위치로 롤링한다.");
});
asyncTest("beforeMove 커스텀이벤트 핸들링", function(){
	oRolling.attach({
		beforeMove : function(oCustomEvent){
			this.detach(oCustomEvent.sType, arguments.callee);
			start();
			oCustomEvent.stop();
			ok(true);
		}
	});
	ok(oRolling.moveTo(5) === false, "beforeMove 커스텀이벤트 핸들러에서 stop() 메소드 수행시 롤링되지 않는다.");
});
