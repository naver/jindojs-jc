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

var aMagneticDropped = [];
var aPointingDropped = [];

var oMagneticDragArea = new jindo.DragArea(document, {
	sClassName : 'draggable-magnetic',
	nThreshold : 10,
	bFlowOut : false
});

var oMagneticDropArea = new jindo.DropArea(document, {
	sClassName : 'droppable',
	oDragInstance : oMagneticDragArea
}).attach({
	dragStart : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
	},
	over : function(oCustomEvent) {
		jindo.$Element(oCustomEvent.elDrop).addClass("overed");
		//aStatus.push(oCustomEvent.sType);
	},
	move : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
	},
	out : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	},
	drop : function(oCustomEvent) {
		aMagneticDropped.push(oCustomEvent.elDrag);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	}
});

var oMagneticDropArea2 = new jindo.DropArea(jindo.$$.getSingle(".droppable-alone"), {
	sClassName : 'droppable-alone',
	oDragInstance : oMagneticDragArea
}).attach({
	dragStart : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
	},
	over : function(oCustomEvent) {
		jindo.$Element(oCustomEvent.elDrop).addClass("overed");
		//aStatus.push(oCustomEvent.sType);
	},
	move : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
	},
	out : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	},
	drop : function(oCustomEvent) {
		aMagneticDropped.push(oCustomEvent.elDrag);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	}
});

var oPointingDragArea = new jindo.DragArea(jindo.$("ui"), {
	sClassName : 'draggable-pointing',
	nThreshold : 10,
	bFlowOut : false
});

var oPointingDropArea = new jindo.DropArea(jindo.$("ui"), {
	sClassName : 'droppable',
	oDragInstance : oPointingDragArea
}).attach({
	dragStart : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
		jindo.$Element(document.body).addClass('dragging');
		
		var oMousePos = oCustomEvent.weEvent.pos();
		jindo.$Element('phantom').html(oCustomEvent.elDrag.innerHTML).show().offset(oMousePos.pageY 
			- oCustomEvent.htDiff.nPageY + 20, oMousePos.pageX - oCustomEvent.htDiff.nPageX + 15);
		
		oCustomEvent.elDrag = jindo.$('phantom');
	},
	dragEnd : function(oCustomEvent) {
		jindo.$Element(document.body).removeClass('dragging');
		jindo.$Element('phantom').hide();
		
	},
	over : function(oCustomEvent) {
		jindo.$Element(oCustomEvent.elDrop).addClass("overed");
		//aStatus.push(oCustomEvent.sType);
	},
	move : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
	},
	out : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	},
	drop : function(oCustomEvent) {
		//aStatus.push(oCustomEvent.sType);
		aPointingDropped.push(oCustomEvent.elDrag);
		jindo.$Element(oCustomEvent.elDrop).removeClass("overed");
	}
});

module("커스텀 이벤트", {
});
test("마우스커서가 드랍될 엘리먼트를 직접 가리킬 수 없는 경우의 드래그 (드래그될 엘리먼트가 커서에 붙어서 움직이는 경우)", function(){
	var oDragArea = oMagneticDragArea;
	var oDropArea = oMagneticDropArea;
	
	ok(!oDragArea.isDragging(), "컴포넌트 초기화시 oDragArea.isDragging()은 false를 리턴한다.");
	
	var welDrag = jindo.$Element("drag1");
	var aDroppable = jindo.$$(".droppable");
	var htOffset = welDrag.offset();
	welDrag.fireEvent("mousedown", {
		left:true,
		clientX:htOffset.left,
		clientY:htOffset.top
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 20,
		clientY:htOffset.top + 20
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 170,
		clientY:htOffset.top + 20
	});
	
	ok(oDropArea.getOveredLists()[0] == aDroppable[0] 
		&& jindo.$Element(oDropArea.getOveredLists()[0]).hasClass("overed"), 
		"drop될 첫번째 .droppable 엘리먼트에 'overed' 클래스명이 추가된다."
	);
	welDrag.fireEvent("mousemove", {
		clientX:htOffset.left + 280,
		clientY:htOffset.top + 130
	});
	ok(oDropArea.getOveredLists()[0] == aDroppable[1] 
		&& jindo.$Element(oDropArea.getOveredLists()[0]).hasClass("overed"), 
		"drop될 두번째 .droppable 엘리먼트에 'overed' 클래스명이 추가된다."
	);
	welDrag.fireEvent("mousemove", {
		clientX:htOffset.left + 240,
		clientY:htOffset.top + 100
	});
	ok(oDropArea.getOveredLists().length == 2 
		&& jindo.$Element(oDropArea.getOveredLists()[0]).hasClass("overed")
		&& jindo.$Element(oDropArea.getOveredLists()[1]).hasClass("overed"), 
		"중첩된 부분에 마우스오버된 경우 2개의 엘리먼트 모두 'overed' 클래스명이 추가된다."
	);
	
	stop();
	setTimeout(function(){
		welDrag.fireEvent("mousemove", {
			clientX:htOffset.left,
			clientY:htOffset.top
		}).fireEvent("mouseup", {
			left:true
		});
		ok(!oDragArea.isDragging(), "mouseup이벤트가 발생하면 oDragArea.isDragging()은 false를 리턴한다.");
		start();
	}, 100);
});

test("마우스커서가 드랍될 엘리먼트를 직접 가리킬 수 없는 경우의 드랍 (드래그될 엘리먼트가 커서에 붙어서 움직이는 경우)", function(){
	var oDragArea = oMagneticDragArea;
	var oDropArea = oMagneticDropArea;
	aMagneticDropped = [];
	
	var welDrag = jindo.$Element("drag1");
	var aDroppable = jindo.$$(".droppable");
	var htOffset = welDrag.offset();
	welDrag.fireEvent("mousedown", {
		left:true,
		clientX:htOffset.left,
		clientY:htOffset.top
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 20,
		clientY:htOffset.top + 20
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 240,
		clientY:htOffset.top + 100
	});
	
	stop();
	setTimeout(function(){
		welDrag.fireEvent("mouseup", {
			left:true
		});
		ok(!oDragArea.isDragging(), "mouseup이벤트가 발생하면 oDragArea.isDragging()은 false를 리턴한다.");
		ok(aMagneticDropped.length == 2 && 
			aMagneticDropped[0] == jindo.$("drag1") &&
			aMagneticDropped[1] == jindo.$("drag1"), 
			"drop될 영역에 drag된 엘리먼트가 제대로 drop이 되면 drop 커스텀 이벤트가 발생한다.");
		start();
	}, 100);
});

test("마우스커서가 드랍될 엘리먼트를 직접 가리킬 수 있는 경우의 드래그 (드래그될 엘리먼트가 임시 엘리먼트로 생성되어 보이는 경우)", function(){
	var oDragArea = oPointingDragArea;
	var oDropArea = oPointingDropArea;
	
	var welDrag = jindo.$Element("drag2");
	var welDropArea = jindo.$Element("ui");
	var aDroppable = jindo.$$(".droppable");
	var htOffset = welDrag.offset();
	welDrag.fireEvent("mousedown", {
		left:true,
		clientX:htOffset.left,
		clientY:htOffset.top
	});
	jindo.$Element(aDroppable[1]).fireEvent("mousemove", {
		clientX:htOffset.left,
		clientY:htOffset.top + 100
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 170,
		clientY:htOffset.top + 20
	}).fireEvent("mouseover");

	ok(oDropArea.getOveredLists().length == 1 
		&& jindo.$Element(oDropArea.getOveredLists()[0]).hasClass("overed"),
		"중첩된 부분에 마우스오버되어도 직접 포인팅 할 수 없기 때문에 1개의 .droppable 엘리먼트에만 'overed' 클래스명이 추가된다."
	);

	return;
	
	welDropArea.fireEvent("mousemove", {
		clientX:htOffset.left + 300,
		clientY:htOffset.top - 300
	}).fireEvent("mouseout");
	
	jindo.$Element(aDroppable[1]).fireEvent("mouseout");
	
	stop();
	setTimeout(function(){
		welDrag.fireEvent("mouseup", {
			left:true
		});
		ok(!oDragArea.isDragging(), "mouseup이벤트가 발생하면 oDragArea.isDragging()은 false를 리턴한다.");
		start();
	}, 100);
});

test("마우스커서가 드랍될 엘리먼트를 직접 가리킬 수 있는 경우의 드랍 (드래그될 엘리먼트가 임시 엘리먼트로 생성되어 보이는 경우)", function(){

	var oDragArea = oPointingDragArea;
	var oDropArea = oPointingDropArea;
	aPointingDropped = [];
	
	var welDrag = jindo.$Element("drag2");
	var welDocument = jindo.$Element(document.body);
	var aDroppable = jindo.$$(".droppable");
	var htOffset = welDrag.offset();
	welDrag.fireEvent("mousedown", {
		left:true,
		clientX:htOffset.left,
		clientY:htOffset.top
	});
	jindo.$Element(aDroppable[1]).fireEvent("mousemove", {
		clientX:htOffset.left + 20,
		clientY:htOffset.top + 20
	}).fireEvent("mousemove", {
		clientX:htOffset.left + 170,
		clientY:htOffset.top + 20
	}).fireEvent("mouseover");
	
	welDrag.fireEvent("mouseup", {
		left:true
	});
	ok(aPointingDropped.length == 1 && 
		aPointingDropped[0] == jindo.$("phantom"), 
		"drop될 영역에 drag된 엘리먼트가 제대로 drop이 되면 drop 커스텀 이벤트가 발생한다.");
});
