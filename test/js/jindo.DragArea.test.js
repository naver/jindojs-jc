var _mouse = jindo.$Event.prototype.mouse;
jindo.$Event.prototype.mouse = function() {
	return _mouse.apply(this, []);
};

//IE9 에서 fireEvent 로 날린 이벤트에서 pageX, pageY 가 안 넘어오는 문제 보완 
(function() {
	
	var fpOldPos = jindo.$Event.prototype.pos;
	
	jindo.$Event.prototype.pos = function() {
		var oPos = fpOldPos.apply(this, arguments);
		oPos.pageX = oPos.clientX;
		oPos.pageY = oPos.clientY;
		return oPos;
	};
	
})();

var aStatus = [];
var oDragArea = new jindo.DragArea(document, {
	sClassName : 'dragable',
	nThreshold : 10,
	bFlowOut : false
});

module("Drag", {
});
test("드래그 동작과 isDragging()", function(){
	ok(!oDragArea.isDragging(), "컴포넌트 초기화시 isDragging()은 false를 리턴한다.");
	jindo.$Element("bar_sub1").fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element("bar_sub1").fireEvent("mousemove", {
		clientX:5,
		clientY:5
	});
	ok(!oDragArea.isDragging(), "mousedown이후 nThreshold값 이하로 mousemove가 발생하면 isDragging()은 false를 리턴한다.");
	
	jindo.$Element("bar_sub1").fireEvent("mousemove", {
		clientX:50,
		clientY:50
	});
	ok(oDragArea.isDragging(), "mousedown이후 nThreshold값 이상으로 mousemove가 발생하면 isDragging()은 true를 리턴한다.");
	jindo.$Element("bar_sub1").fireEvent("mouseup", {
		left:true
	});
	ok(!oDragArea.isDragging(), "mouseup이후 isDragging()은 false를 리턴한다.");
	
	jindo.$Element("bar_sub1").fireEvent("mousedown", {
		left:false,
		right:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element("bar_sub1").fireEvent("mousemove", {
		clientX:50,
		clientY:50
	});
	ok(!oDragArea.isDragging(), "마우스 왼쪽버튼이 아닌경우 드래그할수 없기 때문에 isDragging()은 false를 리턴한다.");
});

test("bFlowOut 옵션", function(){
	var welBox1 = jindo.$Element("bar_sub2");
	var welBox1Parent = jindo.$Element(welBox1.parent());
	var welBox2 = jindo.$Element("bar");
	welBox1.fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	welBox1.fireEvent("mousemove", {
		clientX:500,
		clientY:500
	});
	
	ok(welBox1.width() + welBox1.offset().left <= welBox1Parent.width() + welBox1Parent.$value().scrollWidth && welBox1.height() + welBox1.$value().scrollHeight <= welBox1Parent.height() + welBox1Parent.offset().top, "드래그 된 박스는 상위 엘리먼트 우측과 하단 범위 밖을 벗어나지 않아야 한다.");
	welBox1.fireEvent("mousemove", {
		clientX:-1000,
		clientY:-1000
	});
	ok(welBox1.offset().left > welBox1Parent.offset().left && welBox1.offset().top > welBox1Parent.offset().top, "드래그 된 박스는 상위 엘리먼트 좌측과 상단 범위 밖을 벗어나지 않아야 한다.");
	welBox1.fireEvent("mouseup", {
		left:true
	});
	
	welBox2.fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	welBox2.fireEvent("mousemove", {
		clientX:-2000,
		clientY:-2000
	});
	ok(welBox2.offset().left >= 0 && welBox2.offset().top >= 0, "드래그 된 박스는 상위 엘리먼트(document.body) 좌측과 상단 범위 밖을 벗어나지 않아야 한다.");
	welBox2.fireEvent("mousemove", {
		clientX:2000,
		clientY:2000
	});
	ok(welBox2.width() + welBox2.offset().left <= jindo.$Document().scrollSize().width && welBox2.height() + welBox2.offset().top <= jindo.$Document().scrollSize().height, "드래그 된 박스는 상위 엘리먼트 우측과 하단 범위 밖을 벗어나지 않아야 한다.");
	welBox2.fireEvent("mouseup", {
		left:true
	});
});

test("input, textarea, select 태그를 드래그하는 경우", function(){
	var elInput = jindo.$$.getSingle("#bar input");
	var elSelect = jindo.$$.getSingle("#bar select");
	var elTextarea = jindo.$$.getSingle("#bar textarea");
	
	jindo.$Element(elInput).fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element(elInput).fireEvent("mousemove", {
		clientX:-10,
		clientY:-10
	});
	ok(!oDragArea.isDragging(), "input 엘리먼트를 드래그했을 때에는 isDragging()은 false를 리턴한다.");
	
	jindo.$Element(elSelect).fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element(elSelect).fireEvent("mousemove", {
		clientX:-10,
		clientY:-10
	});
	ok(!oDragArea.isDragging(), "select 엘리먼트를 드래그했을 때에는 isDragging()은 false를 리턴한다.");
	
	jindo.$Element(elTextarea).fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element(elTextarea).fireEvent("mousemove", {
		clientX:-10,
		clientY:-10
	});
	ok(!oDragArea.isDragging(), "textarea 엘리먼트를 드래그했을 때에는 isDragging()은 false를 리턴한다.");
});

test("드래그중 마우스 우클릭시 드래그 중단", function(){
	jindo.$Element("bar_sub1").fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	jindo.$Element("bar_sub1").fireEvent("mousemove", {
		clientX:-10,
		clientY:-10
	});
	ok(oDragArea.isDragging(), "mousedown이후 nThreshold값 이상으로 mousemove가 발생하면 isDragging()은 true를 리턴한다.");
	jindo.$Element("bar_sub1").fireEvent("mouseup", {
		left:false,
		middle:false,
		right:true
	});
	ok(!oDragArea.isDragging(), "드래그중 마우스 우클릭시 isDragging()은 false를 리턴한다.");
});

test("deprecated methods", function(){
	oDragArea.detachEvent();
	ok(!oDragArea.isEventAttached(), "detachEvent() => deactivate()를 수행하면 isEventAttached() => isActivating()은 false이다.");
	oDragArea.attachEvent();
	ok(oDragArea.isEventAttached(), "attachEvent() => activate()를 수행하면 isEventAttached() => isActivating()은 true이다.");
});

test("커스텀 이벤트", function(){
	oDragArea.detachAll();
	oDragArea.attach({
		handleDown : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		dragStart : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		beforeDrag : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		drag : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		dragEnd : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		handleUp : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		}
	});
	
	var welBox = jindo.$Element("bar_sub2");
	welBox.fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	ok(aStatus[0] == "handleDown", "mousedown 이벤트가 발생하면 handleDown 커스텀이벤트가 발생한다.");
	welBox.fireEvent("mousemove", {
		clientX:50,
		clientY:50
	});
	ok(aStatus[1] == "dragStart", "mousemove 이벤트가 발생하고 드래그가 시작되면 dragStart 커스텀이벤트가 발생한다.");
	ok(aStatus[2] == "beforeDrag" && aStatus[3] == "drag", "dragStart 이후에는 beforeDrag/drag 커스텀이벤트가 발생한다.");
	welBox.fireEvent("mouseup", {
		left:true
	});
	
	ok(aStatus[4] == "dragEnd", "드래그가 종료되면 dragEnd 커스텀이벤트가 발생한다.");
	ok(aStatus[5] == "handleUp", "mouseup 이벤트가 발생하면 handleUp 커스텀이벤트가 발생한다.");
	
	oDragArea.detachAll();
	oDragArea.attach({
		handleDown : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		dragStart : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
			oCustomEvent.stop();
		},
		beforeDrag : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
			oCustomEvent.stop();
		},
		drag : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		dragEnd : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		},
		handleUp : function(oCustomEvent) {
			aStatus.push(oCustomEvent.sType);
		}
	});
	welBox.fireEvent("mousedown", {
		left:true,
		clientX:0,
		clientY:0
	});
	ok(aStatus[0] == "handleDown", "mousedown 이벤트가 발생하면 handleDown 커스텀이벤트가 발생한다.");
	welBox.fireEvent("mousemove", {
		clientX:50,
		clientY:50
	});
	ok(aStatus.pop() == "dragStart" && !oDragArea.isDragging(), "dragStart 커스텀이벤트 핸들러에서 stop() 메소드를 수행하면 드래그가 수행되지 않는다.");
	
	oDragArea.detachAll("dragStart");
	welBox.fireEvent("mousemove", {
		clientX:50,
		clientY:50
	});
	ok(aStatus.pop() == "beforeDrag", "beforeDrag 커스텀이벤트 핸들러에서 stop() 메소드를 수행하면 drag 커스텀이벤트는 발생되지 않는다.");
	aStatus.length = 0;
	welBox.fireEvent("mouseup", {
		left:true
	});
});
