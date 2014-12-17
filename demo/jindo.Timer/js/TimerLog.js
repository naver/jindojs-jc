/**
 * Timer.log.html에서 사용할 샘플 클래스입니다. 
 */
var TimerLog = jindo.$Class({
	
	/**
	 * @constructor
	 * 1. 타이머를 생성하고 타이머에 이벤트가 발생한 경우(메소드가 호출 될 때)
	 * 어떠한 이벤트가 호출되었는 지를 출력합니다.
	 * 2. 링크가 클릭될 때 동작이 발생하도록 이벤트 핸들러들을 정의해줍니다.  
	 */
	$init: function() {
		var self = this;
		this._oTimer = new jindo.Timer().attach({
			wait : function(oCustomEvent) {
				self.log("<strong>"+oCustomEvent.sType+"</strong>");
			},
			abort : function(oCustomEvent) {
				self.log("<strong>"+oCustomEvent.sType+"</strong>");
			},
			run : function(oCustomEvent) {
				self.log("<strong>"+oCustomEvent.sType+"</strong>");
			},
			end : function(oCustomEvent) {
				self.log("<strong>"+oCustomEvent.sType+"</strong>");
			}
		});
	
		var elStart = jindo.$$.getSingle("a.start");
		var elPause = jindo.$$.getSingle("a.pause");
		var elResume = jindo.$$.getSingle("a.resume");
		var elAbort = jindo.$$.getSingle("a.abort");
		this.elLog = jindo.$$.getSingle("div.log_pane");

		jindo.$Fn(this.clickStartBtn, this).attach(elStart, "click");
		jindo.$Fn(this.clickPauseBtn, this).attach(elPause, "click");
		jindo.$Fn(this.clickResumeBtn, this).attach(elResume, "click");
		jindo.$Fn(this.clickAbortBtn, this).attach(elAbort, "click");
	},
	
	log: function() {
		var aArgs = Array.prototype.slice.call(arguments);
		this.elLog.innerHTML = (this.elLog.innerHTML + 
				'<div>' +
					('<span class="time">[' +new Date().getTime() +']</span> ') +
					 aArgs.join("") +
				'</div>');
		
		this.elLog.scrollTop = 99999;
	},

	/**
	 * start 링크를 클릭한 경우 호출됩니다. 타이머를 시작하며 
	 * 이미 타이머가 시작된 경우에는 타이머를 종료하고 시작합니다. 
	 */
	clickStartBtn: function() {
		var self = this;
		this.log("jindo.Timer.start() 호출");
		this._oTimer.start(function(){
			var oDate = new Date();
			jindo.$("watch").innerHTML = "지금 시각은 " + oDate.getHours() + "시 " + oDate.getMinutes() + "분 " 
				+ oDate.getSeconds() + "초 입니다.";

			self.log("callback 재수행");
			return true;  
		}, 1000);
		
	},
	
	/**
	 * puase 링크를 클릭한 경우 호출되며 타이머를 멈춥니다. 
	 */
	clickPauseBtn: function() {
		this.log("jindo.Timer.pause() 호출");
		this._oTimer.pause();
	},
	
	/**
	 * resume 링크를 클릭한 경우 호출되며 타이머를 pause로 멈춘
	 * 타이머를 다시 시작합니다. 
	 */
	clickResumeBtn: function() {
		this.log("jindo.Timer.resume() 호출");
		this._oTimer.resume();
	},
	
	/**
	 * abort 링크를 클릭하여 타이머를 중지시킵니다. 
	 */
	clickAbortBtn: function() {
		this.log("jindo.Timer.abort() 호출");
		this._oTimer.abort();
	}
});