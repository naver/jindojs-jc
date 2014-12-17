var welLayer1 = jindo.$Element(jindo.$("layer1")),
	welLayer2 = jindo.$Element(jindo.$("layer2")),
	welLayer3 = jindo.$Element(jindo.$("layer3"));

var oRolloverClick = new jindo.RolloverClick(jindo.$("ui"), {
	RolloverArea : { 
		sClassName : "layer"
	}
});

module("RolloverClick", {
	setup : function() {
		oRolloverClick.detachAll();
		oRolloverClick.activate();
	}
});
test("RolloverClick", function(){
	var nClicked = 0;
	oRolloverClick.attach({
		click : function(oCustomEvent) {
			nClicked++;
		}
	});
	
	ok(welLayer1.hasClass("layer"), '적용될 엘리먼트는 "layer" 클래스명을 가진다');
	ok(!welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	welLayer1.fireEvent("mouseover");
	ok(welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하면 "rollover-over" 클래스명이 추가된다');
	welLayer1.fireEvent("click");
	ok(welLayer1.hasClass("rollover-over") && nClicked === 1, 'click 이벤트가 발생하면 nClicked가 1이 된다');
	welLayer1.fireEvent("mouseout");
	ok(!welLayer1.hasClass("rollover-over"), 'mouseout 이벤트가 발생하면 "rollover-over", "rollover-down" 클래스명이 제거된다');
});

test("Custom Event : over", function(){
	ok(welLayer1.hasClass("layer"), '적용될 엘리먼트는 "layer" 클래스명을 가진다');
	ok(!welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	
	welLayer1.fireEvent("mouseout");
	ok(!welLayer1.hasClass("rollover-over"), 'mouseout 이벤트가 발생하면 "rollover-over", "rollover-down" 클래스명이 제거된다');

	var bStopped = false;	
	oRolloverClick.attach({
		over : function(oCustomEvent) {
			this.detach("over", arguments.callee);
			oCustomEvent.stop();
			bStopped = true;
		}
	});
	welLayer1.fireEvent("mouseover");
	ok(!welLayer1.hasClass("rollover-over") && bStopped, 'over 커스텀이벤트 핸들러에서 stop() 메소드가 수행되면 "rollover-over" 클래스명이 추가되지 않는다.');
	
	bStopped = false;
	welLayer1.fireEvent("mouseover");
	ok(welLayer1.hasClass("rollover-over") && !bStopped, 'over 커스텀이벤트 핸들러에서 stop() 메소드가 수행되지 않으면 "rollover-over" 클래스명이 추가된다.');
	welLayer1.fireEvent("mouseout");
});

test("Custom Event : out", function(){
	ok(welLayer1.hasClass("layer"), '적용될 엘리먼트는 "layer" 클래스명을 가진다');
	ok(!welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	
	var bStopped = false;	
	oRolloverClick.attach({
		out : function(oCustomEvent) {
			this.detach("out", arguments.callee);
			oCustomEvent.stop();
			bStopped = true;
		}
	});
	ok(!welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	welLayer1.fireEvent("mouseover");
	ok(welLayer1.hasClass("rollover-over"), 'mouseover 이벤트가 발생하면 "rollover-over" 클래스명이 추가된다');
	
	welLayer1.fireEvent("mouseout");
	ok(welLayer1.hasClass("rollover-over") && bStopped, 'out 커스텀이벤트 핸들러에서 stop() 메소드가 수행되면 "rollover-over" 클래스명이 제거되지 않는다.');
	
	bStopped = false;
	welLayer1.fireEvent("mouseout");
	ok(!welLayer1.hasClass("rollover-over") && !bStopped, 'out 커스텀이벤트 핸들러에서 stop() 메소드가 수행되지 않으면 "rollover-over" 클래스명이 제거된다.');
});

test("activate() / deactivate()", function(){
	var nClicked = 0;
	oRolloverClick.attach({
		click : function(oCustomEvent) {
			nClicked++;
		}
	});
	
	oRolloverClick.deactivate();
	welLayer1.fireEvent("mouseover");
	ok(!welLayer1.hasClass("rollover-over"), 'deactivate() 된경우에는 mouseover에 반응하지 않는다.');
	welLayer1.fireEvent("click");
	ok(!welLayer1.hasClass("rollover-over") && nClicked == 0, 'deactivate() 된경우에는 click에 반응하지 않는다.');
});
