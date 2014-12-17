var oInst = new jindo.MouseGesture();
			
module("", {
	setup : function() {},
	teardown : function() {}
});

test("", function(){
	
	var sGestureCode = null;
	
	var oMockEvent = {
		mouse : function() { return this._mouse; },
		pos : function() { return this._pos; },
		stop : function() {}
	}
	
	var fpGesture = function(oCustomEvent) {
		sGestureCode = oCustomEvent.sCode;
	};
	
	oInst.attach('gesture', fpGesture);
	
	oMockEvent._mouse = { right : true };
	oMockEvent._pos = { clientX : 200, clientY : 200 };
	oInst._onMouseDown(oMockEvent);
	oMockEvent._pos = { clientX : 200, clientY : 300 };
	oInst._onMouseMove(oMockEvent);
	oMockEvent._pos = { clientX : 200, clientY : 400 };
	oInst._onMouseMove(oMockEvent);

	oMockEvent._pos = { clientX : 300, clientY : 400 };
	oInst._onMouseMove(oMockEvent);
	oMockEvent._pos = { clientX : 400, clientY : 400 };
	oInst._onMouseMove(oMockEvent);

	oMockEvent._pos = { clientX : 400, clientY : 300 };
	oInst._onMouseMove(oMockEvent);
	oMockEvent._pos = { clientX : 400, clientY : 200 };
	oInst._onMouseMove(oMockEvent);

	sGestureCode = null;
	oInst._onMouseUp(oMockEvent);
	equal(sGestureCode, '428');

	oInst.detach('gesture', fpGesture);

});
