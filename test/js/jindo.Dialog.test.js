var oDialog = new jindo.Dialog({
	sClassPrefix : "dialog-"
}).attach({
	beforeShow : function(e) {
		//console.log(e)
		//e.stop();
	},
	show : function(e) {
		//console.log(e)
	},
	beforeHide : function(e) {
		//console.log(e)
		//e.stop();
	},
	hide : function(e) {
		//console.log(e)
	}
});

var aLayerTemplate = [];
aLayerTemplate.push('<div>');
aLayerTemplate.push('	<a href="#" class="dialog-close">');
aLayerTemplate.push('		<img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/>');
aLayerTemplate.push('	</a>');
aLayerTemplate.push('</div>');
aLayerTemplate.push('<div style="position:absolute;top:30px;left:10px;">{=text}</div>');
aLayerTemplate.push('<div style="position:absolute;bottom:10px;right:10px;">');
aLayerTemplate.push('	<button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button>');
aLayerTemplate.push('</div>');
aLayerTemplate.push('</div>');
oDialog.setLayerTemplate(aLayerTemplate.join(''));			
			
module("", {
	setup : function() {
	}
});

test("getLayer()", function() {
	ok(oDialog.getLayer() === jindo.$$.getSingle("." + oDialog.option("sClassPrefix") + "layer"), "getLayer() 메소드는 생성된 레이어 엘리먼트를 리턴한다.");
});

test("getLayerPosition()", function() {
	ok(oDialog.getLayerPosition() instanceof jindo.LayerPosition, "getLayerPosition() 메소드는 내부에서 생성된 LayerPosition 인스턴스를 리턴한다.");
});

test("setLayerTemplate() / getLayerTemplate()", function() {
	oDialog.setLayerTemplate("<strong>{=text}</strong>")
	ok(oDialog.getLayerTemplate() === "<strong>{=text}</strong>", "getLayerTemplate()는 설정된 레이어 템플릿 문자열을 반환한다.");
	oDialog.setLayerTemplate(aLayerTemplate.join(""));
});

test("show() / hide()", function() {
	oDialog.show({ text : "테스트" });
	ok(oDialog.isShown(), "show() 메소드를 수행하면 레이어가 보인다.");
	
	var elTemp = jindo.$("<div>");
	elTemp.innerHTML = jindo.$Template(oDialog.getLayerTemplate()).process({ text : "테스트" });
	
	ok(oDialog.getLayer().innerHTML == elTemp.innerHTML, "레이어의 내용은 setLayerTemplate() 설정된 템플릿에 show()메소드에 전달된 객체에 의해 파싱된 내용이 삽입된다.")
	
	oDialog.hide();
	ok(!oDialog.isShown(), "hide() 메소드를 수행하면 레이어가 보이지 않는다.");
});

asyncTest("show() & 확인버튼 클릭", function(){
	ok(!oDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oDialog.show({ text : "확인하시겠습니까?" }, {
		close : function(e) {
			//console.log(e);
		},
		cancel : function(e) {
			//console.log(e);
		},
		confirm : function(e) {
			start();
			ok(true, "레이어가 보여진 후에 확인 버튼이 클릭되면 confirm 콜백이 수행되어야한다.")
			//console.log(e);
		}
	});	
	ok(oDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");
	
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-confirm", oDialog.getLayer())).fireEvent("click");
		ok(!oDialog.isShown(), "확인 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);
});

asyncTest("show() & 닫기버튼 클릭", function(){
	ok(!oDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oDialog.show({ text : "확인하시겠습니까?" }, {
		close : function(e) {
			start();
			ok(true, "레이어가 보여진 후에 닫기 버튼이 클릭되면 close 콜백이 수행되어야한다.")
		},
		cancel : function(e) {
			//console.log(e);
		},
		confirm : function(e) {
			//console.log(e);
		}
	});
	ok(oDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");	
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-close", oDialog.getLayer())).fireEvent("click");
		ok(!oDialog.isShown(), "닫기 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);
});

asyncTest("show() & 취소버튼 클릭", function(){
	ok(!oDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oDialog.show({ text : "확인하시겠습니까?" }, {
		close : function(e) {
			//console.log(e);
		},
		cancel : function(e) {
			start();
			ok(true, "레이어가 보여진 후에 취소 버튼이 클릭되면 cancel 콜백이 수행되어야한다.")
		},
		confirm : function(e) {
			//console.log(e);
		}
	});
	ok(oDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-cancel", oDialog.getLayer())).fireEvent("click");
		ok(!oDialog.isShown(), "취소 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);	
});
