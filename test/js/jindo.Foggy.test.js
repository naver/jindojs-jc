var oFoggy = new jindo.Foggy({
	sClassName : "fog",
	nShowDuration : 200, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)
	nShowOpacity : 0.7, //(jindo.Effect) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)    
	nHideDuration : 100, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)
	nHideOpacity : 0.1, //(jindo.Effect) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
	fShowEffect : jindo.Effect.cubicEase,
	fHideEffect : jindo.Effect.linear
});

module("", {
	setup : function() {
	}
});
test("getFog()", function(){
	var el = oFoggy.getFog();
	var wel = jindo.$Element(el);
	ok(wel.hasClass(oFoggy.option("sClassName")), "getFog() 메소드는 옵션의 sClassName 값을 클래스명으로 가지는 추가된 fog레이어를 리턴한다.");
	ok(el.parentNode === document.body, "추가된 fog레이어는 document.body의 자식엘리먼트이다.")
});

asyncTest("show() / hide() / isShown()", function(){
	oFoggy.attach({
		show : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(this.isShown(), "show() 메소드가 실행되면 isShown() 메소드는 true를 리턴한다.")
			this.hide();
		},
		hide : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(!this.isShown(), "hide() 메소드가 실행되면 isShown() 메소드는 false를 리턴한다.")
			start();
		}
	});
	ok(!oFoggy.isShown(), "show() 메소드가 실행되기 전 isShown() 메소드는 false를 리턴한다.")
	oFoggy.show();
});

asyncTest("show(element) / resize시 재계산", function(){
	oFoggy.attach({
		show : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(this.isShown(), "show() 메소드가 실행되면 isShown() 메소드는 true를 리턴한다.")
			try { window.resizeBy(-100, -100); } catch(e) {}
			this._fitFogToDocumentScrollSize();
			try { window.resizeBy(100, 100); } catch(e) {}
			
			var self = this;
			setTimeout(function(){
				self.hide();
			}, 500);
		},
		hide : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(!this.isShown(), "hide() 메소드가 실행되면 isShown() 메소드는 false를 리턴한다.")
			start();
		}
	});
	ok(!oFoggy.isShown(), "show() 메소드가 실행되기 전 isShown() 메소드는 false를 리턴한다.")
	oFoggy.show(jindo.$("except"));
});

asyncTest("custom event : beforeShow", function(){
	oFoggy.attach({
		beforeShow : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			oCustomEvent.stop();
			ok(!this.isShown(), "beforeShow 커스텀이벤트 핸들러에서 stop() 수행시 isShown() 메소드는 false를 리턴하고 show 커스텀이벤트가 발생하지 않는다.")
			start();
		}
	});
	oFoggy.show();
});

asyncTest("custom event : beforeHide", function(){
	oFoggy.attach({
		show : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(this.isShown(), "show() 메소드가 실행되면 isShown() 메소드는 true를 리턴한다.")
			this.hide();
		},
		beforeHide : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(this.isShown(), "beforeHide 커스텀이벤트 핸들러에서 stop() 수행시 isShown() 메소드는 true를 리턴하고 hide 커스텀이벤트가 발생하지 않는다.");
			start();
			//console.log('beforeHide');
		}
	});
	oFoggy.show();
});
