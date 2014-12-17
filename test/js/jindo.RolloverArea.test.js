var welLayer1 = jindo.$Element(jindo.$("layer1")),
	welLayer2 = jindo.$Element(jindo.$("layer2")),
	welLayer3 = jindo.$Element(jindo.$("layer3"));

var oRolloverArea = new jindo.RolloverArea(jindo.$("ui"), {
	sClassName : "layer"
});

module("RolloverArea", {
	setup : function() {
		oRolloverArea.detachAll();
		oRolloverArea.activate();
	}
});
test("RolloverArea", function(){
	oRolloverArea.attach({
		over : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		down : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		up : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀다 뗏을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseup 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		},
		out : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		}
	});
	
	ok(welLayer1.hasClass("layer"), '적용될 엘리먼트는 "layer" 클래스명을 가진다');
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	welLayer1.fireEvent("mouseover");
	ok(welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover 이벤트가 발생하면 "rollover-over" 클래스명이 추가된다');
	welLayer1.fireEvent("mousedown");
	ok(welLayer1.hasClass("rollover-over") && welLayer1.hasClass("rollover-down"), 'mouseover된 상태에서 mousedown 이벤트가 발생하면 "rollover-over" 클래스명을 가지고 "rollover-down" 클래스명이 추가된다');
	welLayer1.fireEvent("mouseup");
	ok(welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover된 상태에서 mousedown 이후 mouseup 이벤트가 발생하면 "rollover-over" 클래스명은 유지되고 "rollover-down" 클래스명은 제거된다');
	welLayer1.fireEvent("mouseout");
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseout 이벤트가 발생하면 "rollover-over", "rollover-down" 클래스명이 제거된다');
});

test("RolloverArea", function(){
	oRolloverArea.attach({
		over : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		down : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		up : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀다 뗏을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseup 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		},
		out : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		}
	});
	
	ok(welLayer1.hasClass("layer"), '적용될 엘리먼트는 "layer" 클래스명을 가진다');
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover 이벤트가 발생하기 전에는 "rollover-over", "rollover-down" 클래스명을 가지지 않는다');
	welLayer3.fireEvent("mouseover", {
		relatedElement : welLayer2.$value()
	});
	//ok(welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover 이벤트가 발생하면 "rollover-over" 클래스명이 추가된다');
	welLayer3.fireEvent("mousedown");
	//ok(welLayer1.hasClass("rollover-over") && welLayer1.hasClass("rollover-down"), 'mouseover된 상태에서 mousedown 이벤트가 발생하면 "rollover-over" 클래스명을 가지고 "rollover-down" 클래스명이 추가된다');
	welLayer2.fireEvent("mouseup");
	//ok(welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseover된 상태에서 mousedown 이후 mouseup 이벤트가 발생하면 "rollover-over" 클래스명은 유지되고 "rollover-down" 클래스명은 제거된다');
	welLayer3.fireEvent("mouseout", {
		relatedElement : welLayer2.$value()
	});
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'mouseout 이벤트가 발생하면 "rollover-over", "rollover-down" 클래스명이 제거된다');
});

test("layer1에서 mousedown, layer2에서 mouseup", function(){
	oRolloverArea.attach({
		over : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
			//console.log(oCustomEvent.sType, oCustomEvent);
		},
		down : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
			//console.log(oCustomEvent.sType, oCustomEvent);
		},
		up : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀다 뗏을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseup 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
			//console.log(oCustomEvent.sType, oCustomEvent);
		},
		out : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
			//console.log(oCustomEvent.sType, oCustomEvent);
		}
	});
	
	welLayer1.fireEvent("mousedown");
	ok(welLayer1.hasClass("rollover-down"), 'mousedown 이벤트가 발생하면 "rollover-down" 클래스명이 추가된다');
	welLayer2.fireEvent("mouseup");
	ok(!welLayer1.hasClass("rollover-down"), '다른 엘리먼트에서 mouseup 이벤트가 발생하더라도 추가된 "rollover-down" 클래스명은 제거된다');
});

test("activate() / deactivate()", function(){
	oRolloverArea.attach({
		over : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 올라갔을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		down : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mousedown 이벤트에 대한 $Event 객체
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 추가하지 않음
		},
		up : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 버튼을 눌렀다 뗏을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseup 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		},
		out : function(oCustomEvent) {
			//컴포넌트가 적용된 엘리먼트에 마우스 커서가 벗어났을 때 발생
			//전달되는 이벤트 객체 oCustomEvent = {
			//	element : (HTMLElement) 적용된 엘리먼트
			//	htStatus : {
			//		sOver : "over", // (String) mouseover시 추가, mouseout시 제거될 클래스명
			//		sDown : "down" // (String) mousedown시 추가, mouseup시 제거될 클래스명
			//	},
			//	weEvent : ($Event) mouseout 이벤트에 대한 $Event 객체  
			//}
			//oCustomEvent.stop(); 수행시 클래스명을 제거하지 않음
		}
	});
	
	oRolloverArea.deactivate();
	welLayer1.fireEvent("mouseover");
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'deactivate() 된경우에는 mouseover에 반응하지 않는다.');
	welLayer1.fireEvent("mousedown");
	ok(!welLayer1.hasClass("rollover-over") && !welLayer1.hasClass("rollover-down"), 'deactivate() 된경우에는 mousedown에 반응하지 않는다.');
});
