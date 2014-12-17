module("", {
	setup : function() {
		this.oldHTML = jindo.$('s').innerHTML;
		this.oInst = new jindo.SelectBox(jindo.$("s"));
	},

	teardown : function() {
		this.oInst.deactivate();
		jindo.$('s').innerHTML = this.oldHTML;
	}
});

test("레이어 열고 닫기", function(){

	equal(jindo.$Element('s').hasClass('selectbox-open'), false);

	var elBox = jindo.$$.getSingle('#s .selectbox-box'); 
	jindo.$Element(elBox).fireEvent('mousedown');

	setTimeout(function() {
		equal(jindo.$Element('s').hasClass('selectbox-open'), true);
	}, 100);

});

test("selectedIndex 변경하기", function(){

	equal(this.oInst.getSelectedIndex(), 0);
	equal(this.oInst.getValue(), '1');
	
	this.oInst.setSelectedIndex(2);
	equal(this.oInst.isSelected(), true ,"isSelected()를 호출하면, 선택된 값이 존재 여부를 return한다.(2를 선택했으므로 true가 return된다.).");
	equal(this.oInst.getSelectedIndex(), 2, "getSelectedIndex()를 호출하면, 현재 선택되어있는 index를 리턴한다.(기대값:2)");
	equal(this.oInst.getValue(), '3', "getValue()를 호출하면, 현재 선택되어있는 index의 value를 리턴한다.(기대값:3).");
});

test("포커스 준 이후 액션", function(){

	var oInst = this.oInst;

	equal(jindo.$Element('s').hasClass('selectbox-focused'), false);

	var elBox = jindo.$$.getSingle('#s .selectbox-box'); 
	var welSrc = jindo.$Element(oInst.getSelectElement());
	
	jindo.$Element(elBox).fireEvent('mousedown');

	setTimeout(function() {
		equal(jindo.$Element('s').hasClass('selectbox-focused'), true);
		start();
	}, 100);

	stop();
});
