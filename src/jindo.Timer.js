/**
	@fileOverview 타이머를 편리하게 사용할 수 있게해주는 컴포넌트
	@version #__VERSION__#
**/
/**
	
	타이머의 사용을 편리하게 해주는 컴포넌트
	
	@class jindo.Timer
	@extends jindo.Component
	@keyword timer, 타이머, setTimeout, setInterval
 */
jindo.Timer = jindo.$Class({
	/** @lends jindo.Timer.prototype */

	/**
		Timer 컴포넌트를 초기화한다.
		
		@constructor
 	 */
	$init : function() { 
		this._nTimer = null; // 타이머 객체
		this._nLatest = null; // 마지막으로 콜백 함수가 실행된 Timestamp (ms)
		this._nRemained = 0; // 일시정지 한 경우, 다음 콜백 함수를 수행해야 할 때까지 남은 시간 (ms)
		this._nDelay = null; // 딜레이 시간 (ms)
		this._fRun = null; // 콜백 함수
		this._bIsRunning = false; // 실행 중인지 여부
	},
	
	/**
		함수를 지정한 시간이 지난 후에 실행한다. 실행될 콜백 함수가 true 를 리턴하면 setInterval 을 사용한 것처럼 계속 반복해서 수행된다.
		
		@method start
		@param {Function} fCallback 지정된 지연 시간 이후에 실행될 콜백 함수
		@param {Number} nDelay msec 단위의 지연 시간
		@return {Boolean} 항상 true
		@example
			var o = new jindo.Timer();
			o.start(function() {
				// ...
				return true;
			}, 100);
		
		@history 1.3.0 Bug fRun 에서 예외가 발생하면 리턴 값과 관계없이 계속 반복되는 문제 수정
	**/
 	start : function(fRun, nDelay) {
		this.abort();
		
		this._nRemained = 0;
		this._nDelay = nDelay;
		this._fRun = fRun;
		
		this._bIsRunning = true;
		this._nLatest = this._getTime();
		this.fireEvent('wait');
		this._excute(this._nDelay, false);
		
		return true;
	},
	
	/**
		타이머의 동작 여부를 가져온다.
		
		@method isRunning
		@return {Boolean} 동작중이면 true, 그렇지 않으면 false
	**/
	isRunning : function() {
		return this._bIsRunning;
	},
	
	_getTime : function() {
		return new Date().getTime();
	},
	
	_clearTimer : function() {
		var bFlag = false;
		
		if (this._nTimer) {
			clearTimeout(this._nTimer);
			this._bIsRunning = false;
			bFlag = true;
		}
		
		this._nTimer = null;
		return bFlag;
	},
	
	/**
		현재 대기상태에 있는 타이머를 중단시킨다.
		
		@method abort
		@return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
		
		@history 1.3.0 Bug pause 후에 abort 하면 제대로 abort 되지 않는 문제 수정
	**/
	abort : function() {
		this._clearTimer();
		if (this._fRun) {
			/**
				Timer가 수행을 강제로 종료했을 때 발생
				
				@event abort
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oTimer.attach("abort", function(oCustomEvent) { ... });
			**/
			this.fireEvent('abort');
			this._fRun = null;
			
			return true;
		}
		return false;
	},
	
	/**
		현재 동작하고 있는 타이머를 일시정지 시킨다.
		
		@method pause
		@return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
	**/
	pause : function() {
		var nPassed = this._getTime() - this._nLatest;
		this._nRemained = Math.max(this._nDelay - nPassed, 0);
		
		return this._clearTimer();
	},
	
	_excute : function(nDelay, bResetDelay) {
		var self = this;
		this._clearTimer();
	
		this._bIsRunning = true;
		
		var launcher = function(bDontUseTimer) {
			
			if (!self._fRun) { return; }
			
			if (self._nTimer || bDontUseTimer) { //self._nTimer가 null일때도 간헐적으로 수행되는 버그가 있어 추가
				/**
					Timer 동작 수행이 시작될 때 발생
					
					@event run
					@param {String} sType 커스텀 이벤트명
					@example
						// 커스텀 이벤트 핸들링 예제
						oTimer.attach("run", function(oCustomEvent) { ... });
				**/
				self.fireEvent('run');
				
				var r = self._fRun();
				self._nLatest = self._getTime();
				
				if (!r) {
					if (!bDontUseTimer) {
						clearTimeout(self._nTimer);
					}
					self._nTimer = null;
					self._bIsRunning = false;
					/**
						Timer 동작이 종료될 때 발생
						
						@event end
						@param {String} sType 커스텀 이벤트명
						@example
							// 커스텀 이벤트 핸들링 예제
							oTimer.attach("end", function(oCustomEvent) { ... });
					**/
					self.fireEvent('end');
					return;
				}
				
				/**
					Timer가 기다리기 시작한 시점에 발생
					
					@event wait
					@param {String} sType 커스텀 이벤트명
					@example
						// 커스텀 이벤트 핸들링 예제
						oTimer.attach("wait", function(oCustomEvent) { ... });
				**/
				self.fireEvent('wait');
				self._excute(self._nDelay, false);
			}
		};
		
		if (nDelay > -1) {
			this._nTimer = setTimeout(launcher, nDelay);
		} else {
			launcher(true);
		}
	},
	
	/**
		일시정지 상태인 타이머를 재개시킨다.
		
		@method resume
		@return {Boolean} 재개에 성공했으면 true, 그렇지 않으면 false
	**/
	resume : function() {
		if (!this._fRun || this.isRunning()) {
			return false;
		}
		
		this._bIsRunning = true;
		this.fireEvent('wait');
		this._excute(this._nRemained, true);
		this._nRemained = 0;
		return true;
	}
}).extend(jindo.Component);
