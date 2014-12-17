module("", {
	setup : function() {
		this.oInst = new jindo.ScrollBar("scrollbar");
	},

	teardown : function() {
		this.oInst.deactivate();
	}
});

test("", function(){
	ok(true);
});
