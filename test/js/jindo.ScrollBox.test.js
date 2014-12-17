module("", {
	setup : function() {
		this.oInst = new jindo.ScrollBox("scrollbox", {
			bAdjustThumbSize : true, 
			sOverflowX : "auto",
			sOverflowY : "auto"
		});
	},
	teardown : function() {

	}
});

test("", function(){
	ok(true);
});
