module("", {
	setup : function() {
	
		this.oInst = new jindo.DynamicTree(jindo.$('tree'), {
			sClassPrefix: 'tree-',
			sUrl : "http://ajaxui.nhndesign.com/docs/components/samples/response/DynamicTreeData.php"
		});
		
	},
	teardown : function() {

		this.oInst.deactivate();

	}
});

test("", function(){
	ok(true);
});
