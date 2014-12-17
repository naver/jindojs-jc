var instances = [];

var oLayerPosition = new jindo.LayerPosition(document.body, jindo.$("center"), { 
	sPosition : "inside-bottom", 
	sAlign : "right", 
	sValign : "bottom", 
	nTop : 50, 
	nLeft : 50, 
	bAuto : true
});
instances.push(oLayerPosition);

module("LayerPosition", {
	setup : function() {
		jindo.$A(instances).forEach(function(o){
			o.setPosition();
		});
	}
});
test("getElement() / setElement()", function(){
	ok(oLayerPosition.getElement() === document.body, "getElement()은 위치를 잡을 기준 엘리먼트를 리턴한다.");
	ok(oLayerPosition.setElement(jindo.$("ui")) === oLayerPosition, "setElement(jindo.$('ui'))는 위치를 잡을 기준 엘리먼트를 설정하고 인스턴스 자신을 리턴한다.");
	ok(oLayerPosition.getElement() === jindo.$("ui"), "getElement()은 jindo.$('ui') 엘리먼트를 리턴한다.");
	oLayerPosition.setElement(document.body);
});
test("getLayer() / setLayer()", function(){
	ok(oLayerPosition.getLayer() === jindo.$("center"), "getLayer()은 이동시킬 레이어 엘리먼트를 리턴한다.");
	ok(oLayerPosition.setLayer(jindo.$("ui")) === oLayerPosition, "setLayer(jindo.$('ui'))은 이동시킬 레이어 엘리먼트를 설정하고 인스턴스 자신을 리턴한다.");
	ok(oLayerPosition.getLayer() === jindo.$("ui"), "getLayer()은 이동시킬 jindo.$('ui') 엘리먼트를 리턴한다.");
	oLayerPosition.setLayer(jindo.$("center"));
});
test("setPosition() / getPosition() / getCurrentPosition()", function(){
	var elLayer = oLayerPosition.getLayer();
	var welLayer = jindo.$Element(elLayer);
	ok(oLayerPosition.setPosition(), "setPosition() 메소드는 인스턴스 자신을 리턴한다.");
	ok(elLayer.parentNode == document.body, "레이어는 document.body이 자식으로 append된다.");
	var htPosition = oLayerPosition.getPosition();
	var htCurrentPosition = oLayerPosition.getCurrentPosition();
	ok(htPosition.nTop == htCurrentPosition.nTop && htPosition.nLeft == htCurrentPosition.nLeft, "getPosition()으로 계산된 위치로 레이어의 위치가 이동되어야 한다.");
	oLayerPosition.option({sPosition : "inside-right", sValign : "top"}).setPosition();
});
test("위치 자동조정 _mirrorVertical()", function() {
	try {
		jindo.$Element(window).fireEvent("resize");
	} catch (e){ }
	var htConvertedOption;
	var htOption;
	
	htOption = { sPosition: "inside-center" };
	htConvertedOption = oLayerPosition._mirrorVertical(htOption);
	ok(htConvertedOption == htOption, "sPosition이 inside-center인 경우 변환하지 않고 그대로 리턴한다.");
	
	htOption = { sValign: "middle" };
	htConvertedOption = oLayerPosition._mirrorVertical(htOption);
	ok(htConvertedOption == htOption, "sValign이 middle인 경우 변환하지 않고 그대로 리턴한다.");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-top" });
	ok(htConvertedOption.sPosition, "inside-bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-bottom" });
	ok(htConvertedOption.sPosition == "inside-top");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-top" });
	ok(htConvertedOption.sPosition == "outside-bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-bottom" });
	ok(htConvertedOption.sPosition == "outside-top");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-left", sValign: "top" });
	ok(htConvertedOption.sPosition == "inside-left" && htConvertedOption.sValign == "bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-left", sValign: "bottom" });
	ok(htConvertedOption.sPosition == "inside-left" && htConvertedOption.sValign == "top");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-right", sValign: "top" })
	ok(htConvertedOption.sPosition == "inside-right" && htConvertedOption.sValign == "bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "inside-right", sValign: "bottom" })
	ok(htConvertedOption.sPosition == "inside-right" && htConvertedOption.sValign == "top");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-left", sValign: "top" })
	ok(htConvertedOption.sPosition == "outside-left" && htConvertedOption.sValign == "bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-left", sValign: "bottom" })
	ok(htConvertedOption.sPosition == "outside-left" && htConvertedOption.sValign == "top");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-right", sValign: "top" })
	ok(htConvertedOption.sPosition == "outside-right" && htConvertedOption.sValign == "bottom");
	
	htConvertedOption = oLayerPosition._mirrorVertical({ sPosition: "outside-right", sValign: "bottom" })
	ok(htConvertedOption.sPosition == "outside-right" && htConvertedOption.sValign == "top");
});
test("위치 자동조정 _mirrorHorizontal()", function() {
	var htConvertedOption;
	var htOption;

	htOption = { sPosition: "inside-center" };
	htConvertedOption = oLayerPosition._mirrorHorizontal(htOption);
	ok(htConvertedOption == htOption, "sPosition이 inside-center인 경우 변환하지 않고 그대로 리턴한다.");
	
	htOption = { sAlign: "center" };
	htConvertedOption = oLayerPosition._mirrorHorizontal(htOption);
	ok(htConvertedOption == htOption, "sAlign이 center인 경우 변환하지 않고 그대로 리턴한다.");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-left" })
	ok(htConvertedOption.sPosition == "inside-right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-right" })
	ok(htConvertedOption.sPosition == "inside-left");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-left" })
	ok(htConvertedOption.sPosition == "outside-right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-right" })
	ok(htConvertedOption.sPosition == "outside-left");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-top", sAlign: "left" })
	ok(htConvertedOption.sPosition == "inside-top" && htConvertedOption.sAlign == "right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-top", sAlign: "right" })
	ok(htConvertedOption.sPosition == "inside-top" && htConvertedOption.sAlign == "left");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-bottom", sAlign: "left" })
	ok(htConvertedOption.sPosition == "inside-bottom" && htConvertedOption.sAlign == "right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "inside-bottom", sAlign: "right" })
	ok(htConvertedOption.sPosition == "inside-bottom" && htConvertedOption.sAlign == "left");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-top", sAlign: "left" })
	ok(htConvertedOption.sPosition == "outside-top" && htConvertedOption.sAlign == "right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-top", sAlign: "right" })
	ok(htConvertedOption.sPosition == "outside-top" && htConvertedOption.sAlign == "left");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-bottom", sAlign: "left" })
	ok(htConvertedOption.sPosition == "outside-bottom" && htConvertedOption.sAlign == "right");
	
	htConvertedOption = oLayerPosition._mirrorHorizontal({ sPosition: "outside-bottom", sAlign: "right" })
	ok(htConvertedOption.sPosition == "outside-bottom" && htConvertedOption.sAlign == "left");
});

test("다양항 상황의 setPosition()", function(){
	var o;
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer1"), { sPosition : "outside-top-left", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer2"), { sPosition : "outside-top", sAlign : "left", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer3"), { sPosition : "outside-top", sAlign : "center", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer4"), { sPosition : "outside-top", sAlign : "right", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer5"), { sPosition : "outside-top-right", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer6"), { sPosition : "outside-right", sValign : "top", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer7"), { sPosition : "outside-right", sValign : "middle", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer8"), { sPosition : "outside-right", sValign : "bottom", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer9"), { sPosition : "outside-bottom-right", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer10"), { sPosition : "outside-bottom", sAlign : "right", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer11"), { sPosition : "outside-bottom", sAlign : "center", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer12"), { sPosition : "outside-bottom", sAlign : "left", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer13"), { sPosition : "outside-bottom-left", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer14"), { sPosition : "outside-left", sValign : "bottom", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer15"), { sPosition : "outside-left", sValign : "middle", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer16"), { sPosition : "outside-left", sValign : "top", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer17"), { sPosition : "inside-top-left", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer18"), { sPosition : "inside-top", sAlign : "center", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer19"), { sPosition : "inside-top-right", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer20"), { sPosition : "inside-right", sValign : "middle", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer21"), { sPosition : "inside-bottom-right", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer22"), { sPosition : "inside-bottom", sAlign : "center", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer23"), { sPosition : "inside-bottom-left", nTop : 10, nLeft : 10 });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer24"), { sPosition : "inside-left", sValign : "middle", nTop : 10, nLeft : 10 });
	instances.push(o);
	
	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer25"), { sPosition : "inside-center" });
	instances.push(o);

	o = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer26"), { sPosition : "outside-right", sAlign : "left", sValign : "bottom", nTop : 10, nLeft : 10, bAuto:true });
	instances.push(o);

	ok(true);
});
