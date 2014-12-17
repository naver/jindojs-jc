module("sMoveUnit : page", {
	setup : function() {

		this.orgHTML = jindo.$('ui1').innerHTML;

		this.oInst = new jindo.Pagination(jindo.$('ui1'), {
			nItem : 1000,
			nItemPerPage : 10,
			nPagePerPageList : 5,
			nPage : 1,
			sMoveUnit: "page"
		});
	
	},

	teardown : function() {
		this.oInst.deactivate();
		jindo.$('ui1').innerHTML = this.orgHTML;
	}
});

test("초기화 직후", function(){
	equal(jindo.$Element('ui1').text(), '12345다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '1', '1페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui1 .next')).fireEvent('click');
	equal(jindo.$Element('ui1').text(), '처음이전12345다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '2', '2페이지가 선택된 상태');
});

test("5페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui1 a:contains("5")')).fireEvent('click');
	equal(jindo.$Element('ui1').text(), '처음이전12345다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '5', '5페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui1 .next')).fireEvent('click');
	equal(jindo.$Element('ui1').text(), '처음이전678910다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '6', '6페이지가 선택된 상태');

	this.oInst.reset();
	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '1', '1페이지가 선택된 상태');
});

test("마지막페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui1 .next_end')).fireEvent('click');
	equal(jindo.$Element('ui1').text(), '처음이전96979899100', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '100', '100페이지가 선택된 상태');
});

test("특정 페이지로 점프", function(){
	this.oInst.movePageTo(27);
	equal(jindo.$Element('ui1').text(), '처음이전2627282930다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui1 strong')).text(), '27', '27페이지가 선택된 상태');
});

module("sMoveUnit : pagelist", {
	setup : function() {

		this.orgHTML = jindo.$('ui2').innerHTML;

		this.oInst = new jindo.Pagination(jindo.$('ui2'), {
			nItem : 1000,
			nItemPerPage : 10,
			nPagePerPageList : 5,
			nPage : 1,
			sMoveUnit: "pagelist"
		});
	
	},

	teardown : function() {
		this.oInst.deactivate();
		jindo.$('ui2').innerHTML = this.orgHTML;
	}
});

test("초기화 직후", function(){
	equal(jindo.$Element('ui2').text(), '12345다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '1', '1페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui2 .next')).fireEvent('click');
	equal(jindo.$Element('ui2').text(), '처음이전678910다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '6', '6페이지가 선택된 상태');
});

test("5페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui2 a:contains("5")')).fireEvent('click');
	equal(jindo.$Element('ui2').text(), '처음12345다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '5', '5페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui2 .next')).fireEvent('click');
	equal(jindo.$Element('ui2').text(), '처음이전678910다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '6', '6페이지가 선택된 상태');

	this.oInst.reset();
	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '1', '1페이지가 선택된 상태');
});

test("마지막페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui2 .next_end')).fireEvent('click');
	equal(jindo.$Element('ui2').text(), '처음이전96979899100', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '100', '100페이지가 선택된 상태');
});

test("특정 페이지로 점프", function(){
	this.oInst.movePageTo(27);
	equal(jindo.$Element('ui2').text(), '처음이전2627282930다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui2 strong')).text(), '27', '27페이지가 선택된 상태');
});

module("bAlignCenter : true", {
	setup : function() {

		this.orgHTML = jindo.$('ui3').innerHTML;

		this.oInst = new jindo.Pagination(jindo.$('ui3'), {
			nItem : 1000,
			nItemPerPage : 10,
			nPagePerPageList : 5,
			nPage : 1,
			bAlignCenter : true,
			sMoveUnit: "page"
		});
	
	},

	teardown : function() {
		this.oInst.deactivate();
		jindo.$('ui3').innerHTML = this.orgHTML;
	}
});

test("초기화 직후", function(){
	equal(jindo.$Element('ui3').text(), '12345다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '1', '1페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui3 .next')).fireEvent('click');
	equal(jindo.$Element('ui3').text(), '처음이전12345다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '2', '2페이지가 선택된 상태');
});

test("5페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui3 a:contains("5")')).fireEvent('click');
	equal(jindo.$Element('ui3').text(), '처음이전34567다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '5', '5페이지가 선택된 상태');

	jindo.$Element(jindo.$$.getSingle('#ui3 .next')).fireEvent('click');
	equal(jindo.$Element('ui3').text(), '처음이전45678다음마지막', '전체 페이지 목록 잘 나오는지');
	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '6', '6페이지가 선택된 상태');

	this.oInst.reset();
	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '1', '1페이지가 선택된 상태');
});

test("마지막페이지 클릭시", function(){
	jindo.$Element(jindo.$$.getSingle('#ui3 .next_end')).fireEvent('click');
	equal(jindo.$Element('ui3').text(), '처음이전96979899100', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '100', '100페이지가 선택된 상태');
});

test("특정 페이지로 점프", function(){
	this.oInst.movePageTo(27);
	equal(jindo.$Element('ui3').text(), '처음이전2526272829다음마지막', '전체 페이지 목록 잘 나오는지');

	equal(jindo.$Element(jindo.$$.getSingle('#ui3 strong')).text(), '27', '27페이지가 선택된 상태');
});
