var oLayerEffect = new jindo.LayerEffect("layer")
var htOption = {fCallback : function(){start()}};
module("show", {
	setup : function(){
	oLayerEffect.detachAll().attach({
		before : function(oCustomEvent) {
	//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
		},
		appear : function(oCustomEvent) {
	//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
		},
		end : function(oCustomEvent) {
			ok(jindo.$Element(oLayerEffect.getLayer()).visible(), "보여주기 메소드 실행후 end커스텀이벤트가 발생하고 나면 레이어는 보이는 상태이어야한다.");
			jindo.$Element(oLayerEffect.getLayer()).hide();
		}
	});
	}
});
asyncTest("fadeIn", function(){
	oLayerEffect.fadeIn(htOption);
});
asyncTest("slideDown", function(){
	oLayerEffect.slideDown(htOption);
});
asyncTest("grow", function(){
	oLayerEffect.grow(htOption);
});
asyncTest("unfold", function(){
	oLayerEffect.unfold(htOption);
});
asyncTest("pullUp", function(){
	oLayerEffect.pullUp(htOption);
});
asyncTest("condense", function(){
	oLayerEffect.condense(htOption);
});


module("hide", {
	setup : function(){
	jindo.$Element(oLayerEffect.getLayer()).show();
	oLayerEffect.detachAll().attach({
		before : function(oCustomEvent) {
	//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
		},
		appear : function(oCustomEvent) {
	//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
		},
		end : function(oCustomEvent) {
			ok(!jindo.$Element(oLayerEffect.getLayer()).visible(), "숨기기 메소드 실행후 end커스텀이벤트가 발생하고 나면 레이어는 보이지 않는 상태이어야한다.");
		}
	});
	}
});
asyncTest("fadeOut", function(){
	oLayerEffect.fadeOut(htOption);
});
asyncTest("slideUp", function(){
	oLayerEffect.slideUp(htOption);
});
asyncTest("shrink", function(){
	oLayerEffect.shrink(htOption);
});
asyncTest("fold", function(){
	oLayerEffect.fold(htOption);
});
asyncTest("pushDown", function(){
	oLayerEffect.pushDown(htOption);
});
asyncTest("expand", function(){
	oLayerEffect.expand(htOption);
});

module("highlight", { 
	setup : function(){
		jindo.$Element(oLayerEffect.getLayer()).show();
		oLayerEffect.detachAll().attach({
			before : function(oCustomEvent) {
		//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
			},
			appear : function(oCustomEvent) {
		//		console.log(oCustomEvent.sType, oCustomEvent.elLayer);
			},
			end : function(oCustomEvent) {
				ok(true);
			}
		});	
	}
});
asyncTest("shake()", function(){
	oLayerEffect.shake(htOption);
});
asyncTest("flicker", function(){
	oLayerEffect.flicker(htOption);
});
asyncTest("blink", function(){
	oLayerEffect.blink(htOption);
});
asyncTest("bounce", function(){
	oLayerEffect.bounce(htOption);
});
