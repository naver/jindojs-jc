module("", {
	setup : function() {
		this.oInst = new jindo.Slider(jindo.$('gamma'), { nMinValue : 100, nMaxValue : 200 });
	},
	teardown : function() {
		this.oInst.deactivate();
	}
});

test("", function(){
	ok(true);
});
