var oFloatingLayer1 = new jindo.FloatingLayer(jindo.$('layer1'), {
	nDelay : 0,
	nDuration : 300
});

var oFloatingLayer2 = new jindo.FloatingLayer(jindo.$('layer2'), {
	nDelay : 0,
	nDuration : 300
});

var elDoc = document.documentElement;
if (jindo.$Agent().navigator().safari || jindo.$Agent().navigator().chrome ) {
	elDoc = document.body;
}

test("getTransition()", function(){
	ok(oFloatingLayer1.getTransition() instanceof jindo.Transition, "getTransition() 메소드는 내부에서 사용된 jindo.Transition 인스턴스를 리턴한다.");
});

test("getTimer()", function(){
	ok(oFloatingLayer1.getTimer() instanceof jindo.Timer, "getTimer() 메소드는 내부에서 사용된 jindo.Timer 인스턴스를 리턴한다.");
});

asyncTest("scrollTop 변경시 1", function(){
	var nPrevTop1 = jindo.$Element("layer1").offset().top;
	
	oFloatingLayer1.getTransition().attach({
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(nPrevTop1 + elDoc.scrollTop === jindo.$Element("layer1").offset().top, "레이어의 top 값은 문서의 scroll에 따라 조절된다.");
			
			oFloatingLayer1.getTransition().attach({
				end : function(oCustomEvent) {
					this.detach(oCustomEvent.sType, arguments.callee);
					ok(nPrevTop1 + elDoc.scrollTop === jindo.$Element("layer1").offset().top, "레이어의 top 값은 문서의 scroll에 따라 조절된다.");
					start();
				}
			});
			elDoc.scrollTop = 0;
		}
	});
	elDoc.scrollTop = 100;
});

asyncTest("scrollTop 변경시 2", function(){
	var nPrevTop2 = jindo.$Element("layer2").offset().top;
	
	oFloatingLayer2.getTransition().attach({
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(nPrevTop2 + elDoc.scrollTop === jindo.$Element("layer2").offset().top, "레이어의 top 값은 문서의 scroll에 따라 조절된다.");
			
			oFloatingLayer2.getTransition().attach({
				end : function(oCustomEvent) {
					this.detach(oCustomEvent.sType, arguments.callee);
					ok(nPrevTop2 + elDoc.scrollTop === jindo.$Element("layer2").offset().top, "레이어의 top 값은 문서의 scroll에 따라 조절된다.");
					start();
				}
			});
			elDoc.scrollTop = 0;
		}
	});
	elDoc.scrollTop = 100;
});

test("activate() / deactivate()", function() {
	oFloatingLayer1.deactivate();
	ok(!oFloatingLayer1.isActivating(), "deactivate() 메소드 수행후 isActivate()는 false를 리턴한다.");
	oFloatingLayer1.activate();
	ok(oFloatingLayer1.isActivating(), "activate() 메소드 수행후 isActivate()는 true를 리턴한다.");
});
