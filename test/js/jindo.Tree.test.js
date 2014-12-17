module("", {
	setup : function() {
		this.oldHTML = jindo.$('tree').innerHTML;
		this.oTree = new jindo.Tree(jindo.$('tree'));
	},

	teardown : function() {
		this.oTree.deactivate();
		jindo.$('tree').innerHTML = this.oldHTML;
	}
});

test("노드 접고 펼치기", function(){

	var elButton = jindo.$$.getSingle('.tree-node > div:contains(맹수) > .tree-button');
	var elNode = jindo.$$.getSingle('! .tree-node', elButton);

	equal(jindo.$Element(elNode).hasClass('tree-collapsed'), false);
	equal(this.oTree.isCollapsed(elNode), false);
	
	jindo.$Element(elButton).fireEvent('click');
	equal(jindo.$Element(elNode).hasClass('tree-collapsed'), true);
	equal(this.oTree.isCollapsed(elNode), true);
	
});

test("노드 선택", function(){

	ok(jindo.$$.getSingle('> div:contains(사자)', this.oTree.getSelectedNode()), '사자 노드가 선택되어 있는 상태');
	equal(this.oTree.getNodeDepth(this.oTree.getSelectedNode()), 3, '사자 노드의 깊이는 3');
	equal(this.oTree.hasChild(this.oTree.getSelectedNode()), false, '사자 노드는 자식노드가 없음');
	equal(this.oTree.getChildNodes(this.oTree.getSelectedNode()).length, 0, '사자 노드는 자식노드가 없음');
	
	var elLabel = jindo.$$.getSingle('.tree-node > div:contains(맹수) > .tree-label');
	var elDiv = jindo.$$.getSingle('! div', elLabel);

	equal(jindo.$Element(elDiv).hasClass('tree-selected'), false);
	jindo.$Element(elLabel).fireEvent('click');
	equal(jindo.$Element(elDiv).hasClass('tree-selected'), true);

	ok(jindo.$$.getSingle('> div:contains(맹수)', this.oTree.getSelectedNode()), '맹수 노드가 선택되어 있는 상태');
	equal(this.oTree.getNodeDepth(this.oTree.getSelectedNode()), 2, '맹수 노드의 깊이는 2');
	equal(this.oTree.hasChild(this.oTree.getSelectedNode()), true, '맹수 노드는 자식노드가 있음');
	equal(this.oTree.getChildNodes(this.oTree.getSelectedNode()).length, 4, '맹수 노드는 자식노드가 있음');
	
});

test("노드 생성", function(){

	var aNewNodes = this.oTree.createNode(
		[{ 
			sLabel : "hello",
			_aChildren : [ 
				{sLabel : 'world'}, 
				{sLabel : 'kuku'}
			] 
		}]
	);

	var elNode = jindo.$$.getSingle('.tree-node > div:contains(사자) > .tree-button ! .tree-node');

	equal(this.oTree.hasChild(elNode), false, '사자 노드는 자식노드가 없음');
	this.oTree.appendNode(elNode, aNewNodes);
	equal(this.oTree.hasChild(elNode), true, '사자 노드는 자식노드가 있음');
	equal(this.oTree.getChildNodes(elNode).length, 1, '사자 노드는 자식노드가 1개');

	var elChildNode = this.oTree.getChildNodes(elNode)[0];

	var aNewNodes = this.oTree.createNode([{ sLabel : "foo" }]);		
	this.oTree.insertNodeBefore(elChildNode, aNewNodes);
	equal(this.oTree.getChildNodes(elNode).length, 2, '사자 노드는 자식노드가 2개');

	var aNewNodes = this.oTree.createNode([{ sLabel : "baz" }]);		
	this.oTree.insertNodeAfter(elChildNode, aNewNodes);
	equal(this.oTree.getChildNodes(elNode).length, 3, '사자 노드는 자식노드가 3개');

});

test("노드 이동", function(){

	var elNode = jindo.$$.getSingle('.tree-node > div:contains(사자) > .tree-button ! .tree-node');

	elNode = this.oTree.getNextNode(elNode);
	ok(jindo.$$.getSingle('> div:contains(표범)', elNode), '표범 노드');

	elNode = this.oTree.getPreviousNode(elNode);
	ok(jindo.$$.getSingle('> div:contains(사자)', elNode), '사자 노드');

	elNode = this.oTree.getParentNode(elNode);
	ok(jindo.$$.getSingle('> div:contains(맹수)', elNode), '맹수 노드');

	elNode = this.oTree.getRootNode(elNode);
	ok(jindo.$$.getSingle('> div:contains(루트노드)', elNode), '루트 노드');

});

test("노드 삭제", function(){

	var elNode = jindo.$$.getSingle('.tree-node > div:contains(사자) > .tree-button ! .tree-node');
	var elParentNode = this.oTree.getParentNode(elNode);

	equal(this.oTree.getChildNodes(elParentNode).length, 4, '맹수 노드의 자식노드 갯수');

	this.oTree.removeNode(elNode);
	equal(this.oTree.getChildNodes(elParentNode).length, 3, '맹수 노드의 자식노드 갯수');

	this.oTree.clearNode(elParentNode);
	equal(this.oTree.getChildNodes(elParentNode).length, 0, '맹수 노드의 자식노드 갯수');
	
});
