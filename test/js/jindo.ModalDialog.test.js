var oModalDialog = new jindo.ModalDialog({
	Foggy : { //Foggy 컴포넌트를 위한 옵션 (jindo.Foggy 참고)
		nShowDuration : 150, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)  
		nShowOpacity : 0.8, //(Number) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)      
		nHideDuration : 150, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)  
		nHideOpacity : 0, //(Number) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
		sEffect : "linear", // (String) jindo.Effect의 종류  
		nFPS : 30 //(Number) 효과가 재생될 초당 frame rate  
	}
}).attach({
	beforeShow : function(e) {
		//console.log(e.type)
		//다이얼로그 레이어가 보여지기 전에 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//e.stop(); 수행시 보여지지 않음
	},
	show : function(e) {
		//console.log(e.type)
		//다이얼로그 레이어가 보여진 후 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	},
	beforeHide : function(e) {
		//console.log(e.type)
		//다이얼로그 레이어가 숨겨지기 전에 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
		//e.stop(); 수행시 숨겨지지 않음
	},
	hide : function(e) {
		//console.log(e.type)
		//다이얼로그 레이어가 숨겨진 후 발생
		//전달되는 이벤트 객체 e = {
		//	elLayer (HTMLElement) 다이얼로그 레이어
		//}
	}
});

var aLayerTemplate = [];
aLayerTemplate.push('<div>');
aLayerTemplate.push('	<a href="#" class="dialog-close">');
aLayerTemplate.push('		<img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/>');
aLayerTemplate.push('	</a>');
aLayerTemplate.push('</div>');
aLayerTemplate.push('<div style="position:absolute;top:30px;margin:10px;width:170px">{=text}</div>');
aLayerTemplate.push('	<div style="position:absolute;bottom:10px;right:10px;">');
aLayerTemplate.push('		<button type="button" class="dialog-confirm">확인</button>');
aLayerTemplate.push('		<button type="button" class="dialog-cancel">취소</button>');
aLayerTemplate.push('	</div>');
aLayerTemplate.push('</div>')
oModalDialog.setLayerTemplate(aLayerTemplate.join("\n"));
			
test("getFoggy()", function() {
	ok(oModalDialog.getFoggy() instanceof jindo.Foggy, "getFoggy() 메소드는 내부에서 생성된 Foggy 인스턴스를 리턴한다.");
});

asyncTest("show() / hide()", function() {
	oModalDialog.attach({
		show : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(this.isShown(), "show() 메소드를 수행하면 레이어가 보인다.");
			this.hide();
		},
		hide : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(!this.isShown(), "hide() 메소드를 수행하면 레이어가 보이지 않는다.");
			start();
		}
	});
	oModalDialog.show({ text : "테스트" });
});
/*
asyncTest("show() & 확인버튼 클릭", function(){
	ok(!oModalDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oModalDialog.show({ text : "확인하시겠습니까?" }, {
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
	ok(oModalDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");
	
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-confirm", oModalDialog.getLayer())).fireEvent("click");
		ok(!oModalDialog.isShown(), "확인 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);
});

asyncTest("show() & 닫기버튼 클릭", function(){
	ok(!oModalDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oModalDialog.show({ text : "확인하시겠습니까?" }, {
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
	ok(oModalDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");	
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-close", oModalDialog.getLayer())).fireEvent("click");
		ok(!oModalDialog.isShown(), "닫기 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);
});

asyncTest("show() & 취소버튼 클릭", function(){
	ok(!oModalDialog.isShown(), "show() 수행전에는 레이어가 보이지 않는다. (isShow() 메소드가 false를 리턴한다.)");
	oModalDialog.show({ text : "확인하시겠습니까?" }, {
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
	ok(oModalDialog.isShown(), "show() 수행후에는 레이어가 보인다. (isShow() 메소드가 true를 리턴한다.)");
	setTimeout(function(){
		jindo.$Element(jindo.$$.getSingle(".dialog-cancel", oModalDialog.getLayer())).fireEvent("click");
		ok(!oModalDialog.isShown(), "취소 버튼 클릭 후에는 레이어가 보이지 않는다.");
	}, 200);	
});
*/
