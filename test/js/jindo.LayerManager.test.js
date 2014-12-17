var elLayer1 = jindo.$("layer1");
var welLayer1 = jindo.$Element(elLayer1);
var elLayer2 = jindo.$("layer2");
var welLayer2 = jindo.$Element(elLayer2);
var elButton = jindo.$("button");
var welButton = jindo.$Element(elButton);
var oLayerManager = new jindo.LayerManager(elLayer1, { 
	sCheckEvent : 'click', // {String} 어떤 이벤트가 발생했을 때 레이어를 닫아야 하는지 설정
	nCheckDelay : 100, //{Number} 지정된 시간 내에 다시 링크된 엘리먼트에 mouseover되는 경우 레이어가 숨기지 않도록 지정
	nShowDelay : 100, //{Number} 보여주도록 명령을 한 뒤 얼마 이후에 실제로 보여질지 지연시간 지정 (ms)
	nHideDelay : 100, //{Number} 숨기도록 명령을 한 뒤 얼마 이후에 실제로 숨겨지게 할지 지연시간 지정 (ms)
	sMethod : "show", //{String} "fade", "slide" 보이고 숨길 방법 설정 (Transition 컴포넌트 사용)
	nDuration : 300 
});

jindo.$Fn(function(){
	oLayerManager.toggle();
}).attach(elButton, "click");

module("LayerManager : Basic", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
		welLayer1.hide();
	}
});
test("getLayer() / setLayer()", function(){
	ok(oLayerManager.getLayer() === elLayer1, "getLayer() 메소드는 jindo.$('layer1')을 리턴한다.");
	ok(oLayerManager.setLayer(elLayer2) === oLayerManager, "setLayer(jindo.$('layer2'); 메소드는 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLayer() === elLayer2, "getLayer() 메소드는 jindo.$('layer2')을 리턴한다.");  
});
test("getVisible()", function(){
	ok(oLayerManager.getVisible() === false, "getVisible() 메소드는 레이어가 보이는지 여부를 리턴한다.");
	welLayer1.show();
	ok(oLayerManager.getVisible() === true, "레이어가 보이는 상황에서 getVisible() 메소드는 true를 리턴한다.");
});

module("show", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
		welLayer1.hide();
		
		oLayerManager.attach({
			show : function(oCustomEvent) {
				this.detach("show", arguments.callee);
				start();
				ok(oLayerManager.getVisible() === true, "레이어가 보여야 한다.");
			}
		})
	}
});
asyncTest("show()", function(){
	ok(oLayerManager.show() === oLayerManager, "show() 메소드는 레이어가 보이게하고 (display:block) 인스턴스 자신을 리턴한다.");
});

module("hide", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
		welLayer1.show();
		
		oLayerManager.attach({
			hide : function(oCustomEvent) {
				this.detach("hide", arguments.callee);
				start();
				ok(oLayerManager.getVisible() === false, "레이어가 보이지 않아야 한다.");
			}
		})
	}
});
asyncTest("hide()", function(){
	ok(oLayerManager.hide() === oLayerManager, "hide() 메소드는 레이어가 보이지 않게하고 (display:none) 인스턴스 자신을 리턴한다.");
});

module("toggle()", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
		oLayerManager.link(elLayer1, elButton);
		oLayerManager.option({
			nShowDelay : 0,
			nHideDelay : 0
		});
		
		oLayerManager.attach({
			show : function(oCustomEvent) {
				this.detach("show", arguments.callee);
				ok(oLayerManager.getVisible() === true, "toggle()을 수행하면 레이어가 보여야 한다.");
				this.toggle();
			},
			hide : function(oCustomEvent) {
				this.detach("hide", arguments.callee);
				start();
				ok(oLayerManager.getVisible() === false, "다시 toggle()을 수행하면 레이어가 보이지 않아야 한다.");
			}
		});
	}
});
asyncTest("toggle() : show", function(){
	ok(oLayerManager.getVisible() === false, "레이어는 보이지 않는 상태이다.");
	oLayerManager.toggle();
});

module("link", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
	}
});
test("setLinks() / getLinks() / link() / unlink()", function(){
	ok(oLayerManager.setLinks([elLayer1]) === oLayerManager, "setLinks([elLayer1]);는 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLinks().length === 1, "getLinks();의 길이는 [elLayer1] 가 설정되었으므로 1이다.");
	ok(oLayerManager.link(elButton) === oLayerManager, "link(elButton);은 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLinks().length === 2, "getLinks();의 길이는 [elLayer1, elButton] 가 설정되었으므로 2이다.");
	ok(oLayerManager.link(elButton, elLayer2) === oLayerManager, "link(elButton, elLayer2);는 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLinks().length === 3, "getLinks();의 길이는 중복이 제거되고 [elLayer1, elLayer2, elButton] 가 설정되었으므로 3이다.");
	ok(oLayerManager.unlink(elButton) === oLayerManager, "unlink(elButton);은 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLinks().length === 2, "getLinks();의 길이는 unlink(elButton)이 실행되었으므로 [elLayer1, elLayer2] 가 설정되었으므로 2이다.");
	ok(oLayerManager.unlink(elLayer1, elLayer2, elButton) === oLayerManager, "unlink(elLayer1, elLayer2, elButton);는 인스턴스 자신을 리턴한다.");
	ok(oLayerManager.getLinks().length === 0, "getLinks();의 길이는 모두 unlink 되었으므로 0이다.");
});

test("beforeHide 이벤트에서 stop 안했을때 _bIsHiding 변수가 false 가 되는지 확인", function() {

	oLayerManager.show();
	equal(oLayerManager._bIsHiding, false, '숨기고 있는 중이 아님');
	oLayerManager.hide(100);
	equal(oLayerManager._bIsHiding, true, '숨기고 있는 중임');

	setTimeout(function() {
		equal(oLayerManager._bIsHiding, false, '숨기고 있는 중이 아님');
		start();
	}, 200);
	
	stop();

});



test("beforeHide 이벤트에서 stop 했을때 _bIsHiding 변수가 false 가 되는지 확인", function() {

	var fpHandler = function(oCustomEvent) {
		oCustomEvent.stop();
	};

	oLayerManager.attach('beforeHide', fpHandler);
	
	oLayerManager.show();
	equal(oLayerManager._bIsHiding, false, '숨기고 있는 중이 아님');
	oLayerManager.hide(100);
	equal(oLayerManager._bIsHiding, true, '숨기고 있는 중임');
	
	setTimeout(function() {
		equal(oLayerManager._bIsHiding, false, '숨기고 있는 중이 아님');
		oLayerManager.detach('beforeHide', fpHandler);
		start();
	}, 500);
	stop();

});

test("show/hide 의 delay 로 -1 를 썼을때 바로 보여지고 사라지는지 확인", function() {
	
	oLayerManager.show(-1);
	equal(oLayerManager.getVisible(), true, '이미 보여짐');
	oLayerManager.hide(-1);
	equal(oLayerManager.getVisible(), false, '이미 숨겨짐');
	oLayerManager.show(-1);
	equal(oLayerManager.getVisible(), true, '이미 보여짐');
	oLayerManager.hide(-1);
	equal(oLayerManager.getVisible(), false, '이미 숨겨짐');

});

module("check event", {
	setup : function() {
		oLayerManager.setLayer(elLayer1);
		oLayerManager.link(elLayer1, elButton);
		
		oLayerManager.attach({
			hide : function(oCustomEvent) {
				this.detach("hide", arguments.callee);
				start();
				ok(oLayerManager.getVisible() === false, "레이어가 보이지 않아야 한다.");
			}
		});
	}
});

test("document.body 클릭시 레이어 감추기", function(){
	jindo.$Element(document.body).fireEvent("click");
	welLayer1.show();
	jindo.$Element(document.body).fireEvent("click");
	ok(true);
});
asyncTest("link된 엘리먼트 클릭시에는 레이어를 감추지 않음", function(){
	oLayerManager.attach({
		ignore : function(oCustomEvent) {
			this.detach("ignore", arguments.callee);
			start();
			
			ok(oLayerManager.getVisible() === true, "레이어가 숨겨지지 않아야 한다.");
		}
	})
	welLayer1.show();
	welLayer1.fireEvent("click");
});
test("deactivate() 되었을 경우에는 이벤트를 감지하지 않음", function(){
	oLayerManager.deactivate();
	welLayer1.show();
	welLayer1.fireEvent("click");
	ok(oLayerManager.getVisible() === true, "레이어가 숨겨지지 않아야 한다.");
	oLayerManager.activate();
});
