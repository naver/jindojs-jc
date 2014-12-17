var _mouse = jindo.$Event.prototype.mouse;
jindo.$Event.prototype.mouse = function() {
	return _mouse.apply(this, []);
};

var oSelectArea = new jindo.SelectArea(jindo.$("select"), {
	sClassName : "selectable",
	bMultiSelection : true,
	bDragSelect : true,
	nThreshold : 5
}).attach({
	selectStart : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},	
	beforeSelect : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	select : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	beforeDeselect : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	deselect : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	change : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	selectEnd : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	
	dragStart : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	},
	dragSelecting : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent.aSelectable);
	},
	dragEnd : function(oCustomEvent) {
		//console.log(oCustomEvent.sType, oCustomEvent);
	}
});

mock.setEventHandler('mousedown', jindo.$Fn(oSelectArea._onMouseDown, oSelectArea).bind());
mock.setEventHandler('mouseup', jindo.$Fn(oSelectArea._onMouseUp, oSelectArea).bind());
mock.setEventHandler('mousemove', jindo.$Fn(oSelectArea._onMouseMove, oSelectArea).bind());

module("", {
	setup : function() {
		this.aSelectable = oSelectArea.getSelectableElement();
	}
});
test("getSelectableElement() / isSelectable() / getIndex()", function(){
	ok(this.aSelectable instanceof Array, "getSelectableElement() 메소드는 선택가능한 엘리먼트의 배열을 리턴한다.");
	jindo.$A(this.aSelectable).forEach(function(el, nIndex){
		ok(oSelectArea.getIndex(el) == nIndex, "getIndex()는 선택가능한 엘리먼트가 몇번째 엘리먼트인지 리턴한다.");
	});
	ok(oSelectArea.isSelectable(this.aSelectable[0]), "isSelectable()은 선택가능한 엘리먼트인지 리턴한다.");
	ok(!oSelectArea.isSelectable(document.body), "isSelectable(document.body)는 false를 리턴한다.");
});

test("select() / deselect() / deselectAll() / getSelected() / isSelected()", function(){
	oSelectArea.select(this.aSelectable[0]);
	ok(oSelectArea.getSelected() == this.aSelectable[0], "select(el1) 메소드를 수행하면 el1이 선택되고 getSelected() 호출시 el을 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	
	oSelectArea.select(this.aSelectable[1]);
	ok(oSelectArea.getSelected() == this.aSelectable[1], "select(el2) 메소드를 수행하면 기존 선택된 el1이 선택해제되고 getSelected() 호출시 el2을 리턴한다.");
	ok(!oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 false를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	
	oSelectArea.select(this.aSelectable[2], true);
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 2, "select(el3, true)를 수행하면 기존 선택된 el2가 남아있는채로 el3이 선택되어 getSelected()의 length는 2이다.");
	ok(aSelected[0] == this.aSelectable[1] && aSelected[1] == this.aSelectable[2], "getSelected()의 첫번째 값은 el2, 두번째 값은 el3이다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	
	oSelectArea.deselect(this.aSelectable[1]);
	ok(oSelectArea.getSelected() == this.aSelectable[2], "deselect(el2)를 수행하면 getSelected()의 값은 el3이다.");
	ok(!oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 false를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	
	oSelectArea.deselectAll();
	ok(oSelectArea.getSelected() == null, "deselectAll()를 수행하면 getSelected()의 값은 null이다.");
});

test("select, deselect by mousedown, mouseup", function(){
	jindo.$Element(this.aSelectable[0]).mock_fireEvent("mousedown");
	ok(oSelectArea.getSelected() == this.aSelectable[0], "el1에 mousedown 발생하면 el1이 선택되고 getSelected() 호출시 el을 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[1]).mock_fireEvent("mousedown");
	ok(oSelectArea.getSelected() == this.aSelectable[1], "el2에 mousedown 발생하면 기존 선택된 el1이 선택해제되고 getSelected() 호출시 el2을 리턴한다.");
	ok(!oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 false를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[1].parentNode).mock_fireEvent("mouseup");
	ok(oSelectArea.getSelected() == null, "셀렉트가능하지 않은 영역에 mouseup 발생하면 getSelected()의 값은 null이다.");
	ok(!oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 false를 리턴한다.");
});

test("select, deselect by mousedown, mouseup (with shift/ctrl)", function(){

	jindo.$Element(this.aSelectable[0]).mock_fireEvent("mousedown", { left : true, shift : true });
	ok(oSelectArea.getSelected() == this.aSelectable[0], "el1에 mousedown 발생하면 el1이 선택되고 getSelected() 호출시 el을 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[2]).mock_fireEvent("mousedown", { left : true, shift : true });
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 3, "shift키가 눌러진상태에서 el3 선택시 el1, el2, el3이 선택되어 getSelected()의 length는 3이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[4]).mock_fireEvent("mousedown", { ctrl : true, meta : true });
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 4, "ctrl(맥에서는 meta)키가 눌러진상태에서 el5선택시 el1, el2, el3, el5가 선택되어 getSelected()의 length는 4이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el3)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[6]).mock_fireEvent("mousedown", { ctrl : true, meta : true });
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 5, "ctrl(맥에서는 meta)키가 눌러진상태에서 el7선택시 el1, el2, el3, el5, el7가 선택되어 getSelected()의 length는 5이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el5)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[6]), "isSelected(el7)는 true를 리턴한다.");
	
	jindo.$Element(this.aSelectable[8]).mock_fireEvent("mousedown", { ctrl : true, meta : true, shift : true });
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 7, "ctrl(맥에서는 meta) + shift키가 눌러진상태에서 el9선택시 el1, el2, el3, el5, el7, el8, el9가 선택되어 getSelected()의 length는 7이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el5)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[6]), "isSelected(el7)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[7]), "isSelected(el8)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[8]), "isSelected(el9)는 true를 리턴한다.");
	
	jindo.$Element(this.aSelectable[0]).mock_fireEvent("mousedown", { ctrl : true, meta : true });
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 6, "ctrl(맥에서는 meta)키가 눌러진상태에서 el1선택시 el1만 선택해제되고 el2, el3, el5, el7, el8, el9가 선택되어 getSelected()의 length는 6이다.");
	ok(!oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 false를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el5)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[6]), "isSelected(el7)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[7]), "isSelected(el8)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[8]), "isSelected(el9)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[1]).mock_fireEvent("mousedown");
	ok(oSelectArea.getSelected() != this.aSelectable[1], "선택된 엘리먼트 내에서 다시 선택하려고 할때는 마우스다운에는 선택이 되지 않는다.");
	jindo.$Element(this.aSelectable[1]).fireEvent("mouseup");
	ok(oSelectArea.getSelected() == this.aSelectable[1], "선택된 엘리먼트 내에서 다시 선택하려고 할때는 마우스업시에 선택이 된다.");
	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mousedown");
	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mouseup");
	ok(oSelectArea.getSelected() == null, "셀렉트가능하지 않은 영역에 mousedown 발생하면 getSelected()의 값은 null이다.");
});

test("select, deselect by drag / isDragging() / stopDragging()", function(){

	var elArea = jindo.$("select");
	ok(!oSelectArea.isDragging(), "isDragging()은 드래그가 시작되기 전에는 false를 리턴한다.");
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousedown", {
		left:true,
		clientX:0, clientY:0,
		pageX:0, pageY:0
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:1, clientY:1,
		pageX:1, pageY:1
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:10,
		pageX:200, pageY:10
	});
	ok(oSelectArea.isDragging(), "isDragging()은 드래그가 시작되면 true를 리턴한다.");
	oSelectArea.stopDragging()
	ok(!oSelectArea.isDragging(), "stopDragging() 호출 후에는 isDragging()은 false를 리턴한다.");
	
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousedown", {
		left:true,
		clientX:0, clientY:0,
		pageX:0, pageY:0
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:1, clientY:1,
		pageX:1, pageY:1
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:10,
		pageX:200, pageY:10
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:50,
		pageX:200, pageY:50
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:70,
		pageX:200, pageY:70
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:200,
		pageX:200, pageY:200
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, clientY:150,
		pageX:200, pageY:150
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mouseup", {
		clientX:200, clientY:150,
		pageX:200, pageY:150
	});

	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 6, "drag로 선택한 getSelected()의 length는 6이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[3]), "isSelected(el4)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el5)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[5]), "isSelected(el6)는 true를 리턴한다.");
	
	oSelectArea.deselect([this.aSelectable[1], this.aSelectable[3], this.aSelectable[5]]);
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 3, "el1,3,5를 deselect한 후 getSelected() length는 3이다.");
	ok(oSelectArea.isSelected(this.aSelectable[0]), "isSelected(el1)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[2]), "isSelected(el3)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[4]), "isSelected(el5)는 true를 리턴한다.");

	jindo.$Element(jindo.$("select")).mock_fireEvent("mousedown", {
		left:true,
		ctrl:true,
		meta:true,
		clientX:0, clientY:0,
		pageX:0, pageY:0
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		left:true,
		ctrl:true,
		meta:true,
		clientX:1, clientY:1,
		pageX:1, pageY:1
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		left:true,
		ctrl:true,
		meta:true,
		clientX:200,
		clientY:10,
		pageX:200, pageY:10
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200,
		clientY:50,
		pageX:200, pageY:50
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200,
		clientY:70,
		pageX:200, pageY:70
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200, 
		clientY:200,
		pageX:200, pageY:200
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mousemove", {
		clientX:200,
		clientY:150,
		pageX:200, pageY:150
	});
	jindo.$Element(jindo.$("select")).mock_fireEvent("mouseup", {
		clientX:200,
		clientY:150,
		pageX:200, pageY:150
	});
	
	var aSelected = oSelectArea.getSelected();
	ok(aSelected.length == 3, "ctrl(맥에서는 meta)키가 눌러진상태에서 드래그 선택시 기존 선택값은 toggle 되어 getSelected()의 length는 3이다.");
	ok(oSelectArea.isSelected(this.aSelectable[1]), "isSelected(el2)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[3]), "isSelected(el4)는 true를 리턴한다.");
	ok(oSelectArea.isSelected(this.aSelectable[5]), "isSelected(el6)는 true를 리턴한다.");

	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mousedown");
	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mouseup");
	ok(oSelectArea.getSelected() == null, "셀렉트가능하지 않은 영역에 mousedown, mouseup이 발생하면 getSelected()의 값은 null이다.");
	
	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mousedown");
	jindo.$Element(this.aSelectable[1].parentNode).fireEvent("mouseup");
});

test("activate() / deactivate() / isActivating()", function(){

	ok(oSelectArea.isActivating(), "isActivating()은 true를 리턴한다.");
	ok(oSelectArea.deactivate());
	ok(!oSelectArea.isActivating(), "deactivate()이후에 isActivating()은 false를 리턴한다.");
	ok(oSelectArea.activate());
	ok(oSelectArea.isActivating(), "activate()이후에 isActivating()은 true를 리턴한다.");
});
