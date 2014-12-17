var elBox = jindo.$("box");
var welBox = jindo.$Element(elBox);
var oTransition = new jindo.Transition({ bCorrection : true }).fps(60);

module("Transition", {
	setup : function() {
		elBox.scrollTop = 0;
		welBox.css({
			"top" : "100px", 
			"left" : "100px",
			"height" : "100px",
			"backgroundColor" : "#07f"
		});
		welBox.opacity(1);
	}
});
test("fps()", function(){
	ok(oTransition.fps(60) === oTransition, "fps(60)은 객체 자신을 리턴한다.");
	ok(oTransition.fps() === 60, "fps()는 현재 설정된 fps값을 가져온다.");
});

asyncTest("start()", function(){
	ok(welBox.css("top") === "100px", "css top속성이 '100px'이어야한다.");
	ok(welBox.css("left") === "100px", "css left속성이 '100px'이어야한다.");
	oTransition.attach({
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(welBox.css("top") === "200px", "end 커스텀이벤트가 발생된 이후에는 css top속성이 '200px'이어야한다.");
			ok(welBox.css("left") === "200px", "end 커스텀이벤트가 발생된 이후에는 css left속성이 '200px'이어야한다.");
			start();
		}
	});
	oTransition.start(500, 
		elBox, {
			"@top" : jindo.Effect.linear('200px'),
			"@left" : jindo.Effect.linear('200px'),
			"@opacity" : [0, 0.5],
			"style.backgroundColor" : "#666",
			"scrollTop" : 100
		},
		{
			getter : function(sKey) {
				return welBox[sKey]();
			},
			
			setter : function(sKey, sValue) {
				welBox[sKey](parseFloat(sValue));
			}
		}, {
			"height" : jindo.Effect.linear(200)
		}
	);
});

asyncTest("pause() / resume()", function(){
	ok(oTransition.pause() === oTransition, "pause() 메소드는 this를 리턴한다.");
	
	oTransition.attach({
		playing : function(oCustomEvent) {
			if (oCustomEvent.nStep == Math.ceil(oCustomEvent.nTotalStep / 2)) {
				this.detach(oCustomEvent.sType, arguments.callee);
				this.pause();
			}
		},
		pause : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			var self = this;
			setTimeout(function(){
				ok(welBox.css("top") === "150px", "pause 커스텀이벤트가 발생된 이후에는 css top속성이 '150px'이어야한다.");
				ok(welBox.css("left") === "150px", "pause 커스텀이벤트가 발생된 이후에는 css left속성이 '150px'이어야한다.");
				self.resume();
			}, 300);
		},
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(welBox.css("top") === "200px", "end 커스텀이벤트가 발생된 이후에는 css top속성이 '200px'이어야한다.");
			ok(welBox.css("left") === "200px", "end 커스텀이벤트가 발생된 이후에는 css left속성이 '200px'이어야한다.");
			start();
		}
	});
	oTransition.start(500,
		elBox, {
			"@top" : jindo.Effect.linear('200px'),
			"@left" : jindo.Effect.linear('200px'),
			"@opacity" : 0.5,
			"style.backgroundColor" : "#666",
			"scrollTop" : 100
		}
	);
});

asyncTest("abort()", function(){
	oTransition.attach({
		playing : function(oCustomEvent) {
			if (oCustomEvent.nStep == oCustomEvent.nTotalStep / 2) {
				this.detach(oCustomEvent.sType, arguments.callee);
				this.abort();
			}
		},
		abort : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			setTimeout(function(){
				ok(welBox.css("top") === "150px", "abort 커스텀이벤트가 발생된 이후에는 css top속성이 '150px'이어야한다.");
				ok(welBox.css("left") === "150px", "abort 커스텀이벤트가 발생된 이후에는 css left속성이 '150px'이어야한다.");
				start();
			}, 200);
		}
	});
	oTransition.start(500,
		elBox, {
			"@top" : jindo.Effect.linear('200px'),
			"@left" : jindo.Effect.linear('200px'),
			"@opacity" : 0.5,
			"style.backgroundColor" : "#666",
			"scrollTop" : 100
		}
	);
});

asyncTest("precede() (deprecated)", function(){
	oTransition.attach({
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(welBox.css("top") === "100px", "end 커스텀이벤트가 발생된 이후에는 css top속성이 '100px'이어야한다.");
			ok(welBox.css("left") === "100px", "end 커스텀이벤트가 발생된 이후에는 css left속성이 '100px'이어야한다.");
			start();
		}
	});
	oTransition.precede(500,
		elBox, {
			"@top" : jindo.Effect.linear('200px'),
			"@left" : jindo.Effect.linear('200px'),
			"@opacity" : 0.5,
			"style.backgroundColor" : "#666",
			"scrollTop" : 100
		}
	).precede(500,
		elBox, {
			"@top" : jindo.Effect.linear('100px'),
			"@left" : jindo.Effect.linear('100px'),
			"@opacity" : 1,
			"style.backgroundColor" : "#07f",
			"scrollTop" : 0
		}
	);
});

asyncTest("sleep()", function(){
	var nStart = 0, nEnd = 0;
	
	oTransition.attach({
		sleep : function(oCustomEvent) {
			nStart = new Date().getTime();
			ok(nStart > 0, "sleep 커스텀이벤트가 제대로 발생되어야 한다.");
		},
		awake : function(oCustomEvent) {
			nEnd = new Date().getTime();
			ok(nEnd > 0 && nEnd > nStart, "awake 커스텀이벤트가 제대로 발생되어야 한다.");
		},
		end : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(welBox.css("top") === "100px", "end 커스텀이벤트가 발생된 이후에는 css top속성이 '100px'이어야한다.");
			ok(welBox.css("left") === "100px", "end 커스텀이벤트가 발생된 이후에는 css left속성이 '100px'이어야한다.");
			start();
		}
	});
	oTransition.precede(500,
		elBox, {
			"@top" : jindo.Effect.linear('200px'),
			"@left" : jindo.Effect.linear('200px'),
			"@opacity" : 0.5,
			"style.backgroundColor" : "#666",
			"scrollTop" : 100
		}
	).sleep(500).precede(500,
		elBox, {
			"@top" : jindo.Effect.linear('100px'),
			"@left" : jindo.Effect.linear('100px'),
			"@opacity" : 1,
			"style.backgroundColor" : "#07f",
			"scrollTop" : 0
		}
	);
});
