/**
 * Jindo Component
 * @version 1.14.0
 * 
 * NAVER Corp; JindoJS JavaScript Framework
 * http://jindo.dev.naver.com/
 * 
 * Released under the LGPL v2 license
 * http://www.gnu.org/licenses/old-licenses/lgpl-2.0.html
 */
/**
 *	jindo.Component
 *	jindo.UIComponent
 *	jindo.Timer
 *	jindo.Effect
 *	jindo.Transition
 *	jindo.Accordion
 *	jindo.AjaxHistory
 *	jindo.BrowseButton
 *	jindo.Cache
 *	jindo.Calendar
 *	jindo.Canvas
 *	jindo.HTMLComponent
 *	jindo.CheckBox
 *	jindo.Rolling
 *	jindo.CircularRolling
 *	jindo.Clipboard
 *	jindo.DataBridge
 *	jindo.LayerManager
 *	jindo.LayerPosition
 *	jindo.DatePicker
 *	jindo.DefaultTextValue
 *	jindo.Dialog
 *	jindo.DragArea
 *	jindo.DropArea
 *	jindo.Tree
 *	jindo.DynamicTree
 *	jindo.FileUploader
 *	jindo.FloatingLayer
 *	jindo.Foggy
 *	jindo.TextRange
 *	jindo.Formatter
 *	jindo.InlineTextEdit
 *	jindo.Keyframe
 *	jindo.LayerEffect
 *	jindo.LazyLoading
 *	jindo.ModalDialog
 *	jindo.Morph
 *	jindo.MouseGesture
 *	jindo.MultipleAjaxRequest
 *	jindo.NumberFormatter
 *	jindo.NumericStepper
 *	jindo.Pagination
 *	jindo.RollingChart
 *	jindo.RolloverArea
 *	jindo.RolloverClick
 *	jindo.Slider
 *	jindo.ScrollBar
 *	jindo.ScrollBox
 *	jindo.SelectArea
 *	jindo.SelectBox
 *	jindo.StarRating
 *	jindo.TabControl
 *	jindo.UploadQueue
 *	jindo.Visible
 *	jindo.WatchInput
 */
/**
	@fileOverview 진도 컴포넌트를 구현하기 위한 코어 클래스
	@version 1.14.0
**/

/**
	진도 컴포넌트를 구현하기 위한 코어 클래스.
	다른 컴포넌트가 상속받는 용도로 사용된다.
	
	@class jindo.Component
	
	@keyword component, base, core
**/
jindo.Component = jindo.$Class({
	/** @lends jindo.Component.prototype */

	_htEventHandler : null,
	_htOption : null,

	/**
		jindo.Component를 초기화한다.
		
		@constructor
	**/
	$init : function() {
		this._htEventHandler = {};
		this._htOption = {};
		this._htOption._htSetter = {};

		this.constructor.$count = (this.constructor.$count || 0) + 1;
	},
	
	/**
		옵션 값을 가져온다. 
		
		@method option
		@param {String} sName 옵션의 이름
		@return {Variant} 옵션의 값
	**/
	/**
		옵션 값을 설정한다. 
		htCustomEventHandler 옵션을 선언해서 attach() 메서드를 사용하지 않고 커스텀 이벤트핸들러를 등록할 수 있다.
		
		@method option
		@syntax sName, vValue
		@syntax oValue
		@param {String} sName 옵션의 이름
		@param {Variant} vValue 옵션의 값
		@param {Object} oValue 하나 이상의 이름과 값을 가지는 옵션 객체
		@return {this} 옵션 값을 설정한 인스턴스 자신
		@example
			var MyComponent = jindo.$Class({
				method : function() {
					alert(this.option("foo"));
				}
			}).extend(jindo.Component);
			
			var oInst = new MyComponent();
			oInst.option("foo", 123); // 또는 oInst.option({ foo : 123 });
			oInst.method(); // 결과 123
		@example
			//커스텀 이벤트핸들러 등록예제
			oInst.option("htCustomEventHandler", {
				test : function(oCustomEvent) {
					
				}
			});
			
			//이미 "htCustomEventHandler" 옵션이 설정되어있는 경우에는 무시된다.
			oInst.option("htCustomEventHandler", {
				change : function(oCustomEvent) {
					
				}
			});
	**/
	option : function(sName, vValue) {
		switch (typeof sName) {
			case "undefined" :
				var oOption = {};
				for(var i in this._htOption){
					if(!(i == "htCustomEventHandler" || i == "_htSetter")){
						oOption[i] = this._htOption[i];
					}
				}
				return oOption;
			case "string" : 
				if (typeof vValue != "undefined") {
					if (sName == "htCustomEventHandler") {
						if (typeof this._htOption[sName] == "undefined") {
							this.attach(vValue);
						} else {
							return this;
						}
					}
					
					this._htOption[sName] = vValue;
					if (typeof this._htOption._htSetter[sName] == "function") {
						this._htOption._htSetter[sName](vValue);	
					}
				} else {
					return this._htOption[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					if (sKey == "htCustomEventHandler") {
						if (typeof this._htOption[sKey] == "undefined") {
							this.attach(sName[sKey]);
						} else {
							continue;
						}
					}
					if(sKey !== "_htSetter"){
						this._htOption[sKey] = sName[sKey];
					}
					
					if (typeof this._htOption._htSetter[sKey] == "function") {
						this._htOption._htSetter[sKey](sName[sKey]);	
					}
				}
				break;
		}
		return this;
	},
	
	/**
		옵션의 setter 함수를 가져온다. 
		옵션의 setter 함수는 지정된 옵션이 변경되면 수행되는 함수이다.
		
		@method optionSetter
		@param {String} sName setter의 이름
		@return {Function} setter 함수
	**/
	/**
		옵션의 setter 함수를 설정한다. 
		옵션의 setter 함수는 지정된 옵션이 변경되면 수행되는 함수이다.
		
		@method optionSetter
		@syntax sName, fSetter
		@syntax oValue
		@param {String} sName setter의 이름
		@param {Function} fSetter setter 함수
		@param {Object} oValue 하나 이상의 setter 이름과 setter 함수를 가지는 객체
		@return {this} 옵션의 setter 함수를 설정한 인스턴스 자신
		@example
			oInst.option("sMsg", "test");
			oInst.optionSetter("sMsg", function(){
				alert("sMsg 옵션 값이 변경되었습니다.");
			});
			oInst.option("sMsg", "change"); -> alert발생
		@example
			//HashTable 형태로 설정가능
			oInst.optionSetter({
				"sMsg" : function(){
				},
				"nNum" : function(){
				}
			});
	**/
	optionSetter : function(sName, fSetter) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption._htSetter;
			case "string" : 
				if (typeof fSetter != "undefined") {
					this._htOption._htSetter[sName] = jindo.$Fn(fSetter, this).bind();
				} else {
					return this._htOption._htSetter[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					this._htOption._htSetter[sKey] = jindo.$Fn(sName[sKey], this).bind();
				}
				break;
		}
		return this;
	},
	
	/**
		이벤트를 발생시킨다.
		
		@method fireEvent
		@param {String} sEvent 커스텀 이벤트명
		@param {Object} oEvent 커스텀 이벤트 핸들러에 전달되는 객체.
		@return {Boolean} 핸들러의 커스텀 이벤트객체에서 stop메서드가 수행되면 false를 리턴
		@example
			//커스텀 이벤트를 발생시키는 예제
			var MyComponent = jindo.$Class({
				method : function() {
					this.fireEvent('happened', {
						sHello : 'world',
						nAbc : 123
					});
				}
			}).extend(jindo.Component);
			
			var oInst = new MyComponent().attach({
				happened : function(oCustomEvent) {
					alert(oCustomEvent.sHello + '/' + oCustomEvent.nAbc); // 결과 : world/123
				}
			});
			
			<button onclick="oInst.method();">Click me</button> 
	**/
	fireEvent : function(sEvent, oEvent) {
		oEvent = oEvent || {};
		var fInlineHandler = this['on' + sEvent],
			aHandlerList = this._htEventHandler[sEvent] || [],
			bHasInlineHandler = typeof fInlineHandler == "function",
			bHasHandlerList = aHandlerList.length > 0;
			
		if (!bHasInlineHandler && !bHasHandlerList) {
			return true;
		}
		aHandlerList = aHandlerList.concat(); //fireEvent수행시 핸들러 내부에서 detach되어도 최초수행시의 핸들러리스트는 모두 수행
		
		oEvent.sType = sEvent;
		if (typeof oEvent._aExtend == 'undefined') {
			oEvent._aExtend = [];
			oEvent.stop = function(){
				if (oEvent._aExtend.length > 0) {
					oEvent._aExtend[oEvent._aExtend.length - 1].bCanceled = true;
				}
			};
		}
		oEvent._aExtend.push({
			sType: sEvent,
			bCanceled: false
		});
		
		var aArg = [oEvent], 
			i, nLen;
			
		for (i = 2, nLen = arguments.length; i < nLen; i++){
			aArg.push(arguments[i]);
		}
		
		if (bHasInlineHandler) {
			fInlineHandler.apply(this, aArg);
		}
	
		if (bHasHandlerList) {
			var fHandler;
			for (i = 0, fHandler; (fHandler = aHandlerList[i]); i++) {
				fHandler.apply(this, aArg);
			}
		}
		
		return !oEvent._aExtend.pop().bCanceled;
	},

	/**
		커스텀 이벤트 핸들러를 등록한다.
		
		@method attach
		@param {String} sEvent 커스텀 이벤트 명
		@param {Function} fHandlerToAttach 등록 할 커스텀 이벤트 핸들러
			@param {Object} fHandlerToAttach.oCustomEvent 커스텀 이벤트 객체
		@return {this} 컴포넌트 인스턴스 자신
		@example
			//이벤트 등록 방법 예제
			//아래처럼 등록하면 appear 라는 사용자 이벤트 핸들러는 총 3개가 등록되어 해당 이벤트를 발생시키면 각각의 핸들러 함수가 모두 실행됨.
			//attach 을 통해 등록할때는 이벤트명에 'on' 이 빠지는 것에 유의.
			function fpHandler1(oEvent) { .... };
			function fpHandler2(oEvent) { .... };
			
			var oInst = new MyComponent();
			oInst.onappear = fpHandler1; // 직접 등록
			oInst.attach('appear', fpHandler1); // attach 함수를 통해 등록
			oInst.attach({
				appear : fpHandler1,
				more : fpHandler2
			});
	**/
	attach : function(sEvent, fHandlerToAttach) {
		if (arguments.length == 1) {
			
			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.attach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}
		
		var aHandler = this._htEventHandler[sEvent];
		
		if (typeof aHandler == 'undefined'){
			aHandler = this._htEventHandler[sEvent] = [];
		}
		
		aHandler.push(fHandlerToAttach);
		
		return this;
	},
	
	/**
		커스텀 이벤트 핸들러를 해제한다.
		
		@method detach
		@param {String} sEvent 커스텀 이벤트 명
		@param {Function} fHandlerToDetach 등록 해제 할 커스텀 이벤트 핸들러
		@return {this} 컴포넌트 인스턴스 자신
		@example
			//이벤트 해제 예제
			oInst.onappear = null; // 직접 해제
			oInst.detach('appear', fpHandler1); // detach 함수를 통해 해제
			oInst.detach({
				appear : fpHandler1,
				more : fpHandler2
			});
	**/
	detach : function(sEvent, fHandlerToDetach) {
		if (arguments.length == 1) {
			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.detach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];
		if (aHandler) {
			for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
				if (fHandler === fHandlerToDetach) {
					aHandler = aHandler.splice(i, 1);
					break;
				}
			}
		}

		return this;
	},
	
	/**
		등록된 모든 커스텀 이벤트 핸들러를 해제한다.
		
		@method detachAll
		@param {String} sEvent 이벤트명. 생략시 모든 등록된 커스텀 이벤트 핸들러를 해제한다. 
		@return {this} 컴포넌트 인스턴스 자신
		@example
			//"show" 커스텀 이벤트 핸들러 모두 해제
			oInst.detachAll("show");
			
			//모든 커스텀 이벤트 핸들러 해제
			oInst.detachAll();
	**/
	detachAll : function(sEvent) {
		var aHandler = this._htEventHandler;
		
		if (arguments.length) {
			
			if (typeof aHandler[sEvent] == 'undefined') {
				return this;
			}
	
			delete aHandler[sEvent];
	
			return this;
		}	
		
		for (var o in aHandler) {
			delete aHandler[o];
		}
		return this;				
	}
});

/**
	다수의 컴포넌트를 일괄 생성하는 Static Method
	
	@method factory
	@static
	@param {Array} aObject 기준엘리먼트의 배열
	@param {HashTable} htOption 옵션객체의 배열
	@return {Array} 생성된 컴포넌트 객체 배열
	@example
		var Instance = jindo.Component.factory(
			cssquery('li'),
			{
				foo : 123,
				bar : 456
			}
		);
**/
jindo.Component.factory = function(aObject, htOption) {
	var aReturn = [],
		oInstance;

	if (typeof htOption == "undefined") {
		htOption = {};
	}
	
	for(var i = 0, el; (el = aObject[i]); i++) {
		oInstance = new this(el, htOption);
		aReturn[aReturn.length] = oInstance;
	}

	return aReturn;
};

/**
	컴포넌트의 생성된 인스턴스를 리턴한다.
	
	@static
	@deprecated
	
	@remark 본 메서드는 deprecated 되었으며 멀지 않은 릴리즈부터 사라질 예정입니다. 
	
	@return {Array} 생성된 인스턴스의 배열
**/
jindo.Component.getInstance = function(){
	throw new Error('JC 1.11.0 or JMC 1.13.0 later, getInstance method of Component is not longer supported.');
};

/**
	사용하는 컴포넌트의 버전
	
	@property VERSION
	@static
	
	@type String
	@default "1.3.0"
	
	@example
		console.log(jindo.Component.VERSION); // "1.3.0"

	@since 1.3.0
 */
jindo.Component.VERSION = '1.14.0'; /**
	@fileOverview UI 컴포넌트를 구현하기 위한 코어 클래스
	@version 1.14.0
**/
/**
	UI Component에 상속되어 사용되는 Jindo Component의 Core
	
	@class jindo.UIComponent
	@extends jindo.Component
	@keyword uicomponent, component, 유아이컴포넌트
**/
jindo.UIComponent = jindo.$Class({
	/** @lends jindo.UIComponent.prototype */
		
	/**
		@constructor
		jindo.UIComponent를 초기화한다.
	**/
	$init : function() {
		this._bIsActivating = false; //컴포넌트의 활성화 여부
	},

	/**
		컴포넌트의 활성여부를 가져온다.
		
		@method isActivating
		@return {Boolean} 활성화 여부
	**/
	isActivating : function() {
		return this._bIsActivating;
	},

	/**
		컴포넌트를 활성화한다.
		_onActivate 메서드를 수행하므로 반드시 상속받는 클래스에 _onActivate 메서드가 정의되어야한다.
		
		@method activate
		@return {this}
	**/
	activate : function() {
		if (this.isActivating()) {
			return this;
		}
		this._bIsActivating = true;
		
		if (arguments.length > 0) {
			this._onActivate.apply(this, arguments);
		} else {
			this._onActivate();
		}
				
		return this;
	},
	
	/**
		컴포넌트를 비활성화한다.
		_onDeactivate 메서드를 수행하므로 반드시 상속받는 클래스에 _onDeactivate 메서드가 정의되어야한다.
		
		@method deactivate
		@return {this}
	**/
	deactivate : function() {
		if (!this.isActivating()) {
			return this;
		}
		this._bIsActivating = false;
		
		if (arguments.length > 0) {
			this._onDeactivate.apply(this, arguments);
		} else {
			this._onDeactivate();
		}
		
		return this;
	}
}).extend(jindo.Component);	
/**
	@fileOverview 타이머를 편리하게 사용할 수 있게해주는 컴포넌트
	@version 1.14.0
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
/**
	@version 1.14.0
**/

/*
	TERMS OF USE - EASING EQUATIONS
	Open source under the BSD License.
	Copyright (c) 2001 Robert Penner, all rights reserved.
**/

/**
	수치의 중간 값을 쉽게 얻을 수 있게 하는 static 컴포넌트
	새로운 이펙트 함수를 생성한다.
	
	@class jindo.Effect
	@static
	@param {Function} fEffect 0~1 사이의 숫자를 인자로 받아 정해진 공식에 따라 0~1 사이의 값을 리턴하는 함수
	@return {Function} 이펙트 함수. 이 함수는 시작 값과 종료 값을 입력하여 특정 시점에 해당하는 값을 구하는 타이밍 함수를 생성한다.

	@keyword effect, 효과, animation, 애니메이션

	@history 1.12.0 New CSS 타이밍함수로 바뀔 수 있는 Effect 함수에 toString 구현
	@history 1.8.0 Update Effect 함수 내에 start, end 프로퍼티 추가
	@history 1.8.0 Update 시작값 또는 종료값이 0일 경우, 단위에 상관없이 처리하도록 수정
**/
jindo.Effect = function(fEffect) {
	if (this instanceof arguments.callee) {
		throw new Error("You can't create a instance of this");
	}
	
	// Effect 함수에서 허용하는 시작값/종료값의 정규식들
	var rxNumber = /^(\-?[0-9\.]+)(%|\w+)?$/, // 숫자와 단위(%,px,em 등)
		rxRGB = /^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i, // rgb(R,G,B)
		rxRGBA = /^rgba\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+),\s?([0-9\.]+)\)$/i, // rgba(R,G,B,alpha)
		rxHSL = /^hsl\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%\)$/i, // hsl(H,S,L)
		rxHSLA = /^hsla\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%,\s?([0-9\.]+)\)$/i, // hsla(H,S,L,alpha)
		rxHex = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i, // #FFFFFF
		rx3to6 = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i; // #FFF
	
	// 값을 숫자와 단위로 구분한 객체로 전환
	var getUnitAndValue = function(v) {
		var nValue = v, sUnit;
		
		if (rxNumber.test(v)) { // 숫자와 단위로 구성된 경우
			nValue = parseFloat(v); 
			sUnit = RegExp.$2 || "";
		} else if (rxRGB.test(v)) { // RGB 값인 경우
			nValue = {rgb:[parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), 1]};
			sUnit = 'color';
		} else if (rxRGBA.test(v)) { // RGBA 값인 경우
			nValue = {rgb:[parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), parseFloat(RegExp.$4)]};
			sUnit = 'color';
		} else if (rxHSL.test(v)) { // HSL 값인 경우
			nValue = {hsl:[parseFloat(RegExp.$1), parseFloat(RegExp.$2)/100, parseFloat(RegExp.$3)/100, 1]};
			nValue.rgb = hsl2rgb.apply(this, nValue.hsl); // RGB 값으로 변환한 값도 함께 저장
			sUnit = 'color';
		} else if (rxHSLA.test(v)) { // HSLA 값인 경우
			nValue = {hsl:[parseFloat(RegExp.$1), parseFloat(RegExp.$2)/100, parseFloat(RegExp.$3)/100, parseFloat(RegExp.$4)]};
			nValue.rgb = hsl2rgb.apply(this, nValue.hsl); // RGB 값으로 변환한 값도 함께 저장
			sUnit = 'color';
		} else if (rxHex.test(v = v.replace(rx3to6, '#$1$1$2$2$3$3'))) { // #색상 값인 경우
			nValue = {rgb:[parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16), 1]};
			sUnit = 'color';
		} else {
			throw new Error('unit error (' + v + ')');
		}
				
		return { 
			nValue : nValue, 
			sUnit : sUnit 
		};
	};

	// 여러개의 값이 합쳐져 있는 형태를 빈칸으로 기준으로 배열로 분리
	// fExplode('20px 30px 40px') -> [ '20px', '30px', '40px' ]
	// fExplode('20px rgb(255, 0, 0) #fff') -> [ '20px', 'rgb(255, 0, 0)', '#fff' ]
	var fExplode = function(sStr) {
		var aRet = [];
		sStr.replace(/([^\s]+\([^\)]*\)|[^\s]+)\s?/g, function(_, a) { aRet.push(a); });
		return aRet;
	};

	// 여러개의 값이 합쳐져 있는 형태의 문자열을 숫자와 단위로 구분한 객체의 배열로 분리 변환
	var getUnitAndValueList = function(v) {

		var aList = fExplode(v?v+'':'0');
		var aRet = [];

		for (var i = 0, nLen = aList.length; i < nLen; i++) {
			aRet.push(getUnitAndValue(aList[i]));
		}

		return aRet;

	};

	// 처리과정에서 sUnit 값이 바뀔 수 있으므로 1단계 deep-copy
	var copy = function(oValue) {
		if (typeof oValue === 'object') {
			return { nValue : oValue.nValue, sUnit : oValue.sUnit };
		}
		return oValue;
	};

	// http://jsfiddle.net/EPWF6/9/
	var hsl2rgb = function(H, S, L, alpha) {
		H = (H % 360) / 60;

		var C = (1 - Math.abs((2 * L) - 1)) * S;
		var X = C * (1 - Math.abs((H % 2) - 1));
		var R1 = 0, G1 = 0, B1 = 0;

		if (H >= 5 || H < 1) {
			R1 = C;
			B1 = X;
		} else if (H >= 4) {
			R1 = X;
			B1 = C;
		} else if (H >= 3) {
			G1 = X;
			B1 = C;
		} else if (H >= 2) {
			G1 = C;
			B1 = X;
		} else if (H >= 1) {
			R1 = X;
			G1 = C;
		}

		var m = L - (C / 2);

		return [
			Math.round((R1 + m) * 255),
			Math.round((G1 + m) * 255),
			Math.round((B1 + m) * 255),
			alpha
		];

	};

	// 이펙트 함수
	return function(sStart, sEnd) {

		var aStart, aEnd;

		// 시작값 종료값 파싱
		var fParse = function() {

			var bChanged = false;

			// 시작값이 이전에 파싱했을때와 달라졌으면 다시 파싱
			if (fReturn.start !== sStart) {
				aStart = getUnitAndValueList(fReturn.start);
				sStart = fReturn.start;
				bChanged = true;
			}

			// 종료값이 이전에 파싱했을때와 달라졌으면 다시 파싱
			if (fReturn.end !== sEnd) {
				aEnd = getUnitAndValueList(fReturn.end);
				sEnd = fReturn.end;
				bChanged = true;
			}

			// 시작값이나 종료값이 이전에 파싱했을때와 달라졌으면
			if (bChanged) {

				var nLen = Math.max(aStart.length, aEnd.length);
				var oStart, oEnd;

				// 시작값의 갯수와 종료값의 갯수가 다르면 맞춰줌
				if (aStart.length !== aEnd.length && nLen > 1) {

					switch (aStart.length) {
					case 1: aStart[1] = copy(aStart[0]); // not break
					case 2: aStart[2] = copy(aStart[0]); // not break
					case 3: aStart[3] = copy(aStart[1]); break;
					}

					switch (aEnd.length) {
					case 1: aEnd[1] = copy(aEnd[0]); // not break
					case 2: aEnd[2] = copy(aEnd[0]); // not break
					case 3: aEnd[3] = copy(aEnd[1]); break;
					}

				}

				// 각각의 값을 확인
				for (var i = 0; i < nLen; i++) {

					oStart = aStart[i];
					oEnd = aEnd[i];

					// 어느 한쪽의 값이 0 이면 단위를 다른쪽의 단위와 동일하게 바꿔줌
					if (oStart.nValue === 0) { oStart.sUnit = oEnd.sUnit; }
					else if (oEnd.nValue === 0) { oEnd.sUnit = oStart.sUnit; }

					// 두개의 단위가 다르면 에러 발생
					if (oStart.sUnit != oEnd.sUnit) {
						throw new Error('unit error (' + sStart + ' ~ ' + sEnd + ')');
					}

				}

			}

		};

		// 0.0~1.0 사이의 인자(p)를 받는 함수
		var fReturn = function(p) {

			var aRet = [];

			fParse(); // 시작값, 종료값이 유효한지 확인

			var oStart, oEnd;
			var nStart, nEnd, sUnit;

			var alpha;

			// 시작값들과 종료값들에서 루프
			for (var i = 0, nLen = Math.max(aStart.length, aEnd.length); i < nLen; i++) {

				oStart = aStart[i];
				oEnd = aEnd[i];

				nStart = oStart.nValue;
				nEnd = oEnd.nValue;
				sUnit = oStart.sUnit;

				var nValue = fEffect(p),
					getResult = function(s, d, sUnit) {
						return Math.round(((d - s) * nValue + s) * 1000000) / 1000000 + (sUnit || 0);
					};
				
				// 숫자+단위로 된 값이면
				if (sUnit !== 'color') {
					// 중간값 목록에 추가
					aRet.push(getResult(nStart, nEnd, sUnit));
					continue;
				}

				// HSL 단위이면
				if (nStart.hsl && nEnd.hsl) {

					nStart = nStart.hsl;
					nEnd = nEnd.hsl;

					var h = Math.round(getResult(nStart[0], nEnd[0]));
					var s = Math.max(0, Math.min(1, getResult(nStart[1], nEnd[1]))) * 100;
					var l = Math.max(0, Math.min(1, getResult(nStart[2], nEnd[2]))) * 100;
					alpha = getResult(nStart[3], nEnd[3]);

					if (alpha === 1) {
						aRet.push('hsl(' + [ h, s+'%', l+'%' ].join(',') + ')');
					} else {
						aRet.push('hsla(' + [ h, s+'%', l+'%', alpha ].join(',') + ')');
					}

				// RGB 단위이면
				} else {

					nStart = nStart.rgb;
					nEnd = nEnd.rgb;

					var r = Math.max(0, Math.min(255, Math.round(getResult(nStart[0], nEnd[0]))));
					var g = Math.max(0, Math.min(255, Math.round(getResult(nStart[1], nEnd[1]))));
					var b = Math.max(0, Math.min(255, Math.round(getResult(nStart[2], nEnd[2]))));
					alpha = getResult(nStart[3], nEnd[3]);

					if (alpha === 1) {
						var dummy = ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
						aRet.push('#' + Array(7 - dummy.length).join('0') + dummy);
					} else {
						aRet.push('rgba(' + [ r, g, b, alpha ].join(',') + ')');
					}

				}

			}

			// 중간값 목록을 반환
			return aRet.join(' ');

		};

		switch (arguments.length) {
		case 0: break;
		case 1:
			sEnd = sStart || '0';
			sStart = '0';
			
			fReturn.setStart = function(sStart) {
				this.start = sStart;
			}; // deprecated
			break;
		}

		fReturn.start = sStart;
		fReturn.end = sEnd;
		fReturn.effectConstructor = arguments.callee;

		sStart = sEnd = null;

		if (arguments.length > 1) {
			fParse(); // 시작값, 종료값이 유효한지 확인
		}

		return fReturn;

	};
	
};

/**
	linear 이펙트 함수
	
	@method linear
	@static
**/
jindo.Effect.linear = jindo.Effect(function(s) {
	return s;
});
jindo.Effect.linear.toString = function() { return 'linear'; };

/**
	easeInSine 이펙트 함수
	
	@method easeInSine
	@static
**/
jindo.Effect.easeInSine = jindo.Effect(function(s) {
	return (s == 1) ? 1 : -Math.cos(s * (Math.PI / 2)) + 1;
});
/**
	easeOutSine 이펙트 함수
	
	@method easeOutSine
	@static
**/
jindo.Effect.easeOutSine = jindo.Effect(function(s) {
	return Math.sin(s * (Math.PI / 2));
});
/**
	easeInOutSine 이펙트 함수
	
	@method easeInOutSine
	@static
**/
jindo.Effect.easeInOutSine = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInSine(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInSine 이펙트 함수
	
	@method easeOutInSine
	@static
**/
jindo.Effect.easeOutInSine = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutSine(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInQuad 이펙트 함수
	
	@method easeInQuad
	@static
**/
jindo.Effect.easeInQuad = jindo.Effect(function(s) {
	return s * s;
});
/**
	easeOutQuad 이펙트 함수
	
	@method easeOutQuad
	@static
**/
jindo.Effect.easeOutQuad = jindo.Effect(function(s) {
	return -(s * (s - 2));
});
/**
	easeInOutQuad 이펙트 함수
	
	@method easeInOutQuad
	@static
**/
jindo.Effect.easeInOutQuad = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuad(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInQuad 이펙트 함수
	
	@method easeOutInQuad
	@static
**/
jindo.Effect.easeOutInQuad = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuad(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInCubic 이펙트 함수
	
	@method easeInCubic
	@static
**/
jindo.Effect.easeInCubic = jindo.Effect(function(s) {
	return Math.pow(s, 3);
});
/**
	easeOutCubic 이펙트 함수
	
	@method easeOutCubic
	@static
**/
jindo.Effect.easeOutCubic = jindo.Effect(function(s) {
	return Math.pow((s - 1), 3) + 1;
});
/**
	easeInOutCubic 이펙트 함수
	
	@method easeInOutCubic
	@static
**/
jindo.Effect.easeInOutCubic = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeIn(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOut(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInCubic 이펙트 함수
	
	@method easeOutInCubic
	@static
**/
jindo.Effect.easeOutInCubic = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOut(0, 1)(2 * s) * 0.5 : jindo.Effect.easeIn(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInQuart 이펙트 함수
	
	@method easeInQuart
	@static
**/
jindo.Effect.easeInQuart = jindo.Effect(function(s) {
	return Math.pow(s, 4);
});
/**
	easeOutQuart 이펙트 함수
	
	@method easeOutQuart
	@static
**/
jindo.Effect.easeOutQuart = jindo.Effect(function(s) {
	return -(Math.pow(s - 1, 4) - 1);
});
/**
	easeInOutQuart 이펙트 함수
	
	@method easeInOutQuart
	@static
**/
jindo.Effect.easeInOutQuart = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuart(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInQuart 이펙트 함수
	
	@method easeOutInQuart
	@static
**/
jindo.Effect.easeOutInQuart = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuart(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInQuint 이펙트 함수
	
	@method easeInQuint
	@static
**/
jindo.Effect.easeInQuint = jindo.Effect(function(s) {
	return Math.pow(s, 5);
});
/**
	easeOutQuint 이펙트 함수
	
	@method easeOutQuint
	@static
**/
jindo.Effect.easeOutQuint = jindo.Effect(function(s) {
	return Math.pow(s - 1, 5) + 1;
});
/**
	easeInOutQuint 이펙트 함수
	
	@method easeInOutQuint
	@static
**/
jindo.Effect.easeInOutQuint = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuint(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInQuint 이펙트 함수
	
	@method easeOutInQuint
	@static
**/
jindo.Effect.easeOutInQuint = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuint(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInCircle 이펙트 함수
	
	@method easeInCircle
	@static
**/
jindo.Effect.easeInCircle = jindo.Effect(function(s) {
	return -(Math.sqrt(1 - (s * s)) - 1);
});
/**
	easeOutCircle 이펙트 함수
	
	@method easeOutCircle
	@static
**/
jindo.Effect.easeOutCircle = jindo.Effect(function(s) {
	return Math.sqrt(1 - (s - 1) * (s - 1));
});
/**
	easeInOutCircle 이펙트 함수
	
	@method easeInOutCircle
	@static
**/
jindo.Effect.easeInOutCircle = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInCircle(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutInCircle 이펙트 함수
	
	@method easeOutInCircle
	@static
**/
jindo.Effect.easeOutInCircle = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutCircle(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInBack 이펙트 함수
	
	@method easeInBack
	@static
**/
jindo.Effect.easeInBack = jindo.Effect(function(s) {
	var n = 1.70158;
	return (s == 1) ? 1 : (s / 1) * (s / 1) * ((1 + n) * s - n);
});
/**
	easeOutBack 이펙트 함수
	
	@method easeOutBack
	@static
**/
jindo.Effect.easeOutBack = jindo.Effect(function(s) {
	var n = 1.70158;
	return (s === 0) ? 0 : (s = s / 1 - 1) * s * ((n + 1) * s + n) + 1;
});
/**
	easeInOutBack 이펙트 함수
	
	@method easeInOutBack
	@static
**/
jindo.Effect.easeInOutBack = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInBack(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutBack(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInElastic 이펙트 함수
	
	@method easeInElastic
	@static
**/
jindo.Effect.easeInElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s/=1) == 1) {
		return 1;
	}
	if (!p) {
		p = 0.3;
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	return -(a * Math.pow(2, 10 * (s -= 1)) * Math.sin((s - 1) * (2 * Math.PI) / p));
});

/**
	easeOutElastic 이펙트 함수
	
	@method easeOutElastic
	@static
**/
jindo.Effect.easeOutElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s/=1) == 1) {
		return 1;
	}
	if (!p) {
		p = 0.3;
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	return (a * Math.pow(2, -10 * s) * Math.sin((s - n) * (2 * Math.PI) / p ) + 1);
});
/**
	easeInOutElastic 이펙트 함수
	
	@method easeInOutElastic
	@static
**/
jindo.Effect.easeInOutElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s=s/(1/2)) == 2) {
		return 1;
	}
	if (!p) {
		p = (0.3 * 1.5);
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	if (s < 1) {
		return -0.5 * (a * Math.pow(2, 10 * (s -= 1)) * Math.sin( (s - n) * (2 * Math.PI) / p ));
	}
	return a * Math.pow(2, -10 * (s -= 1)) * Math.sin( (s - n) * (2 * Math.PI) / p ) * 0.5 + 1;
});

/**
	easeOutBounce 이펙트 함수
	
	@method easeOutBounce
	@static
**/
jindo.Effect.easeOutBounce = jindo.Effect(function(s) {
	if (s < (1 / 2.75)) {
		return (7.5625 * s * s);
	} else if (s < (2 / 2.75)) {
		return (7.5625 * (s -= (1.5 / 2.75)) * s + 0.75);
	} else if (s < (2.5 / 2.75)) {
		return (7.5625 * (s -= (2.25 / 2.75)) * s + 0.9375);
	} else {
		return (7.5625 * (s -= (2.625 / 2.75)) * s + 0.984375);
	} 
});
/**
	easeInBounce 이펙트 함수
	
	@method easeInBounce
	@static
**/
jindo.Effect.easeInBounce = jindo.Effect(function(s) {
	return 1 - jindo.Effect.easeOutBounce(0, 1)(1 - s);
});
/**
	easeInOutBounce 이펙트 함수
	
	@method easeInOutBounce
	@static
**/
jindo.Effect.easeInOutBounce = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInBounce(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutBounce(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	easeInExpo 이펙트 함수
	
	@method easeInExpo
	@static
**/
jindo.Effect.easeInExpo = jindo.Effect(function(s) {
	return (s === 0) ? 0 : Math.pow(2, 10 * (s - 1));
});
/**
	easeOutExpo 이펙트 함수
	
	@method easeOutExpo
	@static
**/
jindo.Effect.easeOutExpo = jindo.Effect(function(s) {
	return (s == 1) ? 1 : -Math.pow(2, -10 * s / 1) + 1;
});
/**
	easeInOutExpo 이펙트 함수
	
	@method easeInOutExpo
	@static
**/
jindo.Effect.easeInOutExpo = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInExpo(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
	easeOutExpo 이펙트 함수
	
	@method easeOutInExpo
	@static
**/
jindo.Effect.easeOutInExpo = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutExpo(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
	Cubic-Bezier curve
	@method _cubicBezier
	@private
	@param {Number} x1
	@param {Number} y1
	@param {Number} x2
	@param {Number} y2
	@see http://www.netzgesta.de/dev/cubic-bezier-timing-function.html 
**/
jindo.Effect._cubicBezier = function(x1, y1, x2, y2){
	return function(t){
		var cx = 3.0 * x1, 
	    	bx = 3.0 * (x2 - x1) - cx, 
	    	ax = 1.0 - cx - bx, 
	    	cy = 3.0 * y1, 
	    	by = 3.0 * (y2 - y1) - cy, 
	    	ay = 1.0 - cy - by;
		
	    function sampleCurveX(t) {
	    	return ((ax * t + bx) * t + cx) * t;
	    }
	    function sampleCurveY(t) {
	    	return ((ay * t + by) * t + cy) * t;
	    }
	    function sampleCurveDerivativeX(t) {
	    	return (3.0 * ax * t + 2.0 * bx) * t + cx;
	    }
	    function solveCurveX(x,epsilon) {
	    	var t0, t1, t2, x2, d2, i;
	    	for (t2 = x, i = 0; i<8; i++) {
	    		x2 = sampleCurveX(t2) - x; 
	    		if (Math.abs(x2) < epsilon) {
	    			return t2;
	    		} 
	    		d2 = sampleCurveDerivativeX(t2); 
	    		if(Math.abs(d2) < 1e-6) {
	    			break;
	    		} 
	    		t2 = t2 - x2 / d2;
	    	}
		    t0 = 0.0; 
		    t1 = 1.0; 
		    t2 = x; 
		    if (t2 < t0) {
		    	return t0;
		    } 
		    if (t2 > t1) {
		    	return t1;
		    }
		    while (t0 < t1) {
		    	x2 = sampleCurveX(t2); 
		    	if (Math.abs(x2 - x) < epsilon) {
		    		return t2;
		    	} 
		    	if (x > x2) {
		    		t0 = t2;
		    	} else {
		    		t1 = t2;
		    	} 
		    	t2 = (t1 - t0) * 0.5 + t0;
		    }
	    	return t2; // Failure.
	    }
	    return sampleCurveY(solveCurveX(t, 1 / 200));
	};
};

/**
	Cubic-Bezier 함수를 생성한다.
	
	@method cubicBezier
	@static
	@see http://en.wikipedia.org/wiki/B%C3%A9zier_curve
	@param {Number} x1 control point 1의 x좌표
	@param {Number} y1 control point 1의 y좌표
	@param {Number} x2 control point 2의 x좌표
	@param {Number} y2 control point 2의 y좌표
	@return {Function} 생성된 이펙트 함수
**/
jindo.Effect.cubicBezier = function(x1, y1, x2, y2){
	var f = jindo.Effect(jindo.Effect._cubicBezier(x1, y1, x2, y2));
	var cssTimingFunction = 'cubic-bezier(' + [ x1, y1, x2, y2 ].join(',') + ')';
	f.toString = function() { return cssTimingFunction; };
	return f;
};

/**
	Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 ease 함수
	
	@example
		jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);
	
	@method cubicEase
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.cubicEase = jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);
jindo.Effect.cubicEase.toString = function() { return 'ease'; };

/**
	Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeIn 함수

	@example
		jindo.Effect.cubicBezier(0.42, 0, 1, 1);
	
	@method cubicEaseIn
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.cubicEaseIn = jindo.Effect.cubicBezier(0.42, 0, 1, 1);
jindo.Effect.cubicEaseIn.toString = function() { return 'ease-in'; };

/**
	Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeOut 함수
	
	@example
		jindo.Effect.cubicBezier(0, 0, 0.58, 1);
	
	@method cubicEaseOut
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.cubicEaseOut = jindo.Effect.cubicBezier(0, 0, 0.58, 1);
jindo.Effect.cubicEaseOut.toString = function() { return 'ease-out'; };

/**
	Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeInOut 함수
	
	@example
		jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);
	
	@method cubicEaseInOut
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.cubicEaseInOut = jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);
jindo.Effect.cubicEaseInOut.toString = function() { return 'ease-in-out'; };

/**
	Cubic-Bezier 커브를 이용해 easeOutIn 함수를 구한다.
	
	@example
		jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);
	
	@method cubicEaseOutIn
	@static
**/
jindo.Effect.cubicEaseOutIn = jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);

/**
	overphase 이펙트 함수
	
	@method overphase
	@static
**/
jindo.Effect.overphase = jindo.Effect(function(s){
	s /= 0.652785;
	return (Math.sqrt((2 - s) * s) + (0.1 * s)).toFixed(5);	
});

/**
	sin 곡선의 일부를 이용한 sinusoidal 이펙트 함수
	
	@method sinusoidal
	@static
**/
jindo.Effect.sinusoidal = jindo.Effect(function(s) {
	return (-Math.cos(s * Math.PI) / 2) + 0.5;
});

/**
	mirror 이펙트 함수
	sinusoidal 이펙트 함수를 사용한다.
	
	@method mirror
	@static
**/
jindo.Effect.mirror = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.sinusoidal(0, 1)(s * 2) : jindo.Effect.sinusoidal(0, 1)(1 - (s - 0.5) * 2);
});

/**
	nPulse의 진동수를 가지는 cos 함수를 구한다.
	
	@method pulse
	@static
	@param {Number} nPulse 진동수
	@return {Function} 생성된 이펙트 함수
	@example
		var f = jindo.Effect.pulse(3); //진동수 3을 가지는 함수를 리턴
		//시작 수치 값과 종료 수치 값을 설정해 jindo.Effect 함수를 생성
		var fEffect = f(0, 100);
		fEffect(0); => 0
		fEffect(1); => 100
**/
jindo.Effect.pulse = function(nPulse) {
    return jindo.Effect(function(s){
		return (-Math.cos((s * (nPulse - 0.5) * 2) * Math.PI) / 2) + 0.5;	
	});
};

/**
	nPeriod의 주기와 nHeight의 진폭을 가지는 sin 함수를 구한다.
	
	@method wave
	@static
	@param {Number} nPeriod 주기
	@param {Number} nHeight 진폭
	@return {Function} 생성된 이펙트 함수
	@example
		var f = jindo.Effect.wave(3, 1); //주기 3, 높이 1을 가지는 함수를 리턴
		//시작 수치 값과 종료 수치 값을 설정해 jindo.Effect 함수를 생성
		var fEffect = f(0, 100);
		fEffect(0); => 0
		fEffect(1); => 0
**/
jindo.Effect.wave = function(nPeriod, nHeight) {
    return jindo.Effect(function(s){
    	return (nHeight || 1) * (Math.sin(nPeriod * (s * 360) * Math.PI / 180)).toFixed(5);
	});
};

/**
	CSS3 Transition Timing Function 의 step-start 와 동일한 함수
	
	@method stepStart
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.stepStart = jindo.Effect(function(s) {
	return s === 0 ? 0 : 1;
});

/**
	CSS3 Transition Timing Function 의 step-end 와 동일한 함수
	
	@method stepEnd
	@static
	@see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
**/
jindo.Effect.stepEnd = jindo.Effect(function(s) {
	return s === 1 ? 1 : 0;
});

/**
	easeIn 이펙트 함수
	easeInCubic 함수와 동일하다.
	
	@method easeIn
	@static
	@see easeInCubic
**/
jindo.Effect.easeIn = jindo.Effect.easeInCubic;
/**
	easeOut 이펙트 함수
	easeOutCubic 함수와 동일하다.
	
	@method easeOut
	@static
	@see easeOutCubic
**/
jindo.Effect.easeOut = jindo.Effect.easeOutCubic;
/**
	easeInOut 이펙트 함수
	easeInOutCubic 함수와 동일하다.
	
	@method easeInOut
	@static
	@see easeInOutCubic
**/
jindo.Effect.easeInOut = jindo.Effect.easeInOutCubic;
/**
	easeOutIn 이펙트 함수
	easeOutInCubic 함수와 동일하다.
	
	@method easeOutIn
	@static
	@see easeOutInCubic
**/
jindo.Effect.easeOutIn = jindo.Effect.easeOutInCubic;
/**
	bounce 이펙트 함수
	easeOutBounce 함수와 동일하다.
	
	@method bounce
	@static
	@see easeOutBounce
**/
jindo.Effect.bounce = jindo.Effect.easeOutBounce;
/**
	elastic 이펙트 함수
	easeInElastic 함수와 동일하다.
	
	@method elastic
	@static
	@see easeInElastic
**/
jindo.Effect.elastic = jindo.Effect.easeInElastic;
/**
	@fileOverview 엘리먼트의 css 스타일을 조정해 부드러운 움직임(변형)을 표현하는 컴포넌트
	@version 1.14.0
**/
/**
	엘리먼트의 css style의 변화를 주어 움직이는 효과를 주는 컴포넌트
	
	@class jindo.Transition
	@extends jindo.Component
	@uses jindo.Effect
	@uses jindo.Timer
	@keyword transition, 트랜지션
**/
jindo.Transition = jindo.$Class({
	/** @lends jindo.Transition.prototype */
	_nFPS : 30,
	
	_aTaskQueue : null,
	_oTimer : null,
	
	_bIsWaiting : true, // 큐의 다음 동작을 하길 기다리는 상태
	_bIsPlaying : false, // 재생되고 있는 상태
	
	/**
		Transition 컴포넌트를 초기화한다.
		
		@constructor
		@param {Object} [htOption] 옵션 객체
			@param {Function} [htOption.fEffect=jindo.Effect.linear] jindo.Effect 이펙트 함수
			@param {Boolean} [htOption.bCorrection=false] 소수점에 의해 어긋나는 사이즈를 보정할지 여부
	**/
	$init : function(htOption) {
		this._aTaskQueue = [];
		this._oTimer = new jindo.Timer();
		this._oSleepTimer = new jindo.Timer();
		
		this.option({ 
			fEffect : jindo.Effect.linear, 
			bCorrection : false 
		});
		this.option(htOption || {});
	},

	/**
		효과가 재생될 초당 frame rate를 가져온다.
		
		@method fps
		@return {Number} 
	**/
	/**
		효과가 재생될 초당 frame rate를 설정한다.
		
		@method fps
		@param {Number} nFPS
		@return {this} 
	**/
	fps : function(nFPS) {
		if (arguments.length > 0) {
			this._nFPS = nFPS;
			return this;
		}
		
		return this._nFPS;
	},
	
	/**
		트랜지션이 진행중인지 여부를 가져온다.
		
		@method isPlaying
		@return {Boolean}
	**/
	isPlaying : function() {
		return this._bIsPlaying;
	},
	
	/**
		진행되고 있는 Transition을 중지시킨다.
		
		@method abort
		@return {this}
	**/
	abort : function() {
		this._aTaskQueue = [];
		this._oTimer.abort();
		this._oSleepTimer.abort();
		
		if (this._bIsPlaying) {
			/**
				Transition이 중단되었을 때 발생
				
				@event abort
				@param {String} sType 커스텀 이벤트명
				@example
					// Transition이 중단되었을 때 실행 될 함수 구현.
					oTransition.attach("abort", function() { ... });
			**/
			this.fireEvent("abort");
		}

		this._bIsWaiting = true;
		this._bIsPlaying = false;
		
		this._htTaskToDo = null;
		return this;
	},
	
	/**
		Transition을 수행한다.
		파라미터를 지정(queue 메서드와 동일)하였을 경우에는 해당 동작을 바로 실행시키고, 파라미터가 생략되었을 때에는 지금까지 queue()로 지정된 동작들을 시작시킨다.
		파라미터는 function타입으로 지정하여 콜백을 수행할수 있다. (예제 참고)
		
		@method start
		@param {Number} nDuration Transition이 진행될 시간
		@param {Array} aCommand 적용할 명령셋
		@return {this}
		@see jindo.Transition#method_queue
		@example
			oTransition.start(1000,
				jindo.$("foo"), {
					'@left' : '200px'
				}
			));
		@example
			oTransition.start(1000, [
				[jindo.$("foo"), {
					'@left' : '200px'
				}],
				
				[jindo.$("bar"), {
					'@top' : '200px'
				}]
			]));
		@example
			oTransition.queue(1000,
				jindo.$("foo"), {
					'@left' : '200px'
				}
			));
			oTransition.start();
	**/
	start : function(nDuration, elTarget, htInfo) {
		if (arguments.length > 0) {
			this.queue.apply(this, arguments);
		}
		
		this._prepareNextTask();
		return this;
	},
	
	/**
		Transition을 큐에 담는다.
		여러 단계의 Transition을 담아두고 순차적으로 실행시킬때 사용한다. start() 메서드가 호출되기 전까지 수행되지 않는다.
		파라미터 aCommand는 [(HTMLElement)엘리먼트, (HashTable)Transition정보]로 구성되어야 하고, 여러명령을 동시에 적용할 수 있다.
		파라미터로 function을 지정하여 콜백을 등록할 수 있다.
		
		@method queue
		@param {Number} nDuration Transition이 진행될 시간
		@param {Array} aCommand 적용할 명령셋
		@return {this}
		@see jindo.Transition#method_start
		@example
			// 하나의 엘리먼트에 여러개의 명령을 지정하는 예제
			oTransition.queue(1000,
				jindo.$("foo"), {
					'@left' : '200px',
					'@top' : '50px',
					'@width' : '200px',
					'@height' : '200px',
					'@backgroundColor' : [ '#07f', 'rgb(255, 127, 127)' ]
				}
			); 
		@example
			// 여러개의 엘리먼트에 명령을 지정하는 예 1
			oTransition.queue(1000,
				jindo.$("foo"), {
					"@left" : jindo.Effect.linear("200px")
				},
				jindo.$("bar"), {
					"@top" : jindo.Effect.easeOut("200px")
				}
			);
		@example
			// 여러개의 엘리먼트에 명령을 지정하는 예 2
			oTransition.queue(1000, [
				[jindo.$("foo"), {
					"@left" : jindo.Effect.linear("200px")
				}],
				[jindo.$("bar"), {
					"@top" : jindo.Effect.easeIn("200px")
				}]
			]);  
		@example
			// 엘리먼트를 getter / setter 함수로 지정하는 예  
			oTransition.queue(1000, [
				[{
					getter : function(sKey) {
						return jindo.$Element("foo")[sKey]();
					},
					
					setter : function(sKey, sValue) {
						jindo.$Element("foo")[sKey](parseFloat(sValue));
					}
				}, {
					'height' : jindo.Effect.easeIn(100)
				}]
			]);  
		@example
			// 파라미터로 function을 지정하여 콜백을 수행하는 예제
			oTransition.start(function(){
				alert("end")
			});
	**/
	queue : function(nDuration, aCommand) {
		var htTask;
		if (typeof arguments[0] == 'function') {
			htTask = {
				sType : "function",
				fTask : arguments[0]
			};
		} else {
			var a = [];
			if (arguments[1] instanceof Array) {
				a = arguments[1];
			} else {
				var aInner = [];
				jindo.$A(arguments).forEach(function(v, i){
					if (i > 0) {
						aInner.push(v);
						if (i % 2 === 0) {
							a.push(aInner.concat());
							aInner = [];
						} 
					}
				});
			}
			
			htTask = {
				sType : "task",
				nDuration : nDuration, 
				aList : []
			};
			
			for (var i = 0, nLen = a.length; i < nLen; i ++) {
				var aValue = [],
					htArg = a[i][1],
					sEnd;
				
				for (var sKey in htArg) {
					sEnd = htArg[sKey];
					if (/^(@|style\.)(\w+)/i.test(sKey)) {
						aValue.push([ "style", RegExp.$2, sEnd ]);
					} else {
						aValue.push([ "attr", sKey, sEnd ]);
					}
				}
				
				htTask.aList.push({
					elTarget : a[i][0],
					aValue : aValue
				});
			}
		}
		this._queueTask(htTask);
		
		return this;
	},
	
	/**
		진행되고 있는 Transition을 일시중지시킨다.
		Transition이 진행중일때만 가능하다. (sleep 상태일 때에는 불가능)
		
		@method pause
		@return {this}
	**/
	pause : function() {
		if (this._oTimer.abort()) {
			/**
				Transition이 일시정지 되었을 때 발생
				
				@event pause
				@param {String} sType 커스텀 이벤트명
				@example
					// Transition이 일시정지 되었을 때 실행 될 함수 구현.
					oTransition.attach("pause", function() { ... });
			**/
			this.fireEvent("pause");
		}
		return this;
	},
	
	/**
		일시중지된 Transition을 재시작시킨다.
		
		@method resume
		@return {this}
	**/
	resume : function() {
		if (this._htTaskToDo) {
			if (this._bIsWaiting === false && this._bIsPlaying === true) {
				/**
					Transition이 재시작 될 때 발생
					
					@event resume
					@param {String} sType 커스텀 이벤트명
					@example
						// Transition이 재시작 될 때 실행 될 함수 구현.
						oTransition.attach("resume", function() { ... });
				**/
				this.fireEvent("resume");
			}
			
			this._doTask();
			
			this._bIsWaiting = false;
			this._bIsPlaying = true;
		
			var self = this;
			this._oTimer.start(function() {
				var bEnd = !self._doTask();
				if (bEnd) {
					self._bIsWaiting = true;
					setTimeout(function() { 
						self._prepareNextTask(); 
					}, 0);
				}
				
				return !bEnd;
			}, this._htTaskToDo.nInterval);
		}
		return this;
	},
	
	/**
		지정된 Transition이 종료된 이후에 또 다른 Transition 을 수행한다.
		start() 메서드는 더이상 현재 진행중인 Transition을 abort시키지 않는다.
		
		@method precede
		@return {this}
		@deprecated start() 사용권장
	**/
	precede : function(nDuration, elTarget, htInfo) {
		this.start.apply(this, arguments);
		return this;
	},
	
	/**
		현재의 Transition 종료 후 다음 Transition 진행하기전에 지정된 시간만큼 동작을 지연한다.
		
		@method sleep
		@param {Number} nDuration 지연할 시간
		@param {Function} [fCallback] 지연이 시작될때 수행될 콜백함수
		@return {this}
		@example
			oTransition.start(1000, jindo.$("foo"), {
				"@left" : jindo.Effect.linear(oPos.pageX + "px")
			}).sleep(500).start(1000, jindo.$("bar"), {
				"@top" : jindo.Effect.easeOut(oPos.pageY + "px")
			});
	**/
	sleep : function(nDuration, fCallback) {
		if (typeof fCallback == "undefined") {
			fCallback = function(){};
		}
		this._queueTask({
			sType : "sleep",
			nDuration : nDuration,
			fCallback : fCallback 
		});
		this._prepareNextTask();
		return this;
	},
	
	_queueTask : function(v) {
		this._aTaskQueue.push(v);
	},
	
	_dequeueTask : function() {
		var htTask = this._aTaskQueue.shift();
		if (htTask) {
			if (htTask.sType == "task") {
				var aList = htTask.aList;
				for (var i = 0, nLength = aList.length; i < nLength; i++) {
					
					var elTarget = aList[i].elTarget,
						welTarget = null;
					
					for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
						var sType = aValue[j][0],
							sKey = aValue[j][1],
							fFunc = aValue[j][2];
						
						if (typeof fFunc != "function") {
							var fEffect = this.option("fEffect");
							if (fFunc instanceof Array) {
								fFunc = fEffect(fFunc[0], fFunc[1]);
							} else {
								fFunc = fEffect(fFunc);
							}
							aValue[j][2] = fFunc;
						}
						
						if (fFunc.setStart) {
							if (this._isHTMLElement(elTarget)) {
								welTarget = welTarget || jindo.$Element(elTarget);
								switch (sType) {
									case "style":
										fFunc.setStart(welTarget.css(sKey));
										break;
										
									case "attr":
										fFunc.setStart(welTarget.$value()[sKey]);
										break;
								}
							} else {
								fFunc.setStart(elTarget.getter(sKey));
							}
						}
					}
				}
			}
			return htTask;
		} else {
			return null;
		}
	},
	
	_prepareNextTask : function() {
		if (this._bIsWaiting) {
			var htTask = this._dequeueTask();
			if (htTask) {
				switch (htTask.sType) {
					case "task":
						if (!this._bIsPlaying) {
							/**
								Transition이 시작될 때 발생.
								
								@event start
								@param sType {String} 커스텀 이벤트명
								@example
									// Transition이 시작될 때 실행 될 함수 구현.
									oTransition.attach("start", function() { ... });
							**/
							this.fireEvent("start");
						}
						var nInterval = 1000 / this._nFPS,
							nGap = nInterval / htTask.nDuration;
						
						this._htTaskToDo = {
							aList: htTask.aList,
							nRatio: 0,
							nInterval: nInterval,
							nGap: nGap,
							nStep: 0,
							nTotalStep: Math.ceil(htTask.nDuration / nInterval)
						};
						
						this.resume();
						break;
					case "function":
						if (!this._bIsPlaying) {
							this.fireEvent("start");
						}
						htTask.fTask();
						this._prepareNextTask();
						break;
					case "sleep":
						if (this._bIsPlaying) {
							/**
								Transition이 휴면 상태일 때 발생
								
								@event sleep
								@param {String} sType 커스텀 이벤트명
								@param {Number} nDuration 휴면 시간
								@example
									// Transition이 휴면 상태일 때 실행 될 함수 구현.
									oTransition.attach("sleep", function(oCustomEvent) { ... });
							**/
							this.fireEvent("sleep", {
								nDuration: htTask.nDuration
							});
							htTask.fCallback();
						}
						var self = this;
						this._oSleepTimer.start(function(){
							/**
								Transition이 휴면상태에서 깨어났을 때 발생
								
								@event awake
								@param {String} sType 커스텀 이벤트명
								@example
									// Transition이 휴면상태에서 깨어났을 때 실행 될 함수 구현.
									oTransition.attach("awake", function() { ... });
							**/
							self.fireEvent("awake");
							self._prepareNextTask();
						}, htTask.nDuration);
						break;
				}
			} else {
				if (this._bIsPlaying) {
					this._bIsPlaying = false;
					this.abort();
					/**
						Transition이 끝났을 때 발생
						
						@event end
						@param sType (String) : 커스텀 이벤트명
						@example
							// Transition이 끝날 때 실행 될 함수 구현.
							oTransition.attach("end", function() { ... });
					**/
					this.fireEvent("end");
				}
			}
		}
	},
	
	_isHTMLElement : function(el) {
		return ("tagName" in el);
	},
	
	_doTask : function() {
		var htTaskToDo = this._htTaskToDo,
			nRatio = parseFloat(htTaskToDo.nRatio.toFixed(5), 1),
			nStep = htTaskToDo.nStep,
			nTotalStep = htTaskToDo.nTotalStep,
			aList = htTaskToDo.aList,
			htCorrection = {},
			bCorrection = this.option("bCorrection");
		
		for (var i = 0, nLength = aList.length; i < nLength; i++) {
			var elTarget = aList[i].elTarget,
				welTarget = null;
			
			for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
				var sType = aValue[j][0],
					sKey = aValue[j][1],
					sValue = aValue[j][2](nRatio);

				if (this._isHTMLElement(elTarget)) {
					if (bCorrection) {
						var sUnit = /^\-?[0-9\.]+(%|[\w]+)?$/.test(sValue) && RegExp.$1 || "";
						if (sUnit) {
							var nValue = parseFloat(sValue);
							nValue += htCorrection[sKey] || 0;
							nValue = parseFloat(nValue.toFixed(5));
							if (i == nLength - 1) {
								sValue = Math.round(nValue) + sUnit;
							} else {
								htCorrection[sKey] = nValue - Math.floor(nValue);
								sValue = parseInt(nValue, 10) + sUnit;
							}
						}
					}
					
					welTarget = welTarget || jindo.$Element(elTarget);
					
					switch (sType) {
						case "style":
							welTarget.css(sKey, sValue);
							break;
							
						case "attr":
							welTarget.$value()[sKey] = sValue;
							break;
					}
				} else {
					elTarget.setter(sKey, sValue);
				}
				
				if (this._bIsPlaying) {
					/**
						Transition이 진행되는 매 단계에 발생
						
						@event playing
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} element 변화되고있는 객체
						@param {String} sKey 변화할 대상
						@param {String} sValue 변화할 값
						@param {Number} nStep 현재의 Transition의 단계
						@param {Number} nTotalStep Transition이 완료되기까지 playing 커스텀 이벤트가 발생할 횟수
						@example
							// Transition이 진행되는 매 단계에 실행 될 함수 구현.
							oTransition.attach("playing", function(oCustomEvent) { ... });
					**/
					this.fireEvent("playing", {
						element : elTarget,
						sKey : sKey,
						sValue : sValue,
						nStep : nStep,
						nTotalStep : nTotalStep
					});
				}
			}
		}
		htTaskToDo.nRatio = Math.min(htTaskToDo.nRatio + htTaskToDo.nGap, 1);
		htTaskToDo.nStep += 1;
		return nRatio != 1;
	}
}).extend(jindo.Component);

// jindo.$Element.prototype.css 패치
(function() {
	
	var b = jindo.$Element.prototype.css;
	jindo.$Element.prototype.css = function(k, v) {
		if (k == "opacity") {
			return typeof v != "undefined" ? this.opacity(parseFloat(v)) : this.opacity();
		} else {
			return typeof v != "undefined" ? b.call(this, k, v) : b.call(this, k);
		}
	};
})();/**
	@fileOverview 메뉴의 펼침/닫힘을 이용한 네비게이션을 구현한 아코디언 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	메뉴의 펼침/닫힘을 이용한 네비게이션을 구현한 아코디언 컴포넌트.
	움직임이 악기 아코디언과 비슷하다고 하여 붙여진 Accordion은 제목탭과 내용탭이 쌍으로 펼쳐지고 접혀지는 동작을 정의합니다.
	
	@class jindo.Accordion
	@extends jindo.UIComponent
	@uses jindo.Timer
	@uses jindo.Transition
	
	@keyword accordion, accordian, 아코디언
**/
jindo.Accordion = jindo.$Class({
	/**
		Accordion 컴포넌트를 생성한다.
		@constructor
		@param {String | HTMLElement} el Accordian 컴포넌트를 적용할 레이어의 id 혹은 레이어 자체
		@param {Object} [htOption] 초기화 옵션 설정을 위한 객체.
			@param {String} [htOption.sClassPrefix="accordion-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
			@param {String} [htOption.sDirection="vertical"] Accordion이 펼쳐질 방향<ul><li>"vertical" : 세로</li><li>"horizontal" : 가로</li></ul>
			@param {String} [htOption.sExpandEvent="click"] 펼치기위한 마우스이벤트명
			@param {Number} [htOption.nDefaultIndex=null] 디폴트로 확장될 인덱스, null시 확장하지 않음
			@param {Boolean} [htOption.bToggle=false] 핸들러에 마우스이벤트 발생시 expand/contract 토글 여부.<br/>sExpandEvent가 "mouseover"인 경우는 사용하지 않는 것이 좋다.
			@param {Number} [htOption.nDuration=300] 펼쳐지거나 접힐 때 쓰이는 Transition 지속 시간<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nFPS=30] 펼쳐지거나 접힐 때 쓰이는 Transition의 FPS(Frame Per Second)<br/>- 단위는 초
			@param {Function} [htOption.fExpandEffect=jindo.Effect.cubicEaseOut] 펼쳐질 때 쓰이는 Transition의 효과
			@param {Function} [htOption.fContractEffect=jindo.Effect.cubicEaseIn] 접힐 때 쓰이는 Transition의 효과
			@param {Number} [htOption.nExpandDelay=0] 펼쳐질 때 지연되는 시간<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nContractDelay=0] 접혀질 때 지연되는 시간<br/>- 단위는 ms(1000이 1초)
			@param {Boolean} [htOption.bActivateOnload=true] 로딩과 동시에 활성화할 것인지 여부
	**/
	$init : function(el, htOption) {
		/**
			Accordian 컴포넌트가 적용될 레이어
			
			@type {HTMLElement}
		**/
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el);
		this.option({
			sClassPrefix : "accordion-",
			sDirection : "vertical",
			sExpandEvent : "click",
			nDefaultIndex : null,
			bToggle : false,
			nDuration : 300,
			nFPS : 30,
			fExpandEffect : jindo.Effect.cubicEaseOut, // (Function) 펼쳐질때 Transition 효과의 종류
			fContractEffect : jindo.Effect.cubicEaseIn, // (Function) 닫혀질때 Transition 효과의 종류
			nExpandDelay : 0,
			nContractDelay : 0,
			bActivateOnload : true
		});
		this.option(htOption || {});
		
		this._nExpanded = null;
		this._oTimer = new jindo.Timer();
		this._oTransition = new jindo.Transition({ bCorrection : true }).fps(this.option("nFPS"));
		this._wfOnMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfOnMouseOut = jindo.$Fn(this._onMouseOut, this);
		this._wfOnExpandEvent = jindo.$Fn(this._onExpandEvent, this);
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	getBaseElement : function() {
		return this._el;
	},
	
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(true);
		this._wfOnExpandEvent.attach(this._el, this.option("sExpandEvent"));
		this._wfOnMouseOver.attach(this._el, "mouseover");
		this._wfOnMouseOut.attach(this._el, "mouseout");
		var n = this.option("nDefaultIndex");
		if (typeof n == "number") {
			this.expand(n);
		}
	},
	
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(false);
		this._wfOnExpandEvent.detach(this._el, this.option("sExpandEvent"));
		this._wfOnMouseOver.detach(this._el, "mouseover");
		this._wfOnMouseOut.detach(this._el, "mouseout");
	},
	
	_getBlock : function(el) {
		var sClassPrefix = this.option("sClassPrefix");
		return (jindo.$Element(el).hasClass(sClassPrefix + "block")) ? el : jindo.$$.getSingle("! ." + sClassPrefix + "block", el);
	},
	
	_onMouseOver : function(we) {
		var el = we.element,
			elBlock = this._getBlock(el),
			nIndex = (elBlock) ? jindo.$A(this.getAllBlocks()).indexOf(elBlock) : null;
			
		if (typeof nIndex == "number") {
			var elHandler = this.getHandler(nIndex);
			if (elHandler === elBlock || el === elHandler || jindo.$Element(el).isChildOf(elHandler)) {
				/**
					handler에 mouseover되었을 때 발생
					
					@event mouseover
					@param {String} sType 커스텀 이벤트명
					@param {jindo.$Event} weEvent Event
					@param {Number} nIndex Block의 인덱스
					@param {HTMLElement} elBlock 대상 Block 엘리먼트
					@param {HTMLElement} elHandler 대상 핸들러 엘리먼트
					@example
						// mouseover 커스텀 이벤트 핸들링
						oAccordion.attach("mouseover", function(oCustomEvent) { ... });
				**/
				this.fireEvent(we.type, {
					nIndex: nIndex,
					elBlock : elBlock,
					elHandler : elHandler,
					weEvent : we
				});
			}
		}
	},
	
	_onExpandEvent : function(we) {
		var el = we.element,
			elBlock = this._getBlock(el),
			nIndex = (elBlock) ? jindo.$A(this.getAllBlocks()).indexOf(elBlock) : null;

		if (typeof nIndex == "number") {
			var elHandler = this.getHandler(nIndex);
			if (elHandler === elBlock || el === elHandler || jindo.$Element(el).isChildOf(elHandler)) {
				if (this.option("bToggle") && this.getExpanded() === nIndex ) {
					this.contractAll();
				} else {
					this.expand(nIndex);
				}
			}
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element,
			elBlock = this._getBlock(el),
			nIndex = (elBlock) ? jindo.$Element(elBlock).parent().indexOf(elBlock) : null;
			
		if (elBlock && typeof nIndex == "number") {
			/**
				handler에 mouseover되었을 때 발생
				
				@event mouseout
				@param {String} sType 커스텀 이벤트명
				@param {jindo.$Event} weEvent Event
				@param {Number} nIndex Block의 인덱스
				@param {HTMLElement} elBlock 대상 Block 엘리먼트
				@param {HTMLElement} elHandler 대상 핸들러 엘리먼트
				@example
					// mouseout 커스텀 이벤트 핸들링
					oAccordion.attach("mouseout", function(oCustomEvent) { ... });
					// mouseout시 모두 접혀지게 동작하려면 아래와 같이 설정합니다
					oAccordion.attach("mouseout", function(oCustomEvent) {
						this.contractAll();
					});
			**/
			this.fireEvent(we.type, {
				nIndex: nIndex,
				elBlock : elBlock,
				elHandler : this.getHandler(nIndex),
				weEvent : we
			});
		}
	},
	
	_getHeadSize : function(n) {
		var el = this.getHead(n);
		el.style.zoom = 1; //ie rendering bug
		return { width : jindo.$Element(el).width(), height : jindo.$Element(el).height() };
	},
	
	_getBodySize : function(n) {
		var el = this.getBody(n);
		el.style.zoom = 1; //ie rendering bug
		return { width : jindo.$Element(el).width(), height : jindo.$Element(el).height() };
	},
	
	/**
		Transition 컴포넌트의 인스턴스를 리턴한다.
		
		@method getTransition
		@return {jindo.Transition} Transition 컴포넌트의 인스턴스
	**/
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
		n번째 Block을 확장한다.
		
		@method expand
		@param {Number} n 확장할 Block의 인덱스 (0부터 시작)
		@return {this} n번째 Block을 확장한 인스턴스 자신
	**/
	expand : function(n) {
		var aBlock = this.getAllBlocks(),
			self = this;
		n = Math.max(0, Math.min(aBlock.length, n));
		if (this.getExpanded() === n) {
			return this;
		}
		
		var ht = {
			nIndex : n,
			elBlock : aBlock[n],
			elHandler : this.getHandler(n)
		};
		/**
			Block이 확장되기 전에 발생
			
			@event beforeExpand
			@param {String} sType 커스텀 이벤트명
			@param {Number} nIndex Block의 인덱스
			@param {HTMLElement} elBlock 대상 Block 엘리먼트
			@param {HTMLElement} elHandler 대상 핸들러 엘리먼트
			@param {Function} stop 수행시 Block이 확장되지 않음
			@example
				// beforeExpand 커스텀 이벤트 핸들링
				oAccordion.attach("beforeExpand", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		if (this.fireEvent("beforeExpand", ht)) {
			var fEffect = self.option("fExpandEffect"),
				aArgs = [this.option("nDuration")];
			
			jindo.$A(aBlock).forEach(function(o,i,a){
				var aHeadSize = self._getHeadSize(i),
					aBodySize = self._getBodySize(i);
				
				switch (self.option("sDirection")) {
					case "vertical" :
						if (i == n) {
							aArgs.push(a[i], { '@height' : fEffect(aBodySize.height + aHeadSize.height + "px") });
						} else {
							aArgs.push(a[i], { '@height' : fEffect(aHeadSize.height + "px") });
						}
						break;
					case "horizontal" :
						if (i == n) {
							aArgs.push(a[i], { '@width': fEffect(aBodySize.width + aHeadSize.width + "px")});
						} else {
							aArgs.push(a[i], { '@width': fEffect(aHeadSize.width + "px")});
						}
						break;
				}
			});
			this._oTimer.abort();
			this._oTimer.start(function(){
				self._setExpanded(n);
				self._oTransition.abort().queue.apply(self._oTransition, aArgs).start(function(){
					/**
						Block이 확장된 후에 발생
						
						@event expand
						@param {String} sType 커스텀 이벤트명
						@param {Number} nIndex Block의 인덱스
						@param {HTMLElement} elBlock 대상 Block 엘리먼트
						@param {HTMLElement} elHandler 대상 핸들러 엘리먼트
						@example
							// expand 커스텀 이벤트 핸들링
							oAccordion.attach("expand", function(oCustomEvent) {
							});
					**/
					self.fireEvent("expand", ht);
				});
			}, this.option("nExpandDelay"));
		}
		return this;
	},
	
	/**
		모든 Block을 확장한다.
		
		@method expandAll
		@deprecated expand() 메서드 사용권장.
		@return {this} 모든 Block을 확장한 인스턴스 자신
	**/
	expandAll : function() {
		return this;
	},
	
	/**
		모든 Block을 축소한다.
		
		@method contractAll
		@return {this} 모든 Block을 축소한 인스턴스 자신
	**/
	contractAll : function() {
		var self = this,
			fEffect = self.option("fContractEffect"),
			aArgs = [this.option("nDuration")];

		jindo.$A(this.getAllBlocks()).forEach(function(o,i,a){
			var aHeadSize = self._getHeadSize(i);
			switch (self.option("sDirection")) {
				case "vertical" :
					aArgs.push(a[i], { '@height' : fEffect(aHeadSize.height + "px") });
					break;
				case "horizontal" :
					aArgs.push(a[i], { '@width': fEffect(aHeadSize.width + "px")});
					break;
			}
		});
		
		/**
			contractAll()이 수행되어 Block이 축소되기 전에 발생
			
			@event beforeContract
			@param {String} sType 커스텀 이벤트명
			@param {Function} stop 수행시 Block이 축소되지 않음
			@example
				// beforeContract 커스텀 이벤트 핸들링
				oAccordion.attach("beforeContract", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		if (this.fireEvent("beforeContract")) {
			this._oTimer.start(function(){
				self._setExpanded(null);
				self._oTransition.abort().queue.apply(self._oTransition, aArgs).start(function(){
					/**
						Block이 축소된 후에 발생
						
						@event contract
						@param {String} sType 커스텀 이벤트명
						@example
							// contract 커스텀 이벤트 핸들링
							oAccordion.attach("contract", function(oCustomEvent) {
								oCustomEvent.stop();
							});
					**/
					self.fireEvent("contract");
				});
			}, this.option("nContractDelay"));
		}
		return this;
	},
	
	_setExpanded : function(n) {
		this._nExpanded = n;
	},
	
	/**
		몇 번째 Block이 확장되었는지 가져온다.
		
		@method getExpanded
		@return {Number} 확장된 Block의 인덱스 (0부터 시작) 단, 전체확장일 경우 "all", 전체 축소일경우 null
	**/
	getExpanded : function() {
		return this._nExpanded;
	},
	
	/**
		Block을 가져온다.
		
		@method getBlock
		@param {Number} n 엘리먼트를 가져올 Block의 인덱스 (0부터 시작)
		@return {HTMLElement} 지정한 n번째 Block의 엘리먼트
	**/
	getBlock : function(n) {
		return this.getAllBlocks()[n];
	},
	
	/**
		모든 Block을 가져온다.
		
		@method getAllBlocks
		@return {Array} 모든 Block의 엘리먼트 배열
	**/
	getAllBlocks : function() {
		return jindo.$$("." + this.option("sClassPrefix") + "block", this._el);
	},
	
	/**
		Block의 Head를 가져온다.<br/>
		Head는 Block이 축소되었을때도 항상 노출되는 제목 부분이다.
		
		@method getHead
		@param {Number} n Head 를 가져 올 Block의 인덱스 (0부터 시작)
		@return {HTMLElement} 지정한 n번째 Block의 Head
	**/
	getHead : function(n) {
		return jindo.$$.getSingle("dt", this.getBlock(n));
	},
	
	/**
		Block의 Body를 가져온다.<br/>
		Body는 Block이 확장되었을때만 노출되는 내용 부분이다.
		
		@method getBody
		@param {Number} n Body 를 가져 올 Block의 인덱스 (0부터 시작)
		@return {HTMLElement} 지정한 n번째 Block의 Body
	**/
	getBody : function(n) {
		return jindo.$$.getSingle("dd", this.getBlock(n));
	},
	
	/**
		이벤트를 처리할 핸들러 엘리먼트를 가져온다.<br/>
		해당 block의 head내에 클래스명 "handler" 를 가진 엘리먼트를 리턴하고 없을 경우 해당 head를 리턴한다.
		
		@method getHandler
		@param {Number} n 핸들러 엘리먼트를 가져올 block의 인덱스 (0부터 시작)
		@return {HTMLElement} 지정한 n번째 Block의 핸들러 엘리먼트
	**/
	getHandler : function(n) {
		var elHead = this.getHead(n);
		return jindo.$$.getSingle("." + this.option("sClassPrefix") + "handler", elHead) || elHead;
	}
}).extend(jindo.UIComponent);/**
	@fileOverview Ajax History  
	@author AjaxUI-1 <TarauS> modified by senxation
	@version 1.14.0
**/

/**
    한 페이지내에서 모든 기능을 구현하는 서비스에서 브라우저 히스토리 기능을 사용 할 수 있도록 하는 컴포넌트
    
    @class jindo.AjaxHistory
    @extends jindo.Component
    
    @keyword ajax, history, 히스토리, hash, 해쉬, 해시, pushState
**/
jindo.AjaxHistory = jindo.$Class({
	/** @lends jindo.AjaxHistory.prototype */
	
	/**
		이벤트 핸들러 저장 객체
		@type {HashTable}
	**/
	_htEventHandler : {},
	/**
		히스토리 데이터 저장 객체
		@type {HashTable}
	**/
	_htHistoryData : {},
	/**
		에이전트 정보 저장 객체
		@type {Object}
	**/
	_oAgent : null,
	/**
		IE 7이하에서 사용할 아이프레임 객체
		@type {WrappingElement}
	**/
	_welIFrame : null,
	/**
		setInterval()의 리턴 값
		@type {Number}
	**/
	_nIntervalId : 0,
	/**
		로케이션 변경 체크 방법
		@type {String}
	**/
	_sCheckType : "",
	/**
		컴포넌트 인스턴스의 고유 아이디 값
		@type {String}
	**/
	_sComponentId : "",

	/**
		스태틱 메서드
		@private
	**/
	$static : {
		/**
			IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위한 함수<br/>
			Hidden IFrame의 history.html이 로딩될 때마다 이 함수를 호출 함
			
			@method checkIFrameChange
			@static
			@private
			@param oLocation
		**/
		checkIFrameChange : function(oLocation){
			var htQueryString = jindo.$S(oLocation.search.substring(1)).parseString();
			this._aInstances[0]._checkLocationChange(encodeURIComponent(htQueryString.hash));
			/*
			for(var i=0; i<aInstanceList.length; i++){
				if(htQueryString.componentId == aInstanceList[i].getComponentId()){
				alert("iframe callback : "+htQueryString.hash);
					aInstanceList[i]._checkLocationChange(encodeURIComponent(htQueryString.hash));
					break;
				}
			}
			*/
		}
	},
	
	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션 객체
			@param {Number} [htOption.nCheckInterval=100] IE 7 이하나 onhashchange 이벤트를 지원하지 않는 브라우저에서 location.hash의 변경을 체크할 주기.<br/>특별히 문제가 없을 경우, 변경을 할 필요 없음
			@param {String} [htOption.sIFrameUrl="history.html"] IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위해 로딩하는 웹문서의 위치
		@example
			var oAjaxHistoryInstance = new jindo.AjaxHistory({
				// IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위해 로딩하는 웹문서의 위치
				"sIFrameUrl" : "history.html",
				// attach() 함수를 사용하지 않고, 초기화 시에 이벤트 핸들러를 연결하기 위해 사용
				"htCustomEventHandler" : {
					"load" : function(){
						alert("load event");
					},
					"change" : function(oChangeEvent){
						alert("change event");
					}
				},
				// setInterval()을 이용하여 로케이션 변경을 체크 시, 체크 주기
				"nCheckInterval" : 100
			});
		
			oAjaxHistoryInstance.initialize(); //초기화
			oAjaxHistoryInstance.addHistory({
				"sPageType" : "layer",
				"aParameter" : [
					"1", "2", "3"
				]
			});
	**/
	$init : function(htOption){
		this._oAgent = jindo.$Agent().navigator();
		this._sComponentId = "AjaxHistory"+(new Date()).getTime();
		this.option({
			sIFrameUrl : "history.html",
			nCheckInterval : 100
		});
		this.option(htOption || {});
		
		(this.constructor._aInstances = this.constructor._aInstances || []).push(this);
	},

	/**
		컴포넌트 초기화 후에, 로케이션 변경 체크 및 초기 이벤트 발생을 위한 초기화 함수
		
		@method initialize
		@return {this} 컴포넌트 인스턴스 자신
	**/
	initialize : function(){
		var sHash = this._getLocationHash();
		
		// onHashChange 이벤트를 지원하는 경우
		if((this._oAgent.ie && (document.documentMode||this._oAgent.version) >= 8 && jindo.$Document().renderingMode() == "Standards") || (this._oAgent.firefox && this._oAgent.version >= 3.6) || (this._oAgent.chrome && this._oAgent.version > 3) || (this._oAgent.safari && this._oAgent.version >= 5) || (this._oAgent.opera && this._oAgent.version >= 10.6)){
			this._htEventHandler["hashchange"] = jindo.$Fn(this._checkLocationChange, this).attach(window, "hashchange");
			this._sCheckType = "hashchangeevent";
		// IE 7 이하인 경우
		}else if(this._oAgent.ie){
			this._welIFrame = jindo.$Element("<IFRAME>");
			this._welIFrame.hide();
			this._welIFrame.appendTo(document.body);
			this._sCheckType = "iframe";
			
		// setInterval() 함수를 이용하여 체크해야 하는 경우
		}else{
			this._nIntervalId = setInterval(jindo.$Fn(this._checkLocationChange, this).bind(), this.option("nCheckInterval"));
			this._sCheckType = "setinterval";
		}

		if(sHash&&sHash!="%7B%7D"){
			
			if(this._sCheckType == "iframe"){
				this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
			}else{
				this._htHistoryData = this._getDecodedData(sHash);
				/**
					사용자가 앞으로/뒤로가기 버튼을 눌러 이동을 하거나 히스토리 데이터가 포함된 URL을 이용하여 접근시 발생
					
					@event change
					@param {String} sType 커스텀 이벤트명
					@param {Object} htHistoryData 커스텀 이벤트객체 프로퍼티2
					@example
						oAjaxHistory.attach("change", function(oCustomEvent){
							// htHistoryData의 데이터를 바탕으로 화면의 UI를 재구성
							if(oChangeEvent.sPageType == "main_page"){
								showPage(oChangeEvent.sLayer, oChangeEvent.nPage);
							}else{
								showPageAnother(oChangeEvent.sLayer, oChangeEvent.nPage);
							}
						});
				**/
				this.fireEvent("change", {
					htHistoryData : this._htHistoryData
				});
			}
		}else{
			
			var that = this;
			if(this._oAgent.ie&&(document.documentMode||this._oAgent.version) < 8){
				var ifr = this._welIFrame.$value();
			    ifr.onreadystatechange = function(){
			        if (ifr.readyState == "complete"){
			        	/**
			        	 * 페이지 로딩시 발생되는데, URL에 히스토리 데이터를 포함하고 있을 경우엔 load 이벤트 대신 change 이벤트가 발생
			        	 *
			        	 * @event load
			        	 * @param {String} sType 커스텀 이벤트명
			        	 * @example
			        	 * 	oAjaxHistory.attach("load", function(oCustomEvent) {
			        	 * 		//히스토리 데이터를 포함하지 않은 URL로 페이지가 로딩되었을 경우, 초기 UI 구성에 대한 작업을 수행
			        	 * 	});
			        	 */
						that.fireEvent("load");
						ifr.onreadystatechange = function(){};
			        }
			    };

				ifr.src = this.option("sIFrameUrl");
			}else{
				setTimeout(function(){
					that.fireEvent("load");	
				},0);	
			}
		}
		
		return this;
	},

	/**
		컴포넌트의 고유 아이디를 리턴
		
		@method getComponentId
		@return {String} 컴포넌트 고유 아이디
	**/
	getComponentId : function(){
		return this._sComponentId;
	},

	/**
		현재 설정되어 있는 Hash String을 리턴
        @method _getLocationHash
        @private
		@return {String} 현재 설정된 Hash String
	**/
	_getLocationHash : function(){
		var oAgent = jindo.$Agent().navigator();
		return oAgent.firefox ? encodeURIComponent(location.hash.substring(1)) : (location.hash.substring(1)||"%7B%7D");
	},

	/**
		location.hash 설정 함수
		@method _setLocationHash
		@private
		@param {String} sHash location.hash를 sHash로 변경
	**/
	_setLocationHash : function(sHash){
		location.hash = sHash=="%7B%7D"?"":sHash;
	},

	/**
		htHistoryData를 브라우저의 히스토리에 추가
		
		@method addHistory
		@param {Object} htHistoryData 추가할 히스토리 데이터 객체
		@return {Boolean} 히스토리 추가 결과
	**/
	addHistory : function(htHistoryData){
		if(htHistoryData && typeof(htHistoryData) == "object" && jindo.$H(htHistoryData).length() > 0){
			this._htHistoryData = jindo.$Json(jindo.$Json(htHistoryData).toString()).toObject(); //deep copy
			var sHash = this._getEncodedData(htHistoryData);

			// 현재 설정된 데이터와 추가하려는 데이터가 같지 않을 경우에만 히스토리에 추가
			if(this._getLocationHash() != sHash){
				this._setLocationHash(sHash);
				if(this._sCheckType == "iframe"){
					this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
				}
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	/**
		히스토리 변경을 체크하여 change 이벤트를 발생시키는 함수
		
        @method _checkLocationChange
        @private
		@param {String} [sHash] 로케이션 변경 체크 시, 사용할 히스토리 데이터 문자열
	**/
	_checkLocationChange : function(sHash){
		sHash = sHash=="undefined" ? "%7B%7D": sHash;
//		console.log(sHash)
		sHash = (sHash && typeof(sHash) == "string") ? sHash : this._getLocationHash();
		var htCurrentHistoryData = this._getDecodedData(sHash);
//		console.log(htCurrentHistoryData);
		
		if(!this._compareData(this._htHistoryData, htCurrentHistoryData)){
			this._htHistoryData = htCurrentHistoryData;
			if(this._sCheckType == "iframe"){
				this._setLocationHash(sHash);
			}
//			console.log(this._htHistoryData);
			// change 이벤트 발생
			this.fireEvent("change", {
				htHistoryData : this._htHistoryData
			});
		}
	},

	/**
		htHistoryData 객체를 Json 문자열로 변환 후, 인코딩하여 리턴

        @method _getEncodedData
        @private
		@param {Object} htHistoryData 히스토리 데이터 객체
		@return {String} Json 문자열로 변환 후, 인코딩한 문자열
		@remark JSON.stringify() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
		@remark 위의 함수를 지원하지 않을 경우, jindo.$Json().toString() 함수 사용
	**/
	_getEncodedData : function(htHistoryData){
		if(htHistoryData){
			// JSON.stringify() 함수를 지원하는 경우
			if(typeof(JSON) == "object" && typeof(JSON.stringify) == "function"){
				return encodeURIComponent(JSON.stringify(htHistoryData));
			}else{
				return encodeURIComponent(jindo.$Json(htHistoryData).toString());
			}
		}else{
			return "";
		}
	},
	
	/**
		인코딩된 히스토리 데이터를 HashTable 객체로 변환 후, 리턴

        @method _getDecodedData
        @private
		@param {String} sEncodedHash 인코딩된 히스토리 데이터
		@return {Object} 디코딩 후, HashTable로 변환한 객체
		@remark JSON.parse() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
		@remark 위의 함수를 지원하지 않을 경우, jindo.$Json().toObject() 함수 사용
	**/
	_getDecodedData : function(sEncodedHash){
		try {
			if(sEncodedHash){
				var sHashString = decodeURIComponent(sEncodedHash);
				// JSON.parse() 함수를 지원하는 경우
				if(typeof(JSON) == "object" && typeof(JSON.parse) == "function"){
					return JSON.parse(sHashString);
				}else{
					return jindo.$Json(sHashString).toObject();
				}
			}
		} catch (e) {}
		return {};
	},

	/**
		두 데이터 객체를 비교하여 결과를 리턴

        @method _compareData
        @private
		@param {Object} htBase 비교 기준 객체
		@param {Object} htComparison 비교 객체
		@param {Boolean} 비교 결과
		@remark 하위 데이터가 Object나 Array일 경우, 재귀적으로 비교
	**/
	_compareData : function(htBase, htComparison){
		
		if (!htBase || !htComparison) { return false; }
			
		var wBase = htBase instanceof Array ? jindo.$A(htBase) : jindo.$H(htBase);
		var wComparison = htComparison instanceof Array ? jindo.$A(htComparison) : jindo.$H(htComparison);
		
		if (wBase.length() != wComparison.length()) { return false; }
		
		var bRet = true;
		var fpCallee = arguments.callee;
		
		wBase.forEach(function(v, k) {
			
			if(typeof(v) == "object"){
				if(!fpCallee(v, htComparison[k])){
					bRet = false;
					return;
				}
			}else{
				if(v != htComparison[k]){
					bRet = false;
					return;
				}
			}
			
		});
		
		return bRet;

	},

	/**
		컴포넌트 소멸자
		
		@method destroy
	**/
	destroy : function(){
		// 설정된 로케이션 체크 방법을 해제
		if(this._sCheckType == "hashchangeevent"){
			this._htEventHandler["hashchange"].detach(window, "hashchange");
		}else if(this._sCheckType == "iframe"){
			this._welIFrame.leave();
		}else{
			clearInterval(this._nIntervalId);
		}
		// 프로퍼티 초기화
		this._htEventHandler = null;
		this._htHistoryData = null;
		this._oAgent = null;
		this._welIFrame = null;
		this._nIntervalId = null;
		this._sCheckType = null;
		this._sComponentId = null;

		var aInstances = this.constructor._aInstances || [];
		var nIndex = jindo.$A(aInstances).indexOf(this);
		
		if (nIndex > -1) { aInstances.splice(nIndex, 1); }
	}
}).extend(jindo.Component);/**
	@fileOverview FileSelect (input[type=file])의 찾아보기(browse) 버튼의 디자인을 대체 적용하는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	jindo.BrowseButton 컴포넌트는 File Input 컨트롤의 찾아보기 버튼의 디자인을 커스터마이징 합니다.
	  
	@class jindo.BrowseButton
	@extends jindo.UIComponent
	
	@keyword input, file, browse, button, 파일, 찾아보기, 디자인
**/
jindo.BrowseButton = jindo.$Class({
	/** @lends jindo.BrowseButton.prototype */
	/**
		@constructor
		@param {HTMLElement} el 기준 엘리먼트
		@param {Object} [htOption] 옵션 객체
		 	@param {String} [htOption.sClassPrefix="browse-"] 지정된 마크업을 읽어오는 클래스명의 접두어<br/>[prefix]box, [prefix]file-input, [prefix]button, [prefix]applied, [prefix]over 클래스명이 사용되어진다.
		 	@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 로드시 activate 여부
		@example
			new jindo.BrowseButton(jindo.$('file'), jindo.$('button'), { 
				sClassPrefix : 'button-' 
				//컴포넌트가 적용되면 대체 버튼 엘리먼트에 클래스명 sClassPrefix+"applied" 가 추가됨
				//대체 버튼 엘리먼트에 마우스 오버시 sClassPrefix+"over" 가 추가됨
			}).attach({
				'over' : function(){
					//찾아보기 버튼에 커서가 over 되었을 때 발생
				},
				'out' : function(){
					//찾아보기 버튼에서 커서가 out 되었을 때 발생
				},
				'sourceChange' : function(){
					//선택된 파일의 값이 바뀌었을때 발생
					jindo.$("input").value = this.getFileSelect().value;
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({
			sClassPrefix : 'browse-',
			bActivateOnload : true
		});
		
		this.option(htOption || {});
		this._el = jindo.$(el);

		if (this.option('bActivateOnload')) {
			this.activate();
		}
	},

	_onActivate : function() {
		this._assignHTMLElement();
		this._attachEvents();
	},

	_onDeactivate : function() {
		this._detachEvents();
		this._unassignHTMLElement();
	},
	
	_assignHTMLElement : function() {
		var sClassPrefix = this.option('sClassPrefix');
		
		this._elBox = jindo.$$.getSingle("." + sClassPrefix + "box", this._el);
		this._elFileSelect = jindo.$$.getSingle("." + sClassPrefix + "file-input", this._el);
		this._elBrowseButton = jindo.$$.getSingle("." + sClassPrefix + "button", this._el);

		this._sTmpFileSelectCssText = this._elFileSelect.style.cssText;
		this._elFileSelect.style.cssText = "top:-.5em !important; height:500px !important;";
		jindo.$Element(this._elBrowseButton).addClass(sClassPrefix + 'applied');
	},

	_unassignHTMLElement : function() {
		var sClassPrefix = this.option('sClassPrefix');
		this._elFileSelect.style.cssText = this._sTmpFileSelectCssText;
		jindo.$Element(this._elBrowseButton).removeClass(sClassPrefix + 'applied');
	},
	
	_adjustFileSelectPos : function(nX) {
		this.getFileSelect().style.right = jindo.$Element(this.getBox()).offset().left + jindo.$Element(this.getBox()).width() - nX - 20 + 'px';
	},
	
	_attachEvents : function() {
		var elBrowseButton = this.getBrowseButton(),
			welBrowseButton = jindo.$Element(elBrowseButton),
			elBox = this.getBox(),
			elFileSelect = this.getFileSelect();

		this._wfHoverOnBrowseButton = jindo.$Fn(function(we) {
			welBrowseButton.addClass(this.option('sClassPrefix') + 'over');
			/**
				찾아보기 버튼 커서가 over 되었을 때 발생
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@example
					// over 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("over", function(){
						alert('사용자가 마우스 커서를 버튼 위로 올렸습니다');
					});
			**/
			this.fireEvent('over');			
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);

		this._wfRestore = jindo.$Fn(function(we) {
			welBrowseButton.removeClass(this.option('sClassPrefix') + 'over');
			elFileSelect.style.right = "0px";
			/**
				찾아보기 버튼 커서가 out 되었을 때 발생
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@example
					// out 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("out", function(){
						alert('사용자가 마우스 커서를 버튼 밖으로 이동하였습니다');
					});
			**/
			this.fireEvent('out');
		}, this);

		this._wfMouseMoveOnFloat = jindo.$Fn(function(we) {
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);

		this._wfChange = jindo.$Fn(function(we) {
			/**
				파일이 변경되었을 때 발생
				
				@event sourceChange
				@param {String} sType 커스텀 이벤트명
				@example
					// sourceChange 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("sourceChange", function(){
						alert('파일이 변경되었습니다');
					});
			**/
			this.fireEvent('sourceChange');
		}, this);

		this._wfHoverOnBrowseButton.attach(elBox, 'mouseover');
		this._wfMouseMoveOnFloat.attach(elBox, 'mousemove');
		this._wfRestore.attach(elBox, 'mouseout');
		this._wfChange.attach(this.getFileSelect(), 'change');

	},

	_detachEvents : function() {

		var elBrowseButton = this.getBrowseButton(),
			welBrowseButton = jindo.$Element(elBrowseButton),
			elBox = this.getBox(),
			elFileSelect = this.getFileSelect();

		this._wfHoverOnBrowseButton.detach(elBox, 'mouseover');
		this._wfMouseMoveOnFloat.detach(elBox, 'mousemove');
		this._wfRestore.detach(elBox, 'mouseout');
		this._wfChange.detach(this.getFileSelect(), 'change');

	},
	
	/**
		File Input을 감싸고 있는 Box 엘리먼트를 가져온다.
		
		@method getBox
		@return {HTMLElement} File Input을 감싸고 있는 Box 엘리먼트
	**/
	getBox : function() {
		return this._elBox;
	},
	
	/**
		적용된 File Input (input[type=file])을 가져온다.
		
		@method getFileSelect
		@return {HTMLElement} 적용된 File Input 엘리먼트
	**/
	getFileSelect : function() {
		return this._elFileSelect;
	},
	
	/**
		대체될 찾아보기 버튼을 가져온다.
		
		@method getBrowseButton
		@return {HTMLElement} 대체될 찾아보기 버튼 엘리먼트
	**/
	getBrowseButton : function() {
		return this._elBrowseButton;
	}
}).extend(jindo.UIComponent);
/**
	@fileOverview Data Cache  
	@author AjaxUI-1 <TarauS>
	@version 1.14.0
**/
/**
    Ajax 통신 시에 받은 데이터를 내부적으로 캐싱하여, 다음 Ajax 요청을 빠르게 처리하기 위한 기능을 가진다.
    
    @class jindo.Cache
    @extends jindo.Component
    
    @keyword cache, 캐시, 캐쉬, 성능, ajax
**/
jindo.Cache = jindo.$Class({
	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션
			@param {Number} [htOption.nCacheLimit=100] 캐시의 최대 저장 개수
			@param {Number} [htOption.nExpireTime=600] 캐시의 기본 유효 시간 (600초이며, 데이터가 추가된 지, 60분 후에는 유효하지 않음)
		@example
			var oCache = new jindo.Cache({'nCacheLimit' : 15});
			oCache.add('key1', 'value1', 5 * 60);
			oCache.add('key2', 'value2');
			oCache.add({'key1':true, 'key2':false}, {'value1':10, 'value2':20});

			// vResult is 'value1'
			var vResult = oCache.get('key1');

			// vResult is {'value1':10, 'value2':20}
			var vResult = oCache.get({'key1':true, 'key2':false}); 

			oCache.remove('key1');
			oCache.clear();
	**/
	$init : function(htOption){
		this._htCacheData = {};
		this._htExpireTime = {};
		this._waKeyList = jindo.$A();
		
		this.option({
			nCacheLimit : 50,
			nExpireTime : 0
		});
		this.option(htOption);
	},

	/**
		데이터를 캐시함
		
		@method add
		@param {Variant} vKey 저장할 데이터를 구분할 키 값 (String 타입과 Object 타입 모두 가능)
		@param {Variant} vValue 저장할 데이터
		@param {Number} [nExpireTime=0] 캐시 데이터가 폐기될 시간 (nExpireTime 이후에 폐기되며, 초로 입력)
		@return {Boolean} 추가에 성공하면 true, 실패하면 false
		@example
			// 문자열 키를 이용하여 데이터 캐싱
			oCache.add("string_key", [0, 1, 2]);

			// HashTable 형태의 객체 키를 이용하여 데이터 캐싱
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);

			// 데이터 캐싱 시에, 해당 데이터의 유효 시간을 설정
			// (120초 후에는 컴포넌트 내부에서 데이터 삭제)
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2], 120);
	**/
	add : function(vKey, vValue, nExpireTime){
		if(vKey && vValue){
			this._checkCacheExpire();
			this._checkCacheLimit();
			
			var sKey = this._makeKey(vKey);
			if (sKey) {
				this._htCacheData[sKey] = vValue;
				this._htExpireTime[sKey] = this._getExpireTime(nExpireTime);
				this._waKeyList.push(sKey);
				return true;
			} 
		}
		return false;
	},
	
	/**
		캐시된 데이터를 삭제함
		
		@method remove
		@param {Varinat} vKey 캐시 데이터의 키 값
		@return {Boolean} 삭제에 성공하면 true, 실패하면 false
		@example
			// 데이터 추가
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
			
			// 데이터를 추가할 때 전달했던 키를 동일하게 전달하여 내부 데이터 삭제
			oCache.remove({"key1" : "a", "key2" : "b"});
	**/
	remove : function(vKey){
		if(vKey){
			var sKey = this._makeKey(vKey);
			if(this._htCacheData[sKey]){
				this._waKeyList = this._waKeyList.refuse(sKey);
				delete this._htExpireTime[sKey];
				delete this._htCacheData[sKey];
				return true;
			}
		}
		return false;
	},
	
	/**
		캐시된 데이터 모두를 삭제 함

		@method clear
		@example
			// 데이터 추가
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
			oCache.add({"key1" : "1", "key2" : "2"}, [0, 0, 0]);
			
			// clear() 메서드를 호출하여, 추가된 모든 데이터를 삭제 함
			oCache.clear();
	**/
	clear : function(){
		this._htCacheData = {};
		this._htExpireTime = {};
		this._waKeyList = jindo.$A();
	},
	
	/**
		vKey에 해당하는 캐시된 데이터를 리턴함
		
		@method get
		@param {Variant} vKey 캐시 데이터의 키 값
		@return {Variant} 캐시된 데이터
		@example
			// 데이터 추가
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
			
			// 데이터를 추가할 때 전달했던 키를 동일하게 전달
			// vResult is [0, 1, 2]
			var vResult = oCache.get({"key1" : "a", "key2" : "b"});
	**/
	get : function(vKey){
		if (vKey){
			var sKey = this._makeKey(vKey);
			if(this.check(vKey)){
				return this._htCacheData[sKey];
			}
		}
		return null;
	},
	
	/**
		vKey에 해당하는 캐시 데이터의 유효성을 검사하여 리턴
		
		@method check
		@param {Variant} vKey 캐시 데이터의 키 값
		@return {Boolean} 캐시 데이터의 유효성
		@example
			// 데이터 추가
			oCache.add({"key1" : "a", "key2" : "b"}, [0, 1, 2]);
			
			// 데이터를 추가할 때 전달했던 키를 동일하게 전달
			// bResult is true, bResult2 is false
			var bResult = oCache.check({"key1" : "a", "key2" : "b"});
			var bResult2 = oCache.check({"key1" : 1, "key2" : 2});
	**/
	check : function(vKey){
		if(vKey){
			var sKey = this._makeKey(vKey);
			if(this._htCacheData[sKey] && this._checkCacheExpire(sKey)){
				return true;
			}
		}
		return false;
	},

	/**
		저장되어 있는 캐시의 개수를 체크하여, 옵션의 캐시 최대값보다 클 경우, 가장 먼저 저장된 항목을 삭제 함
		
		@method _checkCacheLimit
		@private
	**/
	_checkCacheLimit : function(){
		if(this._waKeyList.length() == this.option("nCacheLimit")){
			this.remove(this._waKeyList.get(0));
		}
	},
	
	/**
		sKey에 해당하는 캐시 데이터가 유효한지 검사
		
		@method _checkCacheExpire
		@private
		@param {String} sKey 문자열로 변환된 캐시 데이터의 키 값
		@return {Boolean} 유효 여부
	**/
	_checkCacheExpire : function(sKey){
		if(sKey){
			var nTime = this._getTime();
			if(this._htExpireTime[sKey] === 0 || nTime < this._htExpireTime[sKey]){
				return true;
			}else{
				this.remove(jindo.$S(sKey).parseString());
				return false;
			}
		}else{
			for(var i=0, n=this._waKeyList.length(); i<n; i++){
				return this._checkCacheExpire(this._waKeyList.get(i));
			}
		}
	},
	
	/**
		nExpireTime을 기준으로 캐시의 만료 시간을 계산하여 리턴 함

		@method _getExpireTime
		@private
		@param {Number} [nExpireTime] 캐시 만료 시간 (생략할 경우 옵션에 설정된 값을 기준으로 계산)
		@return {Number} 계산된 캐시 만료 시간
	**/
	_getExpireTime : function(nExpireTime){
		if (nExpireTime) {
			return this._getTime() + (nExpireTime * 1000);
		} else if (this.option("nExpireTime")){
			return this._getTime() + (this.option("nExpireTime") * 1000);
		} else {
			return 0;
		}
	},
	
	/**
		vKey가 HashTable인 경우 문자열 키로 변경하여 리턴

		@method _makeKey
		@private
		@param {Variant} vKey 캐시 데이터의 키 값
		@return {String} 문자열로 변환된 캐시 데이터의 키 값
	**/
	_makeKey : function(vKey){
		if(vKey){
			if(typeof(vKey) == "string"){
				return vKey;
			} else{
				try {
					return jindo.$H(vKey).toQueryString();
				} catch(e) {
					return "";
				}
			}
		} else {
			return "";
		}
	},
	
	/**
		현재 시간을 리턴한다.
		
		@method _getTime
		@private
		@return {Number} 현재 시간 (유닉스 타임스탬프 값)
	**/
	_getTime : function(){
		return +new Date();
	},
	
	/**
		컴포넌트 소멸자
		
		@method destroy
	**/
	destroy : function(){
		this._waKeyList = null;
		this._htCacheData = null;
		this._htExpireTime = null;
	}
}).extend(jindo.Component);/**
	@fileOverview 특정 연/월의 달력 출력을 위한 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	특정 년도/월의 달력을 지정한 엘리먼트에 표시하는 컴포넌트이다.
	미리 지정해놓은 엘리먼트에 삽입되기 때문에 원하는 디자인과 마크업 구조를 적용할 수 있으며 공휴일 지정 등 다양한 기능을 활용할 수 있다.
	
	@class jindo.Calendar
	@extends jindo.UIComponent
	
	@keyword calendar, 달력
**/
jindo.Calendar = jindo.$Class({
	/** @lends jindo.Calendar.prototype */
	/**
		Calendar 컴포넌트를 생성한다.
		@constructor
		@param {String | HTMLElement} sLayerId 달력을 출력할 레이어의 id 혹은 레이어 자체.
		@param {Object} [htOption] 초기화 옵션 설정을 위한 객체.
			@param {String} [htOption.sClassPrefix="calendar-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
			@param {Number} [htOption.nYear=현재년] 초기에 표시될 달력의 연도
			@param {Number} [htOption.nMonth=현재월] 초기에 표시될 달력의 달
			@param {Number} [htOption.nDate=현재일] 초기에 표시될 달력의 일
			@param {String} [htOption.sTitleFormat="yyyy-mm"] className이 '[prefix]title' 인 엘리먼트를 찾아서 해당 형식대로 날짜를 출력한다. 다음의 형식을 사용할 수 있다.
			<table>
			<tbody><tr>
				<th>표시형식</th>
				<th>설명</th>
				<th>결과</th>
				</tr>
				<tr>
					<td>yyyy</td>
					<td>4자리 연도</td>
					<td>2010</td>
				</tr>
				<tr>
					<td>yy</td>
					<td>2자리 연도</td>
					<td>10</td>
				</tr>
				<tr>
					<td>mm</td>
					<td>2자리 월</td>
					<td>09</td>
				</tr>
				<tr>
					<td>m</td>
					<td>1자리 월</td>
					<td>9</td>
				</tr>
				<tr>
					<td>M</td>
					<td>aMonthTitle 옵션 값으로 표시</td>
					<td>SEP</td>
				</tr>
			</tbody></table>
			@param {String} [htOption.sYearTitleFormat="yyyy"] className이 '[prefix]year' 인 엘리먼트를 찾아서 해당 형식대로 연도를 출력한다. option의 sTitleFormat에서 사용할 수 있는 형식에서 연도 표시 형식을 사용할 수 있다.
			@param {String} [htOption.sMonthTitleFormat="m"] className이 '[prefix]month' 인 엘리먼트를 찾아서 해당 형식대로 월을 출력한다. option의 sTitleFormat에서 사용할 수 있는 형식에서 월 표시 형식을 사용할 수 있다.
			@param {Array} [htOption.aMonthTitle=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]] 각 월의 이름을 설정할 수 있다. 1월부터 순서대로 배열로 정의한다. option의 sTitleFormat 표시형식에서 M을 사용하면 여기서 설정된 이름으로 표시할 수 있다.
			@param {Boolean} [htOption.bDrawOnload=true] 달력을 로딩과 동시에 바로 표시할 것인지 여부
		@example
			var oCalendar = new jindo.Calendar("calendar_layer", {
				sClassPrefix : "calendar-",
				nYear : 1983,
				nMonth : 5,
				nDate : 12,
				sTitleFormat : "yyyy-mm", //설정될 title의 형식
				sYearTitleFormat : "yyyy", //설정될 연 title의 형식
				sMonthTitleFormat : "m", //설정될 월 title의 형식
				aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], //월의 이름을 설정 "title" 세팅시 적용
				bDrawOnload : true //로딩과 동시에 바로 그릴것인지 여부
			}).attach({
				beforeDraw : function(oCustomEvent) {
					//달력을 새로 그리기 전 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nYear : (Number) 연 (ex. 2009) 
					//	nMonth : (Number) 월 (ex. 5)
					//}
					//oCustomEvent.stop()을 실행하면 draw 커스텀 이벤트가 발생하지 않는다. 
				},
				draw : function(oCustomEvent) {
					//달력을 새로 그리는 중 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elDate : (HTMLElement) 날짜가 쓰여질 목표 엘리먼트
					//  elDateContainer : (HTMLElement) week의 child 엘리먼트로 날짜가 쓰여질 목표 엘리먼트를 감싸고 있는 상위 엘리먼트. (element와 같을 수도 있음) 
					//	nYear : (Number) 연 (ex. 2009) 
					//	nMonth : (Number) 월 (ex. 5)
					//	nDate : (Number) 일 (ex. 12)
					//	bPrevMonth : (Boolean) 그려질 날이 이전달의 날인지 여부
					//	bNextMonth : (Boolean) 그려질 날이 다음달의 날인지 여부
					//}
				},
				afterDraw : function(oCustomEvent) {
					//달력을 그린 이후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nYear : (Number) 연 (ex. 2009) 
					//	nMonth : (Number) 월 (ex. 5)
					//}
				}
			});
	**/
	$init : function(sLayerId, htOption) {
		var htToday = this.constructor.getToday();
		this.setToday(htToday.nYear, htToday.nMonth, htToday.nDate);
		this._elLayer = jindo.$(sLayerId);
		this._htDefaultOption = {
			sClassPrefix : "calendar-",
			nYear : this._htToday.nYear,
			nMonth : this._htToday.nMonth,
			nDate : this._htToday.nDate,
					
			sTitleFormat : "yyyy-mm",
			sYearTitleFormat : "yyyy",
			sMonthTitleFormat : "m",
			
			aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
			bDrawOnload : true
		};
		
		this.option(this._htDefaultOption);
		this.option(htOption || {});
		
		this._assignHTMLElements();
		this.activate();
		this.setDate(this.option("nYear"), this.option("nMonth"), this.option("nDate"));
		if (this.option("bDrawOnload")) {
			this.draw();
		}
	},
	
	/**
		기준 엘리먼트(달력 레이어 엘리먼트)를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement} 달력 레이어
	**/
	getBaseElement : function() {
		return this._elLayer;
	},
	
	/**
		현재 설정된 날짜를 가져온다.
		
		@method getDate
        @return {Object} 연월일을 담은 객체
            @return {Number} .nYear 년도
            @return {Number} .nMonth 월
            @return {Number} .nDate 일
		@example
			oCalendar.getDate(); // { nYear : 2000, nMonth : 1, nDate : 31 } 
	**/
	getDate : function() {
		return this._htDate;
	},
	
	/**
		그려진 달력의 날짜엘리먼트로 해당하는 날짜를 구한다.
		
		@method getDateOfElement
		@param {HTMLElement} el week엘리먼트의 자식노드로 존재하는 7개의 엘리먼트중 하나
        @return {Object} 연월일을 담은 객체
            @return {Number} .nYear 년도
            @return {Number} .nMonth 월
            @return {Number} .nDate 일
		@example 
			oCalendar.getDateOfElement(el); // { nYear : 2000, nMonth : 1, nDate : 31 }
	**/
	getDateOfElement : function(el) {
		var nDateIndex = jindo.$A(this._aDateContainerElement).indexOf(el);
		if (nDateIndex > -1) {
			return this._aMetaData[nDateIndex];
		}
		return null;
	},

	/**
		오늘 정보를 설정한다.<br/>
		JavaScript의 new Date()는 사용자 로컬환경의 시간을 따르므로, 서버에서 내려주는 오늘의 정보를 설정하기 위해 사용한다.
		
		@method setToday
		@param {Number} nYear 년
		@param {Number} nMonth 월
		@param {Number} nDate 일
		@return {this} 오늘 정보를 설정한 인스턴스 자신
	**/
	setToday : function(nYear, nMonth, nDate) {
		if (!this._htToday) {
			this._htToday = {};
		}
		this._htToday.nYear = nYear;
		this._htToday.nMonth = nMonth;
		this._htToday.nDate = nDate;
		return this;
	},
	
	/**
		오늘의 정보를 가지는 Hash Table을 가져온다.
		
		@method getToday
        @return {Object} 연월일을 담은 객체
            @return {Number} .nYear 년도
            @return {Number} .nMonth 월
            @return {Number} .nDate 일
		@example 
			oCalendar.getToday(); // { nYear : 2000, nMonth : 1, nDate : 31 }
	**/
	getToday : function() {
		return {
			nYear : this._htToday.nYear,
			nMonth : this._htToday.nMonth,
			nDate : this._htToday.nDate
		};
	},
	
	/**
		현재 달력의 날짜를 설정한다.
		
		@method setDate
		@param {Number} nYear 연도 값 (ex. 2008)
		@param {Number} nMonth 월 값 (1 ~ 12)
		@param {Number} nDate 일 값 (1 ~ 31)
	**/
	setDate : function(nYear, nMonth, nDate) {
		this._htDate = {
			nYear : nYear,
			nMonth : (nMonth * 1),
			nDate : (nDate * 1)
		};
	},
	
	/**
		현재 표시된 달력의 날짜를 가져온다.
		
		@method getShownDate
		@remark 기본으로 설정된 날짜 또는 setDate로 설정된 날짜와 다른 경우, nDate 값은 1이다.
        @return {Object} 연월일을 담은 객체
            @return {Number} .nYear 년도
            @return {Number} .nMonth 월
            @return {Number} .nDate 일
		@example 
			oCalendar.getShownDate(); // { nYear : 2000, nMonth : 1, nDate : 1 }
	**/
	getShownDate : function() {
		return this._getShownDate();
	},
	
	_getShownDate : function() {
		return this.htShownDate || this.getDate();
	},

	_setShownDate : function(nYear, nMonth) {
		this.htShownDate = {
			nYear : nYear,
			nMonth : (nMonth * 1),
			nDate : 1
		};
	},

	_assignHTMLElements : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			elLayer = this.getBaseElement();
	
		if ((this.elBtnPrevYear = jindo.$$.getSingle(("." + sClassPrefix + "btn-prev-year"), elLayer))) {
			this.wfPrevYear = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(-1, 0, true);
			}, this);
		}
		if ((this.elBtnPrevMonth = jindo.$$.getSingle(("." + sClassPrefix + "btn-prev-mon"), elLayer))) {
			this.wfPrevMonth = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(0, -1, true);
			}, this);	
		}
		if ((this.elBtnNextMonth = jindo.$$.getSingle(("." + sClassPrefix + "btn-next-mon"), elLayer))) {
			this.wfNextMonth = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(0, 1, true);
			}, this);
		}
		if ((this.elBtnNextYear = jindo.$$.getSingle(("." + sClassPrefix + "btn-next-year"), elLayer))) {
			this.wfNextYear = jindo.$Fn(function(oEvent){
				oEvent.stop(jindo.$Event.CANCEL_DEFAULT);
				this.draw(1, 0, true);
			}, this);
		}
		
		this.elTitle = jindo.$$.getSingle(("." + sClassPrefix + "title"), elLayer);
		this.elTitleYear = jindo.$$.getSingle(("." + sClassPrefix + "title-year"), elLayer);
		this.elTitleMonth = jindo.$$.getSingle(("." + sClassPrefix + "title-month"), elLayer);
		var elWeekTemplate = jindo.$$.getSingle("." + sClassPrefix + "week", elLayer);
		this.elWeekTemplate = elWeekTemplate.cloneNode(true);
		this.elWeekAppendTarget = elWeekTemplate.parentNode;
	},
	
	_setCalendarTitle : function(nYear, nMonth, sType) {
		if (nMonth < 10) {
			nMonth = ("0" + (nMonth * 1)).toString();
		} 
		
		var elTitle = this.elTitle,
			sTitleFormat = this.option("sTitleFormat"),
			sTitle;
		
		if (typeof sType != "undefined") {
			switch (sType) {
				case "year" :
					elTitle = this.elTitleYear;
					sTitleFormat = this.option("sYearTitleFormat");
					sTitle = sTitleFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2));
				break;
				case "month" :
					elTitle = this.elTitleMonth;
					sTitleFormat = this.option("sMonthTitleFormat");
					sTitle = sTitleFormat.replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.option("aMonthTitle")[nMonth-1]); 
				break;
			}
		} else {
			sTitle = sTitleFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2)).replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.option("aMonthTitle")[nMonth-1] );
		}  
		
		jindo.$Element(elTitle).text(sTitle);
	},
	
	/**
		Calendar를 그린다.
		
		@method draw
		@param {Number} nYear 연도 값 (ex. 2008)
		@param {Number} nMonth 월 값 (1 ~ 12)
		@param {Boolean} [bRelative] 연도와 월 값이 상대 값인지 여부
		@example
			oCalendar.draw(); //현재 설정된 날짜의 달력을 그린다.
			oCalendar.draw(2008, 12); //2008년 12월 달력을 그린다.
			oCalendar.draw(null, 12); //현재 표시된 달력의 12월을 그린다.
			oCalendar.draw(2010, null); //2010년 현재 표시된 달력의 월을 그린다.
			oCalendar.draw(0, 1, true); //현재 표시된 달력의 다음 달을 그린다.
			oCalendar.draw(-1, null, true); //현재 표시된 달력의 이전 연도를 그린다.
	**/
	draw : function(nYear, nMonth, bRelative) {
		var sClassPrefix = this.option("sClassPrefix"),
			htDate = this.getDate(),
			oShownDate = this._getShownDate();
			
		if (oShownDate && typeof bRelative != "undefined" && bRelative) {
			var htRelativeDate = this.constructor.getRelativeDate(nYear, nMonth, 0, oShownDate);
			nYear = htRelativeDate.nYear;
			nMonth = htRelativeDate.nMonth;
		} else if (typeof nYear == "undefined" && typeof nMonth == "undefined" && typeof bRelative == "undefined") {
			nYear = htDate.nYear;
			nMonth = htDate.nMonth;
		} else {
			nYear = nYear || oShownDate.nYear;
			nMonth = nMonth || oShownDate.nMonth; 
		}
		
		/**
			달력을 그리기 전에 발생
			
			@event beforeDraw
			@param {String} sType 커스텀 이벤트명
			@param {Number} nYear 그려질 달력의 연도
			@param {Number} nMonth 그려질 달력의 월
			@param {Function} stop 레이어 보여주는 것을 중단하는 메서드
			@example
				// beforeDraw 커스텀 이벤트 핸들링
				oCalendar.attach("beforeDraw", function(oCustomEvent){ ... });
				
				// 달력이 보여지지 않도록 처리
				oCalendar.attach("beforeShow", function(oCustomEvent){
					oCustomEvent.stop();
				});
		**/
		if (this.fireEvent("beforeDraw", {
			nYear: nYear,
			nMonth: nMonth
		})) {
			if (this.elTitle) {
				this._setCalendarTitle(nYear, nMonth);
			}
			if (this.elTitleYear) {
				this._setCalendarTitle(nYear, nMonth, "year");
			}
			if (this.elTitleMonth) {
				this._setCalendarTitle(nYear, nMonth, "month");
			}
			
			this._clear(jindo.Calendar.getWeeks(nYear, nMonth));
			this._setShownDate(nYear, nMonth);
			
			var htToday = this.getToday(),		
				nFirstDay = this.constructor.getFirstDay(nYear, nMonth),
				nLastDay = this.constructor.getLastDay(nYear, nMonth),
				nLastDate = this.constructor.getLastDate(nYear, nMonth),
				nDay = 0,
				htDatePrevMonth = this.constructor.getRelativeDate(0, -1, 0, {nYear:nYear, nMonth:nMonth, nDate:1}),
				htDateNextMonth = this.constructor.getRelativeDate(0, 1, 0, {nYear:nYear, nMonth:nMonth, nDate:1}),
				nPrevMonthLastDate = this.constructor.getLastDate(htDatePrevMonth.nYear, htDatePrevMonth.nMonth),	
				aDate = [],
				bPrevMonth,
				bNextMonth,
				welDateContainer,
				nTempYear,
				nTempMonth,
				oParam,
				nIndexOfLastDate,
				elWeek,
				i;
				
			var nWeeks = this.constructor.getWeeks(nYear, nMonth);
		
			for (i = 0; i < nWeeks; i++) {
				elWeek = this.elWeekTemplate.cloneNode(true);
				jindo.$Element(elWeek).appendTo(this.elWeekAppendTarget);
				this._aWeekElement.push(elWeek);
			}
			this._aDateElement = jindo.$$("." + sClassPrefix + "date", this.elWeekAppendTarget);
			this._aDateContainerElement = jindo.$$("." + sClassPrefix + "week > *", this.elWeekAppendTarget);
				
			if (nFirstDay > 0) {
				for (i = nPrevMonthLastDate - nFirstDay; i < nPrevMonthLastDate; i++) {
					aDate.push(i + 1);
				}
			}
			for (i = 1; i < nLastDate + 1; i++) {
				aDate.push(i);	
			}
			nIndexOfLastDate = aDate.length - 1;
			
			for (i = 1; i < 7 - nLastDay; i++) {
				aDate.push(i);	
			}
			
			for (i = 0; i < aDate.length; i++) {
				bPrevMonth = false;
				bNextMonth = false;
				welDateContainer = jindo.$Element(this._aDateContainerElement[i]);
				nTempYear = nYear;
				nTempMonth = nMonth;
				
				if (i < nFirstDay) {
					bPrevMonth = true;
					welDateContainer.addClass(sClassPrefix + "prev-mon");
					nTempYear = htDatePrevMonth.nYear;
					nTempMonth = htDatePrevMonth.nMonth;
				} else if (i > nIndexOfLastDate) {
					bNextMonth = true;
					welDateContainer.addClass(sClassPrefix + "next-mon");				
					nTempYear = htDateNextMonth.nYear;
					nTempMonth = htDateNextMonth.nMonth;
				} else {
					nTempYear = nYear;
					nTempMonth = nMonth;
				}
				
				if (nDay === 0) {
					welDateContainer.addClass(sClassPrefix + "sun");
				}
				if (nDay == 6) {
					welDateContainer.addClass(sClassPrefix + "sat");
				}
				if (nTempYear == htToday.nYear && (nTempMonth * 1) == htToday.nMonth && aDate[i] == htToday.nDate) {
					welDateContainer.addClass(sClassPrefix + "today");
				}
				
				oParam = {
					elDate : this._aDateElement[i],
					elDateContainer : welDateContainer.$value(),
					nYear : nTempYear, 
					nMonth : nTempMonth, 
					nDate : aDate[i],
					bPrevMonth : bPrevMonth,
					bNextMonth : bNextMonth,
					sHTML : aDate[i]
				};
				jindo.$Element(oParam.elDate).html(oParam.sHTML.toString());
				
				this._aMetaData.push({
					nYear : nTempYear, 
					nMonth : nTempMonth, 
					nDate : aDate[i]
				});
				
				nDay = (nDay + 1) % 7;
				
				/**
					달력을 그리면서 일이 표시될 때마다 발생
					
					@event draw
					@param {String} sType 커스텀 이벤트명
					@param {Boolean} bPrevMonth 그려질 날이 이전달의 날인지 여부
					@param {Boolean} bNextMonth 그려질 날이 다음달의 날인지 여부
					@param {HTMLElement} elDate 날이 쓰여질 대상 엘리먼트
					@param {HTMLElement} elDateContainer className이 [prefix]week로 설정된 엘리먼트의 자식 엘리먼트, elDate와 같을 수 있음
					@param {Number} nDate 그려질 날의 일
					@param {Number} nMonth 그려질 날의 월
					@param {Number} nYear 그려질 날의 연
					@param {String} sHTML 대상 엘리먼트에 쓰여질 HTML
					@example
						// draw 커스텀 이벤트 핸들링
						oCalendar.attach("draw", function(oCustomEvent){ ... });
						
						// 10일에만 진하게 표시하기 예제
						oCalendar.attach("draw", function(oCustomEvent){
							if(oCustomEvent.nDate == 10){
								oCustomEvent.elDate.innerHTML = '<b>' + oCustomEvent.sHTML + '</b>';
							}
						});
				**/
				this.fireEvent("draw", oParam);
			}
			/**
				달력을 모두 그린 후에 발생
				
				@event afterDraw
				@param {String} sType 커스텀 이벤트명
				@param {Number} nYear 그려진 달력의 연도
				@param {Number} nMonth 그려진 달력의 월
				@example
					// afterDraw 커스텀 이벤트 핸들링
					oCalendar.attach("afterDraw", function(oCustomEvent){ ... });
			**/
			this.fireEvent("afterDraw", {
				nYear : nYear, 
				nMonth : nMonth
			});
		}
	},
	
	_clear : function(nWeek) {
		this._aMetaData = [];
		this._aWeekElement = [];
		jindo.$Element(this.elWeekAppendTarget).empty();
	},
	
	/**
		@method attachEvent
		@deprecated activate() 사용권장
	**/
	attachEvent : function() {
		this.activate();
	},
	
	/**
		@method detachEvent
		@deprecated deactivate() 사용권장
	**/
	detachEvent : function() {
		this.deactivate();
	},
	
	_onActivate : function() {
		if (this.elBtnPrevYear) {
			this.wfPrevYear.attach(this.elBtnPrevYear, "click");
		}
		if (this.elBtnPrevMonth) {
			this.wfPrevMonth.attach(this.elBtnPrevMonth, "click");
			
		}
		if (this.elBtnNextMonth) {
			this.wfNextMonth.attach(this.elBtnNextMonth, "click");			
		}
		if (this.elBtnNextYear) {
			this.wfNextYear.attach(this.elBtnNextYear, "click");
		}
	},
	
	_onDeactivate : function() {
		if (this.elBtnPrevYear) {
			this.wfPrevYear.detach(this.elBtnPrevYear, "click");
		}
		if (this.elBtnPrevMonth) {
			this.wfPrevMonth.detach(this.elBtnPrevMonth, "click");
		}
		if (this.elBtnNextMonth) {
			this.wfNextMonth.detach(this.elBtnNextMonth, "click");			
		}
		if (this.elBtnNextYear) {
			this.wfNextYear.detach(this.elBtnNextYear, "click");
		}
	}
	
}).extend(jindo.UIComponent);

/**
	오늘 정보를 설정한다.<br/>
	JavaScript의 new Date()는 사용자 로컬환경의 시간을 따르므로, 서버에서 내려주는 오늘의 정보를 설정하기 위해 사용한다.
	
	@method setToday
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@param {Number} nDate 일
	@return {this} 입력한 오늘의 정보를 설정한 인스턴스 자신
**/
jindo.Calendar.setToday = function(nYear, nMonth, nDate) {
	if (!this._htToday) {
		this._htToday = {};
	}
	this._htToday.nYear = nYear;
	this._htToday.nMonth = nMonth;
	this._htToday.nDate = nDate;
	return this;
};

/**
	오늘의 정보를 가지는 Hash Table을 가져온다.
	
	@method getToday
	@static
    @return {Object} 연월일을 담은 객체
        @return {Number} .nYear 년도
        @return {Number} .nMonth 월
        @return {Number} .nDate 일
	@example 
		oCalendar.getToday(); // { nYear : 2000, nMonth : 1, nDate : 31 }
**/
jindo.Calendar.getToday = function() {
	var htToday = this._htToday || this.getDateHashTable(new Date());
	return {
		nYear : htToday.nYear,
		nMonth : htToday.nMonth,
		nDate : htToday.nDate
	};
};

/**
	Date 객체를 구한다.
	
	@method getDateObject
	@static
	@param {Object} htDate 날짜 객체
	@return {Date} Date 객체 인스턴스 자신
	@example
		jindo.Calendar.getDateObject({nYear:2010, nMonth:5, nDate:12});
		jindo.Calendar.getDateObject(2010, 5, 12); //연,월,일
**/
jindo.Calendar.getDateObject = function(htDate) {
	if (arguments.length == 3) {
		return new Date(arguments[0], arguments[1] - 1, arguments[2]);
	}
	return new Date(htDate.nYear, htDate.nMonth - 1, htDate.nDate);
};

/**
	연월일을 포함한 HashTable 객체를 구한다.
	
	@method getDateHashTable
	@static
	@param {Date} Date 날짜 객체
    @return {Object} 연월일을 담은 객체
        @return {Number} .nYear 년도
        @return {Number} .nMonth 월
        @return {Number} .nDate 일
	@example
		jindo.Calendar.getDateHashTable(2010, 5, 12); // {nYear:2010, nMonth:5, nDate:12}
		jindo.Calendar.getDateHashTable(); // {nYear:2010, nMonth:5, nDate:12}
		jindo.Calendar.getDateHashTable(new Date(2009,1,2)); // {nYear:2009, nMonth:2, nDate:1}
**/
jindo.Calendar.getDateHashTable = function(oDate) {
	if (arguments.length == 3) {
		return {
			nYear : arguments[0],
			nMonth : arguments[1],
			nDate : arguments[2]
		};
	} 
	if (arguments.length <= 1) {
		oDate = oDate || new Date();
	}
	return {
		nYear : oDate.getFullYear(),
		nMonth : oDate.getMonth() + 1,
		nDate : oDate.getDate()
	};
};

/**
	연월일을 포함한 HashTable로부터 유닉스타임을 구한다.
	
	@method getTime
	@static
    @param {Object} htDate 날짜 정보가 담긴 객체
        @param {Number} htDate.nYear 년
        @param {Number} htDate.nMonth 월
        @param {Number} htDate.nDate 일
	@return {Number} 유닉스타임 정보
	@example
		jindo.Calendar.getTime({nYear:2010, nMonth:5, nDate:12}); // 1273590000000
**/
jindo.Calendar.getTime = function(htDate) {
	return this.getDateObject(htDate).getTime();
};

/**
	해당 연월의 첫번째 날짜의 요일을 구한다.
	
	@method getFirstDay
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@return {Number} 요일 (0~6)
**/
jindo.Calendar.getFirstDay = function(nYear, nMonth) {
	return new Date(nYear, nMonth - 1, 1).getDay();
};

/**
	해당 연월의 마지막 날짜의 요일을 구한다.
	
	@method getLastDay
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@return {Number} 요일 (0~6)
**/
jindo.Calendar.getLastDay = function(nYear, nMonth) {
	return new Date(nYear, nMonth, 0).getDay();
};

/**
	해당 연월의 마지막 날짜를 구한다.
	
	@method getLastDate
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@return {Number} 날짜 (1~31)
**/
jindo.Calendar.getLastDate = function(nYear, nMonth) {
	return new Date(nYear, nMonth, 0).getDate();
};

/**
	해당 연월의 주의 수를 구한다.
	
	@method getWeeks
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@return {Number} 주 (4~6)
**/
jindo.Calendar.getWeeks = function(nYear, nMonth) {
	var nFirstDay = this.getFirstDay(nYear, nMonth),
		nLastDate = this.getLastDate(nYear, nMonth);
		
	return Math.ceil((nFirstDay + nLastDate) / 7);	
};

/**
	연월일을 포함한 HashTable로부터 상대적인 날짜의 HashTable을 구한다.
	
	@method getRelativeDate
	@static
	@param {Number} nYear 상대적인 연도 (+/-로 정의)
	@param {Number} nMonth 상대적인 월 (+/-로 정의)
	@param {Number} nDate 상대적인 일 (+/-로 정의)
	@param {Object} htDate 연월일 HashTable
    @return {Object} 연월일을 담은 객체
        @return {Number} .nYear 년도
        @return {Number} .nMonth 월
        @return {Number} .nDate 일
	@example
		jindo.Calendar.getRelativeDate(1, 0, 0, {nYear:2000, nMonth:1, nDate:1}); // {nYear:2001, nMonth:1, nDate:1}
		jindo.Calendar.getRelativeDate(0, 0, -1, {nYear:2010, nMonth:1, nDate:1}); // {nYear:2009, nMonth:12, nDate:31}
**/
jindo.Calendar.getRelativeDate = function(nYear, nMonth, nDate, htDate) {
	var beforeDate = jindo.$Date(new Date(htDate.nYear , htDate.nMonth, htDate.nDate));
	var day = {"1":31,"2":28,"3":31,"4":30,"5":31,"6":30,"7":31,"8":31,"9":30,"10":31,"11":30,"12":31};
	if(beforeDate.isLeapYear()){
		day = {"1":31,"2":29,"3":31,"4":30,"5":31,"6":30,"7":31,"8":31,"9":30,"10":31,"11":30,"12":31};
	}
	if(day[htDate.nMonth] == htDate.nDate ){
		htDate.nDate = day[htDate.nMonth+nMonth];
	}
	var changeDate = this.getDateHashTable(new Date(htDate.nYear + nYear, htDate.nMonth + nMonth - 1, htDate.nDate + nDate));
	return this.getDateHashTable(new Date(htDate.nYear + nYear, htDate.nMonth + nMonth - 1, htDate.nDate + nDate));		
};

/**
	유효한 날짜인지 확인힌다.
	
	@method isValidDate
	@static
	@param {Number} nYear 년
	@param {Number} nMonth 월
	@param {Number} nDate 일
	@return {Boolean} 입력한 날짜의 유효 여부
**/
jindo.Calendar.isValidDate = function(nYear, nMonth, nDate) {
	if (nMonth <= 12 && nDate <= this.getLastDate(nYear, nMonth)) {
		return true;
	} else {
		return false;
	}
};

/**
	연월일을 포함한 HashTable이 비교대상 HashTable보다 과거인지 확인한다.
	
	@method isPast
	@static
	@param {Object} htDate 비교를 원하는 날
	@param {Object} htComparisonDate 비교할 기준
	@return {Boolean} 비교 결과(비교대상보다 과거인지 여부)
**/
jindo.Calendar.isPast = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) < this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
	연월일을 포함한 HashTable이 비교대상 HashTable보다 미래인지 확인한다.
	
	@method isFuture
	@static
	@param {Object} htDate 비교를 원하는 날
	@param {Object} htComparisonDate 비교할 기준
	@return {Boolean} 비교 결과(비교대상 보다 미래인지 여부)
**/
jindo.Calendar.isFuture = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) > this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
	연월일을 포함한 HashTable이 비교대상 HashTable과 같은 날인지 확인한다.
	
	@method isSameDate
	@static
	@param {Object} htDate 비교를 원하는 날
	@param {Object} htComparisonDate 비교할 기준
	@return {Boolean} 비교 결과(비교대상과 같은 날인지 여부)
**/
jindo.Calendar.isSameDate = function(htDate, htComparisonDate) {
	if (this.getTime(htDate) == this.getTime(htComparisonDate)) {
		return true;
	} 
	return false;
};

/**
	연월일을 포함한 HashTable이 특정 두 날 사이에 존재하는지 확인한다.
	
	@method isBetween
	@static
	@param {Object} htDate 비교를 원하는 날
	@param {Object} htFrom 시작 날짜
	@param {Object} htTo 끝 날짜
	@return {Boolean} 비교 결과(특정 두 날 사이에 존재하는지 여부)
	@example
		jindo.Calendar.isBetween({nYear:2010, nMonth:5, nDate:12}, {nYear:2010, nMonth:1, nDate:1}, {nYear:2010, nMonth:12, nDate:31}); // true 
**/
jindo.Calendar.isBetween = function(htDate, htFrom, htTo) {
	if (this.isFuture(htDate, htTo) || this.isPast(htDate, htFrom)) {
		return false;
	} else {
		return true;
	}
};/**
	@version 1.14.0
**/

// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var G_vmlCanvasManager;
if(!document.createElement('canvas').getContext){(function(){var m=Math,mr=m.round,ms=m.sin,mc=m.cos,abs=m.abs,sqrt=m.sqrt,Z=10,Z2=Z/2,slice=Array.prototype.slice,dec2hex=[];for(var i=0;i<16;i++){for(var j=0;j<16;j++){dec2hex[i*16+j]=i.toString(16)+j.toString(16);}}
function getContext(){return this.context_||(this.context_=new CanvasRenderingContext2D_(this));}
function bind(f,obj,var_args){var a=slice.call(arguments,2);return function(){return f.apply(obj,a.concat(slice.call(arguments)));};}
var G_vmlCanvasManager_={init:function(opt_doc){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var doc=opt_doc||document;doc.createElement('canvas');doc.attachEvent('onreadystatechange',bind(this.init_,this,doc));}},init_:function(doc){if(!doc.namespaces['g_vml_']){doc.namespaces.add('g_vml_','urn:schemas-microsoft-com:vml','#default#VML');}
if(!doc.namespaces['g_o_']){doc.namespaces.add('g_o_','urn:schemas-microsoft-com:office:office','#default#VML');}
if(!doc.styleSheets['ex_canvas_']){var ss=doc.createStyleSheet();ss.owningElement.id='ex_canvas_';ss.cssText='canvas{display:inline-block;overflow:hidden;'+'text-align:left;width:300px;height:150px}'+'g_vml_\\:*{behavior:url(#default#VML)}'+'g_o_\\:*{behavior:url(#default#VML)}';}
var els=doc.getElementsByTagName('canvas');for(var i=0;i<els.length;i++){this.initElement(els[i]);}},initElement:function(el){if(!el.getContext){el.getContext=getContext;el.innerHTML='';el.attachEvent('onpropertychange',onPropertyChange);el.attachEvent('onresize',onResize);var attrs=el.attributes;if(attrs.width&&attrs.width.specified){el.style.width=attrs.width.nodeValue+'px';}else{el.width=el.clientWidth;}
if(attrs.height&&attrs.height.specified){el.style.height=attrs.height.nodeValue+'px';}else{el.height=el.clientHeight;}}
return el;}};G_vmlCanvasManager_.init();function onPropertyChange(e){var el=e.srcElement;switch(e.propertyName){case'width':el.style.width=el.attributes.width.nodeValue+'px';el.getContext().clearRect();break;case'height':el.style.height=el.attributes.height.nodeValue+'px';el.getContext().clearRect();break;}}
function onResize(e){var el=e.srcElement;if(el.firstChild){el.firstChild.style.width=el.clientWidth+'px';el.firstChild.style.height=el.clientHeight+'px';}}
function createMatrixIdentity(){return[[1,0,0],[0,1,0],[0,0,1]];}
function matrixMultiply(m1,m2){var result=createMatrixIdentity();for(var x=0;x<3;x++){for(var y=0;y<3;y++){var sum=0;for(var z=0;z<3;z++){sum+=m1[x][z]*m2[z][y];}
result[x][y]=sum;}}
return result;}
function copyState(o1,o2){o2.fillStyle=o1.fillStyle;o2.lineCap=o1.lineCap;o2.lineJoin=o1.lineJoin;o2.lineWidth=o1.lineWidth;o2.miterLimit=o1.miterLimit;o2.shadowBlur=o1.shadowBlur;o2.shadowColor=o1.shadowColor;o2.shadowOffsetX=o1.shadowOffsetX;o2.shadowOffsetY=o1.shadowOffsetY;o2.strokeStyle=o1.strokeStyle;o2.globalAlpha=o1.globalAlpha;o2.arcScaleX_=o1.arcScaleX_;o2.arcScaleY_=o1.arcScaleY_;o2.lineScale_=o1.lineScale_;}
function processStyle(styleString){var str,alpha=1;styleString=String(styleString);if(styleString.substring(0,3)=='rgb'){var start=styleString.indexOf('(',3);var end=styleString.indexOf(')',start+1);var guts=styleString.substring(start+1,end).split(',');str='#';for(var i=0;i<3;i++){str+=dec2hex[Number(guts[i])];}
if(guts.length==4&&styleString.substr(3,1)=='a'){alpha=guts[3];}}else{str=styleString;}
return{color:str,alpha:alpha};}
function processLineCap(lineCap){switch(lineCap){case'butt':return'flat';case'round':return'round';case'square':break;default:return'square';}}
function CanvasRenderingContext2D_(surfaceElement){this.m_=createMatrixIdentity();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle='#000';this.fillStyle='#000';this.lineWidth=1;this.lineJoin='miter';this.lineCap='butt';this.miterLimit=Z*1;this.globalAlpha=1;this.canvas=surfaceElement;var el=surfaceElement.ownerDocument.createElement('div');el.style.width=surfaceElement.clientWidth+'px';el.style.height=surfaceElement.clientHeight+'px';surfaceElement.appendChild(el);this.element_=el;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1;}
var contextPrototype=CanvasRenderingContext2D_.prototype;contextPrototype.clearRect=function(){this.element_.innerHTML='';};contextPrototype.beginPath=function(){this.currentPath_=[];};contextPrototype.moveTo=function(aX,aY){var p=this.getCoords_(aX,aY);this.currentPath_.push({type:'moveTo',x:p.x,y:p.y});this.currentX_=p.x;this.currentY_=p.y;};contextPrototype.lineTo=function(aX,aY){var p=this.getCoords_(aX,aY);this.currentPath_.push({type:'lineTo',x:p.x,y:p.y});this.currentX_=p.x;this.currentY_=p.y;};contextPrototype.bezierCurveTo=function(aCP1x,aCP1y,aCP2x,aCP2y,aX,aY){var p=this.getCoords_(aX,aY);var cp1=this.getCoords_(aCP1x,aCP1y);var cp2=this.getCoords_(aCP2x,aCP2y);bezierCurveTo(this,cp1,cp2,p);};function bezierCurveTo(self,cp1,cp2,p){self.currentPath_.push({type:'bezierCurveTo',cp1x:cp1.x,cp1y:cp1.y,cp2x:cp2.x,cp2y:cp2.y,x:p.x,y:p.y});self.currentX_=p.x;self.currentY_=p.y;}
contextPrototype.quadraticCurveTo=function(aCPx,aCPy,aX,aY){var cp=this.getCoords_(aCPx,aCPy);var p=this.getCoords_(aX,aY);var cp1={x:this.currentX_+2.0/3.0*(cp.x-this.currentX_),y:this.currentY_+2.0/3.0*(cp.y-this.currentY_)};var cp2={x:cp1.x+(p.x-this.currentX_)/3.0,y:cp1.y+(p.y-this.currentY_)/3.0};bezierCurveTo(this,cp1,cp2,p);};contextPrototype.arc=function(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise){aRadius*=Z;var arcType=aClockwise?'at':'wa';var xStart=aX+mc(aStartAngle)*aRadius-Z2;var yStart=aY+ms(aStartAngle)*aRadius-Z2;var xEnd=aX+mc(aEndAngle)*aRadius-Z2;var yEnd=aY+ms(aEndAngle)*aRadius-Z2;if(xStart==xEnd&&!aClockwise){xStart+=0.125;}
var p=this.getCoords_(aX,aY);var pStart=this.getCoords_(xStart,yStart);var pEnd=this.getCoords_(xEnd,yEnd);this.currentPath_.push({type:arcType,x:p.x,y:p.y,radius:aRadius,xStart:pStart.x,yStart:pStart.y,xEnd:pEnd.x,yEnd:pEnd.y});};contextPrototype.rect=function(aX,aY,aWidth,aHeight){this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();};contextPrototype.strokeRect=function(aX,aY,aWidth,aHeight){var oldPath=this.currentPath_;this.beginPath();this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();this.stroke();this.currentPath_=oldPath;};contextPrototype.fillRect=function(aX,aY,aWidth,aHeight){var oldPath=this.currentPath_;this.beginPath();this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();this.fill();this.currentPath_=oldPath;};contextPrototype.createLinearGradient=function(aX0,aY0,aX1,aY1){var gradient=new CanvasGradient_('gradient');gradient.x0_=aX0;gradient.y0_=aY0;gradient.x1_=aX1;gradient.y1_=aY1;return gradient;};contextPrototype.createRadialGradient=function(aX0,aY0,aR0,aX1,aY1,aR1){var gradient=new CanvasGradient_('gradientradial');gradient.x0_=aX0;gradient.y0_=aY0;gradient.r0_=aR0;gradient.x1_=aX1;gradient.y1_=aY1;gradient.r1_=aR1;return gradient;};contextPrototype.drawImage=function(image,var_args){var dx,dy,dw,dh,sx,sy,sw,sh;var oldRuntimeWidth=image.runtimeStyle.width;var oldRuntimeHeight=image.runtimeStyle.height;image.runtimeStyle.width='auto';image.runtimeStyle.height='auto';var w=image.width;var h=image.height;image.runtimeStyle.width=oldRuntimeWidth;image.runtimeStyle.height=oldRuntimeHeight;if(arguments.length==3){dx=arguments[1];dy=arguments[2];sx=sy=0;sw=dw=w;sh=dh=h;}else if(arguments.length==5){dx=arguments[1];dy=arguments[2];dw=arguments[3];dh=arguments[4];sx=sy=0;sw=w;sh=h;}else if(arguments.length==9){sx=arguments[1];sy=arguments[2];sw=arguments[3];sh=arguments[4];dx=arguments[5];dy=arguments[6];dw=arguments[7];dh=arguments[8];}else{throw Error('Invalid number of arguments');}
var d=this.getCoords_(dx,dy);var w2=sw/2;var h2=sh/2;var vmlStr=[];var W=10;var H=10;vmlStr.push(' <g_vml_:group',' coordsize="',Z*W,',',Z*H,'"',' coordorigin="0,0"',' style="width:',W,'px;height:',H,'px;position:absolute;');if(this.m_[0][0]!=1||this.m_[0][1]){var filter=[];filter.push('M11=',this.m_[0][0],',','M12=',this.m_[1][0],',','M21=',this.m_[0][1],',','M22=',this.m_[1][1],',','Dx=',mr(d.x/Z),',','Dy=',mr(d.y/Z),'');var max=d;var c2=this.getCoords_(dx+dw,dy);var c3=this.getCoords_(dx,dy+dh);var c4=this.getCoords_(dx+dw,dy+dh);max.x=m.max(max.x,c2.x,c3.x,c4.x);max.y=m.max(max.y,c2.y,c3.y,c4.y);vmlStr.push('padding:0 ',mr(max.x/Z),'px ',mr(max.y/Z),'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',filter.join(''),", sizingmethod='clip');");}else{vmlStr.push('top:',mr(d.y/Z),'px;left:',mr(d.x/Z),'px;');}
vmlStr.push(' ">','<g_vml_:image src="',image.src,'"',' style="width:',Z*dw,'px;',' height:',Z*dh,'px;"',' cropleft="',sx/w,'"',' croptop="',sy/h,'"',' cropright="',(w-sx-sw)/w,'"',' cropbottom="',(h-sy-sh)/h,'"',' />','</g_vml_:group>');this.element_.insertAdjacentHTML('BeforeEnd',vmlStr.join(''));};contextPrototype.stroke=function(aFill){var lineStr=[];var lineOpen=false;var a=processStyle(aFill?this.fillStyle:this.strokeStyle);var color=a.color;var opacity=a.alpha*this.globalAlpha;var W=10;var H=10;lineStr.push('<g_vml_:shape',' filled="',!!aFill,'"',' style="position:absolute;width:',W,'px;height:',H,'px;"',' coordorigin="0 0" coordsize="',Z*W,' ',Z*H,'"',' stroked="',!aFill,'"',' path="');var newSeq=false;var min={x:null,y:null};var max={x:null,y:null};var i;for(i=0;i<this.currentPath_.length;i++){var p=this.currentPath_[i];var c;switch(p.type){case'moveTo':c=p;lineStr.push(' m ',mr(p.x),',',mr(p.y));break;case'lineTo':lineStr.push(' l ',mr(p.x),',',mr(p.y));break;case'close':lineStr.push(' x ');p=null;break;case'bezierCurveTo':lineStr.push(' c ',mr(p.cp1x),',',mr(p.cp1y),',',mr(p.cp2x),',',mr(p.cp2y),',',mr(p.x),',',mr(p.y));break;case'at':case'wa':lineStr.push(' ',p.type,' ',mr(p.x-this.arcScaleX_*p.radius),',',mr(p.y-this.arcScaleY_*p.radius),' ',mr(p.x+this.arcScaleX_*p.radius),',',mr(p.y+this.arcScaleY_*p.radius),' ',mr(p.xStart),',',mr(p.yStart),' ',mr(p.xEnd),',',mr(p.yEnd));break;}
if(p){if(min.x===null||p.x<min.x){min.x=p.x;}
if(max.x===null||p.x>max.x){max.x=p.x;}
if(min.y===null||p.y<min.y){min.y=p.y;}
if(max.y===null||p.y>max.y){max.y=p.y;}}}
lineStr.push(' ">');if(!aFill){var lineWidth=this.lineScale_*this.lineWidth;if(lineWidth<1){opacity*=lineWidth;}
lineStr.push('<g_vml_:stroke',' opacity="',opacity,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',processLineCap(this.lineCap),'"',' weight="',lineWidth,'px"',' color="',color,'" />');}else if(typeof this.fillStyle=='object'){var fillStyle=this.fillStyle;var angle=0;var focus={x:0,y:0};var shift=0;var expansion=1;var p0;if(fillStyle.type_=='gradient'){var x0=fillStyle.x0_/this.arcScaleX_;var y0=fillStyle.y0_/this.arcScaleY_;var x1=fillStyle.x1_/this.arcScaleX_;var y1=fillStyle.y1_/this.arcScaleY_;p0=this.getCoords_(x0,y0);var p1=this.getCoords_(x1,y1);var dx=p1.x-p0.x;var dy=p1.y-p0.y;angle=Math.atan2(dx,dy)*180/Math.PI;if(angle<0){angle+=360;}
if(angle<1e-6){angle=0;}}else{p0=this.getCoords_(fillStyle.x0_,fillStyle.y0_);var width=max.x-min.x;var height=max.y-min.y;focus={x:(p0.x-min.x)/width,y:(p0.y-min.y)/height};width/=this.arcScaleX_*Z;height/=this.arcScaleY_*Z;var dimension=m.max(width,height);shift=2*fillStyle.r0_/dimension;expansion=2*fillStyle.r1_/dimension-shift;}
var stops=fillStyle.colors_;stops.sort(function(cs1,cs2){return cs1.offset-cs2.offset;});var length=stops.length;var color1=stops[0].color;var color2=stops[length-1].color;var opacity1=stops[0].alpha*this.globalAlpha;var opacity2=stops[length-1].alpha*this.globalAlpha;var colors=[];for(i=0;i<length;i++){var stop=stops[i];colors.push(stop.offset*expansion+shift+' '+stop.color);}
lineStr.push('<g_vml_:fill type="',fillStyle.type_,'"',' method="none" focus="100%"',' color="',color1,'"',' color2="',color2,'"',' colors="',colors.join(','),'"',' opacity="',opacity2,'"',' g_o_:opacity2="',opacity1,'"',' angle="',angle,'"',' focusposition="',focus.x,',',focus.y,'" />');}else{lineStr.push('<g_vml_:fill color="',color,'" opacity="',opacity,'" />');}
lineStr.push('</g_vml_:shape>');this.element_.insertAdjacentHTML('beforeEnd',lineStr.join(''));};contextPrototype.fill=function(){this.stroke(true);};contextPrototype.closePath=function(){this.currentPath_.push({type:'close'});};contextPrototype.getCoords_=function(aX,aY){var m=this.m_;return{x:Z*(aX*m[0][0]+aY*m[1][0]+m[2][0])-Z2,y:Z*(aX*m[0][1]+aY*m[1][1]+m[2][1])-Z2};};contextPrototype.save=function(){var o={};copyState(this,o);this.aStack_.push(o);this.mStack_.push(this.m_);this.m_=matrixMultiply(createMatrixIdentity(),this.m_);};contextPrototype.restore=function(){copyState(this.aStack_.pop(),this);this.m_=this.mStack_.pop();};function matrixIsFinite(m){for(var j=0;j<3;j++){for(var k=0;k<2;k++){if(!isFinite(m[j][k])||isNaN(m[j][k])){return false;}}}
return true;}
function setM(ctx,m,updateLineScale){if(!matrixIsFinite(m)){return;}
ctx.m_=m;if(updateLineScale){var det=m[0][0]*m[1][1]-m[0][1]*m[1][0];ctx.lineScale_=sqrt(abs(det));}}
contextPrototype.translate=function(aX,aY){var m1=[[1,0,0],[0,1,0],[aX,aY,1]];setM(this,matrixMultiply(m1,this.m_),false);};contextPrototype.rotate=function(aRot){var c=mc(aRot);var s=ms(aRot);var m1=[[c,s,0],[-s,c,0],[0,0,1]];setM(this,matrixMultiply(m1,this.m_),false);};contextPrototype.scale=function(aX,aY){this.arcScaleX_*=aX;this.arcScaleY_*=aY;var m1=[[aX,0,0],[0,aY,0],[0,0,1]];setM(this,matrixMultiply(m1,this.m_),true);};contextPrototype.transform=function(m11,m12,m21,m22,dx,dy){var m1=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];setM(this,matrixMultiply(m1,this.m_),true);};contextPrototype.setTransform=function(m11,m12,m21,m22,dx,dy){var m=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];setM(this,m,true);};contextPrototype.clip=function(){};contextPrototype.arcTo=function(){};contextPrototype.createPattern=function(){return new CanvasPattern_();};function CanvasGradient_(aType){this.type_=aType;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[];}
CanvasGradient_.prototype.addColorStop=function(aOffset,aColor){aColor=processStyle(aColor);this.colors_.push({offset:aOffset,color:aColor.color,alpha:aColor.alpha});};function CanvasPattern_(){}
G_vmlCanvasManager=G_vmlCanvasManager_;CanvasRenderingContext2D=CanvasRenderingContext2D_;CanvasGradient=CanvasGradient_;CanvasPattern=CanvasPattern_;})();}

/**
	HTML5 Canvas 엘리먼트를 생성하고 간단한 그래픽 작업을 할 수 있도록 지원하는 컴포넌트
	
	@class jindo.Canvas
	@keyword canvas, graphic, 캔버스, 그래픽
**/
jindo.Canvas = jindo.$Class({
	/**
		@constructor
		@param {HTMLElement} [el] canvas 엘리먼트
	**/
	$init : function(el) {
		if (typeof el == "undefined") {
			el = jindo.Canvas.create();
		}
		this._el = el;
		this._elContainer = this._el.parentNode;
		this._oContext = jindo.Canvas.getContext(el);
	},
	
	/**
		canvas 엘리먼트를 가져온다.
		
		@method getElement
		@return {HTMLElement} canvas 엘리먼트
	**/
	getElement : function() {
		return this._el;
	},
	
	/**
		canvas 엘리먼트의 컨테이너 엘리먼트를 가져온다.
		
		@method getContainer
		@return {HTMLElement} 컨테이너 엘리먼트
	**/
	getContainer : function() {
		return this._elContainer;
	},
	
	/**
		canvas 엘리먼트의 너비를 구한다.
		
		@method width
		@return {Number} canvas 엘리먼트의 너비값
	**/
	/**
		canvas 엘리먼트의 너비를 설정한다.
		
		@method width
		@param {Number} n 지정할 너비값
		@return {this} 너비값을 설정한 canvas 인스턴스 자신
	**/
	width : function(n) {
		if (typeof n == "number") {
			this._el.width = n;
			return this;
		}
		return this._el.width;
	},
	
	/**
		canvas 엘리먼트의 높이를 구한다.
		
		@method height
		@return {Number} canvas 엘리먼트의 높이값 
	**/
	/**
		canvas 엘리먼트의 높이를 설정한다.
		
		@method height
		@param {Number} n 지정할 높이값
		@return {this} 높이값을 설정한 canvas 인스턴스 자신
	**/
	height : function(n) {
		if (typeof n == "number") {
			this._el.height = n;
			return this;
		}
		return this._el.height;
	},
	
	/**
		canvas 엘리먼트의 컨텍스트를 가져온다.
		
		@method getContext
		@return {Object} canvas의 컨텍스트 객체
	**/
	getContext : function(){
		return this._oContext;
	},
	
	/**
		canvas 엘리먼트 내부를 모두 지운다.
		
		@method clear
		@return {this} 내부를 모두 지운 canvas 인스턴스 자신
	**/
	clear : function(){
		this._oContext.clearRect(0, 0, this._el.width, this._el.height);
		return this;
	},
	
	_merge : function(ctx, htOption) {
		for (var sKey in htOption) {
			ctx[sKey] = htOption[sKey];
		}
	},
	
	/**
		여러개의 점으로 이루어진 선을 그린다.
		
		@method drawLine
		@param {Array} a 좌표셋의 배열
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@param {Boolean} [bBlockAntiAlias=true] 안티앨리어싱을 막을지 여부
		@return {this} canvas 인스턴스 자신
		@remark 선의 두께 (lineWidth) 가 홀수일경우 x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawLine([[0, 0], [1, 1]], { lineWidth : 1, strokeStyle : "rgb(255, 0, 0)" });
	**/
	drawLine : function(a, htOption, bBlockAntiAlias) {
		var ctx = this._oContext,
			nAdjust = 0,
			nLen = a.length,
			i;
		
		htOption = htOption || {};
		
		if (nLen > 1) {
			if (typeof bBlockAntiAlias == "undefined") {
				bBlockAntiAlias = true;
			}
			
			ctx.save();
			this._merge(ctx, htOption);
			
			ctx.beginPath();
			if (bBlockAntiAlias) {
				if (ctx.lineWidth % 2 === 1) {
					nAdjust = 0.5;
				}
				if (nLen === 2) {
					if (a[0][0] === a[1][0]) {
						ctx.moveTo((Math.round(a[0][0]) + nAdjust), a[0][1]);
						ctx.lineTo((Math.round(a[1][0]) + nAdjust), a[1][1]);
					}
					if (a[0][1] === a[1][1]) {
						ctx.moveTo(a[0][0], (Math.round(a[0][1]) + nAdjust));
						ctx.lineTo(a[1][0], (Math.round(a[1][1]) + nAdjust));
					}
				} else {
					ctx.moveTo((Math.round(a[0][0]) + nAdjust), (Math.round(a[0][1]) + nAdjust));
					for (i = 1; i < nLen; i++) {
						ctx.lineTo((Math.round(a[i][0]) + nAdjust), (Math.round(a[i][1]) + nAdjust));
					}
				}
			} else {
				ctx.moveTo(a[0][0], a[0][1]);
				for (i = 1; i < nLen; i++) {
					ctx.lineTo(a[i][0], a[i][1]);
				}
			}
			
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
		return this;
	},
	
	/**
		여러개의 점으로 이루어진 면을 그린다. 
		
		@method drawFace
		@param {Array} a 좌표셋의 배열
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@return {this} canvas 인스턴스 자신
		@remark x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawFace([[0, 0], [1, 1]], { fillStyle : "rgb(255, 0, 0)" });
	**/
	drawFace : function(a, htOption) {
		var ctx = this._oContext,
			nLen = a.length;
		
		htOption = htOption || {};
		
		if (nLen > 2) {
			ctx.save();
			this._merge(ctx, htOption);
			ctx.beginPath();
			ctx.moveTo(a[0][0], a[0][1]);
			for (var i = 1; i < nLen; i++) {
				ctx.lineTo(a[i][0], a[i][1]);
			}
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		return this;
	},
	
	_round : function(n, nLineWidth) {
		return (nLineWidth % 2 === 1) ? Math.round(n) + 0.5 : n; 
	},
	
	/**
		x, y 좌표를 기준으로 사각형 막대를 그린다. 
		
		@method drawRect
		@param {Number} nX x좌표
		@param {Number} nY y좌표
		@param {Number} nWidth 너비
		@param {Number} nHeight 높이
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@param {Boolean} bBlockAntiAlias 안티앨리어싱을 막을지 여부 (디폴트 true) 
		@return {this} canvas 인스턴스 자신
		@remark nWidth 값이 0보다 작으면 왼쪽방향으로, 0보다 크면 오른쪽방향으로 그리고, nHeight 값이 0보다 작으면 위쪽방향으로, 0보다 크면 아래쪽방향으로 그린다. 
		@remark htOption.strokeStyle이 지정되어있고, 컨텍스트 객체의 선의 두께(lineWidth)가 홀수일경우 x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawRect(20, 100, 100, 100, {
			    fillStyle : "rgb(200, 200, 200)"
			}, true);
			
			drawRect(20, 100, 100, 100, {
			    strokeStyle:"rgb(10, 10, 10)", lineWidth:1
			}, false);
			
			drawRect(20, 100, 100, 100, {
			    fillStyle : "rgb(200, 200, 200)", strokeStyle:"rgb(10, 10, 10)", lineWidth:1
			}, true);
	**/
	drawRect : function(nX, nY, nWidth, nHeight, htOption, bBlockAntiAlias) {
		var ctx = this._oContext,
			bFillDefined = typeof htOption["fillStyle"] != "undefined",
			bStrokeDefined = typeof htOption["strokeStyle"] != "undefined" && htOption["lineWidth"] > 0;
		
		htOption = htOption || {};
		
		if (bFillDefined || bStrokeDefined) {
			ctx.save();
			this._merge(ctx, htOption);
			
			if (bFillDefined) {
				ctx.fillRect(nX, nY, nWidth, nHeight);
			}
			if (bStrokeDefined) {
				if (typeof bBlockAntiAlias == "undefined") {
					bBlockAntiAlias = true;
				}
				
				if (bBlockAntiAlias) {
					nX = this._round(nX, ctx.lineWidth);
					nY = this._round(nY, ctx.lineWidth);
					nHeight = Math.round(nHeight);
					nWidth = Math.round(nWidth);
				}
				ctx.strokeRect(nX, nY, nWidth, nHeight);
			}
			ctx.restore();
		}
		return this;
	}
});

/**
	canvas 엘리먼트를 생성한다. 
	
	@method create
	@static
	@param {Number} nWidth canvas의 너비. canvas에 지정될 width 속성 값
	@param {Number} nHeight canvas의 높이. canvas에 지정될 height 속성 값
	@param {HTMLElement} [elParent] append될 부모 엘리먼트
	@return {HTMLElement} canvas 엘리먼트
	@remark IE는 exCanvas를 사용해 초기화한다.
	@example
		jindo.Canvas.create();
		jindo.Canvas.create(300, 200);
		jindo.Canvas.create(300, 200, document.body);
**/
jindo.Canvas.create = function(nWidth, nHeight, elParent) {
	var elCanvas = document.createElement('canvas');
	elCanvas.setAttribute("width", nWidth || 300);
	elCanvas.setAttribute("height", nHeight || 150);
	 
	if (typeof elCanvas.getContext == "undefined") {
		G_vmlCanvasManager.initElement(elCanvas);
	}
	if (elParent) {
		elParent.appendChild(elCanvas);
	}
	return elCanvas;
};

/**
	canvas 엘리먼트의 컨텍스트 객체를 가져온다.
	
	@method getContext
	@static
	@param {HTMLElement} el canvas 엘리먼트
	@return {Object} canvas의 컨텍스트 객체
**/
jindo.Canvas.getContext = function(el) {
	return el.getContext("2d");
};/**
	@fileOverview HTML 컴포넌트를 구현하기 위한 코어 클래스
	@version 1.14.0
**/
/**
	HTML 컴포넌트에 상속되어 사용되는 jindo.UIComponent.js
	
	@class jindo.HTMLComponent
	@extends jindo.UIComponent
	
	@keyword component, base, core, html
**/
jindo.HTMLComponent = jindo.$Class({
	/** @lends jindo.HTMLComponent.prototype */
	sTagName : "",
	
	/**
		jindo.HTMLComponent를 초기화한다.
		@constructor
	**/
	$init : function() {
	},
	
	/**
		컴포넌트를 새로 그려준다.
		상속받는 클래스는 반드시 _onPaint() 메서드가 정의되어야 한다.
		
		@method paint
		@return {this}
	**/
	paint : function() {
		this._onPaint();
		return this;
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {

		(this.constructor._aInstances = this.constructor._aInstances || []).push(this);

	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		
		var aInstances = this.constructor._aInstances || [];
		var nIndex = jindo.$A(aInstances).indexOf(this);
		
		if (nIndex > -1) { aInstances.splice(nIndex, 1); }
		
	}

}).extend(jindo.UIComponent);

/**
	다수의 컴포넌트의 paint 메서드를 일괄 수행하는 Static Method
	
	@method paint
	@static
**/
jindo.HTMLComponent.paint = function() {
	var aInstance = this._aInstances || [];
	for (var i = 0, oInstance; (oInstance = aInstance[i]); i++) {
		oInstance.paint();
	}
};

/**
	컴포넌트의 생성된 인스턴스를 리턴한다.
	
	@method getInstance
	@static
	
	@return {Array} 생성된 인스턴스의 배열
**/
jindo.HTMLComponent.getInstance = function(){
	return this._aInstances || [];
};/**
	@fileOverview 체크박스나 라디오버튼의 디자인을 대체하기 위한 HTML Component 
	@author hooriza, modified by senxation
	@version 1.14.0
**/

/**
	jindo.CheckBox 컴포넌트는 Checkbox/Radio Button 컨트롤의 디자인을 커스터마이징합니다.
	
	@class jindo.CheckBox
	@extends jindo.HTMLComponent
	
	@keyword input, checkbox, 체크박스, 디자인
**/
jindo.CheckBox = jindo.$Class({
	/** @lends jindo.CheckBox.prototype */
	sTagName : 'input[type=checkbox]', //'input[type=radio]'
	
	/**
		CheckBox 컴포넌트를 생성한다.
		@constructor 
		@param {String | HTMLElement} el input[type=checkbox] 또는 input[type=radio]를 감싸고 있는 엘리먼트 혹은 그 id
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="checkbox-"] 클래스명의 접두어. [prefix]mark, [prefix]focused, [prefix]applied, [prefix]disabled, [prefix]checked 클래스명이 사용된다.
		@remark input[type=checkbox], input[type=radio]에 이벤트를 직접 바인딩해서 사용할 경우 제대로 동작하지 않음
		@example
			<span id="ajax_checkbox">
				<span class="ajax_checkbox_mark"></span><input type="checkbox" name="c" id="c1" />
			</span> 
			<label for="c1">첫번째</label>
			
			<script type="text/javascript" language="javascript">
				var oCheckBox = jindo.CheckBox(jindo.$('ajax_checkbox'), { sClassPrefix : 'checkbox-' }).attach({
					beforeChange : function(oCustomEvent) {
						//전달되는 이벤트객체 oCustomEvent = {
						//	bChecked : (Boolean) 체크 여부
						//}
						//oCustomEvent.stop(); 수행시 체크/해제 되지 않음
					},
					change : function(oCustomEvent) {
						//전달되는 이벤트객체 oCustomEvent = {
						//	bChecked : (Boolean) 체크 여부
						//}
					}
				});
			</script>
	**/
	$init : function(el, htOption) {
		this.option({
			sClassPrefix : 'checkbox-'
		});
		
		this.option(htOption || {});

		this._elWrapper = jindo.$(el);
		this._welWrapper = jindo.$Element(el);
		this._assignHTMLElements();
		
		this.wfOnClickInput = jindo.$Fn(this._onClickInput, this);
		this.wfOnClickWrapper = jindo.$Fn(this._onClickWrapper, this);
		this.wfOnFocusInput = jindo.$Fn(this._onFocusInput, this);
		this.wfOnBlurInput = jindo.$Fn(this._onBlurInput, this);
		
		this.activate();
		this.paint();
	},
	
	_assignHTMLElements : function() {
		var elWrapper = this._elWrapper;
		/**
			해당 input[type=checkbox] 엘리먼트
			@ignore
		**/
		this._elInput = jindo.$$.getSingle('input', elWrapper);
		/**
			해당 input[type=checkbox] 엘리먼트를 대체할 엘리먼트
			@ignore
		**/
		if (this._elInput.type == "radio") {
			this.sTagName = "input[type=radio]";
			this.option("sClassPrefix", "radio-");
		}
		var sPrefix = this.option('sClassPrefix');
		this._elSubstitute = jindo.$$.getSingle("." + sPrefix + "mark", elWrapper);
		this._welSubstitute = jindo.$Element(this._elSubstitute);
	},
	
	/**
		Input 엘리먼트를 구한다.
		
		@method getInput
		@return {HTMLElement} Input 엘리먼트
	**/
	getInput : function() {
		return this._elInput;
	},
	
	/**
		Input 엘리먼트의 Check 여부를 가져온다.
		
		@method getChecked
		@return {Boolean} Input 엘리먼트의 Check 여부
	**/
	getChecked : function() {
		return this.getInput().checked;
	},
	
	/**
		Input 엘리먼트의 Check 여부를 설정한다.
		
		@method setChecked
		@param {Boolean} b 체크 할지 여부 (true : 체크, false : 체크안함)
		@param {Boolean} [bFireEvent=true] change 이벤트의 발생 여부
		@return {this} Input 엘리먼트의 Check 여부를 설정한 인스턴스 자신
	**/
	setChecked : function(b, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		var elInput = this.getInput(),
			bValue = elInput.checked;
		
		if (bValue != b) {
			elInput.checked = b;
			
			switch (elInput.type) {
				case "checkbox" :
					this.paint();
				break;
				case "radio" :
					var self = this;
					//name이 같은 input만 다시 그림
					jindo.$A(this.constructor._aInstances).forEach(function(oRadioButton){
						if (oRadioButton.getInput().name == elInput.name) {
							oRadioButton.paint();
						} 
					});
				break;
			}
			
			if (bFireEvent) {
				this._fireChangeEvent(b);
			}
		}
		
		return this;
	},
	
	_fireChangeEvent : function(b) {
		/**
			 값이 변경되면 발생
			
			@event change
			@param {String} 커스텀 이벤트명
			@param {Boolean} bChecked 체크 상태 값
			@example
				// change 커스텀 이벤트 핸들링 예제
				oCheckBox.attach("change", function(oCustomEvent) { ... });
		**/
		this.fireEvent("change", {
			bChecked : b
		});
	},
	
	/**
		CheckBox를 enable 시킨다.
		
		@method enable
		@return {this} CheckBox를 enable 시킨 인스턴스 자신
	**/
	enable : function() {
		this.getInput().disabled = false;
		this.paint();
		return this;
	},
	
	/**
		CheckBox를 disable 시킨다.
		
		@method disable
		@return {this} CheckBox를 disable 시킨 인스턴스 자신
	**/
	disable : function() {
		this.getInput().disabled = true;
		this.paint();
		return this;
	},
	
	_onClickInput : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var self = this;
		setTimeout(function(){ //Scope 안에서 input[type=checkbox]의 checked가 이상함!
			self._welWrapper.fireEvent("click");	
		}, 1);
	},
	
	_onClickWrapper : function(we) {
		var elInput = this._elInput;
		if (elInput.disabled || we.element === elInput) { /* Diabled거나 Label을 클릭했거나 키보드 스페이스로 직접 선택했을 때 */
			return;
		}
		elInput.focus();
		
		/**
			 값이 변경되기 전에 발생
			
			@event beforeChange
			@param {String} sType 커스텀 이벤트명
			@param {Boolean} bChecked 체크 상태 값
			@param {Function} stop stop 함수를 실행하게 되면 값이 변경되지 않는다.
			@example
				// beforeChange 커스텀 이벤트 핸들링 예제
				oCheckBox.attach("beforeChange", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("beforeChange", { bChecked : elInput.checked })) {
			this.setChecked(((elInput.type == "radio") ? true : !elInput.checked));
		}
	},
	
	_onFocusInput : function(we) {
		this._welWrapper.addClass(this.option('sClassPrefix') + 'focused'); 
	},
	
	_onBlurInput : function(we) {
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'focused');
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		
		this.$super._onActivate();

		this._welWrapper.addClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.attach(this._elInput, 'click');
		this.wfOnClickWrapper.attach(this._elWrapper, 'click');
		this.wfOnFocusInput.attach(this._elInput, 'focus');
		this.wfOnBlurInput.attach(this._elInput, 'blur');

	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.detach(this._elInput, 'click');
		this.wfOnClickWrapper.detach(this._elWrapper, 'click');
		this.wfOnFocusInput.detach(this._elInput, 'focus');
		this.wfOnBlurInput.detach(this._elInput, 'blur');
		
		this.$super._onDeactivate();
		
	},
	
	/**
		컴포넌트를 새로 그려준다. (HTMLComponent 공통메서드)
	**/
	_onPaint : function() {
		var sPrefix = this.option('sClassPrefix');
		
		if (this._elInput.disabled){
			this._welWrapper.addClass(sPrefix + 'disabled');	
		} else {
			this._welWrapper.removeClass(sPrefix + 'disabled');
		}
		
		if (this._elInput.checked){
			this._welSubstitute.addClass(sPrefix + 'checked');	
		} else {
			this._welSubstitute.removeClass(sPrefix + 'checked');
		}
	}
	
}).extend(jindo.HTMLComponent);
/**
	@fileOverview 리스트의 아이템들을 부드러운 움직임으로 이동시켜 볼 수 있도록하는 컴포넌트 
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	리스트의 아이템들을 부드러운 움직임으로 이동시켜 볼 수 있도록하는 컴포넌트
	
	@class jindo.Rolling
	@extends jindo.Component
	@uses jindo.Effect
	@uses jindo.Transition
	@keyword rolling, 롤링
**/
jindo.Rolling = jindo.$Class({
	/** @lends jindo.Rolling.prototype */
	
	_oTransition : null,

	/**
		Rolling 컴포넌트를 생성한다.
		
		@constructor
		@param {String | HTMLElement} el 리스트를 감싸고 있는 엘리먼트의 id 혹은 엘리먼트 자체  
		@param {Object} [htOption] 옵션객체
			@param {Number} [htOption.nFPS=50] 초당 롤링 이동을 표현할 프레임수
			@param {Number} [htOption.nDuration=800] transition이 진행 될 시간, 단위 ms
			@param {String} [htOption.sDirection="horizontal"] 롤링의 방향 설정.
			<ul>
			<li>"horizontal" : 가로</li>
			<li>"vertical" : 세로</li>
			</ul>
			@param {Function} [htOption.fEffect=jindo.Effect.linear] jindo.Effect 이펙트 함수
			@param {String} [htOption.sClassPrefix="rolling-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
		@example
			<xmp>
			<div id="horz_wrap">
				<ul>
					<li>첫번째</li>
					<li>두번째</li>
					<li>세번째</li>
					<li>네번째</li>
					<li>다섯번째</li>
					<li>여섯번째</li>
					<li>일곱번째</li>
					<li>여덟번째</li>
					<li>아홉번째</li>
					<li>마지막</li>
				</ul>
			</div>
			<script>
				new jindo.Rolling(jindo.$('horz_wrap'), {
					nFPS : 50, // (Number) 초당 롤링 이동을 표현할 프레임수
					nDuration : 400, // (ms) jindo.Effect, jindo.Transtition 참고
					sDirection : 'horizontal', // || 'vertical'
					fEffect : jindo.Effect.linear, //jindo.Effect 참고
				}).attach({
					beforeMove : function(oCustomEvent) {
						//oCustomEvent.element 어느 엘리먼트의 scrollLeft 가 바뀌는지
						//oCustomEvent.nIndex 몇번째 항목으로 이동하는지
						//oCustomEvent.nScroll 이동할 포지션
						//oCustomEvent.stop()시 이동하지 않음
					},
					afterMove : function(oCustomEvent) {
						//oCustomEvent.nIndex 몇번째 항목으로 이동하였는지
					}
				});
			</script>
			</xmp>
	**/
	$init : function(el, htOption) {
		this.option({
			nFPS : 50,
			nDuration : 800,
			sDirection : "horizontal",
			fEffect : jindo.Effect.linear,
			sClassPrefix : "rolling-"
		});
		
		this.option(htOption || {});

		this._el = jindo.$(el);
		
		var sListClassQuery = '.' + this.option('sClassPrefix') + 'list';
		
		this._bUsedClassPrefix = true;
		this._elList = jindo.$$.test(this._el, sListClassQuery) ? this._el : jindo.$$.getSingle('> ' + sListClassQuery, el);
		
		if (!this._elList) {
			this._elList = jindo.$$.test(this._el, 'ul, ol') ? this._el : jindo.$$.getSingle('> ul, > ol', el);
			this._bUsedClassPrefix = false;
		}
			
		this._oKeys = this.option('sDirection') == 'horizontal' ? {
			offsetWidth : 'offsetWidth',
			marginLeft : 'marginLeft',
			marginRight : 'marginRight',
			clientWidth : 'clientWidth',
			scrollLeft : 'scrollLeft'
		} : {
			offsetWidth : 'offsetHeight',
			marginLeft : 'marginTop',
			marginRight : 'marginBottom',
			clientWidth : 'clientHeight',
			scrollLeft : 'scrollTop'
		};

		this._initTransition();
	},
	
	_initTransition: function(){
		var self = this;
		this._oTransition = new jindo.Transition().fps(this.option("nFPS")).attach({
			end : function(oCustomEvent) {

				if (self._nItemCount) {
					var oKeys = self._oKeys;
					self._el[oKeys.scrollLeft] = self._getPosition(self.getIndex() % self._nItemCount);
				}

				/**
					이동한 후
					
					@event afterMove
					@param {String} sType 커스텀 이벤트명
					@param {Number} nIndex 이동한 항목의 리스트내 순서
					@example
						// 커스텀 이벤트 핸들링 예제
						oRolling.attach("afterMove", function(oCustomEvent) { ... });
				**/
				self.fireEvent("afterMove", { nIndex : self.getIndex() });
			}
		});
	},
	
	/**
		jindo.Transition 컴포넌트의 인스턴스를 가져온다.
		
		@method getTransition
		@return {jindo.Transition}
	**/
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
		리스트 엘리먼트를 구한다
		
		@method getList
		@return {HTMLElement} 리스트 엘리먼트 ul 또는 ol
	**/
	getList : function() {
		return this._elList;
	},
	
	/**
		리스트의 아이템(LI, 즉 자식 엘리먼트)들을 구한다.
		
		@method getItems
		@return {Array} LI 엘리먼트들의 배열
	**/
	getItems : function() {
		
		var sItemClassQuery = '.' + this.option('sClassPrefix') + 'item';
		return this._bUsedClassPrefix ? jindo.$$('> ' + sItemClassQuery, this._elList) : jindo.$$('> li', this._elList);
		
	},
	
	_offsetSize : function(el) {
		var eEl = jindo.$Element(el),
			oKeys = this._oKeys,
			nMarginLeft = parseInt(eEl.css(oKeys.marginLeft), 10) || 0,
			nMarginRight = parseInt(eEl.css(oKeys.marginRight), 10) || 0;
		return el[oKeys.offsetWidth] + nMarginLeft + nMarginRight;
	},
	
	/**
		현재 표시되고있는 LI의 인덱스를 구한다.
		
		@method getIndex
		@return {Number} 현재 표시되고있는 LI의 인덱스
	**/
	getIndex : function() {
		if (this.isMoving()) {
			return this._nMoveTo;
		}
		
		var el = this._el,
			oKeys = this._oKeys,
			nScroll = el[oKeys.scrollLeft],
			aItems = this.getItems(),
			nSize = 0,
			n = 0,
			nMinDistance = 99999999;

		for (var i = 0; i < aItems.length; i++) {
			var nDistance = Math.abs(nScroll - nSize);
			
			if (nDistance < nMinDistance) {
				nMinDistance = nDistance;
				n = i;
			}
			
			nSize += this._offsetSize(aItems[i]);
		}
		
		return n;
	},
	
	_getPosition : function (n) {
		var el = this._el,
			oKeys = this._oKeys,
			aItems = this.getItems(),
			nPos = 0, nSize = this._getSize();
		
		for (var i = 0; i < n; i++) {
			nPos += this._offsetSize(aItems[i]);
		}
		
		if (nPos + el[oKeys.clientWidth] > nSize) {
			nPos = nSize - el[oKeys.clientWidth];
		}
		
		return nPos;
	},
	
	_getSize : function() {
		var aItems = this.getItems(),
			nSize = 0;
			
		for (var i = 0; i < aItems.length; i++) {
			nSize += this._offsetSize(aItems[i]);
		}
		
		return (this._nSize = nSize);
	},
	
	_move : function(n) {
		var el = this._el,
			oKeys = this._oKeys,
			aItems = this.getItems(),
			nPos = this._getPosition(n),
			nSize = this._getSize();

		var htParam = {
			element : el, // 어느 엘리먼트의 scrollLeft 가 바뀌는지
			nIndex : n, // 몇번째 항목으로 이동하는지
			nScroll : nPos
		};
		
		/**
			이동하기 전
			
			@event beforeMove
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element scrollLeft또는 scrollTop이 바뀔 대상 엘리먼트
			@param {Number} nIndex 이동할 항목의 리스트내 순서
			@param {Number} nScroll 이동할 스크롤위치
			@param {Function} stop 수행시 이동하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oRolling.attach("beforeMove", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent('beforeMove', htParam) && el[oKeys.scrollLeft] != htParam.nScroll) {
			 
			var htDest = {};
			htDest[oKeys.scrollLeft] = this.option('fEffect')(htParam.nScroll);
			this._nMoveTo = n;
			
			this.getTransition().abort().start(this.option('nDuration'), htParam.element, htDest);
			return true;
		}
		return false;
	},
	
	/**
		n번째 아이템으로 이동한다.
		
		@method moveTo
		@param {Number} n 이동 할 위치
		@return {Boolean} 실제로 이동했는지 여부 
	**/
	moveTo : function(n) {
		n = Math.min(n, this.getItems().length - 1);
		n = Math.max(n, 0);
		return this._move(n);
	},

	/**
		뒤에서부터 n번째 아이템으로 이동한다.
		
		@method moveLastTo
		@param {Number} n 이동 할 위치
		@return {Boolean} 실제로 이동했는지 여부
	**/
	moveLastTo : function(n) {
		return this.moveTo(this.getItems().length - 1 - n);
	},

	/**
		현재 위치와 n만큼 떨어진 아이템으로 이동한다.
		
		@method moveBy
		@param {Number} n 이동 할 위치
		@return {Boolean} 실제로 이동했는지 여부
	**/
	moveBy : function(n) {
		return this.moveTo(this.getIndex() + n);
	},
	
	/**
		롤링이 진행중인지 여부를 가져온다.
		
		@method isMoving
		@return {Boolean}
	**/
	isMoving : function() {
		return this._oTransition.isPlaying();
	},
	
	/**
		리스트의 아이템들이 가려있는지 여부를 가져온다.
		
		@method isOverflowed
		@return {Boolean} 리스트의 아이템들이 가려있는지 여부
	**/
	isOverflowed : function() {
		return this._getSize() > this._el[this._oKeys.clientWidth];
	},
	
	/**
		롤링 영역 내에서 잘리지 않고 온전히 보여지는 아이템의 개수를 가져온다.
		
		@method getDisplayedItemCount
		@return {Number}
	**/
	getDisplayedItemCount : function() {
		var nDisplayed = 0,
			aItems = this.getItems(),
			nPos = 0;
		
		for (var i = 0; i < aItems.length; i++) {
			nPos += this._offsetSize(aItems[i]);
			if (nPos <= this._el[this._oKeys.clientWidth]) {
				nDisplayed++; 
			} else {
				break;
			}
		}
		
		return nDisplayed;
	}

}).extend(jindo.Component);/**
	@fileOverview 목록을 순환이동하는 롤링 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	jindo.CircularRolling 컴포넌트는 리스트의 아이템을 무한대로 순환하여 이동시키는 롤링 컴포넌트이다.
	
	@class jindo.CircularRolling
	@extends jindo.Rolling
	@keyword rolling, circular, 롤링, 순환, 회전
**/
jindo.CircularRolling = jindo.$Class({
	/**
		@constructor
		@param {String | HTMLElement} el 리스트를 감싸고 있는 엘리먼트의 id 혹은 엘리먼트 자체  
		@param {Object} [htOption] 옵션객체
			@param {Number} [htOption.nFPS=50] 초당 롤링 이동을 표현할 프레임수
			@param {Number} [htOption.nDuration=800] transition이 진행 될 시간, 단위 ms
			@param {String} [htOption.sDirection="horizontal"] 롤링의 방향 설정.
			<ul>
				<li>"horizontal" : 가로</li>
				<li>"vertical" : 세로</li>
			</ul>
			@param {Function} [htOption.fEffect=jindo.Effect.linear] jindo.Effect 이펙트 함수
			@param {String} [htOption.sClassPrefix="rolling-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
		@example
			var oCircularRolling = new jindo.CircularRolling(jindo.$("rolling"), {
				sDirection : "vertical"
			});
	**/
	$init : function() {
		this.refresh();
	},
	
	/**
		롤링 컴포넌트를 다시 로드한다. 리스트가 갱신되었을때 호출하여야한다.
		
		@method refresh
		@return {this} 리스트를 갱신한 인스턴스 자신
	**/
	refresh : function() {
		this.getTransition().abort();
		this._el[this._oKeys.scrollLeft] = 0;
		this._nDuplicateCount = 0;
		this._nItemCount = this.getItems().length;
		this._nDisplayedCount = this.getDisplayedItemCount();
		if (this.isOverflowed()) {
			this._nDuplicateCount = (this._nDisplayedCount <= (this._nItemCount / 2)) ? 1 : 2;
			this._duplicate(this._nDuplicateCount);
		}
		return this;
	},
	
	_duplicate : function(n) {
		var elList = this._elList,
			elDuplicatedList = jindo.$('<' + elList.tagName + '>'),
			sListInnerHTML = elList.innerHTML,
			aItem;

		var sItemClassQuery = '>' + (this._bUsedClassPrefix ? '.' + this.option('sClassPrefix') + 'item' : 'li');
		
		for (var i = 0; i < n; i++) {
			elDuplicatedList.innerHTML = sListInnerHTML;
			aItem = jindo.$$(sItemClassQuery, elDuplicatedList);
			for (var j = 0; j < aItem.length; j++) {
				elList.appendChild(aItem[j]);
			}
		}
	},
	
	_setStartPosition : function(n, nTo) {
		var oKeys = this._oKeys;
		var nNewPosition = n % (this._nItemCount) || 0;
		if (n + nTo < 0) {
			var nTimes = this._nDuplicateCount;
			if (nNewPosition + this._nDisplayedCount > this._nItemCount) {
				nTimes -= 1;
			} 
			nNewPosition += this._nItemCount * nTimes;
		}
		this._el[oKeys.scrollLeft] = this._getPosition(nNewPosition);
	},
	
	/**
		현재 위치와 n만큼 떨어진 아이템으로 이동한다. 
		롤링이 진행중일때에는 이동되지 않고 false를 리턴한다.
		
		@method moveBy
		@param {Number} n 얼마나 떨어진 아이템으로 이동할지 (음수와 양수 모두 사용 할 수 있음)
		@return {Boolean} 이동 성공 여부
	**/
	moveBy : function(n) {
		if (this.isMoving()) {
			return false;
		}
		
		/*
		if (Math.abs(n) > this._nDisplayedCount) {
			if (n > 0) {
				n = this._nDisplayedCount;
			} else {
				n = -this._nDisplayedCount;
			}
		}
		*/
		
		var bBig = (n >= this._nItemCount);
		
		n = n % this._nItemCount;
		if (bBig) { n += this._nItemCount; }
		
		this._setStartPosition(this.getIndex(), n);
		
		var nTarget = this.getIndex() + n;
		if (!this._move(nTarget)) {
			return false;
		}
		return true;
	}

}).extend(jindo.Rolling);
/**
	@fileOverview 클립보드를 컨트롤하는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/

/**
	플래시 객체를 사용하여 시스템 클립보드에 값을 설정하는 컴포넌트이다.
	
	@class jindo.Clipboard
	@extends jindo.Component
	
	@refer http://www.adobe.com/devnet/flashplayer/articles/fplayer10_security_changes.html Understanding the security changes in Flash Player 10
	@refer http://www.adobe.com/devnet/flashplayer/articles/fplayer10_uia_requirements.html User-initiated action requirements in Flash Player 10
	
	@keyword clipboard, 클립보드, flash
**/
jindo.Clipboard = jindo.$Class({
	/** @lends jindo.Clipboard.prototype */
	_aElement : null,
	_aData : null,
	_elOvered : null,
	_bFailed : true,
	
	/**
		@constructor
		
		@param {String} sFlashURL 클립보드를 제어할 플래시파일 주소
		@example
			<span id="foo">클립보드에 "http://naver.com/" 복사하기</span>
			<script>
				oClipboard = new jindo.Clipboard('../Sources/clipboard.swf').attach({
					load : function(oCustomEvent) {
						//클립보드 제어를 위한 Flash 파일이 로드 완료된 이후에 발생
						this.setData(jindo.$('foo'), 'http://naver.com/');
						this.setData(jindo.$('bar'), 'http://daum.net/');
					},
					copy: function(oCustomEvent){
						//마우스 클릭시 성공적으로 클립보드가 설정된 경우 발생
						alert(e.element + ' 를 눌러서 ' + e.data + ' 가 클립보드에 저장되었습니다');
					},
					failure: function(oCustomEvent){
						//마우스 클릭시 클립보드 설정에 실패한 경우 발생
						alert('실패 : ' + e.element + ' 를 눌렀지만 ' + e.data + ' 를 클립보드에 저장하지 못했습니다');
					},
					over : function(oCustomEvent){
					},
					out : function(oCustomEvent){
					},
					down : function(oCustomEvent){
					},
					up : function(oCustomEvent){
					}
				});
			</script>
	**/
	$init : function(sFlashURL) {
		this._sFlashURL = sFlashURL;
		var oStatic = jindo.Clipboard; //구버전 진도 (0.3.5 이하) jindo.$Class에는 constructor프로퍼티가 존재하지 않음
		var sFlashUID = this._sUnique = 'S' + new Date().getTime() + parseInt(Math.random() * 1000000000, 10);
		
		if (typeof oStatic._callbacks == "undefined") {
			oStatic._callbacks = {};
		}
		oStatic._callbacks[this._sUnique] = {
			click : jindo.$Fn(this._onFlashClick, this).bind(),
			mouseover : jindo.$Fn(this._onFlashMouseOver, this).bind(),
			mouseout : jindo.$Fn(this._onFlashMouseOut, this).bind(),
			mousedown : jindo.$Fn(this._onFlashMouseDown, this).bind(),
			mouseup : jindo.$Fn(this._onFlashMouseUp, this).bind(),
			load : jindo.$Fn(this._onFlashLoad, this).bind()
		};
		
		this._aElement = [];
		this._aData = [];
		this._agent = jindo.$Agent();
		
		this._initFlash();
		
		this._wfHandler = jindo.$Fn(function(we) {
			this._initFlash();
			var el = we.element;
			var htPosition = jindo.$Element(el).offset();
			this._setFlashPosSize(htPosition.left, htPosition.top, el.offsetWidth, el.offsetHeight);
			this._setClipboard(el, this._getData(el));
			this._elOvered = el;
		}, this);
		
	},
	
	_initFlash : function() {
		if (this._elDummy) {
			return;
		}
		var elDummy = this._elDummy = jindo.$('<div>');
		var sFlashUID = this._sUnique;
		
		elDummy.style.cssText = 'position:absolute !important; border:0 !important; padding:0 !important; margin:0 !important; overflow:visible !important; z-index:32000 !important;';
		document.body.insertBefore(elDummy, document.body.firstChild);
		
		if(this._agent.flash().version >= 11&&this._agent.navigator().ie){
			this._sFlashURL += "?"+Math.floor(Math.random() * 10000);
		}
		
		var sFlashHtml = this._getFlashHTML('CLIPBOARD' + sFlashUID, this._sFlashURL, 1, 1, {flashVars : { sUniq : sFlashUID }, wmode : 'transparent'});
		elDummy.innerHTML = sFlashHtml;
		jindo.$Fn(this._checkFailed, this).attach(elDummy, 'click');
	},

	_getFlashHTML : function(sId, sSwfPath, width, height, options) {

		var protocol = (location.protocol == "https:")?"https:":"http:";
	    // var classid = (jindo.$Agent().navigator().ie?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"':'');
	    var classid = 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';

	    options = options || {};
	    options.allowScriptAccess = options.allowScriptAccess || 'always';

	    var params = [], attrs = [], v;
	    for (var k in options) if (options.hasOwnProperty(k)) {
	    	v = options[k];
	    	if (k === 'flashVars') { v = jindo.$H(v).toQueryString(); }
	    	params.push('<param name="' + k + '" value="' + v + '" />');
	    	attrs.push(' ' + k + '="' + v + '"');
	    }

	    return [
	    	'<object tabindex="-1" id="'+sId+'" width="'+width+'" height="'+height+'" '+classid+' codebase="'+protocol+'//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0">',
		    	'<param name="movie" value="'+sSwfPath+'" />',
		    	params.join(''),
	    		'<embed tabindex="-1" name="'+sId+'" src="'+sSwfPath+'"',
	    		' type="application/x-shockwave-flash" pluginspage="'+protocol+'://www.macromedia.com/go/getflashplayer"',
	    		attrs.join(''),
	    		' width="'+width+'" height="'+height+'">',
	    		'</embed>',
	    	'</object>'
	    ].join('');

	},	
	
	_getFlash : function() {
		return document['CLIPBOARD' + this._sUnique] || document.all['CLIPBOARD' + this._sUnique];
	},
	
	_setFlashPosSize : function(nLeft, nTop, nWidth, nHeight) {
		var elDummy = this._elDummy;
		elDummy.style.left = nLeft + 'px';
		elDummy.style.top = nTop + 'px';
		
		var oFlash = this._getFlash();
		oFlash.width = nWidth;
		oFlash.height = nHeight;
		oFlash.style.width = nWidth + 'px';
		oFlash.style.height = nHeight + 'px';
	},
	
	/**
		특정 엘리먼트를 클릭하면 지정된 값을 클립보드에 저장하도록 설정한다.
		
		@method setData
		@remark setData메서드는 반드시 Flash 객체의 로드가 완료된 이후에 수행되어야한다. load 커스텀 이벤트핸들러 내에서 수행하는 것을 권장한다.
		@param {HTMLElement | String} el 지정할 엘리먼트 혹은 id
		@param {String} sData 저장할 값. 빈 값(null 또는 "" 또는 false)이면 설정된 값을 해제한다.
		@example
			oClipboard.attach({
				load : function(e) {
					//클립보드 제어를 위한 Flash 파일이 로드 완료된 이후에 발생
					this.setData(jindo.$('foo'), 'http://naver.com/');
					this.setData(jindo.$('bar'), 'http://daum.net/');
				}
			});
	**/
	setData : function(el, sData) {
		el = jindo.$(el);
		
		var nIndex = jindo.$A(this._aElement).indexOf(el),
			bExist = nIndex != -1;
		
		if (bExist && (!sData && sData !== '')) { // 지워야 하는 상황이면
			this._wfHandler.detach(el, 'mousemove');
			
			this._aElement.splice(nIndex, 1);
			this._aData.splice(nIndex, 1);

			this._setFlashPosSize(0, 0, 1, 1);
			return;
		}
		
		if (!bExist) { 
			// 새로 만들어야 하는 상황
			this._wfHandler.attach(el, 'mousemove');
			this._aElement.push(el);
			this._aData.push(sData);
		} else {
			// 바꿔야 하는 상황
			this._aData[nIndex] = sData;
		}
		this._setClipboard(el, sData);
	},
	
	_getData : function(el) {
		var nIndex = jindo.$A(this._aElement).indexOf(el);
		return this._aData[nIndex];
	},
	
	_setClipboard : function(el, sData) {
		var oFlash = this._getFlash();
		var sCursor = (jindo.$Element(el).css('cursor') || '').toUpperCase();
		var bHandCursor = sCursor == 'POINTER' || sCursor == 'HAND';
		
		try {
			oFlash.setClipboardData(sData);
			oFlash.setClipboardOptions({ cursor : bHandCursor ? 'pointer' : 'default' });
			
			this._sAppliedData = sData;
			this._bFailed = false;
		} catch(e) {
			this._bFailed = true;
		}
	},
	
	_checkFailed : function() {
		if (this._bFailed) {
			// 예전에 externalInterface 쓸때 실패했으면
			/**
				마우스 클릭시 클립보드 설정에 실패한 경우 발생
				
				@event failure
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
				@param {Object} data 클립보드에 복사된 마지막 데이터
				@example
					// 커스텀 이벤트 핸들링 예제
					oComponent.attach("failure", function(oCustomEvent){
						alert('실패 : ' + e.element + ' 를 눌렀지만 ' + e.data + ' 를 클립보드에 저장하지 못했습니다');
					});
			**/
			this.fireEvent('failure', {
				element: this._elOvered,
				data: this._lastestData
			});
		}
	},
	
	_onFlashClick : function(sData) {
		/**
			마우스 클릭시 성공적으로 클립보드가 설정된 경우 발생
			
			@event copy
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
			@param {Object} data 복사에 성공한 데이터
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("copy", function(oCustomEvent){
					alert(e.element + ' 를 눌러서 ' + e.data + ' 가 클립보드에 저장되었습니다');
				});
		**/
		this.fireEvent('copy', { element : this._elOvered, data : sData }); 
	},
	_onFlashMouseOver : function() { 
		/**
			클립보드 액션이 걸린 엘리먼트를 마우스 오버했을때
			
			@event over
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oClipboard.attach("over", function(oCustomEvent){ ... });
		**/
		this.fireEvent('over', { element : this._elOvered }); 
	},
	_onFlashMouseOut : function() {
		/**
			클립보드 액션이 걸린 엘리먼트에 마우스 아웃 했을때
			
			@event out
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oClipboard.attach("out", function(oCustomEvent){ ... });
		**/
		this.fireEvent('out', { element : this._elOvered }); 
	},
	_onFlashMouseDown : function() {
		/**
			클립보드 액션이 걸린 엘리먼트에 마우스 다운 했을때
			
			@event down
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oClipboard.attach("down", function(oCustomEvent){ ... });
		**/
		this.fireEvent('down', { element : this._elOvered }); 
	},
	_onFlashMouseUp : function() {
		/**
			클립보드 액션이 걸린 엘리먼트에 마우스 업 했을때
			
			@event up
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 클립보드 이벤트가 걸린 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oClipboard.attach("up", function(oCustomEvent){ ... });
		**/
		this.fireEvent('up', { element : this._elOvered }); 
	},
	_onFlashLoad : function() {
		/**
			클립보드 제어를 위한 Flash 파일이 로드 완료된 이후에 발생
			
			@event load
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("load", function(oCustomEvent){
					this.setData(jindo.$('foo'), 'http://naver.com/');
					this.setData(jindo.$('bar'), 'http://daum.net/');
				});
		**/
		this.fireEvent('load'); 
	}
}).extend(jindo.Component);
/**
	@fileOverview Data Bridge Component
	@author TarauS
	@version 1.14.0
**/
/**
	jindo.DataBridge 컴포넌트는 flash를 매개체로 같은 PC내의 여러 브라우저간에 통신을 가능하게 함.
	
	@class jindo.DataBridge
	@extends jindo.Component
	
	@keyword data, bridge, flash, 통신
**/
jindo.DataBridge = jindo.$Class({
	/** @lends jindo.DataBridge.prototype */
	/**
		이벤트 핸들러 저장 객체
		@type {HashTable}
	**/
	_htEvent : {},
	
	/**
		스태틱 메서드 저장 객체
		@private 
	**/
	$static : {
		/**
			플래시에서 처리 상황을 로깅하기 위한 콜백함수
			
			@method log
			@static
			@param {String} sFlashId 메시지를 전달할 플래시 객체의 아이디
			@param {String} sMessage 로깅 메시지
		**/
		log : function(sFlashId, sMessage){
			if(sFlashId && sMessage){
				this.getComponentInstance(sFlashId)._onLog(sMessage);
			}else{
				alert("Parameter is wrong!!");
			}
		},
		
		/**
			다른 클라이언트에서 온 데이터를 수신하기 위한 콜백함수
			
			@method onReceive
			@static
			@param {String} sFlashId 데이터를 전달할 플래시 객체의 아이디
			@param {String} sSenderId 데이터를 송신한 클라이언트의 아이디
			@param {Variant} vData 다른 클라이언트에서 온 데이터
		**/
		onReceive : function(sFlashId, sSenderId, vData){
			if(sFlashId && sSenderId && vData){
				this.getComponentInstance(sFlashId)._onReceiveData(sSenderId, vData);
			}else{
				alert("Parameter is wrong!!");
			}
		},
		
		/**
			플래시 객체에 해당하는 인스턴스를 찾아서 리턴함
			
			@method getComponentInstance
			@static
			@param {String} sFlashId 문서에 삽입된 플래시 객체의 아이디
			@return {jindo.DataBridge} sFlashId에 해당하는 플래시를 사용하는 DataBridge 인스턴스
		**/
		getComponentInstance : function(sFlashId){
			var aInstanceList = this._aInstances;
			for(var i=0; i<aInstanceList.length; i++){
				if(sFlashId == aInstanceList[i].getFlashObjectId()){
					return aInstanceList[i];
				}
			}
		}
	},
	
	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션 객체
			@param {String} [htOption.sSwfPath="data_bridge.swf"] 플래시 파일 경로
			@param {Number} [htOption.nRetryLimit=3] flashvars로 전달할 retryLimit
		@example
			var oDataBridge = new jindo.DataBridge({
				"sServiceId" : "deskhome",
				"nRetryCount" : 3
			});
			
			oDataBridge.attach("receive", function(oCustomEvent){
				console.log(oCustomEvent.vData);
			});
	**/
	$init : function(htOption){
		(this.constructor._aInstances = this.constructor._aInstances || []).push(this);
		this.option({
			"sSwfPath" : "data_bridge.swf",
			"nRetryLimit" : 3
		});
		this.option(htOption);
		this._attachEvent();
		this._createFlashObject();
	},
	
	/**
		이벤트 핸들러 등록
	**/
	_attachEvent : function(){
		this._htEvent["beforeunload"] = jindo.$Fn(this.destroy, this).attach(window, "beforeunload");
	},
	
	/**
		클라이언트들과 통신을 담당할 플래시 객체를 동적으로 생성
	**/
	_createFlashObject : function(){
		this._sFlashId = 'data_bridge_'+(new Date()).getMilliseconds()+Math.floor(Math.random()*100000);
		var welFlashContainer = jindo.$Element('<div style="position:absolute;top:-1000px;left:0px">');
		var sFlashVars = "serviceId="+this.option("sServiceId")+"&logHandler=jindo.DataBridge.log&onReceiveHandler=jindo.DataBridge.onReceive&flashId="+this._sFlashId+"&retryLimit="+this.option("nRetryLimit");
		welFlashContainer.appendTo(document.body);
		welFlashContainer.html('<object id="'+this._sFlashId+'" width="1" height="1" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"><param name="flashvars" value="'+sFlashVars+'"><param name="movie" value="'+this.option("sSwfPath")+'"><param name = "allowScriptAccess" value = "always" /><embed name="'+this._sFlashId+'" src="'+this.option("sSwfPath")+'" flashvars="'+sFlashVars+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" width="1" height="1" allowScriptAccess="always" swLiveConnect="true"></embed></object>');
	},
	
	/**
		클라이언트들과 통신을 담당하기 위해 문서에 삽입된 플래시 객체를 리턴
		
		@return {Element} 플래시 객체
	**/
	_getFlashObject : function(){
		return document[this._sFlashId] || jindo.$(this._sFlashId);
	},
	
	/**
		클라이언트들과 통신을 담당할 플래시 객체의 엘리먼트 아이디를 리턴
		
		@method getFlashObjectId
		@return {String} 플래시 객체의 엘리먼트 아이디
	**/
	getFlashObjectId : function(){
		return this._sFlashId;
	},
	
	/**
		클라이언트 아이디를 리턴
		
		@method getClientId
		@return {String} 클라이언트 아이디
	**/
	getClientId : function(){
		return this.option("sServiceId")+"_"+this._sFlashId;
	},
	
	/**
		다른 클라이언트들에게 vData를 전달
		
		@method send
		@param {Variant} vData 전달할 데이터
		@return {this} DataBridge 인스턴스 자신
		@remark 클래스 인스턴스 생성 후, 플래시 객체가 문서에 삽입되기까지 시간이 걸리기에, send 메서드는 특정 시간 이후에 사용해야 함
	**/
	send : function(vData){
		if(vData){
			try{
				this._getFlashObject().send(vData);
			}catch(e){
				alert("Flash object is not ready!!");
			}
		}else{
			alert("vData parameter is null!!");	
		}
		return this;
	},
	
	/**
		다른 클라이언트로부터 데이터를 수신했을 때, 수행될 콜백 함수
		
		@param {String} sSenderId 데이터를 송신한 클라이언트의 아이디
		@param {Variant} vData 전달받은 데이터
		@remark 데이터 수신 후, receive라는 사용자 이벤트를 발생 시킴
	**/
	_onReceiveData : function(sSenderId, vData){
		this.fireEvent("receive", {
			"sSenderId" : sSenderId,
			"vData" : vData
		});
	},
	
	/**
		플래시 내에서의 처리 상황을 로깅하기 위한 콜백 함수
		
		@param {String} sMessage 로깅 메시지
	**/
	_onLog : function(sMessage){
		this.fireEvent("log", {
			"sMessage" : sMessage
		});
	},
	
	/**
		다른 클라이언트들과의 로컬 연결을 해제 함
	**/
	_close : function(){
		this._getFlashObject().close();
	},
	
	/**
		이벤트 핸들러 해제
	**/
	_detachEvent : function(){
		this._htEvent["beforeunload"].detach(window, "beforeunload");
	},
	
	getLocalData : function(){
		
	},
	
	setLocalData : function(){
		
	},
	
	resetLocalData : function(){
		
	},
	
	/**
		모듈 소멸자
		
		@method destroy
	**/
	destroy : function(){
		this._close();
		this._detachEvent();
		this._htEvent = {};
		jindo.$Element(this._getFlashObject()).leave();
		
		var aInstances = this.constructor._aInstances || [];
		var nIndex = jindo.$A(aInstances).indexOf(this);
		
		if (nIndex > -1) { aInstances.splice(nIndex, 1); }
	}
}).extend(jindo.Component);/**
	@fileOverview 특정 엘리먼트 및 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 역할을 하는 컴포넌트
	@version 1.14.0
**/
/**
	특정 엘리먼트와 지정한 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 컴포넌트
	
	@class jindo.LayerManager
	@extends jindo.UIComponent
	@uses jindo.Timer
	
	@keyword layer, manager, 레이어, 관리
**/
jindo.LayerManager = jindo.$Class({
	/** @lends jindo.LayerManager.prototype */
	
	_bIsActivating  : false,
	_bIsHiding : false, //hide() 메서드가 Timer로 수행되고 있는지의 여부
	_bIsShowing : false,
	_aLink : null,
	
	/**
		LayerManager 컴포넌트를 초기화한다.
		@constructor
		@param {HTMLElement | String} el 숨기고자하는 레이어 엘리먼트 (혹은 id)
		@param {Object} [htOption] 추가 옵션
			@param {String} [htOption.sCheckEvent="click"] 레이어가 숨김동작을 확인할 이벤트 종류. 이 이벤트는 document.body에 바인딩된다. 이벤트 명은 on을 제외하고 입력한다. 예를들어 레이어에서 커서가 벗어나 document.body에 마우스오버되었을 경우 레이어가 닫히게 하고 싶은 경우 "mouseover"로 지정한다. ("mouseout" 아님)
			@param {Number} [htOption.nCheckDelay=100] 레이어 숨김여부를 확인하기 위한 지연시간. sCheckEvent옵션으로 정의된 이벤트가 발생하고 난 후, 지정된 지연시간 전에 link된 엘리먼트에 mouseover되는 경우 레이어가 숨겨지지 않고 취소 된다. 이때 ignore 커스텀 이벤트가 발생한다.<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nShowDelay=0] 레이어가 보여지기까지의 지연시간<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nHideDelay=100] 레이어가 숨겨지기까지의 지연시간<br/>- 단위는 ms(1000이 1초)
	**/
	$init: function(el, htOption){
		this.option({
			sCheckEvent: "click",
			nCheckDelay: 100,
			nShowDelay: 0,
			nHideDelay: 100
		});
		
		this.option(htOption || {});
		this.setLayer(el);
		
		this._aLink = [];
		this._oShowTimer = new jindo.Timer();
		this._oHideTimer = new jindo.Timer();
		this._oEventTimer = new jindo.Timer();
		this._wfOnEvent = jindo.$Fn(this._onEvent, this);
		this.getVisible();
		this.activate();
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		this._wfOnEvent.attach(document, this.option("sCheckEvent"));
	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		this._wfOnEvent.detach(document, this.option("sCheckEvent"));
	},
	
	/**
		Layer가 보여지고 있는지 여부를 가져온다.
		
		@method getVisible
		@return {Boolean}
	**/
	getVisible: function(){
		return this._wel.visible();
	},
	
	_check: function(el){
		var wel = jindo.$Element(el);
		for (var i = 0, elLink, welLink; (elLink = this._aLink[i]); i++) {
			welLink = jindo.$Element(elLink);
			if (welLink) {
				elLink = welLink.$value();
				if (elLink && wel && (el == elLink || wel.isChildOf(elLink))) {
					return true;
				} 
			}
		}
		return false;
	},
	
	_find: function(el){
		for (var i = 0, elLink; (elLink = this._aLink[i]); i++) {
			if (elLink == el) {
				return i;
			} 
		}
		return -1;
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 가져온다.
		
		@method getLayer
		@return {HTMLElement} 
	**/
	getLayer : function() {
		return this._el;
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 설정한다.
		
		@method setLayer
		@param {HTMLElement} el 레이어 엘리먼트
		@return {this} 
	**/
	setLayer : function(el) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		return this;
	},
	
	/**
		link된 엘리먼트 배열을 가져온다.
		
		@method getLinks
		@return {Array}
	**/
	getLinks : function() {
		return this._aLink;
	},
	
	/**
		link할 엘리먼트 배열을 설정한다.
		
		@method setLinks
		@param {Array} a 엘리먼트 배열
		@return {this} 인스턴스 자신
	**/
	setLinks : function(a) {
		this._aLink = jindo.$A(a).unique().$value();
		return this;
	},
	
	/**
		생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트를 지정한다
		
		@method link
		@param {vElement} vElement 이벤트를 무시할 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
		@return {this} 인스턴스 자신
		@example
			o.link(jindo.$("one"), "two", oEl);
	**/
	link: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.link(arguments[i]);
			}
			return this;
		}
		
		if (this._find(vElement) != -1) {
			return this;
		} 
		
		this._aLink.push(vElement);
		return this;
	},
	
	/**
		생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트 지정한 것을 제거한다
		
		@method unlink
		@param {vElement} vElement 이벤트가 무시된 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
		@return {this} 인스턴스 자신
		@example
			o.unlink(jindo.$("one"), "two", oEl);
	**/
	unlink: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.unlink(arguments[i]);
			}
			return this;
		}
		
		var nIndex = this._find(vElement);
		if (nIndex > -1) {
			this._aLink.splice(nIndex, 1);
		}
		
		return this;
	},
	
	_fireEventBeforeShow : function() {
		/**
			레이어를 보여주기 전에 발생
			
			@event beforeShow
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@param {Function} stop 레이어 보여주는 것을 중단하는 메서드
			@example
				// beforeShow 커스텀 이벤트 핸들링
				oLayerManager.attach("beforeShow", function(oCustomEvent) { ... });
			@example
				// 레이어가 보여지지 않도록 처리
				oLayerManager.attach("beforeShow", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		return this.fireEvent("beforeShow", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_fireEventShow : function() {
		this._bIsShowing = false;
		/**
			레이어가 화면에 나타나는 것이 끝난 후 발생
			
			@event show
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@example
				// show 커스텀 이벤트 핸들링
				oLayerManager.attach("show", function(oCustomEvent) { ... });
		**/
		this.fireEvent("show", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_fireEventBeforeHide : function() {
		/**
			레이어를 감추기 전에 발생
			
			@event beforeHide
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@param {Function} stop 레이어를 감추는 것을 중단하는 메서드
			@example
				// beforeHide 커스텀 이벤트 핸들링
				oLayerManager.attach("beforeHide", function(oCustomEvent) { ... });
			@example
				// 레이어가 감춰지지 않도록 처리
				oLayerManager.attach("beforeHide", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		var bRet = this.fireEvent("beforeHide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
		
		if (!bRet) { this._bIsHiding = false; }
		return bRet;
	},
	
	_fireEventHide : function() {
		this._bIsHiding = false;
		/**
			레이어가 감춰진 후 발생
			
			@event hide
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@example
				// hide 커스텀 이벤트 핸들링
				oLayerManager.attach("hide", function(oCustomEvent) { ... });
		**/
		this.fireEvent("hide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_show: function(fShow, nDelay){
		var self = this;
		
		this._oEventTimer.abort();
		this._bIsShowing = true;
		this._bIsHiding = false;

		if (nDelay <= 0) { self._oHideTimer.abort(); }
		this._oShowTimer.start(function() {
			fShow();
		}, nDelay);
	},
	
	_hide: function(fHide, nDelay){
		var self = this;

		this._bIsShowing = false;
		this._bIsHiding = true;
		
		if (nDelay <= 0) { self._oShowTimer.abort(); }
		this._oHideTimer.start(function() {
			fHide();
		}, nDelay);
	},
	
	/**
		레이어를 보여준다.
		
		@method show
		@param {Number} nDelay 레이어를 보여줄 때의 지연시간을 지정 (생략시 옵션으로 지정한 nShowDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	show : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		var self = this;
		this._show(function(){
			if (!self.getVisible()) {
				if (self._fireEventBeforeShow()) {
					self._wel.show();
					self._fireEventShow();
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
		레이어를 숨긴다.
		
		@method hide
		@param {Number} nDelay nDelay 레이어를 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 nHideDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	hide : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		var self = this;
		this._hide(function(){
			if (self.getVisible()) {
				if (self._fireEventBeforeHide()) {
					self._wel.hide();
					self._fireEventHide();
				}
			}
		}, nDelay);
		return this;
	},
	
	/**
		레이어를 보여주거나 숨기도록 요청한다.
		
		@method toggle
		@param {Number} nDelay 레이어를 보여주거나 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 showDelay/hideDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	toggle: function(nDelay){
		if (!this.getVisible() || this._bIsHiding) {
			this.show(nDelay || this.option("nShowDelay"));
		} else {
			this.hide(nDelay || this.option("nHideDelay"));
		}
		return this;
	},
	
	_onEvent : function(we){
		var el = we.element,
			self = this;
		
		this._oEventTimer.start(function() {
			if (!self._bIsHiding && self.getVisible()) {
				if (self._check(el)) { // hide()수행중이 아니고 links 객체들 안에서 발생한거면 무시
					if (!self._bIsShowing) {
						/**
							sCheckEvent가 발생했으나 레이어를 숨기지 않도록 무시된 경우에 발생
							
							@event ignore
							@param {String} sType 커스텀 이벤트명
							@param {Array} aLinkedElement link된 엘리먼트들
							@param {Element} elLayer 보여지고 감춰지는 대상 레이어
							@param {String} sCheckEvent 발생된 이벤트 타입
							@example
								// ignore 커스텀 이벤트 핸들링
								oLayerManager.attach("ignore", function(oCustomEvent) { ... });
						**/
						self.fireEvent("ignore", {
							sCheckEvent : self.option("sCheckEvent")
						});
						self._oHideTimer.abort();
						self._bIsHiding = false;
					}
				} else { //이벤트에 의해 hide()
					//mousedown시 disabled된 input일 경우 el이 제대로 리턴되지 않는 IE버그 수정
					// [JINDOSUS-1630] 오페라에서 키보드 사용시 OPTION 에서 mousedown 이벤트가 발생하는 버그 회피
					if (typeof el.tagName !== "undefined" && el.tagName !== 'OPTION') {
						self.hide();
					}
				}
			}
		}, this.option("nCheckDelay"));	//link된 레이어 내를 클릭해서 레이어를 닫으려하는 경우 처리
	}
}).extend(jindo.UIComponent);/**
	@fileOverview 특정 엘리먼트로부터 상대적인 레이어의 위치를 구한다. 
	@author senxation
	@version 1.14.0
**/

/**
	레이어를 지정된 엘리먼트에 상대적으로 위치시켜주는 컴포넌트
	
	@class jindo.LayerPosition
	@extends jindo.Component

	@remark
		위치를 설정할 레이어 엘리먼트는 document.body의 바로 아래에 존재해야야 한다.
		그렇지 않을 경우 강제로 document.body로 이동된다.
	
	@keyword layer, position, 레이어, 위치
**/
jindo.LayerPosition = jindo.$Class({
	/** @lends jindo.LayerPosition.prototype */

	/**
		컴포넌트를 생성한다.
		@constructor  
		@param {HTMLElement} el 기준이 되는 엘리먼트, document.body도 가능하다
		@param {HTMLElement} elLayer 위치를 설정할 레이어 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sPosition="outside-bottom"] 레이어를 띄울 위치를 설정, 총 17가지 위치 설정 가능.
			<ul>
			<li>"outside-top-left"</li>
			<li>"outside-top"</li>
			<li>"outside-top-right"</li>
			<li>"outside-right"</li>
			<li>"outside-bottom-right"</li>
			<li>"outside-bottom"</li>
			<li>"outside-bottom-left"</li>
			<li>"outside-left"</li>
			<li>"inside-top-left"</li>
			<li>"inside-top"</li>
			<li>"inside-top-right"</li>
			<li>"inside-right"</li>
			<li>"inside-bottom-right"</li>
			<li>"inside-bottom"</li>
			<li>"inside-bottom-left"</li>
			<li>"inside-left"</li>
			<li>"inside-center"</li>
			</ul>
			@param {String} [htOption.sAlign="left"] 레이어의 위치가 top/bottom일 때 좌우 정렬 값.
			<ul>
			<li>"left"</li>
			<li>"center"</li>
			<li>"middle"</li>
			</ul>
			@param {String} [htOption.sValign=""] 레이어의 위치가 left/right일 때 상하 정렬 값.
			<ul>
			<li>"top"</li>
			<li>"middle"</li>
			<li>"bottom"</li>
			</ul>
			@param {Number} [htOption.nTop=0] 기준 레이어와의 y좌표 차이
			@param {Number} [htOption.nLeft=0] 기준 레이어와의 x좌표 차이
			@param {Boolean} [htOption.bAuto=false] 자동 정렬 여부. 스크롤과 브라우저창의 크기가 변경되거나 스크롤될 때 레이어 위치를 다시 조정한다.
			@param {Boolean} [htOption.bPositionOnload=true] 로드시에 setPosition() 수행 여부.
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 활성화 여부. 이 옵션을 false로 설정하였을 경우, activate 메서드를 이용해 활성화 시킬 수 있다.

		@example
			var oLayerPosition = new jindo.LayerPosition(jindo.$("center"), jindo.$("layer26"), { 
				sPosition: "outside-bottom", //레이어를 띄울 위치. 총 17가지의 위치를 가질 수 있다.
				sAlign: "left", //레이어의 위치가 top/bottom일 때 좌우 정렬 값 "left" || "center" || "middle" 
				sValign: "", //레이어의 위치가 left/right일 때 상하 정렬 값 "top" || "middle" || "bottom"
				nTop: 0, //기준 레이어와의 y좌표의 차이
				nLeft: 0, //기준 레이어와의 x좌표의 차이
				bAuto: false, //자동정렬 여부. 스크롤과 브라우저창의 크기가 변경될 때 레이어 위치를 다시 조정한다.
				bPositionOnload: true //로드시에 setPosition() 수행 여부
			}).attach({
				beforeAdjust : function(oCustomEvent){
					//bAuto 옵션에 의해 자동으로 위치가 조정되기 전에 발생
					//이벤트 객체 oCustomEvent = {
					//	elLayer : {HTMLElement} 레이어 엘리먼트
					//	htCurrentPosition : {HashTable} 현재 위치
					//	htAdjustedPosition : {HashTable} 이동될 위치
					//}
					//oCustomEvent.stop(); 수행시 조정되지 않음
				},
				adjust : function(oCustomEvent){
					//bAuto 옵션에 의해 자동으로 위치가 조정된 이후에 발생
					//이벤트 객체 oCustomEvent = {
					//	elLayer : {HTMLElement} 레이어 엘리먼트
					//	htCurrentPosition : {HashTable} 조정된 현재 위치
					//}
				}
			});
		@example
			htOption.sPosition = "outside-top-left" || "outside-top" || "outside-top-right" || "outside-right" || "outside-bottom-right" || "outside-bottom" || "outside-bottom-left" || "outside-left" || "inside-top-left" || "inside-top" || "inside-top-right" || "inside-right" || "inside-bottom-right" || "inside-bottom" || "inside-bottom-left" || "inside-left" || "inside-center"
	**/
	$init: function(el, elLayer, htOption){
		this.option({
			sPosition: "outside-bottom",
			sAlign: "left",
			sValign: "",
			nTop: 0,
			nLeft: 0,
			bAuto: false,
			bPositionOnload: true,
			bActivateOnload: true
		});
		this.option(htOption || {});
		this.setElement(el);
		if (elLayer) {
			this.setLayer(elLayer);
		}
		
		this._wfSetPosition = jindo.$Fn(function(){
			var el = this._elLayer;
			if (el && this._welLayer.visible()){
				/**
					bAuto 옵션 값이 true일 때 자동으로 위치가 조정되기 전 발생
					
					@event beforeAdjust
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elLayer 레이어 엘리먼트
					@param {Object} htCurrentPosition 현재 위치
						@param {Number} htCurrentPosition.nTop 가로 위치
						@param {Number} htCurrentPosition.nLeft 세로 위치
					@param {Object} htAdjustedPosition 이동될 위치
						@param {Number} htAdjustedPosition.nTop 가로 위치
						@param {Number} htAdjustedPosition.nLeft 세로 위치
					@example
						// beforeAdjust 커스텀 이벤트 핸들링
						oLayerPosition.attach("beforeAdjust", function(oCustomEvent) { ... });
					@example
						// 레이어 위치 조정되지 않도록 처리
						oLayerPosition.attach("beforeAdjust", function(oCustomEvent) {
							oCustomEvent.stop();
						});
				**/
				if (this.fireEvent("beforeAdjust", {
						elLayer : el,
						htCurrentPosition : this.getCurrentPosition(),
						htAdjustedPosition : this._adjustPosition(this.getCurrentPosition())
					})) {
					this.setPosition();
					/**
						bAuto 옵션 값이 true일 때 자동으로 위치가 조정된 이후에 발생
						
						@event adjust
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elLayer 레이어 엘리먼트
						@param {Object} htCurrentPosition 조정된 현재 위치
							@param {Number} htCurrentPosition.nTop 가로 위치
							@param {Number} htCurrentPosition.nLeft 세로 위치
						@example
							// adjust 커스텀 이벤트 핸들링
							oLayerPosition.attach("adjust", function(oCustomEvent) { ... });
					**/
					this.fireEvent("adjust", {
						elLayer : el,
						htCurrentPosition : this.getCurrentPosition()
					});
				}
			}
		}, this);

		if (this.option('bPositionOnload')) {
			this._wfSetPosition.bind().call();
		}

		if (this.option('bActivateOnload')) {
			this.activate();
		}
		
	},

	_onActivate : function() {
		if (this.option("bAuto")) {
			this._wfSetPosition.attach(window, "scroll").attach(window, "resize");
			this._attached = true;
		}
	},

	_onDeactivate : function() {
		if (this._attached) {
			this._wfSetPosition.detach(window, "scroll").detach(window, "resize");
			this._attached = false;
		}
	},	
	
	/**
		기준 엘리먼트를 구한다.
		
		@method getElement
		@return {HTMLElement}
	**/
	getElement : function() {
		return this._el;
	},
	
	/**
		기준 엘리먼트를 설정한다.
		
		@method setElement
		@param el {HTMLElement}
		@return {this} 인스턴스 자신
	**/
	setElement : function(el) {
		this._wel = this._el = jindo.$(el);
		if (this._el) {
			this._wel = jindo.$Element(el);
		}
		
		return this;
	},
	
	/**
		레이어 엘리먼트를 구한다.
		
		@method getLayer
		@return {HTMLElement}
	**/
	getLayer : function() {
		return this._elLayer;
	},
	
	/**
		레이어 엘리먼트를 설정한다. 설정된 엘리먼트는 document.body에 append된다.
		
		@method setLayer
		@param elLayer {HTMLElement || String} 레이어엘리먼트 또는 엘리먼트의 id
		@return {this} 인스턴스 자신
	**/
	setLayer : function(elLayer) {
		this._elLayer = jindo.$(elLayer);
		this._welLayer = jindo.$Element(elLayer);
		if (this._elLayer.parentNode != document.body) {
			//document.body.appendChild(this._elLayer);
			document.body.insertBefore(this._elLayer, document.body.firstChild);
		}
		return this;
	},
	
	_isPosition : function(htOption, sWord) {
		if (htOption.sPosition.indexOf(sWord) > -1) {
			return true;
		}
		return false;
	},
	
	_setLeftRight : function (htOption, htPosition){
		var el = this.getElement(),
			elLayer = this.getLayer(),
			nWidth = el.offsetWidth,
			nLayerWidth = elLayer.offsetWidth;
			
		if (el == document.body) {
			nWidth = jindo.$Document().clientSize().width;
		}
		
		var bLeft = this._isPosition(htOption, "left"),
			bRight = this._isPosition(htOption, "right"),
			bInside = this._isPosition(htOption, "inside");
		
		
		if (bLeft) {
			if (bInside) {
				htPosition.nLeft += htOption.nLeft;
			} else {
				htPosition.nLeft -= nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;					
			}
		} else if (bRight) {
			htPosition.nLeft += nWidth;
			if (bInside) {
				htPosition.nLeft -= nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;
			} else {
				htPosition.nLeft += htOption.nLeft;
			}
		} else {
			if (htOption.sAlign == "left") {
				htPosition.nLeft += htOption.nLeft;	
			}
			
			if (htOption.sAlign == "center") {
				htPosition.nLeft += (nWidth - nLayerWidth) / 2;
			}
				
			if (htOption.sAlign == "right") {
				htPosition.nLeft += nWidth - nLayerWidth;
				htPosition.nLeft -= htOption.nLeft;	
			}
		}
		return htPosition;
	},
	
	_setVerticalAlign : function (htOption, htPosition) {
		var el = this.getElement(),
			elLayer = this.getLayer(),
			nHeight = el.offsetHeight,
			nLayerHeight = elLayer.offsetHeight;
			
		if (el == document.body) {
			nHeight = jindo.$Document().clientSize().height;
		}
		
		switch (htOption.sValign) {
			case "top" :
				htPosition.nTop += htOption.nTop;	
			break;
			case "middle" :
				htPosition.nTop += (nHeight - nLayerHeight) / 2;
			break;
			case "bottom" :
				htPosition.nTop += nHeight - nLayerHeight - htOption.nTop;
			break;
		}
		
		return htPosition;
	},
	
	_adjustScrollPosition : function(htPosition) {
		/* 기준 엘리먼트가 body인 경우 scroll 포지션에 따른 보정 */
		if (this.getElement() == document.body) {
			var htScrollPosition = jindo.$Document().scrollPosition();
			htPosition.nTop += htScrollPosition.top;	
			htPosition.nLeft += htScrollPosition.left;
		}
		return htPosition;
	},
	
	/**
		옵션에 해당하는 레이어의 위치를 구한다.
		
		@method getPosition
		@param {Object} [htOption] 옵션
		@return {Object} htPosition
		@example
			oLayerPosition.getPosition({
				sPosition: "outside-bottom",
				sAlign: "left",
				sValign: "",
				nTop: 10, //지정되지 않으면 0으로 설정된다.
				nLeft: 10 //지정되지 않으면 0으로 설정된다.
			}); 
			
			(return value) htPosition = {
				nTop : (Number) 문서상의 y좌표
				nLeft : (Number) 문서상의 x좌표
			} 
	**/
	getPosition : function(htOption) {
		if (typeof htOption != "object") {
			htOption = this.option();
		} 
		if (typeof htOption.nTop == "undefined") {
			htOption.nTop = 0;
		}
		if (typeof htOption.nLeft == "undefined") {
			htOption.nLeft = 0;
		}
		
		var sArea,
			bCenter = this._isPosition(htOption, "center"),
			bInside = this._isPosition(htOption, "inside"),
			
			bTop = this._isPosition(htOption, "top"),
			bBottom = this._isPosition(htOption, "bottom"),
			bLeft = this._isPosition(htOption, "left"),
			bRight = this._isPosition(htOption, "right");
		
		if (bLeft) {
			sArea = "left";
		}
		if (bRight) {
			sArea = "right";
		}
		if (bTop) {
			sArea = "top";
		}
		if (bBottom) {
			sArea = "bottom";
		}
		if (bCenter){
			sArea = "center";
		}
		
		var el = this.getElement(),
			wel = jindo.$Element(el),
			elLayer = this.getLayer(),
			welLayer = jindo.$Element(elLayer),
			htElementPosition = wel.offset(),
			nWidth = el.offsetWidth,
			nHeight = el.offsetHeight,
			oClientSize,
			nLayerWidth = elLayer.offsetWidth,
			nLayerHeight = elLayer.offsetHeight,
			htPosition = {
				nTop: htElementPosition.top,
				nLeft: htElementPosition.left
			};
			
		if (el == document.body) {
			oClientSize = jindo.$Document().clientSize();
			nWidth = oClientSize.width;
			nHeight = oClientSize.height;
		}
		
		//Layer에 마진이 있는경우 렌더링 보정.
		nLayerWidth += parseInt(welLayer.css('marginLeft'), 10) + parseInt(welLayer.css('marginRight'), 10) || 0;
		nLayerHeight += parseInt(welLayer.css('marginTop'), 10) + parseInt(welLayer.css('marginBottom'), 10) || 0;
		
		switch (sArea) {
			case "center" :
				htPosition.nTop += (nHeight - nLayerHeight) / 2;
				htPosition.nTop += htOption.nTop;
				htPosition.nLeft += (nWidth - nLayerWidth) / 2;
				htPosition.nLeft += htOption.nLeft;
			break;
			case "top" :
				if (bInside) {
					htPosition.nTop += htOption.nTop;	
				} else {
					htPosition.nTop -= htOption.nTop + nLayerHeight;
				}
				htPosition = this._setLeftRight(htOption, htPosition);
			break;
			case "bottom" :
				htPosition.nTop += nHeight;
				if (bInside) {
					htPosition.nTop -= htOption.nTop + nLayerHeight;
				} else {
					htPosition.nTop += htOption.nTop;
				}
				htPosition = this._setLeftRight(htOption, htPosition);
			break;
			case "left" :
				if (bInside) {
					htPosition.nLeft += htOption.nLeft;
				} else {
					htPosition.nLeft -= htOption.nLeft + nLayerWidth;
				}
				htPosition = this._setVerticalAlign(htOption, htPosition);
			break;
			case "right" :
				htPosition.nLeft += nWidth;
				if (bInside) {
					htPosition.nLeft -= htOption.nLeft + nLayerWidth;
				} else {
					htPosition.nLeft += htOption.nLeft;
				}
				htPosition = this._setVerticalAlign(htOption, htPosition);
			break;
		}
		
		htPosition = this._adjustScrollPosition(htPosition);

		//[2572]IE6에서 IFrame 내부에 있고, FrameBorder가 있는 경우 2px보정
		if(jindo.$Agent().navigator().ie && jindo.$Agent().navigator().version < 8 && window.external){
			try{
				var bHasFrameBorder = (window != top) && (window.frameElement) && !window.frameElement.frameBorder;
				if(bHasFrameBorder){
					htPosition.nLeft -= 2;
					htPosition.nTop -= 2;
				}
			}catch(e){}
		}
		
		return htPosition;
	},
	
	/**
		레이어를 지정된 옵션에 맞게 위치시킨다.
		
		@method setPosition
		@param {Object} [htPosition] 위치에 대한 객체 (생략시, 설정된 옵션에 따라 자동으로 계산된다)
		@return {this} 인스턴스 자신
		@remark css의 top, left 속성으로 위치를 설정한다. 
		@example
			oLayerPosition.setPosition({ nTop : 100, nLeft : 100 });
	**/
	setPosition : function(htPosition){
		var welLayer = jindo.$Element(this.getLayer()),
			bVisible = welLayer.visible(); 
		
		if (!bVisible) {
			welLayer.show();
		}
		welLayer.css("left", "-9999px").css("top", "0px");
		
		if (typeof htPosition == "undefined") {
			htPosition = this.getPosition();
		}
		if (this.option("bAuto")) {
			htPosition = this._adjustPosition(htPosition);
		}
		welLayer.css("left", htPosition.nLeft + "px").css("top", htPosition.nTop + "px"); //offset으로 설정할경우 간혹 수치가 맞지 않음
		
		if (!bVisible) {
			welLayer.hide();
		}
		return this;
	},
	
	/**
		현재 레이어의 위치를 구한다.
		
		@method getCurrentPosition
		@return {Object}
		@remark 설정된 css의 top, left 속성 값을 숫자 값으로 리턴한다.
		@example
			(return value) htPosition = {
				nTop : (Number) 문서상의 y좌표
				nLeft : (Number) 문서상의 x좌표
			} 
	**/
	getCurrentPosition : function() {
		var welLayer = jindo.$Element(this.getLayer());
			
		return {
			nTop : parseInt(welLayer.css("top"), 10),
			nLeft : parseInt(welLayer.css("left"), 10)
		};
	},
	
	/**
		레이어 전체가 화면에 얼마나 보이는지 여부를 가져온다.
		@param {Object} htPosition
		@return {Number} 0 (가로, 세로 다 안 가려짐), 1 (가로, 세로 둘 중 한쪽이 가려짐), 2 (가로, 세로 모두 가려짐)
		@ignore
	**/
	_getScoreFullyVisible : function(htPosition){

		var nScore = 0;

		var elLayer = this.getLayer(),
			welLayer = jindo.$Element(elLayer),
			oScrollPosition = jindo.$Document().scrollPosition(),
			nScrollTop = oScrollPosition.top, 	//top
			nScrollLeft = oScrollPosition.left,	//left
			oClientSize = jindo.$Document().clientSize(),
			nLayerWidth = elLayer.offsetWidth + (parseInt(welLayer.css('marginLeft'), 10) + parseInt(welLayer.css('marginRight'), 10) || 0),
			nLayerHeight = elLayer.offsetHeight + (parseInt(welLayer.css('marginTop'), 10) + parseInt(welLayer.css('marginBottom'), 10) || 0);
		
		if (htPosition.nLeft >= 0 && oClientSize.width >= htPosition.nLeft - nScrollLeft + nLayerWidth) { nScore++; }
		if (htPosition.nTop >= 0 && oClientSize.height >= htPosition.nTop - nScrollTop + nLayerHeight) { nScore++; }

		return nScore;
	},
	
	/**
		가로방향으로 반전되어 배치되도록 변환된 옵션 객체를 가져온다.
		@param {Object} htOption
		@return {Object} htOption
		@ignore
	**/
	_mirrorHorizontal : function(htOption) {
		if (htOption.sAlign == "center" || htOption.sPosition == "inside-center") {
			return htOption;
		}
		
		var htConvertedOption = {};
		for (var i in htOption) {
			htConvertedOption[i] = htOption[i];
		}
		
		if (this._isPosition(htConvertedOption, "right")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/right/, "left");
		} else if (this._isPosition(htConvertedOption, "left")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/left/, "right");
		} else if (htConvertedOption.sAlign == "right") {
			htConvertedOption.sAlign = "left";
		} else if (htConvertedOption.sAlign == "left") {
			htConvertedOption.sAlign = "right";
		}
		
		return htConvertedOption;
	},
	
	/**
		세로방향으로 반전되어 배치되도록 변환된 옵션 객체를 가져온다.
		@param {Object} htOption
		@return {Object} htOption
		@ignore
	**/
	_mirrorVertical : function(htOption) {
		if (htOption.sValign == "middle" || htOption.sPosition == "inside-center") {
			return htOption;
		}
		
		var htConvertedOption = {};
		for (var i in htOption) {
			htConvertedOption[i] = htOption[i];
		}
		
		if (this._isPosition(htConvertedOption, "top")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/top/, "bottom");
		} else if (this._isPosition(htConvertedOption, "bottom")) {
			htConvertedOption.sPosition = htConvertedOption.sPosition.replace(/bottom/, "top");
		} else if (htConvertedOption.sValign == "top") {
			htConvertedOption.sValign = "bottom";
		} else if (htConvertedOption.sValign == "bottom") {
			htConvertedOption.sValign = "top";
		}
		
		return htConvertedOption;
	},
	
	/**
		레이어가 항상 보이도록 위치를 자동 조절한다.
		우선순위는 가로 반전, 세로반전, 가로세로반전 순이다.
		모든 경우에도 레이어 전체가 보이지 않을 경우 원위치시킨다.
		@param {Object} htPosition
		@return {Object} htOption
		@ignore
	**/
	_adjustPosition: function(htPosition){
		var htOption = this.option(),
			aCandidatePosition = [];

		var htRetPosition = htPosition;
		
		aCandidatePosition.push(htPosition);
		aCandidatePosition.push(this.getPosition(this._mirrorHorizontal(htOption)));
		aCandidatePosition.push(this.getPosition(this._mirrorVertical(htOption)));
		aCandidatePosition.push(this.getPosition(this._mirrorVertical(this._mirrorHorizontal(htOption))));

		var nMaxScore = 0, nScore;

		for (var i = 0, htCandidatePosition; (htCandidatePosition = aCandidatePosition[i]); i++) {
			nScore = this._getScoreFullyVisible(htCandidatePosition);
			if (nScore > nMaxScore) {
				htRetPosition = htCandidatePosition;
				nMaxScore = nScore;
			}
		}
		
		return htRetPosition;
	}
}).extend(jindo.UIComponent);/**
    @fileOverview Calendar 컴포넌트를 사용하여 Text Input Control에 특정 형식의 날짜입력을 클릭만으로 입력할 수 있게 하는 컴포넌트
    @version 1.14.0
**/

/**
    Calendar 컴포넌트를 통해 출력된 달력의 날짜 선택으로 Input의 값을 입력한다.
    
    @class jindo.DatePicker
    @extends jindo.UIComponent
    @uses jindo.Calendar
    @uses jindo.LayerManager
    @uses jindo.LayerPosition
    
    @keyword input, date, picker, 달력, 날짜, 선택 
**/

jindo.DatePicker = jindo.$Class({
    /** @lends jindo.DatePicker.prototype */
    
    _aDatePickerSet : null,
    _htSelectedDatePickerSet : null, //클릭된 엘리먼트에 대한 DatePickerSet
    
    /**
        DatePicker 컴포넌트를 초기화한다.
        
        @constructor
        @param {HTMLElement} elCalendarLayer 달력을 출력할 레이어 엘리먼트 혹은 id 
        @param {Object} [htOption] 초기화 옵션 설정을 위한 객체.
            @param {Boolean} [htOption.bUseLayerPosition=true] LayerPosition을 사용해서 포지셔닝을 할지 여부
            @param {Object} [htOption.Calendar] jindo.Calendar 를 위한 옵션
            @param {Object} [htOption.LayerManager] jindo.LayerManager 를 위한 옵션
            @param {Object} [htOption.LayerPosition] jindo.LayerPosition 을 위한 옵션
    **/ 
    $init : function(elCalendarLayer, htOption) {
        var oDate = new Date();
        this.option({
            bUseLayerPosition : true, //LayerPosition을 사용해서 포지셔닝을 할지의 여부
            
            Calendar : { //Calendar를 위한 옵션
                sClassPrefix : "calendar-", //Default Class Prefix
                nYear : oDate.getFullYear(),
                nMonth : oDate.getMonth() + 1,
                nDate : oDate.getDate(),            
                sTitleFormat : "yyyy-mm", //달력의 제목부분에 표시될 형식
                aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] //월 이름
            },
            
            LayerManager : { //LayerManager를 위한 옵션
                sCheckEvent : "click",
                nShowDelay : 0, 
                nHideDelay : 0
            },
            
            LayerPosition : { //LayerPosition을 위한 옵션
                sPosition: "outside-bottom",
                sAlign: "left",
                nTop: 0,
                nLeft: 0,
                bAuto: false
            }
        });
        this.option(htOption);
        
        this._aDatePickerSet = [];
        this._elCalendarLayer = jindo.$(elCalendarLayer);
        this._initCalendar();
        this._initLayerManager();
        this._initLayerPosition();  
        
        this._wfFocusInput = jindo.$Fn(this._onFocusInput, this);
        this._wfClickLinkedElement = jindo.$Fn(this._onClickLinkedElement, this);
        this._wfMouseOverDate = jindo.$Fn(this._onMouseOverDate, this);
        this._wfMouseOutDate = jindo.$Fn(this._onMouseOutDate, this);
        this._wfClickDate = jindo.$Fn(this._onClickDate, this);

        var welCalendarLayer = jindo.$Element(this._elCalendarLayer);
        if (isNaN(welCalendarLayer.css('zIndex')*1)) {
            welCalendarLayer.css('zIndex', 1);
        }
        
        this.activate(); //컴포넌트를 활성화한다.
    },
    
    /**
        DatePicker 세트를 추가한다.
        
        @method addDatePickerSet
        @param {Object} ht DatePicker 세트 옵션
        @param {HTMLElement} ht.elInput 날짜가 입력될 input 엘리먼트
        @param {HTMLElement} ht.elButton input외에도 달력을 보이게 할 엘리먼트
        @param {HTMLElement} ht.elLayerPosition LayerPosition 컴포넌트로 자동으로 위치 조절시 기준이 되는 엘리먼트 (생략시 elInput이 디폴트)
        @param {Object} [ht.htOption] 추가옵션
            @param {Number} [ht.htOption.nYear=현재년] 기본으로 설정될 연도
            @param {Number} [ht.htOption.nMonth=현재월] 기본으로 설정될 월
            @param {Number} [ht.htOption.nDate=현재일] 기본으로 설정될 일
            @param {Boolean} [ht.htOption.bDefaultSet=true] true이면 기본 Input 값을 설정한다. false이면 설정하지 않는다.
            @param {Boolean} [ht.htOption.bReadOnly=true] true이면 input에 직접 값을 입력하지 못한다.
            @param {String} [ht.htOption.sDateFormat="yyyy-mm-dd"] input에 입력될 날짜의 형식
            @param {Object} [ht.htOption.htSelectableDateFrom] 선택가능한 첫 날짜
                @param {Number} [ht.htOption.htSelectableDateFrom.nYear=1900] 년도
                @param {Number} [ht.htOption.htSelectableDateFrom.nMonth=1] 월
                @param {Number} [ht.htOption.htSelectableDateFrom.nDate=1] 일
            @param {Object} [ht.htOption.htSelectableDateTo] 선택가능한 마지막 날짜
                @param {Number} [ht.htOption.htSelectableDateTo.nYear=2100] 년도
                @param {Number} [ht.htOption.htSelectableDateTo.nMonth=12] 월
                @param {Number} [ht.htOption.htSelectableDateTo.nDate=31] 일
        @return {this} 지정한 DatePicker 세트를 추가한 인스턴스 자신
        @example
            oDatePicker.addDatePickerSet({
                elInput : jindo.$("input"), //날짜가 입력될 input 엘리먼트
                elButton : jindo.$("button"), //input외에도 달력을 보이게 할 엘리먼트
                elLayerPosition : jindo.$("input"), //LayerPosition 컴포넌트로 자동으로 위치 조절시 기준이 되는 엘리먼트 (생략시 elInput이 디폴트)
                htOption : {
                    nYear : 1983, //기본으로 설정될 연도
                    nMonth : 5, //기본으로 설정될 월
                    nDate : 12, //기본으로 설정될 일
                    
                    bDefaultSet : true, //true이면 기본 Input 값을 설정한다. false이면 설정하지 않는다.
                    bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
                    sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
                    htSelectableDateFrom : { //선택가능한 첫 날짜
                        nYear : 1900,
                        nMonth : 1,
                        nDate : 1               
                    },
                    htSelectableDateTo : { //선택가능한 마지막 날짜
                        nYear : 2100,
                        nMonth : 12,
                        nDate : 31
                    }
                }
            });
    **/
    addDatePickerSet : function(ht) {
        var htOption = this.option(),
            htCalendarOption = this.getCalendar().option(),
            htDefaultOption = {
                nYear : htCalendarOption.nYear,
                nMonth : htCalendarOption.nMonth,
                nDate : htCalendarOption.nDate,
                bDefaultSet : true,
                bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
                sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
                htSelectableDateFrom : { //선택가능한 첫 날짜
                    nYear : 1900,
                    nMonth : 1,
                    nDate : 1               
                },
                htSelectableDateTo : { //선택가능한 마지막 날짜
                    nYear : 2100,
                    nMonth : 12,
                    nDate : 31
                }
            };
            
        if (typeof ht.htOption != "undefined") {
            //빈 값은 기본 값으로 셋팅해줌.
            for (var value in ht.htOption) {
                if (typeof htDefaultOption[value] != "undefined") {
                    htDefaultOption[value] = ht.htOption[value]; 
                }
            }
        }   
        ht.htOption = htDefaultOption;
        
        this._aDatePickerSet.push(ht);
        
        var oLayerManager = this.getLayerManager();
        if (typeof ht.elInput != "undefined") {
            oLayerManager.link(ht.elInput);
            if (ht.htOption.bReadOnly) {
                ht.elInput.readOnly = true;
            }
            this._wfFocusInput.attach(ht.elInput, "focus");
            this._wfClickLinkedElement.attach(ht.elInput, "click");
        }
        
        if (typeof ht.elButton != "undefined") {
            oLayerManager.link(ht.elButton);
            this._wfClickLinkedElement.attach(ht.elButton, "click");
        }
        
        if (ht.htOption.bDefaultSet) {
            this._setDate(ht, ht.htOption);
        }
        return this;    
    },
    
    /**
        DatePicker 세트를 제거한다.
        
        @method removeDatePickerSet
        @param {Object} ht 삭제할 DatePicker 세트
            @param {HTMLElement} ht.elInput 해당 DatePicker 세트의 input 엘리먼트
            @param {HTMLElement} [ht.elButton] 해당 DatePicker 세트의 달력을 보이게 하는 엘리먼트
        @return {this} 지정한 DatePicker 세트를 제거한 인스턴스 자신 
        @example
            oDatePicker.removeDatePickerSet({
                elInput : jindo.$("input"), // 삭제할 DatePicker 세트의 input 엘리먼트
                elButton : jindo.$("button") // 삭제할 DatePicker 세트의 달력을 보이게 하는 엘리먼트
            })
    **/
    removeDatePickerSet : function(ht) {
        var nIndex = -1;
        for (var i = 0, len = this._aDatePickerSet.length ; i < len; i++) {
            if (this._aDatePickerSet[i].elInput == ht.elInput || this._aDatePickerSet[i].elButton == ht.elButton) {
                nIndex = i;
                break;              
            }
        }
        
        var htDatePickerSet = this._aDatePickerSet[nIndex];
        var oLayerManager = this.getLayerManager();
        if (typeof htDatePickerSet.elButton != "undefined") {
            oLayerManager.unlink(htDatePickerSet.elButton);
            this._wfClickLinkedElement.detach(htDatePickerSet.elButton, "click");
        }
        
        if (typeof htDatePickerSet.elInput != "undefined") {
            this._wfFocusInput.detach(htDatePickerSet.elInput, "focus");
            this._wfClickLinkedElement.detach(htDatePickerSet.elInput, "click");
            htDatePickerSet.elInput.readOnly = false;
        }
        if (htDatePickerSet == this._htSelectedDatePickerSet) {
            this._htSelectedDatePickerSet = null;
        }       
        this._aDatePickerSet.splice(i, 1);
        
        return this;
    },
    
    /**
        DatePicker 세트를 가져온다.
        
        @method getDatePickerSet
        @param {HTMLElement} [el] 가져올 DatePicker 세트의 Input 엘리먼트
        @return {Object | Array} 파라미터로 엘리먼트가 전달될 경우 해당 Input 엘리먼트가 속하는 DatePicker 세트 객체를, 파라미터가 없는 경우 DatePicker 세트 배열을 리턴
    **/
    getDatePickerSet : function(el) {
        if(typeof el == "undefined") {
            return this._aDatePickerSet;
        }
        
        for (var i = 0, len = this._aDatePickerSet.length; i < len; i++) {
            if (this._aDatePickerSet[i].elInput == el || this._aDatePickerSet[i].elButton == el) {
                return this._aDatePickerSet[i];             
            }
        }
        return false;
    },
    
    /**
        달력레이어를 가져온다.
        
        @method getCalendarLayer
        @return {HTMLElement} 달력레이어 엘리먼트
    **/
    getCalendarLayer : function() {
        return this._elCalendarLayer;
    },
    
    _initCalendar : function() {
        /**
            달력 오브젝트
            @type Object jindo.Calendar 컴포넌트 
            @see jindo.Calendar
        **/
        var self = this;
        this._oCalendar = new jindo.Calendar(this.getCalendarLayer(), this.option("Calendar")).attach({
            beforeDraw : function(oCustomEvent) {
                /**
                    달력을 그리기 전에 발생
                    
                    @event beforeDraw
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 그려질 달력의 년
                    @param {Number} nMonth 그려질 달력의 월
                    @param {Function} stop 달력이 새로 그려지지 않도록 중단시키는 메서드
                    @example
                        // beforeDraw 커스텀 이벤트 핸들링
                        oDatePicker.attach("beforeDraw", function(oCustomEvent) {
                            // 변경될 달력이 2000년 이전이면 변경시키지 않음
                            if(oCustomEvent.nYear < 2000){
                                oCustomEvent.stop();
                                alert("2000년 이전은 선택할 수 없습니다.");
                            }
                        });
                **/
                if(!self.fireEvent("beforeDraw", oCustomEvent)) {
                    oCustomEvent.stop();
                }
            },
            draw : function(oCustomEvent) {
                //선택한 날짜 class명 부여
                var sClassPrefix = this.option("sClassPrefix");
                var oShowDatePickerSet = self._htSelectedDatePickerSet;
                
                if (self.isSelectable(oShowDatePickerSet, oCustomEvent)) {
                    oCustomEvent.bSelectable = true;
                    if (jindo.Calendar.isSameDate(oCustomEvent, oShowDatePickerSet)) {
                        jindo.$Element(oCustomEvent.elDateContainer).addClass(sClassPrefix + "selected");
                    }
                } else {
                    oCustomEvent.bSelectable = false;
                    jindo.$Element(oCustomEvent.elDateContainer).addClass(this.option("sClassPrefix") + "unselectable");
                }
                /**
                    달력을 그리면서 일이 표시될 때마다 발생
                    
                    @event draw
                    @param {String} sType 커스텀 이벤트명
                    @param {Boolean} bPrevMonth 그려질 날이 이전달의 날인지 여부
                    @param {Boolean} bNextMonth 그려질 날이 다음달의 날인지 여부
                    @param {HTMLElement} elDate 날이 쓰여질 대상 엘리먼트
                    @param {HTMLElement} elDateContainer className이 [prefix]week로 설정된 엘리먼트의 자식 엘리먼트, elDate와 같을 수 있음
                    @param {Number} nYear 그려진 날의 연
                    @param {Number} nMonth 그려진 날의 월
                    @param {Number} nDate 그려진 날의 일
                    @param {String} sHTML 대상 엘리먼트에 쓰여질 HTML
                    @example
                        // draw 커스텀 이벤트 핸들링
                        var oHoliday = { ... }; // 공휴일 정보 설정
                         
                        oDatePicker.attach("draw", function(oCustomEvent) {
                            // 그려지는 날짜가 공휴일인지 검사한 후 설정하는 예제
                            if (typeof oHoliday == "object" && oHoliday[oCustomEvent.nYear]
                                && oHoliday[oCustomEvent.nYear][parseInt(oCustomEvent.nMonth * 1)]
                                && oHoliday[oCustomEvent.nYear][parseInt(oCustomEvent.nMonth * 1)][oCustomEvent.nDate]) {
                                    jindo.$Element(oCustomEvent.elDateContainer).addClass("calendar-holiday"); 
                            }
                        });
                **/
                if(!self.fireEvent("draw", oCustomEvent)) {
                    oCustomEvent.stop();
                }
            },
            afterDraw : function(oCustomEvent) {
                /**
                    달력을 모두 그린 후에 발생
                    
                    @event afterDraw
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 그려진 달력의 연도
                    @param {Number} nMonth 그려진 달력의 월
                    @example
                        // afterDraw 커스텀 이벤트 핸들링
                        oDatePicker.attach("afterDraw", function(oCustomEvent) { ... });
                **/
                self.fireEvent("afterDraw", oCustomEvent);
            }
        });
    },
    
    /**
        Calendar 객체를 가져온다.
        
        @method getCalendar
        @return {jindo.Calendar} Calendar 객체
        @see jindo.Calendar
    **/
    getCalendar : function() {
        return this._oCalendar;
    },
    
    _initLayerManager : function() {
        var self = this;
        var elCalendarLayer = this.getCalendarLayer();
        this._oLayerManager = new jindo.LayerManager(elCalendarLayer, this.option("LayerManager")).attach({
            show : function() {
                if (self._oTimerDatePickerSet) {
                    clearTimeout(self._oTimerDatePickerSet);
                    self._oTimerDatePickerSet = null;
                }
                /**
                    달력 레이어가 펼쳐진 후 상태에서 발생하는 이벤트
                    
                    @event showCalendar
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("showCalendar", function() { ... });
                **/
                self.fireEvent("showCalendar");
            },
            hide : function(oCustomEvent) {
                self._oTimerDatePickerSet = setTimeout(function() {
                    self._htSelectedDatePickerSet = null;
                    self._oTimerDatePickerSet = null;
                }, 0);
                /**
                    달력 레이어가 닫혀진 후 상태에서 발생하는 이벤트
                    
                    @event hideCalendar
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("hideCalendar", function() { ... });
                **/
                self.fireEvent("hideCalendar");
            }
        }).link(elCalendarLayer);
    },

    /**
        LayerManager 객체를 가져온다.
        
        @method getLayerManager
        @return {jindo.LayerManager} LayerManager 객체
    **/ 
    getLayerManager : function() {
        return this._oLayerManager;
    },
    
    _initLayerPosition : function() {
        if (this.option("bUseLayerPosition")) {
            this._oLayerPosition = new jindo.LayerPosition(null, this.getCalendarLayer(), this.option("LayerPosition"));
        }
    },
    
    /**
        LayerPosition 객체를 가져온다.
        
        @method getLayerPosition
        @return {jindo.LayerPosition} LayerPosition 객체
    **/
    getLayerPosition : function() {
        return this._oLayerPosition;
    },
    
    /**
        DatePicker 세트에 해당하는 Input 엘리먼트를 가져온다.
        
        @method getInput
        @param {Object} [htDatePickerSet] Input 엘리먼트를 가져올 DatePicker 세트
        @return {HTMLElement} 해당 Input 엘리먼트, 파라미터가 없는 경우에는 현재포커스된 Input을 리턴하고, 포커스된 Input이 없는 경우 null을 리턴
    **/
    getInput : function(htDatePickerSet) {
        if (typeof htDatePickerSet != "undefined") {
            return htDatePickerSet.elInput || null;
        }
        if (this._htSelectedDatePickerSet) {
            return this._htSelectedDatePickerSet.elInput || null;
        }
        return null;
    },
    
    /**
        선택된 날짜를 가져온다.
        
        @method getDate
        @param {Object} htDatePickerSet 선택된 날짜를 가져올 DatePicker 세트
        @return {Object} 해당 DatePicker 세트에 선택된 날짜
    **/
    getDate : function(htDatePickerSet) {
        return {
            nYear : htDatePickerSet.nYear,
            nMonth : htDatePickerSet.nMonth,
            nDate : htDatePickerSet.nDate 
        };
    },
    
    _setDate : function(htDatePickerSet, htDate) {
        htDatePickerSet.nYear = htDate.nYear * 1;
        htDatePickerSet.nMonth = htDate.nMonth * 1;
        htDatePickerSet.nDate = htDate.nDate * 1;
        if (typeof htDatePickerSet.elInput != "undefined") {
            htDatePickerSet.elInput.value = this._getDateFormat(htDatePickerSet, htDate);
        }
    },
    
    /**
        지정한 날짜가 DatePicker 세트에서 선택가능한 날짜인지 확인한다.
        
        @method isSelectable
        @param {Object} htDatePickerSet 선택가능 여부를 확인할 DatePicker 세트
        @param {Object} htDate 선택 가능 여부를 확인할 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
    **/
    isSelectable : function(htDatePickerSet, htDate) {
        return jindo.Calendar.isBetween(htDate, htDatePickerSet.htOption["htSelectableDateFrom"], htDatePickerSet.htOption["htSelectableDateTo"]);
    },
    
    /**
        선택한 날짜에 대해 DatePicker 세트의 Input에 형식에 맞는 날짜 값을 설정한다.
        
        @method setDate
        @param {Object} htDatePickerSet TODO : 파라미터 설명달기
        @param {Object} htDate 선택할 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
        @return {Boolean} DatePicker 세트에 선택한 날짜 설정이 성공했는지 여부
    **/
    setDate : function(htDatePickerSet, htDate) {
        if (this.isSelectable(htDatePickerSet, htDate)) {
            var sDateFormat = this._getDateFormat(htDatePickerSet, htDate);
            var htParam = {
                "sText": sDateFormat,
                "nYear": htDate.nYear,
                "nMonth": htDate.nMonth,
                "nDate": htDate.nDate
            };
            /**
                달력 레이어에서 날짜를 선택하고 Text Input에 값이 설정되기 직전에 실행
                
                @event beforeSelect
                @param {String} sType 커스텀 이벤트명
                @param {String} sText Text Input에 설정될 값
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @param {Function} stop Text Input에 선택된 값 입력을 중단시키는 메서드
                @example
                    // beforeSelect 커스텀 이벤트 핸들링
                    oDatePicker.attach("beforeSelect", function(oCustomEvent) {
                        // Text Input에 값을 입력하지 않는다.
                        // select 이벤트가 발생되기전에 수행을 중단한다.
                        oCustomEvent.stop();
                    });
            **/
            if (this.fireEvent("beforeSelect", htParam)) {
                this._setDate(htDatePickerSet, htDate);
                this.getLayerManager().hide();
                /**
                    달력 레이어에서 날짜를 선택하고 Text Input에 값이 설정된 이후 실행
                    
                    @event select
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 선택된 달력의 연도
                    @param {Number} nMonth 선택된 달력의 월
                    @param {Number} nDate 선택된 달력의 일
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("select", function(oCustomEvent) { ... });
                **/
                this.fireEvent("select", htParam);
            }
            return true;
        }
        return false;
    },
    
    /**
        DatePicker 세트의 Input에 입력되는 날짜의 형식을 가져온다. 
        
        @method _getDateFormat
        @param {Object} htDatePickerSet 날짜의 형식을 가져올 DatePicker 세트
        @param {Object} htDate 날짜의 형식을 확인하기 위한 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
        @return {String} sDateFormat
        @ignore
    **/
    _getDateFormat : function(htDatePickerSet, htDate) {
        var nYear = htDate.nYear;
        var nMonth = htDate.nMonth;
        var nDate = htDate.nDate;
        
        if (nMonth < 10) {
            nMonth = ("0" + (nMonth * 1)).toString();
        }
        if (nDate < 10) {
            nDate = ("0" + (nDate * 1)).toString();
        } 
        
        var sDateFormat = htDatePickerSet.htOption.sDateFormat;
        sDateFormat = sDateFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2)).replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.getCalendar().option("aMonthTitle")[nMonth-1] ).replace(/dd/g, nDate).replace(/d/g, (nDate * 1)); 
        return sDateFormat;
    },
    
    _linkOnly : function (htDatePickerSet) {
        var oLayerManager = this.getLayerManager();
        oLayerManager.setLinks([this.getCalendarLayer()]);
        if (typeof htDatePickerSet.elInput != "undefined") {
            oLayerManager.link(htDatePickerSet.elInput);
        }
        if (typeof htDatePickerSet.elButton != "undefined") {
            oLayerManager.link(htDatePickerSet.elButton);   
        }
    },
    
    /**
        컴포넌트를 활성화한다.
    **/
    _onActivate : function() {
        var elCalendarLayer = this.getCalendarLayer();
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(elCalendarLayer).preventTapHighlight(true);
        this._wfMouseOverDate.attach(elCalendarLayer, "mouseover");
        this._wfMouseOutDate.attach(elCalendarLayer, "mouseout");
        this._wfClickDate.attach(elCalendarLayer, "click");
        this.getLayerManager().activate();
        this.getCalendar().activate();
    },
    
    /**
        컴포넌트를 비활성화한다.
    **/
    _onDeactivate : function() {
        var elCalendarLayer = this.getCalendarLayer();
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(elCalendarLayer).preventTapHighlight(false);
        this._wfMouseOverDate.detach(elCalendarLayer, "mouseover");
        this._wfMouseOutDate.detach(elCalendarLayer, "mouseout");
        this._wfClickDate.detach(elCalendarLayer, "click").detach(elCalendarLayer, "mouseover").detach(elCalendarLayer, "mouseout");
        this.getLayerManager().deactivate();
        this.getCalendar().deactivate();
    },
    
    _onFocusInput : function(we) {
        /**
            Input 엘리먼트에 포커스 되었을 때 발생
            
            @event focus
            @param {String} sType 커스텀 이벤트명
            @param {HTMLElement} element 포커스된 Input 엘리먼트
            @example
                // focus 커스텀 이벤트 핸들링
                oDatePicker.attach("focus", function() { ... });
        **/
        this.fireEvent("focus", {
            element : we.element
        });
    },
    
    _onClickLinkedElement : function(we){
        we.stop(jindo.$Event.CANCEL_DEFAULT);
        /**
            Input 엘리먼트에 마우스 클릭 하였을 때 발생
            
            @event click
            @param {String} sType 커스텀 이벤트명
            @param {HTMLElement} element 클릭된 Input 엘리먼트
            @example
                // click 커스텀 이벤트 핸들링
                oDatePicker.attach("click", function(oCustomEvent) { ... });
        **/
        if (this.fireEvent("click", {
            element: we.element
        })) {
            var htDatePickerSet = this.getDatePickerSet(we.currentElement);
            if (htDatePickerSet) {
                this._htSelectedDatePickerSet = htDatePickerSet;
                this._linkOnly(htDatePickerSet);
                if (!htDatePickerSet.nYear) {
                    htDatePickerSet.nYear = htDatePickerSet.htOption.nYear;
                }
                if (!htDatePickerSet.nMonth) {
                    htDatePickerSet.nMonth = htDatePickerSet.htOption.nMonth;
                }
                if (!htDatePickerSet.nDate) {
                    htDatePickerSet.nDate = htDatePickerSet.htOption.nDate;
                }
                var nYear = htDatePickerSet.nYear;
                var nMonth = htDatePickerSet.nMonth;
                this.getLayerManager().show();
                this.getCalendar().draw(nYear, nMonth);
                if (this.option("bUseLayerPosition")) {
                    if (typeof htDatePickerSet.elLayerPosition != "undefined") {
                        this.getLayerPosition().setElement(htDatePickerSet.elLayerPosition).setPosition();
                    } else {
                        this.getLayerPosition().setElement(htDatePickerSet.elInput).setPosition();
                    }
                }
            }
        }
    },
    
    _getTargetDateElement : function(el) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDate = (jindo.$Element(el).hasClass(sClassPrefix + "date")) ? el : jindo.$$.getSingle("."+ sClassPrefix + "date", el);
        if (elDate && (elDate == el || elDate.length == 1)) {
            return elDate;
        }
        return null;
    },
    
    _getTargetDateContainerElement : function(el) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elWeek = jindo.$$.getSingle("! ." + sClassPrefix + "week", el);
        if (elWeek) {
            var elReturn = el;
            while(!jindo.$Element(elReturn.parentNode).hasClass(sClassPrefix + "week")) {
                elReturn = elReturn.parentNode;
            }
            if (jindo.$Element(elReturn).hasClass(sClassPrefix + "unselectable")) {
                return null;
            }
            return elReturn;
        } else {
            return null;
        }
    },
    
    _setSelectedAgain : function() {
        if (this._elSelected) {
            var sClassPrefix = this.getCalendar().option("sClassPrefix");
            jindo.$Element(this._elSelected).addClass(sClassPrefix + "selected");
            this._elSelected = null;
        }
    },
    
    _setAsideSelected : function() {
        if (!this._elSelected) {
            var sClassPrefix = this.getCalendar().option("sClassPrefix");
            this._elSelected = jindo.$$.getSingle("." + sClassPrefix + "selected", this.elWeekAppendTarget);
            if (this._elSelected) {
                jindo.$Element(this._elSelected).removeClass(sClassPrefix + "selected");
            }
        }
    },
    
    _onMouseOverDate : function(we) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDateContainer = this._getTargetDateContainerElement(we.element);
        if (elDateContainer) {
            var htDate = this.getCalendar().getDateOfElement(elDateContainer);
            var htParam = {
                element : we.element,
                nYear : htDate.nYear,
                nMonth : htDate.nMonth,
                nDate : htDate.nDate,
                bSelectable : false
            };
            if (this._htSelectedDatePickerSet && this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                this._setAsideSelected();
                jindo.$Element(elDateContainer).addClass(sClassPrefix + "over");
                htParam.bSelectable = true;
            }
            /**
                달력레이어의 날짜에 마우스오버 하였을 때 발생
                
                @event mouseover
                @param {String} sType 커스텀 이벤트명
                @param {HTMLElement} element 마우스오버된 Input 엘리먼트
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @example
                    // mouseover 커스텀 이벤트 핸들링
                    oDatePicker.attach("mouseover", function(oCustomEvent) { ... });
            **/
            this.fireEvent("mouseover", htParam);
        } 
    },
    
    _onMouseOutDate : function(we) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDateContainer = this._getTargetDateContainerElement(we.element);
        if (elDateContainer) {
            var htDate = this.getCalendar().getDateOfElement(elDateContainer);
            var htParam = {
                element : we.element,
                nYear : htDate.nYear,
                nMonth : htDate.nMonth,
                nDate : htDate.nDate,
                bSelectable : false
            };
            if (this._htSelectedDatePickerSet && this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                jindo.$Element(elDateContainer).removeClass(sClassPrefix + "over");
                htParam.bSelectable = true;
                this._setSelectedAgain();
            }
            /**
                달력레이어의 날짜에 마우스아웃 하였을 때 발생
                
                @event mouseout
                @param {String} sType 커스텀 이벤트명
                @param {HTMLElement} element 마우스아웃된 Input 엘리먼트
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @example
                    // mouseout 커스텀 이벤트 핸들링
                    oDatePicker.attach("mouseout", function(oCustomEvent) { ... });
            **/
            this.fireEvent("mouseout", htParam);
        } else {
            this._setSelectedAgain();
        }
    },
    
    _onClickDate : function(we){
        we.stop(jindo.$Event.CANCEL_DEFAULT);
        var el = we.element;
        
        var elDate = this._getTargetDateElement(el);
        if (elDate) {
            var elDateContainer = this._getTargetDateContainerElement(elDate);
            if (elDateContainer) {
                var htDate = this.getCalendar().getDateOfElement(elDateContainer);
                if (this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                    this.setDate(this._htSelectedDatePickerSet, htDate);
                }
            }
        } 
    }
}).extend(jindo.UIComponent);
/**
	@fileOverview Text Input에 입력 값이 없을 경우 "입력해주세요"와 같이 기본 안내 문구를 등록한다
	@author senxation
	@version 1.14.0
**/

/**
	Text Input에 기본 안내 문구를 설정하는 컴포넌트로 input[type=text] 나 textarea에 적용될 수 있다.
	
	@class jindo.DefaultTextValue
	@extends jindo.UIComponent
	
	@keyword placeholder, 기본문구, default, input
**/
jindo.DefaultTextValue = jindo.$Class({
	/** @lends jindo.DefaultTextValue.prototype */
		
	/**
		DefaultTextValue 컴포넌트를 생성한다.

		@constructor
		@param {HTMLElement} el 베이스(기준) 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sValue=""] 입력창에 기본으로 보여줄 값
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 컴포넌트 활성화여부
	**/
	$init : function(el, htOption) {
		this.option({
			sValue : "", //입력창에 기본으로 보여줄 값
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		});
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._elBaseTarget = jindo.$(el);
		this._wfOnFocusAndBlur = jindo.$Fn(this._onFocusAndBlur, this);

		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.
		}
	},

	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement} 컴포넌트의 베이스 엘리먼트
	**/
	getBaseElement : function() {
		return this._elBaseTarget;
	},
	
	/**
		input의 value를 기본값으로 설정한다.
		
		@method setDefault
		@return {this} 컴포넌트 인스턴스 자신
	**/
	setDefault : function() {
		this.getBaseElement().value = this.option("sValue");
		return this;
	},
	
	/**
		입력창에 기본으로 보여줄 값을 설정한다.
		
		@method setDefaultValue
		@param {String} sValue 입력창에 기본으로 보여줄 값
		@return {this} 컴포넌트 인스턴스 자신
	**/
	setDefaultValue : function(sValue) {
		var sOldValue = this.option("sValue");
		this.option("sValue", sValue);
		if (this.getBaseElement().value == sOldValue) {
			this.setDefault();
		}
		return this;
	},
	
	/**
		입력창에 기본으로 보여줄 값을 가져온다.
		
		@method getDefaultValue
		@return {String} 기본으로 보여줄 값
	**/
	getDefaultValue : function() {
		return this.option("sValue");
	},
	
	/**
		입력창의 값을 확인하여 기본값이면 빈 값으로, 빈 값이면 기본값으로 변경한다.
		
		@method paint
		@deprecated
		@return {this} 컴포넌트 인스턴스 자신
	**/
	paint : function() {
		return this;
	},
	
	_onActivate : function() {
		//초기화시 Input의 값이 없을 경우에만 Default Text로 변경
		var elInput = this.getBaseElement();
		if (elInput.value == "") {
			this.setDefault();
		}
		this._wfOnFocusAndBlur.attach(elInput, "focus").attach(elInput, "blur");
	},
	
	_onDeactivate : function() {
		var elInput = this.getBaseElement();
		this._wfOnFocusAndBlur.detach(elInput, "focus").detach(elInput, "blur");
	},
	
	_onFocusAndBlur : function(we) {
		var el = this._elBaseTarget;
		var sValue = el.value;
		switch (we.type) {
			case "focus":
				if (sValue.replace(/\r\n/g, "\n") == this.getDefaultValue()) {
					el.value = "";
					el.select(); //IE에서 커서가 사라지는 문제가 있어 추가
				} 
			break;
			case "blur":
				if (jindo.$S(sValue).trim().$value() == "") {
					this.setDefault();
				} 
			break;
		}
	}
}).extend(jindo.UIComponent);	/**
	@fileOverview 다이얼로그 레이어
	@author senxation
	@version 1.14.0
**/

/**
	사용자 대화창을 생성하는 컴포넌트
	
	@class jindo.Dialog
	@extends jindo.Component
	@uses jindo.LayerPosition
	
	@keyword dialog, 다이얼로그, 대화상자
**/
jindo.Dialog = jindo.$Class({
	/** @lends jindo.Dialog.prototype */
		
	/**
		Dialog 컴포넌트를 생성한다.

		@constructor
		@param {Object} [htOption] 옵션 해시테이블
			@param {String} [htOption.sClassPrefix="dialog-"] Dialog에 적용될 Class의 prefix명. ( layer와 각 버튼에 prefix+"명칭" 으로 클래스가 구성된다. )
			@param {Object} [htOption.LayerPosition] 다이얼로그의 위치 정보, jindo.LayerPosition 컴포넌트의 옵션이 그대로 적용됨
		@example
			var oDialog = new jindo.Dialog({
				sClassPrefix : 'dialog-', //Default Class Prefix
				LayerPosition : { //LayerPosition에 적용될 옵션
					sPosition : "inside-center",
					bAuto : true
				}
			}).attach({
				beforeShow : function(oCustomEvent) {
					//다이얼로그 레이어가 보여지기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//oCustomEvent.stop(); 수행시 보여지지 않음
				},
				show : function(oCustomEvent) {
					//다이얼로그 레이어가 보여진 후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				},
				beforeHide : function(oCustomEvent) {
					//다이얼로그 레이어가 숨겨지기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//oCustomEvent.stop(); 수행시 숨겨지지 않음
				},
				hide : function(oCustomEvent) {
					//다이얼로그 레이어가 숨겨진 후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				}
			});
	**/
	$init : function(htOption) {
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'dialog-', //Default Class Prefix
			LayerPosition : {
				sPosition : "inside-center",
				bAuto : true
			}
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._bIsEventAttached = false;
		this._bIsShown = false;
		
		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._assignHTMLElements();
		this._initLayerPosition();
	},
	
	/**
		HTMLElement들을 선언한다.
		
		@method _assignHTMLElements
		@ignore
	**/
	_assignHTMLElements : function() {
		this._elLayer = jindo.$('<div class="' + this.option("sClassPrefix") + 'layer"></div>');
		this._welLayer = jindo.$Element(this._elLayer);
		this._wfClick = jindo.$Fn(this._onClick, this);
		
		jindo.$Element.prototype.preventTapHighlight && this._welLayer.preventTapHighlight(true);
	},
	
	/**
		LayerPosition 컴포넌트를 초기화한다.
		
		@method _initLayerPosition
		@ignore
	**/
	_initLayerPosition : function() {
		this._oLayerPosition = new jindo.LayerPosition(document.body, this._elLayer, this.option("LayerPosition"));
	},
	
	/**
		다이얼로그 레이어 엘리먼트를 가져온다.
		
		@method getLayer
		@return {HTMLElement} 레이어 엘리먼트
	**/
	getLayer : function() {
		return this._elLayer;
	},
	
	/**
		생성된 LayerPosition 컴포넌트의 인스턴스를 가져온다.
		
		@method getLayerPosition
		@return {jindo.LayerPosition} LayerPosition 컴포넌트의 인스턴스
	**/
	getLayerPosition : function() {
		return this._oLayerPosition;
	},
	
	/**
		다이얼로그 레이어에 대한 템플릿을 설정한다.
		다이얼로그 레이어의 내용을 동적으로 설정하기 위해 템플릿 형태로 설정한다.
		
		@method setLayerTemplate
		@param {String} sTemplate 템플릿 문자열
		@remark Jindo의 jindo.$Template 참고
		@example
			oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
	**/
	setLayerTemplate : function(sTemplate) {
		this._sTemplate = sTemplate;
		this._template = jindo.$Template(this._sTemplate);
	},
	
	/**
		설정된 다이얼로그 레이어의 템플릿을 가져온다.
		
		@method getLayerTemplate
		@return {String} 설정된 템플릿
	**/
	getLayerTemplate : function() {
		return this._sTemplate;
	},
	
	/**
		다이얼로그 레이어를 보여준다.
		
		@method show
		@remark 다이얼로그 레이어는 설정된 레이어의 템플릿으로부터 만들어져 document.body에 append된다.
		@param {Object} htTemplateProcess 템플릿에 대체하기 위한 데이터를 가지는 Hash Table
		@param {Object} htEventHandler 다이얼로그 내부에서 발생하는 이벤트를 처리하는 핸들러들
		@example
			//다이얼로그 레이어에 닫기, 취소, 확인 버튼이 모두 존재하는경우 각각의 버튼에 대한 핸들러를 함께 등록한다. 
			var oDialog = new jindo.Dialog();
			
			oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
			
			oDialog.show({ text : "<strong>확인하시겠습니까?</strong>" }, {
				close : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 닫기 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				},
				cancel : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 취소 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				},
				confirm : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 확인 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				}
			});	
	**/
	show : function(htTemplateProcess, htEventHandler) {
		if (!this.isShown()) {
			this.attach(htEventHandler);
			
			document.body.appendChild(this._elLayer);
			this._welLayer.html(this._template.process(htTemplateProcess));
			
			var htCustomEvent = {
				"elLayer": this._elLayer
			};
			
			/**
				다이얼로그가 화면에 보여지기 전에 발생
				
				@event beforeShow
				@param {String} sType 발생한 이벤트명
				@param {HTMLElement} elLayer 다이얼로그 Element
				@param {Function} stop 레이어가 보여지지않도록 수행종료
				@example
					// 커스텀 이벤트 핸들링 예제
					oDialog.attach("beforeShow", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("beforeShow", htCustomEvent)) {
				this._welLayer.show();
				this._attachEvents();
				this.getLayerPosition().setPosition();
				this._bIsShown = true;
				/**
					다이얼로그 레이어가 화면에 보여지면 발생
					
					@event show
					@param {String} sType 발생한 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 Element
					@example
						// 커스텀 이벤트 핸들링 예제
						oDialog.attach("show", function(oCustomEvent) { ... });
				**/
				this.fireEvent("show", htCustomEvent);
			}
		}
	},
	
	/**
		다이얼로그 레이어를 숨긴다.
		
		@method hide
		@remark 다이얼로그 레이어가 숨겨지는 동시에 모든 이벤트가 제거되고 document.body에서 제거된다.
	**/
	hide : function() {
		if (this.isShown()) {
			var htCustomEvent = {"elLayer" : this._elLayer }; 
			
			/**
				다이얼로그가 숨겨지기 전 발생
				
				@event beforeHide
				@param {String} sType 발생한 이벤트명
				@param {HTMLElement} elLayer 다이얼로그 Element
				@param {Function} stop 레이어를 숨기지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oDialog.attach("beforeHide", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("beforeHide", htCustomEvent)) {
				this.detachAll("close").detachAll("confirm").detachAll("cancel");
				this._detachEvents();
				this._welLayer.hide();
				this._welLayer.leave();
				this._bIsShown = false;
				/**
					다이얼로그가 닫힌후에 발생
					
					@event hide
					@param {String} sType 발생한 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 Element
					@example
						// 커스텀 이벤트 핸들링 예제
						oDialog.attach("hide", function(oCustomEvent) { ... });
				**/
				this.fireEvent("hide", htCustomEvent); 
			} 
		}
	},
	
	/**
		다이얼로그 레이어가 보여지고 있는지 가져온다.
		
		@method isShown
		@return {Boolean} 다이얼로그 레이어의 노출여부
	**/
	isShown : function() {
		return this._bIsShown;
	},
	
	/**
		이벤트 등록 여부를 가져온다.
		@return {Boolean}
		@ignore
	**/
	_isEventAttached : function() {
		return this._bIsEventAttached;
	},

	/**
		이벤트를 등록한다.
		@return {this}
		@ignore
	**/
	_attachEvents : function() {
		if (!this._isEventAttached()) {
			//활성화 로직 ex)event binding
			this._wfClick.attach(this._elLayer, "click");
			this._bIsEventAttached = true;
		}
		return this;
	},
	
	/**
		이벤트를 해제한다.
		@return {this}
		@ignore
	**/
	_detachEvents : function() {
		if (this._isEventAttached()) {
			//비활성화 로직 ex)event unbinding
			this._wfClick.detach(this._elLayer, "click");
			this._bIsEventAttached = false;
		}
		return this;
	},
	
	/**
		다이얼로그 레이어 내부에서 닫기, 확인, 취소 버튼을 처리하기 위한 핸들러
		@param {jindo.$Event} we
		@ignore
	**/
	_onClick : function(we) {
		var sClassPrefix = this.option("sClassPrefix");
		var elClosestClose, elClosestConfirm, elClosestCancel;
		if ((elClosestClose = this._getClosest(("." + sClassPrefix + "close"), we.element))) {
			if(this.fireEvent("close")) {
				this.hide();
			} 
		} else if ((elClosestConfirm = this._getClosest(("." + sClassPrefix + "confirm"), we.element))) {
			if(this.fireEvent("confirm")) {
				this.hide();
			}
		} else if ((elClosestCancel = this._getClosest(("." + sClassPrefix + "cancel"), we.element))) {
			if (this.fireEvent("cancel")) {
				this.hide();
			}
		}
	},
	
	/**
		자신을 포함하여 부모노드중에 셀렉터에 해당하는 가장 가까운 엘리먼트를 구함
		@param {String} sSelector CSS셀렉터
		@param {HTMLElement} elBaseElement 기준이 되는 엘리먼트
		@return {HTMLElement} 구해진 HTMLElement
		@ignore
	**/
	_getClosest : function(sSelector, elBaseElement) {
		if (jindo.$$.test(elBaseElement, sSelector)) {
			return elBaseElement;
		}
		return jindo.$$.getSingle("! " + sSelector, elBaseElement);
	}
}).extend(jindo.Component);	/**
	@fileOverview HTML Element를 Drag할 수 있게 해주는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/

/**
	HTML Element를 Drag할 수 있게 해주는 컴포넌트
	DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트를 Drag 가능하게 하는 기능을 한다.
	
	@class jindo.DragArea
	@extends jindo.UIComponent
	
	@keyword drag, area, 드래그&드랍, 드래그, 영역
**/
jindo.DragArea = jindo.$Class({
	/** @lends jindo.DragArea.prototype */
	
	/**
		DragArea 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} el Drag될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="draggable"] 드래그 될 엘리먼트의 클래스명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 드래그가능하게 된다.
			@param {Boolean} [htOption.bFlowOut=true] 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작한다. 작은 경우 document사이즈로 제한한다.
			@param {Boolean} [htOption.bSetCapture=true] ie에서 setCapture() 명령 사용여부
			@param {Number} [htOption.nThreshold=0] 드래그가 시작되기 위한 최소 역치 값(px)
		@example
			var oDragArea = new jindo.DragArea(document, {
				"sClassName" : 'dragable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drag 가능하게 된다. 
				"bFlowOut" : true, // (Boolean) 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작하도록 수정. 작은 경우 document사이즈로 제한한다.
				"bSetCapture" : true, //ie에서 setCapture 사용여부
				"nThreshold" : 0 // (Number) 드래그가 시작되기 위한 최소 역치 값(px) 
			}).attach({
				handleDown : function(oCustomEvent) {
					//드래그될 handle 에 마우스가 클릭되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	weEvent : (jindo.$Event) mousedown시 발생되는 jindo.$Event 객체
					//};
					//oCustomEvent.stop(); 이 수행되면 dragStart 이벤트가 발생하지 않고 중단된다.
				},
				dragStart : function(oCustomEvent) {
					//드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//};
					//oCustomEvent.stop(); 이 수행되면 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단된다.
				},
				beforeDrag : function(oCustomEvent) {
					//드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elFlowOut : (HTMLElement) bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//	nX : (Number) 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nY : (Number) 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
					//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
					//};
					//oCustomEvent.stop(); 이 수행되면 뒤따르는 drag 이벤트가 발생하지 않고 중단된다.
					//oCustomEvent.nX = null; // 가로로는 안 움직이게
					//oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
					//oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
					//if (oCustomEvent.nX < 0) oCustomEvent.nX = 0;
					//if (oCustomEvent.nY < 0) oCustomEvent.nY = 0;
				},
				drag : function(oCustomEvent) {
					//드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//	nX : (Number) 드래그 된 x좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nY : (Number) 드래그 된 y좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
					//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
					//};
				},
				dragEnd : function(oCustomEvent) {
					//드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//	bInterupted : (Boolean) 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
					//	nX : (Number) 드래그 된 x좌표.
					//	nY : (Number) 드래그 된 y좌표.
					//}
				},
				handleUp : function(oCustomEvent) {
					//드래그된 handle에 마우스 클릭이 해제됬을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 된 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
					//};
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		});
		
		this.option(htOption || {});
		
		this._el = el;
		
		this._bIE = jindo.$Agent().navigator().ie;
		
		this._htDragInfo = {
			"bIsDragging" : false, // 드래그 중인 상태인지 여부
			"bPrepared" : false, // mousedown이 되었을때 true, threshold 를 넘겨서 이동중엔 false
			"bHandleDown" : false, // handle 을 마우스로 클릭하고 있는 상태인지 여부
			"bForceDrag" : false // startDragging 메서드를 통해서 강제로 드래그 하는 건지 여부
		};

		this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfOnMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		this._wfOnDragStart = jindo.$Fn(this._onDragStart, this);
		this._wfOnSelectStart = jindo.$Fn(this._onSelectStart, this);
		
		this.activate();
	},
	
	// 드래그 가능한 엘리먼트 찾기
	_findDraggableElement : function(el) {
		// 입력폼을 잡고는 드래그 할 수 없게
		if (el.nodeType === 1 && jindo.$$.test(el, "input[type=text], textarea, select")){
			return null;
		} 
		
		var self = this;
		var sClass = '.' + this.option('sClassName');
		
		var isChildOfDragArea = function(el) {
			if (el === null) {
				return false;
			}
			if (self._el === document || self._el === el) {
				return true;
			} 
			return jindo.$Element(self._el).isParentOf(el);
		};
		
		// 지정한 클래스명을 포함하고 있는 엘리먼트를 찾음
		var elReturn = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		
		// 찾아낸 엘리먼트가 DragArea 영역 바깥에 있으면 그만둠
		if (!isChildOfDragArea(elReturn)) {
			elReturn = null;
		}
		return elReturn;
	},
	
	/**
		레이어가 현재 드래그 되고 있는지 여부를 가져온다.
		
		@method isDragging
		@return {Boolean} 레이어가 현재 드래그 되고 있는지 여부
	**/
	isDragging : function() {
		var htDragInfo = this._htDragInfo; 
		return htDragInfo.bIsDragging && !htDragInfo.bPrepared;
	},
	
	/**
		드래그를 강제 종료시킨다.
		
		@method stopDragging
		@return {this}
	**/
	stopDragging : function() {
		this._stopDragging(true);
		return this;
	},
	
	// 드래그 중단시키기
	_stopDragging : function(bInterupted) {
		this._wfOnMouseMove.detach(document, 'mousemove');
		this._wfOnMouseUp.detach(document, 'mouseup');
		
		if (!this.isDragging()) { return; }

		var htDragInfo = this._htDragInfo,
			welDrag = jindo.$Element(htDragInfo.elDrag);
		
		htDragInfo.bIsDragging = false;
		htDragInfo.bForceDrag = false;
		htDragInfo.bPrepared = false;
		
		if(this._bIE && this._elSetCapture) {
			this._elSetCapture.releaseCapture();
			this._elSetCapture = null;
		}
		
		/**
			드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
			
			@event dragEnd
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elArea 기준 엘리먼트
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {Boolean} bInterupted 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
			@param {Number} nX 드래그 된 x좌표.
			@param {Number} nY 드래그 된 y좌표.
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("dragEnd", function(oCustomEvent) {
					//~~
				});
		**/
		this.fireEvent('dragEnd', {
			"elArea" : this._el,
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"nX" : parseInt(welDrag.css("left"), 10) || 0,
			"nY" : parseInt(welDrag.css("top"), 10) || 0,
			"bInterupted" : bInterupted
		});

	},
	
	/**
		DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 attach 한다. 
	**/
	_onActivate : function() {
		this._wfOnMouseDown.attach(this._el, 'mousedown');
		this._wfOnDragStart.attach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.attach(this._el, 'selectstart'); // for IE	
	},
	
	/**
		DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 detach 한다. 
	**/
	_onDeactivate : function() {
		this._wfOnMouseDown.detach(this._el, 'mousedown');
		this._wfOnDragStart.detach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.detach(this._el, 'selectstart'); // for IE
	},
	
	/**
		이벤트를 attach한다.
		
		@method attachEvent
		@deprecated activate() 사용권장
	**/
	attachEvent : function() {
		this.activate();
	},
	
	/**
		이벤트를 detach한다.
		
		@method detachEvent
		@deprecated deactivate() 사용권장
	**/
	detachEvent : function() {
		this.deactivate();
	},
	
	/**
		이벤트의 attach 여부를 가져온다.
		
		@method isEventAttached
		@deprecated isActivating() 사용권장
	**/
	isEventAttached : function() {
		return this.isActivating();
	},
	
	/**
		마우스다운이벤트와 관계없이 지정된 엘리먼트를 드래그 시작한다.
		
		@method startDragging
		@param {HTMLElement} el 드래그할 엘리먼트
		@return {Boolean} 드래그시작여부
	**/
	startDragging : function(el) {
		var elDrag = this._findDraggableElement(el);
		if (elDrag) {
			this._htDragInfo.bForceDrag = true;
			this._htDragInfo.bPrepared = true;
			this._htDragInfo.elHandle = elDrag;
			this._htDragInfo.elDrag = elDrag;
			
			this._wfOnMouseMove.attach(document, 'mousemove');
			this._wfOnMouseUp.attach(document, 'mouseup');
			return true;
		}
		return false;
	},
	
	_onMouseDown : function(we) {
		
		var mouse = we.mouse(true);
        /* 
         * IE에서 네이버 툴바의 마우스제스처 기능 사용시 우클릭하면
         * e.mouse().right가 false로 들어오므로 left 값으로만 처리하도록 수정
         * [추가] 모바일에서 동작하지 않아 이벤트 타입이 mouse인 것만 확인. 
         */ 
        if (/^mouse/.test(we.type)&&(!mouse.left || mouse.right || mouse.scrollbar)) {
            this._stopDragging(true);
            return;
        }
		
		// 드래그 할 객체 찾기
		var el = this._findDraggableElement(we.element);
		if (el) {
			var oPos = we.pos(),
				htDragInfo = this._htDragInfo;
			
			htDragInfo.bHandleDown = true;
			htDragInfo.bPrepared = true;
			htDragInfo.nButton = we._event.button;
			htDragInfo.elHandle = el;
			htDragInfo.elDrag = el;
			htDragInfo.nPageX = oPos.pageX;
			htDragInfo.nPageY = oPos.pageY;
			/**
				드래그될 handle 에 마우스가 클릭되었을 때 발생
				
				@event handleDown
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@param {Function} stop dragStart 이벤트를 발생시키지 않고 중단시킬때 호출
				@example
					// 커스텀 이벤트 핸들링 예제
					oDragArea.attach("handleDown", function(oCustomEvent){
						// 뒤따르는 dragStart 이벤트가 발생하지 않고 중단하고 싶은 경우
						oCustomEvent.stop();
					});
			**/
			if (this.fireEvent('handleDown', { 
				elHandle : el, 
				elDrag : el, 
				weEvent : we 
			})) {
				this._wfOnMouseMove.attach(document, 'mousemove');
			} 
			this._wfOnMouseUp.attach(document, 'mouseup');
			
			we.stop(jindo.$Event.CANCEL_DEFAULT);			
		}
	},
	
	_onMouseMove : function(we) {
		var htDragInfo = this._htDragInfo,
			htParam, htRect,
			oPos = we.pos(), 
			htGap = {
				"nX" : oPos.pageX - htDragInfo.nPageX,
				"nY" : oPos.pageY - htDragInfo.nPageY
			};

		// 아직 threshold 을 넘겨서 드래그하지 못한 상태면
		if (htDragInfo.bPrepared) {
			var nThreshold = this.option('nThreshold'),
				htDiff = {};
			
			// 강제로 드래그하는게 아니고 threshold 옵션이 지정되어 있으면
			if (!htDragInfo.bForceDrag && nThreshold) {
				htDiff.nPageX = oPos.pageX - htDragInfo.nPageX;
				htDiff.nPageY = oPos.pageY - htDragInfo.nPageY;
				var nDistance = Math.sqrt(htDiff.nPageX * htDiff.nPageX + htDiff.nPageY * htDiff.nPageY);
				if (nThreshold > nDistance){ // threshold 를 못 넘겼으면 그만둠
					return;
				} 
			}

			if (this._bIE && this.option("bSetCapture")) {
				this._elSetCapture = (this._el === document) ? document.body : this._findDraggableElement(we.element);
				if (this._elSetCapture) {
					this._elSetCapture.setCapture(false);
				}
			}
			 
			htParam = {
				elArea : this._el,
				elHandle : htDragInfo.elHandle,
				elDrag : htDragInfo.elDrag,
				htDiff : htDiff, //nThreshold가 있는경우 htDiff필요
				weEvent : we //jindo.$Event
			};
			
			htDragInfo.bIsDragging = true; // 드래그 중이고
			htDragInfo.bPrepared = false; // threshold 을 넘겼다고 flag 변경

			/**
				드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
				
				@event dragStart
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elArea 기준 엘리먼트
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {Object} htDiff handledown된 좌표와 dragstart된 좌표의 차이
				@param {Number} htDiff.nPageX 가로 좌표
				@param {Number} htDiff.nPageY 세로 좌표
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@param {Function} stop beforedrag 이벤트를 발생시키지 않고 중단시킬때 호출
				@example
					// 커스텀 이벤트 핸들링 예제
					oDragArea.attach("dragStart", function(oCustomEvent){
						// 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단하고 싶은 경우
						oCustomEvent.stop();
					});
			**/
			if (this.fireEvent('dragStart', htParam)) {
				var welDrag = jindo.$Element(htParam.elDrag),
					htOffset = welDrag.offset();
				
				htDragInfo.elHandle = htParam.elHandle;
				htDragInfo.elDrag = htParam.elDrag;
				htDragInfo.nX = parseInt(welDrag.css('left'), 10) || 0;
				htDragInfo.nY = parseInt(welDrag.css('top'), 10) || 0;
				htDragInfo.nClientX = htOffset.left + welDrag.width() / 2;
				htDragInfo.nClientY = htOffset.top + welDrag.height() / 2;
			} else {
				htDragInfo.bPrepared = true;
				return;
			}
		} 
				
		if (htDragInfo.bForceDrag) {
			htGap.nX = oPos.clientX - htDragInfo.nClientX;
			htGap.nY = oPos.clientY - htDragInfo.nClientY;
		}
		
		htParam = {
			"elArea" : this._el,
			"elFlowOut" : htDragInfo.elDrag.parentNode, 
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"weEvent" : we, 		 //jindo.$Event
			"nX" : htDragInfo.nX + htGap.nX,
			"nY" : htDragInfo.nY + htGap.nY,
			"nGapX" : htGap.nX,
			"nGapY" : htGap.nY
		};
		
		/**
			드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
			
			@event beforeDrag
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elArea 기준 엘리먼트
			@param {HTMLElement} elFlowOut bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {Number} nX 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
			@param {Number} nY 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
			@param {Number} nGapX 드래그가 시작된 x좌표와의 차이
			@param {Number} nGapY 드래그가 시작된 y좌표와의 차이
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@param {Function} stop drag 이벤트를 발생시키지 않고 중단시킬때 호출
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("beforeDrag", function(oCustomEvent) {
					// 뒤따르는 drag 이벤트가 발생하지 않고 중단하고 싶은 경우
					oCustomEvent.stop();
					
					// 가로로는 안 움직이게 않게 할 경우
					oCustomEvent.nX = null;
					
					// Grid 좌표로 이동하게 할 경우
					oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
					oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
					
					if(oCustomEvent.nX < 0){
						oCustomEvent.nX = 0;
					}
					
					if(oCustomEvent.nY < 0){
						oCustomEvent.nY = 0;
					}
				});
		**/
		if (this.fireEvent('beforeDrag', htParam)) {
			var elDrag = htDragInfo.elDrag;

			// 드래그 객체가 영역 밖으로 넘어가면 안되는 상황이면 계산을 통해 위치(nX, nY)를 제한
			if (this.option('bFlowOut') === false) {
				var elParent = htParam.elFlowOut,
					aSize = [ elDrag.offsetWidth, elDrag.offsetHeight ],
					nScrollLeft = 0, nScrollTop = 0;
					
				if (elParent == document.body) {
					nScrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
					nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					elParent = null;
				}
				
				var elParentSize = elParent && {
					w : Math.max(elParent.offsetWidth, elParent.scrollWidth),
					h : Math.max(elParent.offsetHeight, elParent.scrollHeight)
				};
				
				if (elParent && aSize[0] <= elParentSize.w && aSize[1] <= elParentSize.h) {
					
					htRect = { 
						nWidth : elParent.clientWidth, 
						nHeight : elParent.clientHeight
					};	
					nScrollLeft = elParent.scrollLeft;
					nScrollTop = elParent.scrollTop;
				} else {
					var	htClientSize = jindo.$Document().clientSize();
						
					htRect = {
						nWidth : htClientSize.width, 
						nHeight : htClientSize.height
					};
				}
	
				if (htParam.nX !== null) {
					htParam.nX = Math.max(htParam.nX, nScrollLeft);
					htParam.nX = Math.min(htParam.nX, htRect.nWidth - aSize[0] + nScrollLeft);
				}
				
				if (htParam.nY !== null) {
					htParam.nY = Math.max(htParam.nY, nScrollTop);
					htParam.nY = Math.min(htParam.nY, htRect.nHeight - aSize[1] + nScrollTop);
				}
			}

			if (htParam.nX !== null) { // nX 가 null 이면 변경 안함
				elDrag.style.left = htParam.nX + 'px';
			}

			if (htParam.nY !== null) { // nY 가 null 이면 변경 안함
				elDrag.style.top = htParam.nY + 'px';
			}
			
			/**
				드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
				
				@event drag
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elArea 기준 엘리먼트
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {Number} nX 드래그 된 x좌표.
				@param {Number} nY 드래그 된 y좌표.
				@param {Number} nGapX 드래그가 시작된 x좌표와의 차이
				@param {Number} nGapY 드래그가 시작된 y좌표와의 차이
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@example
					//커스텀 이벤트 핸들링 예제
					oDragArea.attach("drag", function(oCustomEvent) {
						//~~
					});
			**/
			this.fireEvent('drag', htParam);
		}else{
			htDragInfo.bIsDragging = false;
		}
	},
	
	_onMouseUp : function(we) {
		this._stopDragging(false);
		
		var htDragInfo = this._htDragInfo;
		htDragInfo.bHandleDown = false;
		/**
			드래그된 handle에 마우스 클릭이 해제됬을 때 발생
			
			@event handleUp
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("handleUp", function(oCustomEvent) {
					//~~
				});
		**/
		this.fireEvent("handleUp", {
			weEvent : we,
			elHandle : htDragInfo.elHandle,
			elDrag : htDragInfo.elDrag 
		});
	},
	
	_onDragStart : function(we) {
		if (this._findDraggableElement(we.element)) { 
			we.stop(jindo.$Event.CANCEL_DEFAULT); 
		}
	},
	
	_onSelectStart : function(we) {
		if (this.isDragging() || this._findDraggableElement(we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);	
		}
	}
	
}).extend(jindo.UIComponent);/**
	@fileOverview HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/

/**
	HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트에 Drag된 엘리먼트를 Drop 가능하게 한다.
	
	@class jindo.DropArea
	@extends jindo.Component
	@uses jindo.DragArea
	
	@keyword drop, area, 드래그&드랍, 드랍, 영역
**/
jindo.DropArea = jindo.$Class({
	/** @lends jindo.DropArea.prototype */
	
	/**
		DropArea 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement || document} el Drop될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {jindo.DragArea} htOption.oDragInstance Drop이 될 대상인 DragArea 컴포넌트의 인스턴스 (필수지정)
			@param {String} [htOption.sClassName="droppable"] 드랍가능한 엘리먼트의 클래스명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 드랍가능하게 된다.
		@example
			var oDropArea = new jindo.DropArea(document, { 
				sClassName : 'dropable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drop 가능하게 된다. 
				oDragInstance : oDragArea // (jindo.DragArea) Drop이 될 대상인 DragArea 컴포넌트의 인스턴스
			}).attach({
				dragStart : function(oCustomEvent) {
					//oDragInstance의 dragStart 이벤트에 연이어 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
					//	weEvent : (jindo.$Event) 마우스 이동 중 발생되는 jindo.$Event 객체
					//};
				},
				over : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//}
				},
				move : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	weEvent : (jindo.$Event) 마우스 이동시 발생하는 jindo의 jindo.$Event 객체
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//	nRatioX : (Number) 드랍될 엘리먼트 내부의 좌우비율
					//	nRatioY : (Number) 드랍될 엘리먼트 내부의 상하비율
					//}
				},
				out : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 엘리먼트
					//}
				}, 
				drop : function(oCustomEvent) {
					//Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
					//}
				},
				dragEnd : function(oCustomEvent) {
					//oDragInstance의 dragEnd 이벤트에 연이어 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//  aDrop : (Array) Drop 될 대상 엘리먼트의 배열
					//	nX : (Number) 드래그 된 x좌표.
					//	nY : (Number) 드래그 된 y좌표.
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el);
		
		this.option({ 
			sClassName : 'droppable', 
			oDragInstance : null 
		});
		this.option(htOption || {});
		
		this._waOveredDroppableElement = jindo.$A([]);
		
		this._elHandle = null;
		this._elDragging = null;
				
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		var oDrag = this.option('oDragInstance');
		if (oDrag) {
			var self = this;
			oDrag.attach({
				handleDown : function(oCustomEvent) {
					self._elHandle = oCustomEvent.elHandle;
					self._waOveredDroppableElement.empty(); 
				},
				dragStart : function(oCustomEvent) {
					self._reCalculate();
					/**
						oDragInstance의 dragStart 이벤트에 연이어 발생
						
						@event dragStart
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elArea 기준 엘리먼트
						@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
						@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
						@param {Object} htDiff handledown된 좌표와 dragstart된 좌표의 차이
							@param {Number} htDiff.nPageX 가로 좌표
							@param {Number} htDiff.nPageY 세로 좌표
						@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oDropArea.attach("dragStart", function(oCustomEvent) { ... });
					**/
					self.fireEvent(oCustomEvent.sType, oCustomEvent); //dragStart
					
					self._wfMouseMove.attach(document, 'mousemove'); //move
					//self._wfMouseOver.attach(self._el, 'mouseover'); //over
					//self._wfMouseOut.attach(self._el, 'mouseout');  //out
				},
				drag : function(oCustomEvent) {
					self._elDragging = oCustomEvent.elDrag; 
				},
				dragEnd : function(oCustomEvent) {
					var o = {};
					for (var sKey in oCustomEvent) {
						o[sKey] = oCustomEvent[sKey];
					}
					o.aDrop = self.getOveredLists().concat();
					
					self._clearOveredDroppableElement(oCustomEvent.weEvent, oCustomEvent.bInterupted); //drop
					/**
						oDragInstance의 dragEnd 이벤트에 연이어 발생
						
						@event dragEnd
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elArea 기준 엘리먼트
						@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
						@param {HTMLElement} elDrag 실제로 드래그 된 엘리먼트커스텀 
						@param {Array} aDrop Drop 될 대상 엘리먼트의 배열
						@param {Number} nX 드래그 된 x좌표
						@param {Number} nY 드래그 된 y좌표
						@example
							// 커스텀 이벤트 핸들링 예제
							oDropArea.attach("dragEnd", function(oCustomEvent) { ... });
					**/
					self.fireEvent(oCustomEvent.sType, o); //dragEnd
					
					self._wfMouseMove.detach(document, 'mousemove');
					//self._wfMouseOver.detach(self._el, 'mouseover');
					//self._wfMouseOut.detach(self._el, 'mouseout'); 
				},
				handleUp : function(oCustomEvent) {
					self._elDragging = null;
					self._elHandle = null;
				}
			});
		} 
	},
	
	_addOveredDroppableElement : function(elDroppable) {
		if (this._waOveredDroppableElement.indexOf(elDroppable) == -1) {
			this._waOveredDroppableElement.push(elDroppable);
			/**
				Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("over", function(oCustomEvent) { ... });
			**/
			this.fireEvent('over', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},
	
	_fireMoveEvent : function(elDroppable, oRect, oPos, we) {
		var nRatioX = (oPos.pageX - oRect.nLeft) / (oRect.nRight - oRect.nLeft);
		var nRatioY = (oPos.pageY - oRect.nTop) / (oRect.nBottom - oRect.nTop);
		/**
			Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
			
			@event move
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
			@param {Number} nRatioX 드랍될 엘리먼트 내부의 좌우비율
			@param {Number} nRatioY 드랍될 엘리먼트 내부의 상하비율
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@example
				// 커스텀 이벤트 핸들링 예제
				oDropArea.attach("move", function(oCustomEvent) { ... });
		**/
		this.fireEvent('move', {
			weEvent : we,
			elHandle : this._elHandle,
			elDrag : this._elDragging, 
			elDrop : elDroppable, 
			nRatioX : nRatioX,
			nRatioY : nRatioY
		});
	},

	_removeOveredDroppableElement : function(elDroppable) {
		var nIndex = this._waOveredDroppableElement.indexOf(elDroppable);
		if (nIndex != -1) {
			this._waOveredDroppableElement.splice(nIndex, 1);
			/**
				Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("out", function(oCustomEvent) { ... });
			**/
			this.fireEvent('out', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},

	_clearOveredDroppableElement : function(weEvent, bInterupted) {
		if (bInterupted) {
			this._waOveredDroppableElement.empty();
			return;
		}
		for (var elDroppable; (elDroppable = this._waOveredDroppableElement.$value()[0]); ) {
			this._waOveredDroppableElement.splice(0, 1);
			/**
				Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
				
				@event drop
				@param {String} sType  커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("drop", function(oCustomEvent) { ... });
			**/
			this.fireEvent('drop', {
				weEvent : weEvent,
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable 
			});
		}
	},
	
	/**
		Drag되고 있는 채, 마우스가 올라간 엘리먼트의 리스트를 구함
		
		@method getOveredLists
		@return {Array} 겹쳐진 엘리먼트 
	**/
	getOveredLists : function() {
		return this._waOveredDroppableElement ? this._waOveredDroppableElement.$value() : [];
	},
	
	_isChildOfDropArea : function(el) {
		if (this._el === document || this._el === el){
			return true;
		} 
		return this._wel.isParentOf(el);
	},
	
	_findDroppableElement : function(el) {
		if(!el) return null;
		var sClass = '.' + this.option('sClassName');		
		var elDroppable = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!this._isChildOfDropArea(el)) { //기준 엘리먼트가 document인 경우 Magnetic일때 문서밖으로 커서이동시 event 발생!
			elDroppable = null;
		}
		return elDroppable;
	},
	
	_isDragging : function() {
		var oDrag = this.option('oDragInstance');
		return (oDrag && oDrag.isDragging());
	},
	
	_onMouseMove : function(we) {		
		if (this._isDragging()) {
			
			var oPos = we.pos();

			if (we.element == this._elDragging || jindo.$Element(this._elDragging).isParentOf(we.element)) { //Magnetic
				var aItem = this._aItem;
				var aItemRect = this._aItemRect;
				
				for (var i = 0, htRect, el; ((htRect = aItemRect[i]) && (el = aItem[i])); i++) {
					if ( htRect.nLeft <= oPos.pageX && oPos.pageX <= htRect.nRight && htRect.nTop <= oPos.pageY && oPos.pageY <= htRect.nBottom ) {
						this._addOveredDroppableElement(el);
						this._fireMoveEvent(el, htRect, oPos, we);
					} else {
						this._removeOveredDroppableElement(el);
					}
				}
			} else { //Pointing

				var elDroppable = this._findDroppableElement(we.element);
				if(this.elPrevMove && this.elPrevMove != elDroppable){
					this._removeOveredDroppableElement(this.elPrevMove);
					this.elPrevMove = null;
				}
				
				// IE9에서 mousemove event의 element가 dragarea를 반환하기 때문에 droppable을 정상적으로 찾지 못함. 이 경우는 mouse pointer 위치의 element를 이용하여 droppable 탐색
				if( elDroppable==we.element || (!elDroppable && document.elementFromPoint)){
					var aScr = [
						document.documentElement.scrollLeft || document.body.scrollLeft,
						document.documentElement.scrollTop || document.body.scrollTop
					];
				 	elDroppable = this._findDroppableElement(document.elementFromPoint(oPos.pageX - aScr[0], oPos.pageY - aScr[1]));
				}
				if (!elDroppable) {
					return;
				}
				
				this.elPrevMove = elDroppable;
			
				this._addOveredDroppableElement(elDroppable);
			
				var htOffset = jindo.$Element(elDroppable).offset();
				var htArea = {
					"nLeft" : htOffset.left,
					"nTop" : htOffset.top,
					"nRight" : htOffset.left + elDroppable.offsetWidth,
					"nBottom" : htOffset.top + elDroppable.offsetHeight
				};
		
				if ( htArea.nLeft <= oPos.pageX && oPos.pageX <= htArea.nRight && htArea.nTop <= oPos.pageY && oPos.pageY <= htArea.nBottom ) {
					this._fireMoveEvent(elDroppable, htArea, oPos, we);
				}
			}
			
		}
	},
	
	_onMouseOver : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable) {
				this._addOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_onMouseOut : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable && we.relatedElement && !jindo.$Element(we.relatedElement).isChildOf(we.element)) {
				this._removeOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_getRectInfo : function(el) {
		var htOffset = jindo.$Element(el).offset();	
		return {
			nLeft : htOffset.left,
			nTop : htOffset.top,
			nRight : htOffset.left + el.offsetWidth,
			nBottom : htOffset.top + el.offsetHeight
		};
	},
	
	_reCalculate : function() {
		var aItem = jindo.$$('.' + this.option('sClassName'), this._el);
			
		if (this._el.tagName && jindo.$$.test(this._el, '.' + this.option('sClassName'))) {
			aItem.push(this._el);
		}
		
		this._aItem = aItem;
		this._aItemRect = [];
		
		for (var i = 0, el; (el = aItem[i]); i++) {
			this._aItemRect.push(this._getRectInfo(el));
		}
	},

	/**
		Drop 영역의 캐싱된 위치정보를 갱신함
		드래그 도중에 Drop 영역의 위치가 바뀌는 경우 사용 할 수 있음.
		
		@method refresh
		@return {this}
	**/
	refresh : function() {
		this._reCalculate();
		return this;
	}
}).extend(jindo.Component);
/**
	@fileOverview 트리구조를 표현하는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	트리구조를 표현하는 컴포넌트
	
	@class jindo.Tree
	@extends jindo.UIComponent
	@keyword tree, 트리
**/
jindo.Tree = jindo.$Class({
	/** @lends jindo.Tree.prototype */
	
	_bIsActivating : false, //컴포넌트의 활성화 여부
	_sTemplate : null,
	_htNodeData : null,
	_el : null,
	_elSelectedNode : null,
	
	/**
		Tree 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el 적용할 트리 엘리먼트 
		@param {Object} [htOption] 옵션객체
			@param {String} [htOption.sClassPrefix="tree-"] 클래스명 접두어
			@param {String} [htOption.sEventSelect="click"] 노드 선택을 위한 이벤트명
			@param {String} [htOption.sEventExpand="dblclick"] 자식노드를 펼치거나 접을 이벤트명
			@param {Boolean} [htOption.bExpandOnSelect=true] 레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 activate() 수행여부
		@example
			tree = new jindo.Tree(jindo.$('tree'), { 
				sClassPrefix : 'tree-', //Class Prefix
				sEventSelect : "click", //노드 선택을 위한 이벤트명
				sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
				bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
				bActivateOnload : true //로드시 activate() 수행여부
			}).attach({
				click : function(oCustomEvent) { //sEventExpand 값이 "click" 일 경우
					//자식노드를 펼치거나 접기위해 sEventSelect 옵션으로 지정된 이벤트가 발생할 때
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//	weEvent : (jindo.$Event) 클릭 이벤트 객체
					//}
					//oCustomEvent.stop(); 수행시 노드를 선택하지 않음
				},
				beforeSelect : function(oCustomEvent) {
					//노드가 선택되기 전 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
				},
				select : function(oCustomEvent) {
					//노드가 선택되었을 때 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				dblclick : function(oCustomEvent) { //sEventExpand 값이 "dblclick" 일 경우
					//자식노드를 펼치거나 접기위해 sEventExpand 옵션으로 지정된 이벤트가 발생할 때
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 이벤트가 발생한 노드
					//	weEvent : (jindo.$Event) 더블클릭 이벤트 객체
					//}
					//oCustomEvent.stop(); 수행시 자식노드를 펼치거나 접지 않음
				},
				beforeExpand : function(oCustomEvent) {
					//노드가 펼쳐지기 전에 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
				},
				expand : function(oCustomEvent) {
					//노드가 펼쳐진 후 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				beforeCollapse : function(oCustomEvent) {
					//노드가 접혀지기 전에 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 collapse 이벤트는 발생하지 않는다.
				},
				collapse : function(oCustomEvent) {
					//노드가 접혀진 후 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				beforeProcessData : function(oCustomEvent) {
					//노드를 생성할 때 (createNode) 발생한다.
					//sTemplate에 data를 파싱해 넣는 동작을 커스터마이징 할 수 있다.  
					//전달되는 이벤트객체 oCustomEvent = {
					//	sTemplate : (String) '<li class="{=nodeClass}{if lastNode} {=lastNodeClass}{/if}"><div{if hasChild} class="{=hasChildClass}"{/if}><button class="{=buttonClass}">+</button><span class="{=labelClass}" unselectable="on">{=text}</span></div></li>';
					//	htData : (HashTable) 처리중인 데이터 객체
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({ 
			sClassPrefix : 'tree-', //Default Class Prefix
			sEventSelect : "click", //노드 선택을 위한 이벤트명
			sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
			bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
			bActivateOnload : true //로드시 activate() 수행여부
		});
		this.option(htOption || {});
		
		var sPrefix = this.option('sClassPrefix');
		
		//클래스명들
		this.htClassName = {
			sNode : sPrefix + "node",
			sLastNode : sPrefix + "last-node",
			sHasChild : sPrefix + "has-child",
			sButton : sPrefix + "button",
			sLabel : sPrefix + "label",
			sSelected : sPrefix + "selected",
			sCollapsed : sPrefix + "collapsed"
		};
		
		this.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}" unselectable="on">{=sText}</span></div></li>');
		this._htNodeData = {};
		
		el = jindo.$(el);
		this._setRootList(el);
		
 		this._wfSelectHandler = jindo.$Fn(this._onSelectEvent, this);
		this._wfExpandHandler = jindo.$Fn(this._onExpandEvent, this);
		
		this._makeNodeDataKeyFromHTML(); //data를 마크업으로부터 nodedata를 생성하고 데이터를 기반으로 paint
		this.paintAllNodes();
		
		var elDefaultSelectedNode = jindo.$$.getSingle('.' + this.htClassName.sNode + ' > .' + this.htClassName.sSelected, this.getRootList());
		if (elDefaultSelectedNode) {
			this._setSelectedNode(this.getNode(elDefaultSelectedNode));
		}
		
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		var el = this.getRootList();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(el).preventTapHighlight(true);
		this._wfSelectHandler.attach(el, this.option("sEventSelect"));
		this._wfExpandHandler.attach(el, this.option("sEventExpand"));
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		var el = this.getRootList();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(el).preventTapHighlight(false);
		this._wfSelectHandler.detach(el, this.option("sEventSelect"));
		this._wfExpandHandler.detach(el, this.option("sEventExpand"));
	},
	
	_onSelectEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode) {
			return;
		}
		
		var elButton = jindo.$$.test(el, '.' + this.htClassName.sButton) ? el : jindo.$$.getSingle('! .' + this.htClassName.sButton, el);
		if (elButton) {
			if (this.isCollapsed(elNode)) {
				this.expandNode(elNode);
			} else {
				this.collapseNode(elNode);
			}
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem) {
				/**
					자식노드를 펼치거나 접기위해 sEventSelect 옵션으로 지정된 이벤트가 발생할 때
					(이벤트 이름은 sEventSelect 옵션명에 따름)
					
					@event click
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 선택될 노드
					@param {jindo.$Event} weEvent 클릭 이벤트 객체
					@param {Function} stop 수행시 노드를 선택하지 않음
					@example
						// 커스텀 이벤트 핸들링 예제
						oTree.attach("click", function(oCustomEvent) { ... });
				**/
				if (this.fireEvent(we.type, { element : elNode, weEvent : we })) {
					this.selectNode(elNode);
				}
			}
		} 
	},
	
	_onExpandEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode || !this.hasChild(elNode)) {
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htParam = { element : elNode, weEvent : we };
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem && jindo.$Element(htPart.elItem).visible()) {
				if (this.isCollapsed(elNode)) {
					/**
						자식노드를 펼치거나 접기위해 sEventExpand 옵션으로 지정된 이벤트가 발생할 때
						(이벤트 이름은 sEventExpand 옵션명에 따름)
						
						@event dblclick
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} element 이벤트가 발생한 노드
						@param {jindo.$Event} weEvent 더블클릭 이벤트 객체
						@param {Function} stop 수행시 노드를 자식노드를 펼치거나 접지 않음
						@example
							// 커스텀 이벤트 핸들링 예제
							oTree.attach("dblclick", function(oCustomEvent) { ... });
					**/
					if (this.fireEvent(we.type, htParam)) {
						this.expandNode(elNode);
					}
				} else {
					if (!this._bExpandOnSelect) {
						if (this.fireEvent(we.type, htParam)) {
							this.collapseNode(elNode);
						}
					}
				}
			}
		}
	},
	
	//paint관련
	/**
		노드를 새로 그린다.
		
		@method paintNode
		@param {HTMLElement} elNode
		@param {Boolean} bPaintChild 자식노드도 새로 그릴지 여부 (Default : true)
		@return {this}
	**/
	paintNode : function(elNode, bPaintChild) {
		if (typeof bPaintChild == "undefined") {
			bPaintChild = true;
		}
		
		this._paintNode(elNode);
		
		if (bPaintChild) {
			var aNodes = this.getChildNodes(elNode);
			for (var i = 0; i < aNodes.length; i++) {
				this.paintNode(aNodes[i]);
			}
		}
		
		return this;
	},
	
	/**
		모든 노드를 새로 그린다.
		
		@method paintAllNodes
		@param {HTMLElement} [elNode] 새로 그릴 기준 노드
		@return {this}
	**/
	paintAllNodes : function(elNode) {
		this.paintNode(elNode || this.getRootNode());
		return this;
	},
	
	/**
		노드를 새로 그린다. (자식노드가 있거나 마지막 노드일경우 클래스명 처리)
		@ignore
		@param {HTMLElement} elNode
	**/
	_paintNode : function(elNode) {
		if (!elNode) {
			return;
		}
		var htPart = this.getPartsOfNode(elNode);
		var aChildNodes = this.getChildNodes(elNode);
		var htNodeData = this.getNodeData(elNode);
		var welNode = jindo.$Element(elNode); 
		var welItem = jindo.$Element(htPart.elItem);

		delete htNodeData["_aChildren"]; //자식이 없으면 _aChildren 제거
		
		//자식이 있는지 여부		
		if (this.hasChild(elNode)) {
			welItem.addClass(this.htClassName.sHasChild);
			htNodeData["bHasChild"] = true;
			htNodeData["_aChildren"] = [];
			
			var self = this;
			jindo.$A(aChildNodes).forEach(function(elNode, i){
				htNodeData["_aChildren"].push(self.getNodeData(elNode));
			});
		} else {
			htNodeData["bHasChild"] = false;
			welItem.removeClass(this.htClassName.sHasChild);
			if (htPart.elChild) {
				htPart.elChild.parentNode.removeChild(htPart.elChild);	
			}
		}
		
		//마지막 노드인지
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
		if (htNodeData["bLastNode"]) {
			welNode.addClass(this.htClassName.sLastNode);
		} else {
			welNode.removeClass(this.htClassName.sLastNode);
		}
		elNode.parentNode.style.zoom = 1; //ie 렌더링 버그 수정!!
	},
	
	/**
		노드에 적용될 템플릿을 가져온다.
		
		@method getNodeTemplate
		@return {String}
		@example
			oTree.getNodeTemplate();
			기본 값 -> '<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>'
			
			//템플릿에 process될 값들의 Hash Table
			var htProcess = {
				sNodeClass : 노드의 클래스명
				bLastNode : 노드가 마지막인지 여부 
				sLastNodeClass : 마지막 노드의  클래스명
				bHasChild : 노드가 자식을 가지는 지 여부
				sHasChildClass : 자식을 가지는 경우의 클래스명
				sCollapsedClass : 접혀진 노드의 클래스명
				sButtonClass : 접기/펼치기 버튼의 클래스명
				sLabelClass : 레이블의 클래스명
				sText : 노드의 이름 (텍스트)
			};
	**/
	getNodeTemplate : function() {
		return this._sTemplate;
	},
	/**
		노드 생성시 노드에 적용될 템플릿을 설정한다.
		
		@method setNodeTemplate
		@param {String} s
		@return {this}
		@example
			//자식노드가 모두 접혀진 채 생성하는 예제
			oTree.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if} {=sCollapsedClass}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>');
	**/
	setNodeTemplate : function(s) {
		this._sTemplate = s;
		return this;
	},
	
	//List 관련
	/**
		노드의 트리리스트(ul 엘리먼트)를 가져온다.
		
		@method getChildListOfNode
		@param {HTMLElement} elNode
		@return {HTMLElement} ul 엘리먼트
	**/
	getChildListOfNode : function(elNode) {
		return jindo.$$.getSingle("ul", elNode);
	},
	
	/**
		트리컴포넌트그 최상위 루트 트리리스트(ul 엘리먼트)를 가져온다.
		
		@method getRootList
		@return {HTMLElement}
	**/
	getRootList : function() {
		return this._el;
	},
	
	_setRootList : function(el) {
		this._el = el;
	},
	
	//Node 관련
	/**
		특정 엘리먼트가 속해있는 노드를 구한다.
		
		@method getNode
		@param {HTMLElement} el 노드 자체, 노드의 버튼, 레이블 같이 노드의 li태그 자식 엘리먼트로부터 노드를 구할 수 있다.  
		@return {HTMLElement} 노드 (LI Element)
	**/
	getNode : function(el) {
		var elNode = jindo.$$.test(el, '.' + this.htClassName.sNode) ? el : jindo.$$.getSingle('! .' + this.htClassName.sNode, el);
		return elNode && jindo.$Element(elNode).isChildOf(this.getRootList()) ? elNode : null;
	},
	
	/**
		노드를 구성하는 요소를 구한다.
		
		@method getPartsOfNode
		@param {HTMLElement} elNode
		@return {Object}
		@example
			리턴하는 HashTable = { 
				elItem : (HTMLElement), 
				elChild : (HTMLElement) 
			}
	**/
	getPartsOfNode : function(elNode) {
		var aParts = jindo.$$('> *', elNode);
		return { elItem : aParts[0], elChild : aParts[1] };
	},
	
	/**
		노드의 타입을 구한다.
		
		@method getNodeType
		@param {HTMLElement} elNode
		@return {String} <ul><li>"root"</li><li>"internal"</li><li>"leaf"</li></ul>
	**/	
	getNodeType : function(elNode) {
		if (elNode === this.getRootNode()) {
			return "root";
		} else if (this.getChildNodes(elNode).length > 0) {
			return "internal";
		} else {
			return "leaf";
		}
	},
	
	/**
		루트노드를 구한다.
		
		@method getRootNode
		@return {HTMLElement}
	**/
	getRootNode : function() {
		if (this._elRootNode) {
			return this._elRootNode;
		}
		this._elRootNode = jindo.$$.getSingle('.' + this.htClassName.sNode, this.getRootList());
		return this._elRootNode;
	},
	
	/**
		모든 노드를 가져온다.
		
		@method getAllNodes
		@return {Array}
	**/
	getAllNodes : function() {
		return jindo.$$('.' + this.htClassName.sNode, this.getRootList());
	},
	
	/**
		자식 노드들을 가져온다.
		
		@method getChildNodes
		@param {HTMLElement} elNode 노드
		@return {Array} 자식 노드들의 배열
	**/
	getChildNodes : function(elNode) {
		var elChildList = this.getChildListOfNode(elNode);
		return elChildList ? jindo.$$('> .' + this.htClassName.sNode, elChildList) : [];
	},
	
	/**
		노드가 자식을 가지고 있는지 여부를 가져온다.
		
		@method hasChild
		@param {HTMLElement} elNode 노드
		@return {Boolean}
	**/
	hasChild : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		return htPart.elChild && htPart.elChild.getElementsByTagName('li')[0] ? true : false;
	},
	
	/**
		부모 노드를 가져온다.
		
		@method getParentNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 부모 노드
	**/
	getParentNode : function(elNode) {
		var elRootNode = this.getRootNode();
		if (elNode === elRootNode) {
			return null;
		}
		return this.getNode(elNode.parentNode);
	},
	
	/**
		이전 노드를 가져온다.
		
		@method getPreviousNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 이전 노드
	**/
	getPreviousNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('!~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
		다음 노드를 가져온다.
		
		@method getNextNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 다음 노드
	**/
	getNextNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
		선택된 엘리먼트를 가져온다.
		
		@method getSelectedNode
		@return {HTMLElement}
	**/
	getSelectedNode : function() {
		return this._elSelectedNode;
	},
	
	_setSelectedNode : function(el) {
		this._elSelectedNode = el;
	},
	
	/**
		노드가 접혀있는지 여부를 구함
		
		@method isCollapsed
		@param {HTMLElement} elNode
		@return {Boolean} 노드가 접혀있는지 여부
	**/
	isCollapsed : function(elNode) {
		return jindo.$Element(elNode).hasClass(this.htClassName.sCollapsed);
	},
	
	/**
		노드의 depth를 구한다.
		
		@method getNodeDepth
		@param {HTMLElement} elNode
		@return {Number} 노드의 depth 
	**/
	getNodeDepth : function(elNode) {
		var nDepth = -1;
		
		for (; elNode; elNode = elNode.parentNode) {
			if (elNode == this.getRootList()) {
				break;
			}
			if (jindo.$$.test(elNode, '.' + this.htClassName.sNode)) {
				nDepth++;
			}
		}
		
		return nDepth;
	},
	
	/**
		노드에 Data를 설정한다.
		
		@method setNodeData
		@param {HTMLElement} elNode
		@return {this}
		@example
			oTree.setNodeData(elNode, {
				nType : 1,
				nDepth : 3
			});
			
			oTree.getNodeData(elNode);
			-->  
			{
				bLabel : (String) 노드의 레이블 텍스트명,
				_aChildren : (Array) 자식노드데이터의 배열
				nType : 1,
				nDepth : 3,
			}
	**/
	setNodeData : function(elNode, htNodeData) {
		var sKey = this._getNodeDataKey(elNode);
		delete htNodeData["_aChildren"]; //고정 정보는 설정할 수 없도록 
		delete htNodeData["sLabel"]; //label은 setNodeLabel 메서드로 설정가능
		for (var vProp in htNodeData) {
			this._htNodeData[sKey][vProp] = htNodeData[vProp];	
		}
		return this;
	},
	
	/**
		노드의 label에 해당하는 엘리먼트를 가져온다.
		
		@method getNodeLabelElement
		@param {HTMLElement} elNode
		@return {HTMLElement} 클래스명 "label"을 가지는 엘리먼트
	**/
	getNodeLabelElement : function(elNode) {
		return jindo.$$.getSingle("." + this.htClassName.sLabel, elNode);
	},
	
	/**
		노드의 label을 가져온다.
		
		@method getNodeLabel
		@param {HTMLElement} elNode
		@return {String} label의 innerHTML
	**/
	getNodeLabel : function(elNode) {
		return jindo.$Element(this.getNodeLabelElement(elNode)).html();
	},
	
	/**
		노드의 label을 변경한다.
		
		@method setNodeLabel
		@param {HTMLElement} elNode
		@param {String} sLabel label의 innerHTML
		@return {this}
	**/
	setNodeLabel : function(elNode, sLabel) {
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey]["sLabel"] = sLabel;
		jindo.$Element(this.getNodeLabelElement(elNode)).html(sLabel);
		return this;	
	},
	
	/**
		모든 노드에 키를 생성하여 설정한다.
		@ignore
	**/
	_makeNodeDataKeyFromHTML : function() {
		var aNodes = this.getAllNodes();
		
		//루프
		for (var i = 0; i < aNodes.length; i++) {
			var elNode = aNodes[i];
			this._makeNodeDataKey(elNode);
			this._makeNodeData(elNode);
		}
	},
	
	/**
		노드의 data를 가져오기위한 키를 생성하여 설정한다.
		@ignore
		@param {HTMLElement} elNode
	**/
	_makeNodeDataKey : function(elNode) {
		var welNode = jindo.$Element(elNode);
		var sNodeDataKey = this._getNodeDataKey(elNode);
		if (sNodeDataKey) {
			return false;
		}
		
		var sPrefix = this.option('sClassPrefix');
		var sUnique = ('data-' + new Date().getTime() + parseInt(Math.random() * 10000000, 10)).toString(); //ie8 버그수정. toString 이 없으면 나중에 sUnique 값이 바뀜
		var sUniqueClass = sPrefix + sUnique;
		welNode.addClass(sUniqueClass);
		
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey] = {}; //Data Object 초기화
		
		return sKey;		
	},
	
	/**
		노드의 기본 data를 설정한다.
		@param {HTMLElement} elNode
	**/
	_makeNodeData : function(elNode) {
		var htNodeData = this.getNodeData(elNode);
		htNodeData["element"] = elNode;
		htNodeData["sLabel"] = jindo.$Element(this.getNodeLabelElement(elNode)).text();
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
	},
	
	/**
		노드의 data를 가져오기위한 키를 구한다.
		@ignore
		@param {HTMLElement} elNode
	**/
	_getNodeDataKey : function(elNode) {
		var sClassName = elNode.className;
		var sPrefix = this.option('sClassPrefix');
		
		var rKey = new RegExp('('+ sPrefix + 'data-[0-9]+)');
		if (rKey.test(sClassName)) {
			return RegExp.$1;
		}
		
		return null;
	},
	
	/**
		노드에 설정된 data를 구한다.
		
		@method getNodeData
		@param {HTMLElement} elNode 생략될 경우 전체 데이터셋을 리턴한다.
		@return {Object} 노드의 data
		@example 
			// 노드 data의 기본 구조
			{ 
				sLabel : (String) 노드명, 
				_aChildren : (Array) 자식노드 배열 
			}
	**/
	getNodeData : function(elNode) {
		return (elNode) ? this._htNodeData[this._getNodeDataKey(elNode)] : this._htNodeData;
	},
	
	/**
		노드의 데이터를 제거한다.
		부모의 children에서도 제거한다.
		@param {HTMLElement} elNode
	**/
	_clearNodeData : function(elNode) {
		//todo
		var elParentNode = this.getParentNode(elNode);
		var htNodeData = this.getNodeData(elNode);
		var sKey = this._getNodeDataKey(elNode);
		
		if (elParentNode) {
			var htParentNodeData = this.getNodeData(elParentNode);
			if(htParentNodeData) {
				var nIndex = jindo.$A(htParentNodeData["_aChildren"]).indexOf(htNodeData);
				if(nIndex > -1){
    				htParentNodeData["_aChildren"].splice(nIndex, 1);	
				}
			}
		}

		//자식의 모든 노드 데이터도 재귀로 제거한다.
		var self = this;
		if (this.hasChild(elNode)) {
			jindo.$A(this.getChildNodes(elNode)).forEach(function(elNode){
				self._clearNodeData(elNode);
			});
		}

		delete this._htNodeData[sKey];
	},
	
	/**
		노드를 펼친다.
		
		@method expandNode
		@param {HTMLElement} elNode 펼칠 노드
		@param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
		@return {this}
	**/
	expandNode : function(elNode, bChildAll) {
		/**
			노드가 펼쳐지기 전
			
			@event beforeExpand
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 펼쳐질 노드
			@param {Function} stop 수행시 노드를 자식노드를 펼치지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeExpand", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeExpand', { element : elNode })) {
			return;
		}
		
		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];

		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}
		
		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));
		}

		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).removeClass(this.htClassName.sCollapsed);
			/**
				노드가 펼쳐진 후
				
				@event expand
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 펼쳐진 노드
				@example
					// 커스텀 이벤트 핸들링 예제
					oTree.attach("expand", function(oCustomEvent) { ... });
			**/
			this.fireEvent('expand', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
		노드를 접는다.
		
		@method collapseNode
		@param {HTMLElement} elNode 접을 노드
		@param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
		@return {this}
	**/
	collapseNode : function(elNode, bChildAll) {
		/**
			노드가 접혀지기 전
			
			@event beforeCollapse
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 접혀질 노드
			@param {Function} stop 수행시 노드를 자식노드를 접지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeCollapse", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeCollapse', { element : elNode })) {
			return;
		}
		
		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];
		
		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}
		
		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));
		}
		
		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).addClass(this.htClassName.sCollapsed);
			/**
				노드가 접혀진 후
				
				@event collapse
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 접혀진 노드
				@example
					// 커스텀 이벤트 핸들링 예제
					oTree.attach("collapse", function(oCustomEvent) { ... });
			**/
			this.fireEvent('collapse', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
		노드를 선택한다.
		
		@method selectNode
		@param {HTMLElement} elNode 선택할 노드
		@return {Boolean} 선택여부
	**/
	selectNode : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		var elSelectedNode = this.getSelectedNode();
		
		var elItem = htPart.elItem;
		
		/**
			노드가 선택되기 전
			
			@event beforeSelect
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 선택될 노드
			@param {Function} stop 수행시 노드를 선택하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeSelect", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeSelect', { element : elNode })) {
			return false;
		}
		
		if (elSelectedNode != elNode) {
			this.deselectNode();
			jindo.$Element(elItem).addClass(this.htClassName.sSelected);
			
			this._setSelectedNode(elNode);
		} 
		
		/**
			노드가 선택되었을 때
			
			@event select
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 선택된 노드
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("select", function(oCustomEvent) { ... });
		**/
		this.fireEvent('select', { element : elNode });
		if (this.option("bExpandOnSelect") && elSelectedNode != elNode && this.isCollapsed(elNode)) {
			var self = this;
			this._bExpandOnSelect = true;
			setTimeout(function(){
				self._bExpandOnSelect = false;
			}, 500);
			this.expandNode(elNode);
		} 
		return true;
	},
	
	/**
		선택된 노드를 선택해제한다.
		
		@method deselectNode
		@return {this}
	**/
	deselectNode : function() {
		var elSelectedNode = this.getSelectedNode();
		if (elSelectedNode) {
			jindo.$Element(this.getPartsOfNode(elSelectedNode).elItem).removeClass(this.htClassName.sSelected);
		}
		this._setSelectedNode(null);
		return this;
	},
	
	_createChild : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (!elChild) {
			elChild = jindo.$('<ul>');
			elNode.appendChild(elChild);
		}

		try {
			return elChild;
		} finally {
			elChild = null;
		}
	},
	
	/**
		노드를 삭제한다.
		
		@method removeNode
		@param {HTMLElement} elNode 삭제할 노드
		@return {this}
	**/
	removeNode : function(elNode) {
		//루트노드틑 삭제할 수 없음
		if (!elNode || elNode === this.getRootNode()) {
			this.clearNode(elNode);
			return this;
		}

		var htNodeData = this.getNodeData(elNode);
		var elPreviousNode = htNodeData.bLastNode ? this.getPreviousNode(elNode) : null;
		
		var bLastNode = elNode.parentNode.childNodes.length == 1; 
		
		var elParentNode = this.getParentNode(elNode);
		this._clearNodeData(elNode);
		elNode.parentNode.removeChild(elNode);
		
		this.selectNode(elParentNode);
		
		// 형제중에서 마지막 노드가 삭제되는 경우 앞의 노드가 마지막 노드가 되어야 하므로 paint
		this._paintNode(elPreviousNode);
		
		if (bLastNode) {
			var htParentNodeData = this.getNodeData(elParentNode);
			htParentNodeData.bHasChild = false;
		}
		
		// 부모노드 paint
		this._paintNode(elParentNode);
		return this;
	},
	
	/**
		자식 노드를 모두 삭제한다.
		
		@method clearNode
		@param {HTMLElement} elNode 삭제할 노드들의 부모노드
		@return {Boolean} 삭제여부
	**/
	clearNode : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (elChild) {
			var aChildLi = elChild.getElementsByTagName('li');
			for (var i = 0, elChildLi; (elChildLi = aChildLi[i]); i++) {
				this._clearNodeData(elChildLi);
			}
			
			elChild.parentNode.removeChild(elChild);
			
			var htNodeData = this.getNodeData(elNode);
			htNodeData.bHasChild = false;
			
			this._paintNode(elNode);
			return true;
		} 
		return false;
	},
	
	/**
		루트를 제외한 모든 노드를 제거한다.
		
		@method clearTree
		@return {this} 
	**/
	clearTree : function() {
		this.clearNode(this.getRootNode());
		return this;
	},
	
	_moveNodes : function(elTargetNode, aNodes, fCallback) {
		for (var i = 0, elNode; (elNode = aNodes[i]); i++) {
			fCallback(elNode);
		}
	},
	
	/**
		특정 노드에 새 자식노드를 삽입한다.
		
		@method appendNode
		@param {HTMLElement} elTargetNode 삽입할 노드의 부모가 될 노드
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	appendNode : function(elTargetNode, aNodes) {
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [aNodes]);
		}
		
		var self = this;
		var elChild = this._createChild(elTargetNode);
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			var elParentNode = null;
			elParentNode = self.getParentNode(elNode);
			
			elChild.appendChild(elNode);
			
			//원래의 부모와 그 부모의 자식
			if (elParentNode) {
				self.paintNode(elParentNode, false);
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		//타겟
		this.paintNode(elTargetNode, false);
		
		//타겟의 자식 (자기 자신과 자신의 형제)
		jindo.$A(this.getChildNodes(elTargetNode)).forEach(function(elChildNode){
			self.paintNode(elChildNode, false);	
		});
		
		return this;
	},
	
	/**
		특정 노드 앞 새 노드를 삽입한다.
		
		@method insertNodeBefore
		@param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	insertNodeBefore : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}

		var self = this;
		var elChildList = elTargetNode.parentNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			
			elChildList.insertBefore(elNode, elTargetNode);
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	/**
		특정 노드 다음에 새 노드를 삽입힌다.
		
		@method insertNodeAfter
		@param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	insertNodeAfter : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}
		
		var self = this;
		var elChildList = elTargetNode.parentNode;
		var elNextNode = elTargetNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			 
			elChildList.insertBefore(elNode, elNextNode.nextSibling); 
			elNextNode = elNode;
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	_getCode : function(aData) {
		if (aData instanceof Array) {
			var aCodes = [];
			var sTemplate = this.getNodeTemplate();
		
			for (var i = 0; i < aData.length; i++) {
				var htData = aData[i];
				var htParam = { sTemplate : sTemplate, htData : htData };
				/**
					노드를 생성할 때 (createNode) 발생
					
					@event beforeProcessData
					@param {String} sType 커스텀 이벤트명
					@param {String} sTemplate 노드의 템플릿문자열
					@param {Object} htData 처리중인 데이터 객체
					@example
						// 커스텀 이벤트 핸들링 예제
						oTree.attach("beforeProcessData", function(oCustomEvent) {
						
							// sNodeClass : 노드 클래스명
							// bLastNode : 마지막 노드인지 여부
							// sLastNodeClass : 마지막 노드임을 나타내는 클래스명
							// bHasChild : 자식 노드가 있는지 여부
							// sHasChildClass : 자식 노드가 있음을 나타내는 클래스명
							// sCollapsedClass : 접혀있는 노드임을 나타내는 클래스명
							// sButtonClass : 버튼을 나타내는 클래스명
							// sLabelClass : 라벨을 나타내는 클래스명
							// sText : 노드의 텍스트
							// htData : 노드 데이터
							
							oCustomEvent.sTemplate = [
								'<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}">',
									'<div{if bHasChild} class="{=sHasChildClass}"{/if}>',
										'<button class="{=sButtonClass}">+</button>',
										'<span class="{=sLabelClass} drag-span" unselectable="on">{=sText}({=htData.sLabel})</span>',
									'</div>',
								'</li>'
							].join('');
						
						});
				**/
				this.fireEvent('beforeProcessData', htParam);
				
				var htProcess = {
					sNodeClass : this.htClassName.sNode,
					bLastNode : (i == aData.length - 1) ? true : false, 
					sLastNodeClass : this.htClassName.sLastNode,
					bHasChild : (typeof htData._aChildren != "undefined" && htData._aChildren.length > 0) ? true : false,
					sHasChildClass : this.htClassName.sHasChild,
					sCollapsedClass : this.htClassName.sCollapsed,
					sButtonClass : this.htClassName.sButton,
					sLabelClass : this.htClassName.sLabel,
					sText : htData.sLabel,
					htData : htData
				};
				
				var sCode = jindo.$Template(htParam.sTemplate).process(htProcess);
				sCode = this._getChildCode(htData._aChildren, sCode);
				aCodes.push(sCode);
			}
			return aCodes.join('\n');
		}
	},

	_getChildCode : function(elChild, sCode) {
		var sChild = elChild ? this._getCode(elChild) : '';
		if (sChild) {
			var bChanged = false;
			sCode = sCode.replace(/(<ul(\s[^>]*)*>)(<\/ul>)/i, function(_, sBegin, __, sClose) {
				bChanged = true;
				return sBegin + sChild + sClose;
			});
			if (!bChanged) {
				sCode = sCode.replace(/<\/li>/i, function(_) { return '\n<ul>' + sChild + '</ul>\n' + _; });
			}
		}
		return sCode;
	},	
	
	_setData : function(elChildListOfParentNode, aDatas) {
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elChildListOfParentNode);
		
		for (var i = 0, nLen = aNodes.length; i < nLen; i++) {
			var elNode = aNodes[i];
			var htNodeData = aDatas[i];
			
			var sKey = this._makeNodeDataKey(elNode);
			
			htNodeData.bLastNode = (i === nLen - 1); 
			
			this._htNodeData[sKey] = htNodeData;
			
			var bHasChild = htNodeData.bHasChild = (typeof htNodeData._aChildren != "undefined" && htNodeData._aChildren.length) || htNodeData.bHasChild ? true : false;
			if (bHasChild) {
				this._setData(this.getChildListOfNode(elNode), htNodeData._aChildren);
			}
		}
	},
	
	/**
		노드를 생성한다.
		
		@method createNode
		@param {Array} aDatas 생성할 노드의 정보
		@return {Array} 생성된 노드들의 배열
		@remark 노드를 생성하기 위해 하나의 노드는 sLabel 스트링이 반드시 필요하고, 자식 노드는 _aChildren 배열로 선언한다.
		@example 
			//기본적인 데이터만을 포함하여 노드를 생성하는 예제
			var aNewNodes = tree.createNode([
				{
					sLabel : '포유류',
					_aChildren : [
						{ sLabel : '고래' },
						{ sLabel : '토끼' },
						{ sLabel : '다람쥐' },
						{
							sLabel : '맹수',
							_aChildren : [
								{ sLabel : '호랑이' },
								{ sLabel : '표범' },
								{ sLabel : '사자' },
								{ sLabel : '재규어' }
							]
						}
					
					]
				},
				
				{ sLabel : '조류' }
			]);
		@example
			//노드별로 원하는 형태의 데이터를 설정하여 생성하는 예제
			var aNodes = tree.createNode([
				{
					sLabel : '포유류',
					nType : 1,
					nValue : 15
				},
				{
					sLabel : '조류',
					nType : 2,
					nValue : 20
				}
			]);
	**/
	createNode : function(aDatas) {
		var elDummy = jindo.$('<ul>');
		elDummy.innerHTML = this._getCode(aDatas);
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elDummy);
		this._setData(elDummy, aDatas);
		
		return aNodes;
	},
	
	/**
		노드를 생성할 때 적용된 노드의 원시 데이터를 가져온다.
		
		@method getNodeRawData
		@deprecated getNodeData() 사용권장
		@return {Object}
	**/
	getNodeRawData : function(elNode) {
		return this.getNodeData(elNode);
	},
	/**
		노드가 연속으로 선택된 횟수를 가져온다.
		
		@method getSelectCount
		@return {Number}
		@deprecated
	**/
	getSelectCount : function() {
		return this;
	}
	
}).extend(jindo.UIComponent);
/**
	@fileOverview 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리
	@author senxation
	@version 1.14.0
**/
/**
	자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리 컴포넌트
	
	@class jindo.DynamicTree
	@extends jindo.Tree
	
	@keyword dynamic, tree, ajax, 동적, 트리
**/
jindo.DynamicTree = jindo.$Class({
	/** @lends jindo.DynamicTree.prototype */
	
	/**
		DynamicTree 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} el 컴포넌트를 적용할 Base (기준) 엘리먼트
		@param {Object} [htOption] 옵션객체
			@param {String} [htOption.sClassPrefix="tree-"] 클래스명 접두어
			@param {String} [htOption.sUrl=""] 요청 URL
		@example
			var oDanamicTree = new jindo.DynamicTree(jindo.$('tree'), {
				sClassPrefix: 'tree-',
				sUrl : "http://ajaxui.jindodesign.com/docs/components/samples/response/DynamicTree.php"
			}).attach({
				request : function(oCustomEvent){
					//자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
					//이벤트 객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드, 
					//	htRequestParameter : { //(Object) Ajax 요청을 보낼 파라미터 객체
					//		sKey : (String) 선택된 노드의 유일한 key 값
					// 	}
					//}
					//oCustomEvent.stop() 수행시 Ajax 요청 보내지 않음
				},
				response : function(oCustomEvent){
					//응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
					//이벤트 객체 e = {
					//	htResponseJSON : (HashTable) Ajax 응답의 JSON 객체
					//}
					//oCustomEvent.stop() 수행시 응답에 대한 자식노드를 추가하지 않음
				}
			});
		@example
			// 응답 예제
			{
				sKey : 'tree-data-12452282036211399187', //부모 노드의 키
				htChildren : [
					{
						sLabel : 'node', //첫번째 자식 노드의 레이블   
						bHasChild : false //노드가 자식을 가지는지의 여부 
					},
					{
						sLabel : 'internal-node', 
						bHasChild : true
					}
				]
			}
	**/
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : {} //(Object) 파라미터
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});

		this._attachEvents();		
		this._initAjax();
	},
	
	_attachEvents : function() {
		var self = this;
		
		this.attach("beforeExpand", function(oCustomEvent){
			
			var el = oCustomEvent.element;
			
			var self = this;
			//받아온 데이터가 있는지확인
			if(self.getNodeData(el).hasOwnProperty("_aChildren") && self.getNodeData(el)._aChildren.length) {
				return;
			}
	
			var htRequestParameter = self.option("htRequestParameter");
			htRequestParameter.key = self._getNodeDataKey(el);
			var htParam = {
				element : el,
				htRequestParameter : htRequestParameter 
			};
			
			/**
				자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
				
				@event request
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 선택된 노드
				@param {Object} htRequestParameter Ajax 요청을 보낼 파라미터 객체 
					@param {String} htRequestParameter.sKey 선택된 노드의 유일한 key 값
				@example
					// 커스텀 이벤트 핸들링 예제
					oDynamicTree.attach("request", function(oCustomEvent) {
						// stop() 수행시 Ajax 요청 보내지 않음
						oCustomEvent.stop()
					});
			**/
			if (self.fireEvent("request", htParam)) {
				//데이터를 받아옴
				self._request(htParam.htRequestParameter);
			}
			else {
				oCustomEvent.stop();				
			}
		});
	},
	
	_initAjax : function() {
		var htOption = this.option();
		var sPrefix = this.option("sClassPrefix");
        var sUrl = htOption.sUrl;
		var self = this;     
		this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = {
						htResponseJSON : oResponse.json() 
					};
					
					/**
						응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
						
						@event response
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} element 선택된 노드 프로퍼티
						@param {Object} e 이벤트 객체 
							@param {Object} e.htResponseJSON Ajax 응답의 JSON 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oDynamicTree.attach("response", function(oCustomEvent) {
								// stop() 수행시 응답에 대한 자식노드를 추가하지 않음
								oCustomEvent.stop()
							});
					**/
					if (!self.fireEvent("response", htParam)) {
						return;
					}
					
					var elNode = self.createNode(htParam.htResponseJSON["aChildren"]);
					var elTargetNode = jindo.$$.getSingle("." + htParam.htResponseJSON["sKey"], self.getRootList());
					if(self.getChildListOfNode(elTargetNode)) {
						return;
					}
					self.appendNode(elTargetNode, elNode);
					
					//자식이 있는경우 닫힌상태로 append
					jindo.$A(elNode).forEach(function(el){
						if (jindo.$$.getSingle("." + sPrefix + "has-child", el)) {
							jindo.$Element(el).addClass(sPrefix + "collapsed");	
						}
					});
                } 
                catch (e) {
                }
            }
        });
	},
	
	/**
     * @ignore
     */
    _request: function(htRequestParameter){
		this._oAjax.abort();
		this._oAjax.request(htRequestParameter);	
    },
		
	/**
		노드가 자식을 가지고 있는지 여부를 가져온다. (overriding)
		
		@method hasChild
		@param {Object} elNode
		@return {Boolean}
	**/
	hasChild : function(elNode) {
		return this._htNodeData[this._getNodeDataKey(elNode)]["bHasChild"] || (this.getChildNodes(elNode).length > 0);
	},
	
	/**
		(overriding)
		@ignore
	**/
	_makeNodeData : function(elNode) {
		var oNodeData = this.getNodeData(elNode);
		oNodeData["bHasChild"] = false;
		if (jindo.$Element(this.getPartsOfNode(elNode).elItem).hasClass(this.option('sClassPrefix') + 'has-child')) {
			oNodeData["bHasChild"] = true;				
		}	
		this.$super._makeNodeData(elNode);
	}
	
}).extend(jindo.Tree);
/**
	@fileOverview iframe에 Form을 Submit하여 리프레시없이 파일을 업로드하는 컴포넌트
	@author senxation
	@version 1.14.0
**/

/**
	iframe에 Form을 Submit하여 리프레시없이 파일을 업로드하는 컴포넌트
	
	@class jindo.FileUploader
	@extends jindo.UIComponent
	
	@keyword input, file, upload, 파일, 업로드
**/
jindo.FileUploader = jindo.$Class({
	/** @lends jindo.FileUploader.prototype */
		
	_bIsActivating : false, //컴포넌트의 활성화 여부
	_aHiddenInput : [],

	/**
		컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} elFileSelect File Select. 베이스(기준) 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sUrl=""] 업로드할 서버의 url (Form 전송의 대상)
			@param {String} [htOption.sCallback=""] 업로드 이후에 iframe이 redirect될 콜백페이지의 주소
			@param {Object} [htOption.htData={}] post할 데이터 셋 (예 { blogId : "testid" })
			@param {String} [htOption.sFiletype="*"] 허용할 파일의 형식. ex) "*", "*.*", "*.jpg", "1234.*"
			@param {String} [htOption.sMsgNotAllowedExt="업로드가허용되지않는파일형식입니다"] 허용할 파일의 형식이 아닌경우에 띄워주는 경고창의 문구
			@param {Boolean} [htOption.bAutoUpload=false] 파일이 선택됨과 동시에 자동으로 업로드를 수행할지 여부 (upload 메서드 수행)
			@param {Boolean} [htOption.bAutoReset=true] 업로드한 직후에 파일폼을 리셋 시킬지 여부 (reset 메서드 수행)
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 컴포넌트 활성화여부
		@example 
			var oFileUploader = new jindo.FileUploader(jindo.$("file_select"),{
				sUrl  : 'http://ajaxui.jindodesign.com/docs/components/samples/response/FileUpload.php', //업로드할 서버의 url (Form 전송의 대상)
				sCallback : 'http://ajaxui.jindodesign.com/svnview/Jindo_Component/FileUploader/trunk/Spec/callback.html', //업로드 이후에 iframe이 redirect될 콜백페이지의 주소
				htData : {}, //post할 데이터 셋 예 { blogId : "testid" }
				sFiletype : "*", //허용할 파일의 형식. ex) "*", "*.*", "*.jpg", "1234.*"
				sMsgNotAllowedExt: "업로드가 허용되지 않는 파일형식입니다", //허용할 파일의 형식이 아닌경우에 띄워주는 경고창의 문구
				bAutoUpload : false //파일이 선택됨과 동시에 자동으로 업로드를 수행할지 여부 (upload 메서드 수행)
				bAutoReset : true // 업로드한 직후에 파일폼을 리셋 시킬지 여부 (reset 메서드 수행)
			}).attach({
				select : function(oCustomEvent) {
					//파일 선택이 완료되었을 때 발생
					//이벤트 객체 oCustomEvent = {
					//	sValue (String) 선택된 File Input의 값
					//	bAllowed (Boolean) 선택된 파일의 형식이 허용되는 형식인지 여부
					//	sMsgNotAllowedExt (String) 허용되지 않는 파일 형식인 경우 띄워줄 경고메세지
					//}
					//bAllowed 값이 false인 경우 경고문구와 함께 alert 수행 
					//oCustomEvent.stop(); 수행시 bAllowed 가 false이더라도 alert이 수행되지 않음
				},
				success : function(oCustomEvent) {
					//업로드가 성공적으로 완료되었을 때 발생
					//이벤트 객체 oCustomEvent = {
					//	htResult (Object) 서버에서 전달해주는 결과 객체 (서버 설정에 따라 유동적으로 선택가능)
					//}
				},
				error : function(oCustomEvent) {
					//업로드가 실패했을 때 발생
					//이벤트 객체 oCustomEvent = {
					//	htResult : { (Object) 서버에서 전달해주는 결과 객체. 에러발생시 errstr 프로퍼티를 반드시 포함하도록 서버 응답을 설정하여야한다.
					//		errstr : (String) 에러메시지
					// 	}
					//}
				}
			});
	**/
	$init : function(elFileSelect, htOption) {
		
		//옵션 초기화
		var htDefaultOption = {
			sUrl: '', // upload url
			sCallback: '', // callback url
			htData : {},
            sFiletype: '*',
            sMsgNotAllowedExt: "업로드가 허용되지 않는 파일형식입니다",
            bAutoUpload: false,
            bAutoReset: true,
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._el = jindo.$(elFileSelect);
		this._wel = jindo.$Element(this._el);
		this._elForm = this._el.form;
		this._aHiddenInput = [];
		
		this.constructor._oCallback = {};
		this._wfChange = jindo.$Fn(this._onFileSelectChange, this);
		
		// upload() 호출 후, 업로드가 완료되기 전에 reset() 호출하는 경우에, 삭제할 콜백함수를 참조할 이름.
		this._sFunctionName = null;
		
		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	_appendIframe : function() {
		//Iframe 설정
        var sIframeName = 'tmpFrame_' + this._makeUniqueId();
        this._welIframe = jindo.$Element(jindo.$('<iframe name="' + sIframeName + '" src="">')).css({
			position : 'absolute',
        	width : '1px',
        	height : '1px',
        	left : '-100px',
        	top : '-100px'
		});
        document.body.appendChild(this._welIframe.$value());
	},
	
	_removeIframe : function() {
		if(this._welIframe){
			this._welIframe.leave();
		}
	},
	
	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@deprecated getFileSelect() 사용권장
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this.getFileSelect();
	},
	
	/**
		File Select 엘리먼트를 가져온다.
		
		@method getFileSelect
		@return {HTMLElement}
	**/
	getFileSelect : function() {
		return this._el;
	},
	
	/**
		File Select의 해당 Form 엘리먼트를 가져온다.
		
		@method getFormElement
		@return {HTMLElement} 
	**/
	getFormElement : function() {
		return this._elForm;
	},
	
	/**
		IFrame으로 업로드를 수행한다.
		
		@method upload
	**/
	upload : function(){
		this._appendIframe();
		
		var elForm = this.getFormElement(),
			welForm = jindo.$Element(elForm),
			sIframeName = this._welIframe.attr("name"),
			sFunctionName = this._sFunctionName = sIframeName + '_func',
			sAction = this.option("sUrl");
		
		//Form 설정		
		welForm.attr({
			target : sIframeName,
			action : sAction
		});
		
		this._aHiddenInput.push(this._createElement('input', {
            'type': 'hidden',
            'name': 'callback',
            'value': this.option("sCallback")
        }));
        this._aHiddenInput.push(this._createElement('input', {
            'type': 'hidden',
            'name': 'callback_func',
            'value': sFunctionName
        }));
        for (var k in this.option("htData")) {
            this._aHiddenInput.push(this._createElement('input', {
                'type': 'hidden',
                'name': k,
                'value': this.option("htData")[k]
            }));
        }
		
		for (var i = 0; i < this._aHiddenInput.length; i++) {
			elForm.appendChild(this._aHiddenInput[i]);	
		}
		
		//callback 함수 정의
		/**
			업로드가 성공적으로 완료 되었을 때
			
			@event success
			@param {String} sType 커스텀 이벤트명
			@param {Hash} htResult 서버에서 전달해주는 결과 객체 (서버 설정에 따라 유동적으로 선택 가능)
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("success", function(oCustomEvent) { ... });
		**/
        this.constructor._oCallback[sFunctionName + '_success'] = jindo.$Fn(function(oParameter){
            if (this.option("bAutoReset")) {
                this.reset();
            }
            this._revertFormAttr();
			this.fireEvent("success", { htResult : oParameter });
			this._clear();
        }, this).bind();
        
        // temporary function - on error
		/**
			업로드가 실패 했을 때
			
			@event error
			@param {String} sType 커스텀 이벤트명
			
			@param {Hash} htResult
				서버에서 전달해주는 결과 객체, 에러 발생 시 에러메시지 문자열 값을 가지는 errstr 프로퍼티를 반드시 포함하도록 서버 응답을 설정해야 한다.
				
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("error", function(oCustomEvent) { ... });
		**/
        this.constructor._oCallback[sFunctionName + '_error'] = jindo.$Fn(function(oParameter){
            if (this.option("bAutoReset")) {
                this.reset();
            }
            this._revertFormAttr();
			this.fireEvent("error", { htResult : oParameter });
			this._clear();
        }, this).bind();
		
        // form submit and reset
        elForm.submit();
        
	},
	
    /**
     * File Select의 선택 값을 초기화한다.
     * 
     * @method reset
     * @return {this}
     */
    reset : function() {
    	
    	// 다른 폼에는 영향을 주지 않고 파일선택폼만 리셋시키기 위해 임시폼에 넣어놓고 리셋 수행
    	var elWrapForm = jindo.$("<form>");
    	this._wel.wrap(elWrapForm);
    	elWrapForm.reset();

    	jindo.$Element(elWrapForm).replace(this._el);


		var oNav = jindo.$Agent().navigator();
		if (oNav.ie && oNav.version <= 10) {
	    	var elForm = this.getFormElement();
	    	elForm.type = 'radio'; // IE10 에서 reset 되지 않는 문제 회피
	    	elForm.type = 'file';
		}

    	this._clear();
		
    	return this;
    },
    /**
     * activate 때 취했던 target, action 으로 원복 
     */
    _revertFormAttr : function(){
        var elForm = this.getFormElement(),
        welForm = jindo.$Element(elForm);
        
        welForm.attr({
            target : this._sPrevTarget,
            action : this._sAction
        });
    },
    
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		var elForm = this.getFormElement(),
			welForm = jindo.$Element(elForm);
    	
		this._sPrevTarget = welForm.attr("target");
		this._sAction = welForm.attr("action");
		
    	this._el.value = "";
		this._wfChange.attach(this._el, "change");
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		this._wfChange.detach(this._el, "change");
	},
	
	/**
		유일한 id를 랜덤하게 생성한다.
		@ignore
	**/
    _makeUniqueId: function(){
        return new Date().getMilliseconds() + Math.floor(Math.random() * 100000);
    },
	
	/**
		element를 생성한다.
		@param {Object} name
		@param {Object} attributes
		@ignore
	**/
    _createElement: function(name, attributes){
        var el = jindo.$("<" + name + ">");
		var wel = jindo.$Element(el);
        for (var k in attributes) {
            wel.attr(k, attributes[k]);
        }
        return el;
    },
	
	/**
		파일의 확장자를 검사한다.
		@param {String} sFile
		@ignore
	**/
    _checkExtension: function(sFile){
        var aType = this.option("sFiletype").split(';');
        for (var i = 0, sType; i < aType.length; i++) {
			sType = (aType[i] == "*.*") ? "*" : aType[i];
            sType = sType.replace(/^\s+|\s+$/, '');
            sType = sType.replace(/\./g, '\\.');
            sType = sType.replace(/\*/g, '[^\\\/]+');
            if ((new RegExp(sType + '$', 'gi')).test(sFile)) {
                return true;
			} 
        }
        return false;
    },
	
	/**
		선택된 파일이 바뀌었을경우 처리
		@param {jindo.$Event} we
		@ignore
	**/
	_onFileSelectChange : function(we) {
		var sValue = we.element.value,
			bAllowed = this._checkExtension(sValue),
			htParam = {
				sValue : sValue,
				bAllowed : bAllowed,
				sMsgNotAllowedExt : this.option("sMsgNotAllowedExt") 
			};
		
		/**
			파일 선택이 완료되었을 때
			
			@event select
			@param {String} sType 커스텀 이벤트명
			@param {String} sValue 선택된 File Input의 값
			@param {Boolean} bAllowed 선택된 파일의 형식이 허용되는 형식인지 여부. ( 값이 false인 경우 경고메시지 alert 수행)
			@param {String} sMsgNotAllowedExt 허용되지 않는 파일 형식인 경우 띄워줄 경고메세지
			@param {Function} stop 수행시 bAllowed 가 false이더라도 alert이 수행되지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("select", function(oCustomEvent) { ... });
		**/
		if (sValue.length && this.fireEvent("select", htParam)) {
			if (bAllowed) {
				if (this.option("bAutoUpload")) {
					this.upload();
				}
			} else {
				alert(htParam.sMsgNotAllowedExt);
			}
		}
	},
	
	/**
		업로드 완료후 호출될 콜백함수와, 파라미터 전송을 위해 생성한 <input type="hidden">엘리먼트와, <iframe>엘리먼트를 지운다.
		@ignore
	**/
	_clear : function(){
		if(this._sFunctionName != null){
			delete this.constructor._oCallback[this._sFunctionName + '_success'];
			delete this.constructor._oCallback[this._sFunctionName + '_error'];
			this._sFunctionName = null;
		}
		
		for(var i = 0, length = this._aHiddenInput.length; i < length; i++){
			jindo.$Element(this._aHiddenInput[i]).leave();
		}
		
		this._aHiddenInput.length = 0;
		this._removeIframe();
	}
}).extend(jindo.UIComponent);/**
	@fileOverview 브라우저가 스크롤되어도 항상 레이어가 따라오도록 위치를 고정시키는 컴포넌트 
	@author hooriza, modified by senxation
	@version 1.14.0
**/
 
/**
	브라우저가 스크롤되어도 항상 레이어가 따라오도록 위치를 고정시키는 컴포넌트
	
	@class jindo.FloatingLayer
	@extends jindo.UIComponent
	@uses jindo.Effect
	@uses jindo.Timer
	@uses jindo.Transition
	
	@keyword floating, layer, fixed, 플로팅, 레이어, 고정
**/
jindo.FloatingLayer = jindo.$Class({
	/** @lends jindo.FloatingLayer.prototype */ 

	/**
		FloatingLayer 컴포넌트를 생성한다.
		@constructor
		@param {String | HTMLElement} el 고정시킬 레이어 엘리먼트 (또는 id)
		@param {Object} [htOption] 옵션 객체
			@param {Number} [htOption.nDelay=0] 스크롤시 nDelay(ms) 이후에 이동
			@param {Number} [htOption.nDuration=500] Transition이 수행될 시간(ms)
			@param {Function} [htOption.fEffect=jindo.Effect.easeOut] 레이어 이동에 적용될 jindo.Effect 함수
			@param {Boolean} [htOption.bActivateOnload=true] 로드와 동시에 activate 할지 여부
		@example
			new jindo.FloatingLayer(jindo.$('LU_layer'), {
				nDelay : 0, // (Number) 스크롤시 nDelay(ms) 이후에 이동
				nDuration : 500, // (Number) Transition이 수행될 시간
				sEffect : jindo.Effect.easeOut, // (Function) 레이어 이동에 적용될 jindo.Effect 함수
				bActivateOnload : true //(Boolean) 로드와 동시에 activate 할지 여부
			}).attach({
				beforeMove : function(oCustomEvent) {
					//레이어가 이동하기 전에 발생
					//oCustomEvent.nX : 레이어가 이동될 x좌표 (number)
					//oCustomEvent.nY : 레이어가 이동될 y좌표 (number)
					//oCustomEvent.stop() 수행시 이동하지 않음
				},
				move : function() {
					//레이어 이동후 발생
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		
		this.option({
			nDelay : 0,
			nDuration : 500,
			fEffect : jindo.Effect.easeOut,
			bActivateOnload : true
		});
		
		this.option(htOption || {});
		this._htPos = this._getPosition();
		this._oTransition = new jindo.Transition().fps(60);
		this._oTimer = new jindo.Timer();
		this._wfScroll = jindo.$Fn(this._onScroll, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	/**
		사용된 jindo.Transition 컴포넌트의 인스턴스를 리턴한다.
		
		@method getTransition
		@return {jindo.Transition}
	**/
	getTransition : function() {
		return this._oTransition;
	},
	
	/**
		사용된 jindo.Timer 컴포넌트의 인스턴스를 리턴한다.
		
		@method getTimer
		@return {jindo.Timer}
	**/
	getTimer : function() {
		return this._oTimer;
	},
	
	_onActivate : function() {
		var self = this;
		setTimeout(function() { 
			self._onScroll(); 
		}, 0);
		
		this._wfScroll.attach(window, 'scroll').attach(window, 'resize');
	},
	
	_onDeactivate : function() {
		this._wfScroll.detach(window, 'scroll').detach(window, 'resize');
	},
	
	_getPosition : function() {
		var el = this._el,
			wel = this._wel,
			sLeft = el.style.left,
			sRight = el.style.right,
			sTop = el.style.top,
			sBottom = el.style.bottom,
			htPos = {
				sAlignX : sLeft ? 'left' : (sRight ? 'right' : null),
				sAlignY : sTop ? 'top' : (sBottom ? 'bottom' : null)
			},
			htOffset = wel.offset(),
			htClientSize = jindo.$Document().clientSize();
		
		switch (htPos.sAlignX) {
			case "left" :
				htPos.nX = htOffset.left;
			break;
			case "right" :
				htPos.nX = Math.max(htClientSize.width - htOffset.left - wel.width(), parseFloat(sRight));
			break;
		}

		switch (htPos.sAlignY) {
			case "top" :
				htPos.nY = htOffset.top;
			break;
			case "bottom" :
				htPos.nY = Math.max(htClientSize.height - htOffset.top - wel.height(), parseFloat(sBottom));
			break;
		}
		
		return htPos;
	},
	
	_onScroll : function() {
		var self = this;
		
		this._oTimer.start(function() {
			self._paint();
		}, this.option('nDelay'));
	},
	
	_paint : function() {
		var oDoc = document.documentElement || document,
			elBody = document.body,
			el = this._el,
			wel = this._wel,
			htPos = this._htPos,
			htScrollPos = {},
			htOffset = jindo.$Element(el).offset(), // 플로팅 객체의 위치
			nPosX, nPosY,
			htParam = { nX : null, nY : null };

		if (htPos.sAlignX) {
			switch (htPos.sAlignX) {
			case 'left':
				htScrollPos.x = oDoc.scrollLeft || elBody.scrollLeft;
				nPosX = htOffset.left - htScrollPos.x; // 스크롤 기준 선부터 얼마나 떨어져 있나
				break;
			
			case 'right':
				htScrollPos.x = (oDoc.scrollLeft || elBody.scrollLeft) + jindo.$Document().clientSize().width;
				nPosX = htScrollPos.x - (htOffset.left + wel.width());
				break;
			}
			
			htParam.nX = parseFloat(wel.css(htPos.sAlignX)) + (htPos.nX - nPosX);
		}
		
		if (htPos.sAlignY) {
			switch (htPos.sAlignY) {
			case 'top':
				htScrollPos.y = oDoc.scrollTop || elBody.scrollTop;
				nPosY = htOffset.top - htScrollPos.y; // 스크롤 기준 선부터 얼마나 떨어져 있나
				break;
			
			case 'bottom':
				htScrollPos.y = (oDoc.scrollTop || elBody.scrollTop) + jindo.$Document().clientSize().height;
				nPosY = htScrollPos.y - (htOffset.top + wel.height());
				break;
			}
			
			htParam.nY = parseFloat(wel.css(htPos.sAlignY)) + (htPos.nY - nPosY);
		}
		
		/**
			레이어가 이동하기 전
			
			@event beforeMove
			@param {String} sType 커스텀 이벤트명
			@param {Number} nX 레이어가 이동될 x좌표
			@param {Number} nY 레이어가 이동될 y좌표
			@param {Function} stop 수행시 레이어가 이동되지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oFloatingLayer.attach("stop", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent('beforeMove', htParam)) {
			var htTransition = {},
				fEffect = this.option("fEffect");
			
			if (htParam.nX !== null) {
				htTransition['@' + htPos.sAlignX] = fEffect(htParam.nX + 'px');
			}
			if (htParam.nY !== null) {
				htTransition['@' + htPos.sAlignY] = fEffect(htParam.nY + 'px');
			}
			
			var self = this;
			this._oTransition.abort().start(this.option('nDuration'), el, htTransition).start(function() {
				/**
					레이어 이동 후
					
					@event move
					@param {String} sType 커스텀 이벤트명
					@example
						// 커스텀 이벤트 핸들링 예제
						oFloatingLayer.attach("move", function(oCustomEvent) { ... });
				**/
				self.fireEvent('move');
			});
		}
	}
}).extend(jindo.UIComponent);
/**
	@fileOverview 특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
	Foggy 컴포넌트는 특정영역을 highlighting하기 위해 이외의 부분을 안개처럼 뿌옇게 가려주는 기능을 한다.
	
	@class jindo.Foggy
	@extends jindo.Component
	@uses jindo.Effect
	@uses jindo.Transition
	
	@keyword foggy, dimmed, 안개, 뿌옇게, 딤드
**/
jindo.Foggy = jindo.$Class({
	/** @lends jindo.Foggy.prototype */

	_elFog : null,
	_bFogAppended : false,
	_oExcept : null,
	_bFogVisible : false,
	_bFogShowing : false,
	_oTransition : null,
	/**
		Foggy 컴포넌트를 생성한다.
		@constructor
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="fog"] fog 레이어에 지정될 클래스명
			@param {Number} [htOption.nShowDuration=200] fog 레이어가 완전히 나타나기까지의 시간 (ms)
			@param {Number} [htOption.nShowOpacity=0.5] fog 레이어가 모두 보여졌을 때의 투명도 (0~1사이의 값)
			@param {Number} [htOption.nHideDuration=200] fog 레이어가 완전히 사라지기까지의 시간 (ms)
			@param {Number} [htOption.nHideOpacity=0] fog 레이어를 숨기기위해 적용할 투명도 (0~1사이의 값)
			@param {Function} [htOption.fShowEffect=jindo.Effect.linear] foggy 를 표시할 때 적용할 효과
			@param {Function} [htOption.fHideEffect=jindo.Effect.linear] foggy 를 숨길 때 적용할 효과
			@param {Number} [htOption.nFPS=15] 효과가 재생될 초당 frame rate
			@param {Number} [htOption.nZIndex=32000] foggy layer의 zindex
		@example
			var foggy = new jindo.Foggy({
				sClassName : "fog", //(String) fog 레이어에 지정될 클래스명
				nShowDuration : 200, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)
				nShowOpacity : 0.5, //(Number) fog 레이어가 모두 보여졌을 때의 투명도 (0~1사이의 값)
				nHideDuration : 200, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)
				nHideOpacity : 0, //(Number) fog 레이어를 숨기기위해 적용할 투명도 (0~1사이의 값)
				fShowEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 보여줄 때 적용할 효과
				fHideEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 숨길 때 적용할 효과
				nFPS : 15 //(Number) 효과가 재생될 초당 frame rate
				nZIndex : 32000 //(Number) foggy layer의 zindex. foggy에 의해 가려지지 않게 할 요소가 있는 경우에 사용 
			}).attach({
				beforeShow : function(oCustomEvent) {
					//oCustomEvent.stop(); 수행시 fog레이어를 보여주지 않음.
				},
				show : function() {
					//fog 레이어가 화면에 보여지고나서 발생
				},
				beforeHide : function(oCustomEvent) {
					//oCustomEvent.stop(); 수행시 fog레이어를 숨기지 않음.
				},
				hide : function() {
					//fog 레이어가 화면에서 숨겨지고나서 발생
				}
			});
			
			//컴포넌트에 의해 생성된 fog레이어에 대한 설정
			foggy.getFog().className = 'fog';
			foggy.getFog().onclick = function() { foggy.hide(); };
	**/
	$init : function(htOption) {
		this.option({
			sClassName : "fog",
			nShowDuration : 200,
			nShowOpacity : 0.5,
			nHideDuration : 200,
			nHideOpacity : 0,
			fShowEffect : jindo.Effect.linear,
			fHideEffect : jindo.Effect.linear,
			nFPS : 15,
			nZIndex : 32000
		});
		this.option(htOption || {});

		this._elFog = jindo.$('<div class="' + this.option("sClassName") + '">');
		this._welFog = jindo.$Element(this._elFog);
		document.body.insertBefore(this._elFog, document.body.firstChild);
		this._welFog.opacity(this.option('nHideOpacity'));
		this._welFog.hide();

		this._oExcept = {};

		this._oTransition = new jindo.Transition().fps(this.option("nFPS"));

		this._fOnResize = jindo.$Fn(this._fitFogToDocument, this);
		this._fOnScroll = jindo.$Fn(this._fitFogToDocumentScrollSize, this);
	},

	_getScroll : function(wDocument) {
		return {
			top : window.pageYOffset || document[wDocument._docKey].scrollTop,
			left : window.pageXOffset || document[wDocument._docKey].scrollLeft
		};
	},

	_fitFogToDocument : function() {
		var wDocument = jindo.$Document();

		this._elFog.style.left = this._getScroll(wDocument).left + 'px';
		this._elFog.style.width = "100%";

		var self = this;
		clearTimeout(this._nTimer);
		this._nTimer = null;

		//가로스크롤이 생겼다 사라지는경우의 버그를 수정하기위한 setTimeout
		this._nTimer = setTimeout(function(){

			var oSize = wDocument.clientSize();

			self._elFog.style.top = self._getScroll(wDocument).top + 'px';
			self._elFog.style.height = oSize.height + 'px';

			self._elFog.style.left = self._getScroll(wDocument).left + 'px';

		}, 100);
	},

	_fitFogToDocumentScrollSize : function() {
		var oSize = jindo.$Document().scrollSize();
		this._elFog.style.left = "0";
		this._elFog.style.top = "0";
		this._elFog.style.width = oSize.width + 'px';
		this._elFog.style.height = oSize.height + 'px';
	},

	/**
		생성된 fog 레이어 엘리먼트를 가져온다.
		
		@method getFog
		@return {HTMLElement} fog 레이어 엘리먼트
	**/
	getFog : function() {
		return this._elFog;
	},

	/**
		fog 레이어가 보여졌는지 여부를 가져온다.
		
		@method isShown
		@return {Boolean}
	**/
	isShown : function() {
		return this._bFogVisible;
	},

	/**
		fog 레이어가 보여지고 있는 상태인지 여부를 가져온다.
		
		@method isShowing
		@return {Boolean}
	**/
	isShowing : function() {
		return this._bFogShowing;
	},
	
	/**
		fog 레이어를 보여준다. (elExcept는 가리지 않는다.)
		
		@method show
		@param {HTMLElement} elExcept
	**/
	show : function(elExcept) {
		if (!this._bFogVisible) {
			/**
				foggy 가 표시되기 직전
				
				@event beforeShow
				@param {String} sType 커스텀 이벤트명
				@param {Number} nValue 변경하려 한 값
				@param {Number} nMin 옵션에서 정의한 최소값
				@param {Number} nMax 옵션에서 정의한 최대값
				@param {Function} stop Foggy 를 표시하는 것을 중단하는 메서드
				@example
					// 커스텀 이벤트 핸들링 예제
					oFoggy.attach("beforeShow", function(oCustomEvent) {
						oCustomEvent.stop(); //수행시 foggy를 표시하지 않음.
					});
			**/
			if (this.fireEvent('beforeShow')) {
				if (elExcept) {
					this._oExcept.element = elExcept;
					var sPosition = jindo.$Element(elExcept).css('position');
					if (sPosition == 'static') {
						elExcept.style.position = 'relative';
					}

					this._oExcept.position = elExcept.style.position;
					this._oExcept.zIndex = elExcept.style.zIndex;
					elExcept.style.zIndex = this.option('nZIndex')+1;
				}

				this._elFog.style.zIndex = this.option('nZIndex');
				this._elFog.style.display = 'none';

				this._fitFogToDocument();
				this._fOnResize.attach(window, "resize");
				this._fOnScroll.attach(window, "scroll");

				this._elFog.style.display = 'block';

				// IE7 에서 데모페이지의 static 클릭했을때 두번째부터 반응없는 현상 회피
				if (elExcept) {
					elExcept.style.zoom = 1;
					elExcept.style.zoom = '';
				}

				var self = this;
				this._bFogShowing = true;
				this._oTransition.abort().start(this.option('nShowDuration'),
					this._elFog, { '@opacity' : this.option("fShowEffect")(this.option('nShowOpacity')) }
				).start(function() {
					self._bFogVisible = true;
					self._bFogShowing = false;
					/**
						foggy 가 표시되는 시점
						
						@event show
						@param {String} sType 커스텀 이벤트명
						@example
							// 커스텀 이벤트 핸들링 예제
							oFoggy.attach("show", function(oCustomEvent) { ... });
					**/
					self.fireEvent('show');
				});
			}
		}
	},

	/**
		fog 레이어를 숨긴다.
		
		@method hide
	**/
	hide : function() {
		if (this._bFogVisible || this._bFogShowing) {
			/**
				foggy 가 사라지기 직전
				
				@event beforeHide
				@param {String} sType 커스텀 이벤트명
				@param {Number} nValue 변경하려 한 값
				@param {Number} nMin 옵션에서 정의한 최소값
				@param {Number} nMax 옵션에서 정의한 최대값
				@example
					// 커스텀 이벤트 핸들링 예제
					oFoggy.attach("beforeHide", function(oCustomEvent) {
						oCustomEvent.stop(); //수행시 foggy를 숨기지 않음.
					});
			**/
			if (this.fireEvent('beforeHide')) {
				var self = this;

				this._oTransition.abort().start(this.option('nHideDuration'),
					this._elFog, { '@opacity' : this.option("fHideEffect")(this.option('nHideOpacity')) }
				).start(function() {
					self._elFog.style.display = 'none';

					var elExcept = self._oExcept.element;
					if (elExcept) {
						elExcept.style.position = self._oExcept.position;
						elExcept.style.zIndex = self._oExcept.zIndex;
					}
					self._oExcept = {};
					self._fOnResize.detach(window, "resize");
					self._fOnScroll.detach(window, "scroll");
					self._bFogVisible = false;
					/**
						foggy 가 사라지는 시점
						
						@event hide
						@param {String} sType 커스텀 이벤트명
						@param {Number} nValue 변경하려 한 값
						@param {Number} nMin 옵션에서 정의한 최소값
						@param {Number} nMax 옵션에서 정의한 최대값
						@example
							// 커스텀 이벤트 핸들링 예제
							oFoggy.attach("hide", function(oCustomEvent) { ... });
					**/
					self.fireEvent('hide');
				});
			}
		}
	}
}).extend(jindo.Component);
/**
	@fileOverview Text Input의 Caret에 대한 제어를 가능하게 하는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	Text Input의 Caret에 대한 제어를 가능하게 하는 컴포넌트
	TextRange 컴포넌트는 Text Input에서 Caret에 대한 control을 가능하게 한다.
	
	@class jindo.TextRange
	@extends jindo.UIComponent
	@see jindo.Formatter
	@see jindo.NumberFormatter
	@keyword textrange, range, 텍스트레인지
**/
jindo.TextRange = jindo.$Class({
	/** @lends jindo.TextRange.prototype */
	/**
		TextRange 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el 대상 TextInput 엘리먼트
		@param {Object} [htOption] 옵션 해시테이블
			@param {Boolean} [htOption.bActivateOnload=true] 초기화시 activate() 수행 여부
		@example
			var oTextRange = new jindo.TextRange(jindo.$("foo"), {
				bActivateOnload : true //인스턴스화이후 activate수행 여부
			});
	**/	
	$init : function(el, htOption) {
		this.option({
			bActivateOnload : true
		});
		this.option(htOption || {});
		this._el = jindo.$(el);
		this._bFocused = false;
		
		this._wfFocus = jindo.$Fn(function() { this._bFocused = true; }, this);
		this._wfBlur = jindo.$Fn(function() { this._bFocused = false; }, this);
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onActivate : function() {
		this._wfFocus.attach(this._el, 'focus').attach(this._el, 'keydown');
		this._wfBlur.attach(this._el, 'blur');
	},
	
	_onDeactivate : function() {
		this._wfFocus.detach(this._el, 'focus').detach(this._el, 'keydown');
		this._wfBlur.detach(this._el, 'blur');
	},
	
	/**
		TextInput에 focus 되어있는지 여부를 가져온다.
		
		@method hasFocus
		@return {Boolean} TextInput에 focus 되어있는지 여부
	**/
	hasFocus : function() {
		return this._bFocused;
	},
	
	/**
		Caret이 선택된 영역을 가져온다.
		
		@method getSelection
		@return {Array} Caret의 시작위치와 끝위치
		
		@see http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
	**/
	getSelection : function() {
		var el = this._el;
		var aSelection = [ -1, -1 ];

		var sNormalizedValue,
			oTextInputRange, oEndRange,
			nStart, nEnd, nLen;
		
		if (isNaN(this._el.selectionStart)) { //IE
			
			var oRange = document.selection.createRange();
	
			if (oRange && oRange.parentElement() == el) {
				nLen = el.value.length;
				sNormalizedValue = el.value.replace(/\r\n/g, "\n");
	
				oTextInputRange = el.createTextRange();
				oTextInputRange.moveToBookmark(oRange.getBookmark());
	
				oEndRange = el.createTextRange();
				oEndRange.collapse(false);
	
				if (oTextInputRange.compareEndPoints("StartToEnd", oEndRange) > -1) {
					nStart = nEnd = nLen;
				} else {
					nStart = -oTextInputRange.moveStart("character", -nLen);
					nStart += sNormalizedValue.slice(0, nStart).split("\n").length - 1;
	
					if (oTextInputRange.compareEndPoints("EndToEnd", oEndRange) > -1) {
						nEnd = nLen;
					} else {
						nEnd = -oTextInputRange.moveEnd("character", -nLen);
						nEnd += sNormalizedValue.slice(0, nEnd).split("\n").length - 1;
					}
				}
				
			}
			
		} else {
			nStart = el.selectionStart;
			nEnd = el.selectionEnd;
		}
	
		return [ nStart, nEnd ];
	},
	
	/**
		Caret의 선택영역을 설정한다.
		
		@method setSelection
		@remark nStart, nEnd를 동일하게 지정하거나 nEnd 생략시 nStart로 지정된 위치로 캐럿을 이동한다. 
		@param {Number} nStart 시작지점
		@param {Number} [nEnd] 끝지점
	**/
	setSelection : function(nStart, nEnd) {
		var el = this._el;
		if (typeof nEnd == 'undefined') {
			nEnd = nStart;
		}
		
		if (el.setSelectionRange) {
			el.setSelectionRange(nStart, nEnd);
		} else if (el.createTextRange) { //IE
			var oRange = el.createTextRange();
			oRange.collapse(true);
			oRange.moveStart("character", nStart);
			oRange.moveEnd("character", nEnd - nStart);
			oRange.select();
		}
	},
	
	/**
		선택된 selection의 문자열을 가져옴
		
		@method copy
		@return {String} 선택된 selection의 문자열
	**/
	copy : function() {
		if (!this._bFocused) {
			this._el.focus();
		}
		var aSelection = this.getSelection();
		return this._el.value.substring(aSelection[0], aSelection[1]);
	},

	/**
		선택된 selection에 문자열을 붙여넣음
		
		@method paste
		@param {String} sStr 붙여넣을 문자열
	**/
	paste : function(sStr) {
		if (!this._bFocused) {
			this._el.focus();
		}
		
		var el = this._el,
			aSelection = this.getSelection(),
			sValue = el.value,
			sPre = sValue.substr(0, aSelection[0]),
			sPost = sValue.substr(aSelection[1]);
	
		sValue = sPre + sStr + sPost;
		el.value = sValue;
	
		this.setSelection(aSelection[0] + sStr.length);
	},
	
	/**
		선택된 selection의 문자열을 잘라냄
		
		@method cut
		@return {String} 선택된 selection의 문자열
	**/
	cut : function() {
		var s = this.copy();
		this.paste("");
	
		return s;
	}
}).extend(jindo.UIComponent);
/**
	@fileOverview Text Input의 값을 특정한 형식으로 변환하는 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	Text Input의 값을 특정한 형식으로 변환하는 컴포넌트
	Formatter 컴포넌트는 입력 컨트롤 (input[type=text], textarea)의 값을 특정한 형식으로 변환한다.
	
	@class jindo.Formatter
	@extends jindo.UIComponent
	@uses jindo.TextRange
	
	@keyword formatter, 포맷터, input, text, 형식
**/
jindo.Formatter = jindo.$Class({
	/** @lends jindo.Formatter.prototype */
	
	_aMarks : [ '\u0000', '\uFFFF' ],
	
	_sPrevValue : null,
	_oTextRange : null,
	_bFakeFocus : false,
	
	/**
		Formatter 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} el 컴포넌트를 적용할 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {Boolean} [htOption.bPaintOnload=true] 로드시에 paint() 수행여부
			@param {Boolean} [htOption.bActivateOnload=true] 로드시에 activate() 수행여부
		@example 
			var oFormatter = new jindo.Formatter(jindo.$('foo'), {
				bPaintOnload : true, //로드시에 paint() 수행여부
				bActivateOnload : true //로드시에 activate() 수행여부
			}).attach({
				focus : function(oCustomEvent) {
					//입력 컨트롤에 focus되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
					//}
				},
				beforeChange : function(oCustomEvent) {
					//입력된 값이 정해진 형식으로 변경되기 전에 발생 
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
					//	sText : (String) 입력 컨트롤의 값
					//	sStartMark : (String) 캐럿의 시작위치를 계산하기 위한 임시 문자  
					//	sEndMark : (String) 캐럿의 마지막위치를 계산하기 위한 임시 문자
					//} 
				},
				change : function(oCustomEvent) {
					//입력된 값이 정해진 형식으로 변경된 후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
					//}
				},
				blur : function(oCustomEvent) {
					//입력 컨트롤이 blur되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elInput : (HTMLElement) 입력 컨트롤 엘리먼트
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this.option({
			bPaintOnload : true, //로드시에 paint() 수행여부
			bActivateOnload : true //로드시에 activate() 수행여부
		});
		this.option(htOption || {});
		this.isOpera = jindo.$Agent().navigator.opera;
		
		var self = this;
		this._wfRealBlur = jindo.$Fn(this._realBlur, this);
		this._wfRealFocus = jindo.$Fn(this._realFocus, this);
		this._oTextRange = new jindo.TextRange(el);

		var oAgent = jindo.$Agent().navigator();

		jindo.$Fn(this._onInput, this).
			attach(this._el, oAgent.ie && oAgent.version < 9 ? 'keydown' : 'input').
			attach(this._el, 'paste');

		if (this.option("bPaintOnload")) {
			this._onInput();
		}

		if (this.option("bActivateOnload")) {
			this.activate();		
		}
	},

	_onInput : function() {
		var self = this;
		setTimeout(function() { self.paint(); }, 1);
	},
	
	_splice : function(sStr, nIndex, nHowMany, sInsert) {
		return sStr.slice(0, nIndex) + sInsert + sStr.slice(nIndex + nHowMany);
	},
	
	/**
		Text Input의 값을 설정한다.
		 값이 설정된 후 paint()가 수행되며 정해진 형식으로 변환된다.
		
		@method setValue
		@param {String} s Text Input의 값
		@return {this}
	**/
	setValue : function(s) {
		this._el.value = s;
		this.paint();
		return this;
	},
	
	/**
		Formatter 컴포넌트를 수행한다.
		Text Input에 입력이 있는 경우 beforeChange 이벤트 발생. 값이 바뀌었을때 change 이벤트가 발생한다.
		
		@method paint
		@return {this} 
	**/
	paint : function() {
		var el = this._el,
			oTextRange = this._oTextRange,
			aMark = this._aMarks,
			sText = el.value.toString(),
			bFocus = oTextRange.hasFocus(),
			aSel,
			htParam;
		
		if (bFocus) {
			aSel = [ -1, -1 ];
			try { 
				aSel = oTextRange.getSelection();
			} catch(e) { }
			
			sText = this._splice(this._splice(sText, aSel[1], 0, aMark[1]), aSel[0], 0, aMark[0]);
		}
		
		htParam = { 
			elInput : el, 
			sText : sText, 
			sStartMark : aMark[0], 
			sEndMark : aMark[1] 
		};
		
		/**
			입력된 값이 정해진 형식으로 변경되기 전
			
			@event beforeChange
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elInput 입력 컨트롤 엘리먼트
			@param {String} sText 입력 컨트롤의 값
			@param {String} sStartMark 캐럿의 시작위치를 계산하기 위한 임시 문자
			@param {String} sEndMark 캐럿의 마지막위치를 계산하기 위한 임시 문자
			@param {Function}stop  수행시 입력된 값을 변경하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oFormatter.attach("beforeChange", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent('beforeChange', htParam)) {
			var sOutput = htParam.sText;

			if (bFocus) {
				var nPos = sOutput.indexOf(aMark[0]);
				if (nPos > -1) {
					sOutput = this._splice(sOutput, nPos, 1, '');
				}
				
				aSel = [nPos];
				aSel[1] = sOutput.indexOf(aMark[1]);
				if (aSel[1] > -1) {
					sOutput = this._splice(sOutput, aSel[1], 1, '');
				}
				
				var self = this;
				setTimeout(function(){
					self._bFakeFocus = true;
					(!this.isOpera)||el.blur(); //opera 10.10의 경우 blur() focus()를 수행해도 focus 먼저 발생하기때문에 순서대로 수행되도록 수정
				}, 1);
				
				setTimeout(function(){

					el.blur();
					el.value = sOutput;
					el.focus();
					try {
						oTextRange.setSelection(aSel[0], aSel[1]);
					} catch(e) {}
					/**
						입력된 값이 정해진 형식으로 변경된 후
						
						@event change
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elInput 입력 컨트롤 엘리먼트
						@example
							// 커스텀 이벤트 핸들링 예제
							oFormatter.attach("change", function(oCustomEvent) { ... });
					**/
					self.fireEvent('change', {
						elInput: el
					});
				}, 2);
				
				setTimeout(function(){
					self._bFakeFocus = false;
				}, 20);
			} else {
				el.value = sOutput;
				this.fireEvent('change', {
					elInput: el
				});
			}
		}
		
		return this;
	},
	
	_realBlur : function() {
		if (!this._bFakeFocus) {
			/**
				입력 컨트롤이 blur되었을 때
				
				@event blur
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elInput 입력 컨트롤 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oFormatter.attach("blur", function(oCustomEvent) { ... });
			**/
			this.fireEvent("blur", {
				elInput : this._el
			});
		}
	},
	
	_realFocus : function() {
		if (!this._bFakeFocus) {
			/**
				입력 컨트롤에 focus되었을 때
				
				@event focus
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elInput 입력 컨트롤 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oFormatter.attach("focus", function(oCustomEvent) { ... });
			**/
			this.fireEvent("focus", {
				elInput : this._el
			});
		}
	},
	
	_onActivate : function() {
		this._wfRealBlur.attach(this._el, "blur");
		this._wfRealFocus.attach(this._el, "focus");
	},
	
	_onDeactivate : function() {
		this._wfRealBlur.detach(this._el, "blur");
		this._wfRealFocus.detach(this._el, "focus");
	}
}).extend(jindo.UIComponent);/**
	@fileOverview 문서내의 Text 노드를 Text Input으로 변환시켜 즉시 수정할 수 있게해주는 컴포넌트
	@author senxation
	@version 1.14.0
**/

/**
	문서내의 Text 노드를 Text Input으로 변환시켜 즉시 수정할 수 있게해주는 컴포넌트
	
	@class jindo.InlineTextEdit
	@extends jindo.Component
	
	@keyword inline, input, edit, 인라인, 수정
**/
jindo.InlineTextEdit = jindo.$Class({
	/** @lends jindo.InlineTextEdit.prototype */
	
	_bIsEditing : false,
	
	/**
		@constructor
		@param {Object} [htOption] 옵션
			@param {HTMLElement} [htOption.elInput] 수정시 표시될 Input 엘리먼트 (또는 textarea)<br/>기본 값 : `jindo.$('<input type="text">'`)
			@param {Boolean} [htOption.bHandleBlur=true] 수정중인 Input 엘리먼트에서 blur되었을 때 적용(apply())할지 여부
			@param {Boolean} [htOption.bHandleKeyDown=true] enter키 입력시 적용/esc키 입력시 취소를 적용할지 여부
		@example
			var oInlineTextEdit = new jindo.InlineTextEdit({
				elInput : jindo.$('<input type="text">') 수정시 표시될 Input 엘리먼트
			}).attach({
				beforeChange : function(oCustomEvent) {
					//수정이 성공적으로 완료되고 수정된 값이 적용되기 전에 발생
					//oCustomEvent = {
					//	sText : (String) 수정될 값, 핸들러내에서 수정가능
					//	elInput : (HTMLElement) 수정을 위해 표시된 Input 엘리먼트
					//	elText : (HTMLElement) 수정될 엘리먼트
					//};
					//oCustomEvent.stop(); 수행시 elText의 값이 변경되지 않고 change 커스텀 이벤트가 발생하지 않음
				},
				change : function(oCustomEvent) {
					//수정된 값이 적용된 이후에 발생
					//oCustomEvent = {
					//	sText : (String) 수정된 값
					//	elInput : (HTMLElement) 수정을 위해 표시된 Input 엘리먼트
					//	elText : (HTMLElement) 수정된 엘리먼트
					//};
				}
			});
	**/
	$init : function(htOption) {
		var htDefaultOption = {
			elInput : jindo.$('<input type="text">'),
			bHandleBlur : true,
			bHandleKeyDown : true
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._wfBlur = jindo.$Fn(this._onBlur, this);
		this._wfKeyDown = jindo.$Fn(this._onKeyDown, this);
	},
	
	/**
		수정시 보여지는 입력컨트롤 엘리먼트를 리턴한다.
		
		@method getTextInput
		@return {HTMLElement}
	**/
	getTextInput : function() {
		return this._getTextInput().$value();
	},
	
	_getTextInput : function() {
		if (this._welInput && this._welInput.$value()) {
			return this._welInput;
		} else {
			return (this._welInput = jindo.$Element(this.option("elInput")));
		}
	},
	
	_resize : function(elFrom, elTo) {
		var wel = jindo.$Element(elFrom);
		var welTo = jindo.$Element(elTo);
		welTo.width(wel.width()).height(wel.height());
	},
	
	/**
		수정중인지 여부를 가져온다.
		
		@method isEditing
		@return {Boolean}
	**/
	isEditing : function() {
		return this._bIsEditing;
	},
	
	/**
		지정된 엘리먼트를 수정한다.
		수정 이후에 입력컨트롤이 blur되면 수정된 값이 반영되고, 수정중 esc키가 입력되면 수정이 취소된다.
		
		@method edit
		@param {HTMLElement} el 수정할 엘리먼트
		@param {HTMLElement} elGetSizeFrom Text Input의 사이즈를 지정하기위해 사이즈를 구할 엘리먼트 (생략시 기본값은 el)
		@return {this} 
		@example
			oInlineTextEdit.edit(jindo.$("text"));
	**/
	edit : function(el, elGetSizeFrom) {
		var wel = jindo.$Element(el),
			welInput = this._getTextInput(),
			elInput = welInput.$value();
		
		this._welHidden = wel;
		wel.after(elInput);
		this._resize(elGetSizeFrom || el, elInput);
		wel.hide();
		elInput.value = wel.text();	
		elInput.focus();
		
		this._bIsEditing = true;
		if (this.option("bHandleBlur")) {
			this._wfBlur.attach(elInput, "blur");
		}
		if (this.option("bHandleKeyDown")) {
			this._wfKeyDown.attach(elInput, "keydown");
		}
		return this;
	},
	
	/**
		수정중인 내용을 적용한다.
		
		@method apply
		@return {this}
	**/
	apply : function() {
		if (this.isEditing()) {
			var welInput = this._getTextInput(),
				elInput = welInput.$value(),
				sText = elInput.value,
				htCustomEvent = {
					sText : sText,
					elInput : elInput,
					elText : this._welHidden.$value()
				};
			
			/**
				수정이 성공적으로 완료되고 수정된 값이 적용되기 전
				
				@event beforeChange
				@param {String} sType 커스텀 이벤트명
				@param {String} sText 수정될 값, 핸들러내에서 변경가능
				@param {HTMLElement} elInput 수정을 위해 표시된 Input 엘리먼트
				@param {HTMLElement} elText 수정될 엘리먼트
				@param {Function} stop 수행시 elText의 값이 변경되지 않고 change 커스텀 이벤트가 발생하지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oInlineTextEdit.attach("beforeChange", function(oCustomEvent) { ... });
			**/
			if (this._welHidden.text() != sText && this.fireEvent("beforeChange", htCustomEvent)) {
				this._welHidden.text(htCustomEvent.sText).show();
				this._bIsEditing = false;
				/**
					수정된 값이 적용된 이후
					
					@event change
					@param {String} sType 커스텀 이벤트명
					@param {String} sText 수정된 값, 핸들러내에서 변경가능
					@param {HTMLElement} elInput 수정을 위해 표시된 Input 엘리먼트
					@param {HTMLElement} elText 수정된 엘리먼트
					@example
						// 커스텀 이벤트 핸들링 예제
						oInlineTextEdit.attach("change", function(oCustomEvent) { ... });
				**/
				this.fireEvent("change", htCustomEvent);
			} else {
				this._welHidden.show();
			}
			this._wfBlur.detach(elInput, "blur").detach(elInput, "keydown");
			welInput.leave();
		}
		
		return this;
	},
	
	/**
		수정중인 내용을 취소한다.
		
		@method cancel
		@return {this}
	**/
	cancel : function() {
		if (this.isEditing()) {
			var welInput = this._getTextInput(), elInput = welInput.$value();
			
			this._welHidden.show();
			this._bIsEditing = false;
			this._wfBlur.detach(elInput, "blur").detach(elInput, "keydown");
			welInput.leave();
		}
		
		return this;
	},
	
	_onBlur : function(we) {
		this.apply();
	}, 
	
	_onKeyDown : function(we) {
		switch (we.key().keyCode) {
			case 27 : 
				this.cancel();
			break;
			case 13 :
				if (this.getTextInput().tagName.toLowerCase() == "input") {
					this.apply();
				} 
			break;
		}
	}
}).extend(jindo.Component);
/**
	지정한 방법으로 진행되는 애니메이션 동작의 특정 시점의 상황으로 만들어 주는 컴포넌트

	@author hooriza
	@version 1.14.0
	
	@class jindo.Keyframe
	@extends jindo.Component
	@uses jindo.Effect
	@keyword 애니메이션, animation, transition, keyframe
**/
jindo.Keyframe = jindo.$Class({

	/**
		Keyframe 컴포넌트를 생성한다.

		@constructor
		@param {Hash} [oOption] 옵션
			@param {Function} [oOption.fEffect=jindo.Effect.linear] 기본 애니메이션 효과
	**/
	$init : function(oOptions) {

		this._nCurValue = null;
		this._nCurIdx = null;

		this._aKeyframeLists = [];
		this._oPreprocessed = null;
		this._bPreprocessed = false;

		this._oRAF = null;

		var oAgent = jindo.$Agent();
		var oOS = oAgent.os();
		var oNavigator = oAgent.navigator();

		this._bHasTransformRenderBug = oOS.ios && parseInt(oOS.version, 10) === 5 && oNavigator.msafari;

		this.option({ fEffect : jindo.Effect.linear, nAnimationDuration : 0 });
		this.option(oOptions || {});

		this._fDefaultEffect = this.option('fEffect')();

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////

	// 비동기 preprocess 을 위해 for-loop 대신에 사용
	_loop : function(bAsync, nLen, fBody, fDone) {

		(function loop(i) {

			fBody(i);

			if (++i < nLen) {

				if (bAsync) {
					(window.requestAnimationFrame || window.setTimeout)(
						function() { loop(i); }, 1000 / 60
					);
				} else {
					loop(i);
				}

				return;
			}

			fDone();

		})(0);

	},

	// preprocess 구현
	_preprocessKeyframes : function(bPreprocessAsync) {

		if (this._bPreprocessed) {
			this.fireEvent('preprocessEnd');
			return;
		}

		if (this._oPreprocessed) { return; }

		this._oPreprocessed = { objs : {}, frames : null };

		var aBefore = this._aKeyframeLists.sort(function(a, b) { return a.frame - b.frame; });
		var oAfter = {}, aAfter = [];

		var oIngFrame = {};
		var oFirstFrame = {}; // 맨 처음 frame 객체

		var self = this;

		// dynamic 속성 셋팅
		var step1 = function() {

			self._loop(bPreprocessAsync, aBefore.length, function(i) {

				var oFrame = aBefore[i];

				var nFrame = oFrame.frame;
				var sObjKey;
				var oVals = self._toPropObj(oFrame.propLists);

				var oPreprocessedFrame = oAfter[nFrame] = { 'frame' : nFrame, 'dynamic' : {}, 'static' : {} };
				aAfter.push(oPreprocessedFrame);

				for (sObjKey in oVals) if (oVals.hasOwnProperty(sObjKey)) {

					var nEndFrame = nFrame;
					var vEndVal = oVals[sObjKey];
					var fEffect = self._fDefaultEffect;

					// 효과가 지정된경우
					// ex) keyframe.set(2000, [ elEl, { '@left' : jindo.Effect.bounce('30px') } ]);
					if (typeof vEndVal === 'function') {
						fEffect = vEndVal;
						vEndVal = vEndVal.end;
					}

					var oIng = oIngFrame[sObjKey];

					if (oIng) { // 앞에서 같은 sObjKey 도 셋팅된게 있다면 종료값을 연장시켜줌

						oIng.effect = fEffect;
						oIng.frames[1] = nEndFrame;
						oIng.vals[1] = vEndVal;

						// if (fEffect.name === 'skip') {
						if (fEffect.effectConstructor === jindo.Effect.stepEnd) {
							oIng.vals[1] = oIng.vals[0];
						}
						/* @JINDOSUS-1745 이슈로 인해 이 코드가 없어야 잘 돌아감
						else if (fEffect.effectConstructor === jindo.Effect.stepStart) {
							oIng.vals[0] = oIng.vals[1];
						}*/

					}

					if (!(sObjKey in oFirstFrame)) {
						oFirstFrame[sObjKey] = vEndVal;
					}

					// 새로운 frame 객체 만듬
					oIngFrame[sObjKey] = { effect : null, frames : [ nEndFrame ] , vals : [ vEndVal ] };

				}

				for (sObjKey in oIngFrame) if (oIngFrame.hasOwnProperty(sObjKey)) {
					oAfter[nFrame]['dynamic'][sObjKey] = oIngFrame[sObjKey];
				}

			}, step2);

		};

		// static 속성 셋팅
		var step2 = function() {

			self._loop(bPreprocessAsync, aAfter.length, function(i) {

				var oFrame = aAfter[i];
				for (var sObjKey in oFirstFrame) if (oFirstFrame.hasOwnProperty(sObjKey)) {
					if (sObjKey in oFrame['dynamic']) { continue; }
					oFrame['static'][sObjKey] = oFirstFrame[sObjKey];
				}

			}, step3);

		};

		// 마무리 정리
		var step3 = function() {

			self._oPreprocessed.frames = aAfter;

			// 객체에 할당된 임시 키값 제거
			var oCache = self._oPreprocessed.objs;
			for (var sObjKey in oCache) if (oCache.hasOwnProperty(sObjKey)) {
				try {
					delete oCache[sObjKey].__KEYFRAME_UNIQ;
				} catch(e) {
					oCache[sObjKey].__KEYFRAME_UNIQ = undefined;
				}
			}

			oAfter = null;
			self._bPreprocessed = true;

			/**
				Preprocess 작업이 완료되었을때 발생하는 이벤트

				@event proprocessEnd
			**/
			self.fireEvent('preprocessEnd');

		};

		step1();

	},

	/**
		get, frame 메서드를 빠르게 사용할 수 있도록 set 으로 지정한 속성을 전처리한다.

		@remark
			set 메서드를 사용하여 규칙 속성이 변경 된 후에는 반드시 호출해야 하며,
			만약 preprocess 메서드를 호출하지 않고 get, frame 메서드를 사용하면 예외가 발생한다.

		@method preprocess
		@param {Boolean} [bPreprocessAsync=false]
			전처리 작업을 비동기적으로 진행 할 지 지정한다.
			동기로 진행하면 최대한 빠르게 처리되지만 처리되는 동안에 브라우저가 멈추는 문제가 있고,
			비동기로 진행하면 전처리 작업을 분할해서 진행하기 때문에 브라우저는 멈추지 않지만 처리 속도가 다소 느려진다.

		@chainable
		@return {jindo.Keyframe}

		@example
			var keyframe = new jindo.Keyframe();
			...
			keyframe.preprocess(false);
			keyframe.frame(0.5); // preprocess 를 동기적으로 처리했기 때문에 바로 frame 메서드 사용가능

		@example
			var keyframe = new jindo.Keyframe();
			...
			keyframe.attach('preprocessEnd', function() {
				// preprocess 를 비동기적으로 처리했기 때문에 preprocessEnd 이벤트가 발생한 후에 frame 메서드 사용가능
				keyframe.frame(0.5);
			});
			keyframe.preprocess(true);

	**/
	preprocess : function(bPreprocessAsync) {
		this._preprocessKeyframes(!!bPreprocessAsync);
		return this;
	},

	// 원하는 frame 의 prop 목록들 얻기
	_getPropLists : function(nFrame, bIncludeStatic) {

		// this.preprocess();

		var aPreprocessedLists = this._oPreprocessed.frames;

		// 필요한 인덱스
		var nDstIdx = aPreprocessedLists.length - 1;

		for (var i = 0, oFrame; oFrame = aPreprocessedLists[i]; i++) {
			if (oFrame.frame > nFrame) { // 원하는 frame 보다 큰 frame 으로 지정된 객체를 얻으면
				// 그 앞에껄로 인덱스 셋팅하고 중단
				nDstIdx = Math.max(0, i - 1); break;
			}
		}

		// console.warn('frame', [ nFrame ], '->', [ nDstIdx ]);

		var oDstLists = aPreprocessedLists[nDstIdx];
		var oPropLists = {};

		// console.log('nDstIdx : ', nDstIdx, oDstLists);

		// 원하는 frame 에 맞는 Dynamic Props 를 얻기
		oPropLists = this._getDynamicProps(oPropLists, nFrame, oDstLists);

		// bIncludeStatic 가 true 이거나 이전에 사용했던 인덱스값과 다른 경우
		if (bIncludeStatic || this._nCurIdx !== nDstIdx) {
			// 원하는 frame 에 맞는 Static Props 를 얻기
			oPropLists = this._getStaticProps(oPropLists, nFrame, oDstLists);
		}

		// 마지막으로 사용한 인덱스값 변경
		this._nCurIdx = nDstIdx;

		return oPropLists;

	},

	_get : function(nFrame, bIncludeStatic) {

		if (!this._bPreprocessed) {
			throw new Error('First, you need to call preprocess().');
		}

		var oPropLists = this._getPropLists(nFrame, bIncludeStatic);
		var oCache = this._oPreprocessed.objs;

		// console.log(oCache);

		var oObj, oProps;
		var aRet = [];

		for (var sObj in oPropLists) if (oPropLists.hasOwnProperty(sObj)) {

			oObj = oCache[sObj];
			oProps = oPropLists[sObj];

			aRet.push(oObj, oProps);

		}

		return aRet;

	},

	/**
		인자로 넣은 진행값인 경우 각 객체에 지정되어야 할 속성 값을 얻는다.

		@remark
			set 메서드를 사용 한 후에 get 메서드를 사용하려면 get 메서드 사용전에 preprocess 메서드를 반드시 한번 호출 해야 한다.

		@method get
		@param {Number} nFrame 진행값

		@return {Array} 객체와 속성 목록이 번갈아 들어있는 배열

		@example
			var keyframe = new jindo.Keyframe();

			keyframe.set(0, [ el, { '@left' : '100px' } ]);
			keyframe.set(100, [ el, { '@left' : '200px' } ]);
			keyframe.preprocess(false);

			LOG(keyframe.get(50)); // 결과 : [ el, { '@left' : '150px '} ]
	**/
	get : function(nFrame) {
		return this._get(nFrame, true);
	},

	/**
		인자로 넣은 진행값에 맞는 값으로 각 객체에 속성을 지정한다.

		@remark
			set 메서드를 사용 한 후에 frame 메서드를 사용하려면 frame 메서드 사용전에 preprocess 메서드를 반드시 한번 호출 해야 한다.

		@method frame
		@param {Number} nFrame 진행값
		@param {Boolean} bAll 모든 속성을 변경 (인접한 진행값으로 이동할 때 바꾸지 않아도 되는 속성도 함께 변경하고 싶을때 true 로 지정한다)

		@return {jindo.Keyframe}
		@chainable
	**/
	frame : function(nFrame, bAll) {

		var self = this;
		var nCurValue = this._nCurValue;

		if (!bAll && nFrame === nCurValue) { return; }
		this._nCurValue = nFrame;

		if (this._oRAF) {
			cancelAnimationFrame(this._oRAF);
			this._oRAF = null;
		}

		if (self._bPlaying) {
			self._frame(nCurValue, bAll);
		}

		var nAnimationDuration = this.option('nAnimationDuration');
		if (nAnimationDuration && nCurValue !== null) {

			var fValue = jindo.Effect.easeOut(
				// nCurValue,
				// nFrame
				Math.round(nCurValue * 1000000) / 1000000,
				Math.round(nFrame * 1000000) / 1000000
			);

			var nStart = new Date().getTime();
			var bFirst = true;

			self._bPlaying = true;

			(function loop() {
				self._oRAF = requestAnimationFrame(function() {
					var nFrame = Math.max(0, Math.min(1, (new Date() - nStart) / nAnimationDuration));
					self._frame(fValue(nFrame), bFirst);
					bFirst = false;
					self.oRAF = null;
					if (nFrame < 1) { return loop(); }
					self._bPlaying = false;
				});
			})();

			return;

		}

		return this._frame(nFrame, bAll);

	},

	_frame : function(nFrame, bAll) {

		var bHasTransformRenderBug = this._bHasTransformRenderBug;

		var aLists = this._get(nFrame, bAll);
		var oObj, oProps, welObj, vProp;

		var fp = null;
		var self = this;

		for (var i = 0, nLen = aLists.length; i < nLen; i += 2) {

			oObj = aLists[i];
			oObj = typeof oObj === 'function' ? oObj() : oObj;

			oProps = aLists[i + 1];

			fp = fp || function(oObj, oProps) {

				welObj = jindo.$Element(oObj);

				for (var sKey in oProps) if (oProps.hasOwnProperty(sKey)) {

					vProp = oProps[sKey];

					if (/^@(.*)$/.test(sKey)) {
						sKey = RegExp.$1;
						if (/transition/.test(sKey)) { vProp = self._getCSSVal(vProp); }

						if (bHasTransformRenderBug && '@transform' === sKey && ('@left' in oProps || '@top' in oProps)) {
							oObj.clientHeight;
						}

						welObj.$value().style[self._getCSSKey(sKey)] = vProp;

					} else {
						oObj[sKey] = vProp;
					}

				}

			};

			if (oObj instanceof Array) {
				for (var j = 0, nJen = oObj.length; j < nJen; j++) {
					fp(oObj[j], oProps);
				}
			} else {
				fp(oObj, oProps);
			}

		}

	},

	_getStaticProps : function(oOutProps, nFrame, oDstLists) {

		var oStaticPropLists = oDstLists['static'];

		// console.log('_applyProps', nFrame, oStaticPropLists);

		/****var oCache = this._oPreprocessed.objs;****/
		// var oIdx = {};

		for (var sObjKey in oStaticPropLists) if (/^(.+):(.+)$/.test(sObjKey)) {

			var sObj = RegExp.$1;
			var sKey = RegExp.$2;

			/****var oObj = oCache[sObj];****/
			var vProp = oStaticPropLists[sObjKey];

			oOutProps[sObj] = oOutProps[sObj] || {};
			oOutProps[sObj][sKey] = vProp; 

			/****
			if (/^@(.*)$/.test(sKey)) {
 				sKey = RegExp.$1;
				if (/transition/.test(sKey)) { vProp = this._getCSSVal(vProp); }
				jindo.$Element(oObj).css(this._getCSSKey(sKey), vProp);
			} else {
				oObj[sKey] = vProp;
			}
			****/

			//console.log('static >', [ sKey, vProp ]);

		}

		return oOutProps;

	},

	_getDynamicProps : function(oOutProps, nFrame, oDstLists) {

		var oDynamicPropLists = oDstLists['dynamic'];
		var oStaticPropLists = oDstLists['static'];

		/****var oCache = this._oPreprocessed.objs;****/
		var aDeleteObjKey = [];

		for (var sObjKey in oDynamicPropLists) if (/^(.+):(.+)$/.test(sObjKey)) {

			var sObj = RegExp.$1;
			var sKey = RegExp.$2;

			/****var oObj = oCache[sObj];****/
			var vProp = oDynamicPropLists[sObjKey];

			var fEffect = vProp.effect;
			var vStart = vProp.vals[0];
			var vEnd = vProp.vals[1];

			// 종료값이 없거나 시작값과 종료값이 같으면 static 속성으로 전환
			if (!fEffect || vStart === vEnd) {
				oStaticPropLists[sObjKey] = vStart;
				aDeleteObjKey.push(sObjKey);
				continue;
			}

			fEffect.start = vStart;
			fEffect.end = vEnd;

			if (/^@transform/.test(sKey)) {
				fEffect = this._getTransformFunction(fEffect);
			}

			var nEffectRate = Math.max(0, Math.min(1, (nFrame - vProp.frames[0]) / (vProp.frames[1] - vProp.frames[0])));

			try {
				vProp = fEffect(nEffectRate);
			} catch(e) { // Effect 로 변화시킬 수 없는 값이면 static 속성
				if (!/^unit error/.test(e.message)) { throw e; }
				oStaticPropLists[sObjKey] = vStart;
				aDeleteObjKey.push(sObjKey);
				continue;
			}

			oOutProps[sObj] = oOutProps[sObj] || {};
			oOutProps[sObj][sKey] = vProp; 

			/****
			if (/^@(.*)$/.test(sKey)) {
				sKey = RegExp.$1;
				if (/transition/.test(sKey)) { vProp = this._getCSSVal(vProp); }
				jindo.$Element(oObj).css(this._getCSSKey(sKey), vProp);
			} else {
				oObj[sKey] = vProp;
			}
			****/

			//console.log('dynamic >', [sKey, vProp]);

		}

		for (var i = 0, nLen = aDeleteObjKey.length; i < nLen; i++) {
			delete oDynamicPropLists[aDeleteObjKey[i]];
		}

		aDeleteObjKey.length = null;

		return oOutProps;

	},

	_toPropObj : function(aPropLists) {

		var oRet = {};
		var oCache = this._oPreprocessed.objs;

		function fpGetString(oObj) {

			var sRand;

			if (typeof oObj === 'object') {
				sRand = oObj.__KEYFRAME_UNIQ = oObj.__KEYFRAME_UNIQ || Math.floor(Math.random() * new Date().getTime()) + '';
			} else {
				for (var k in oCache) if (oCache.hasOwnProperty(k)) {
					if (oCache[k] === oObj) { return k; }
				}
				sRand = Math.floor(Math.random() * new Date().getTime()) + '';
			}

			oCache[sRand] = oObj;
			return sRand;

		}

		for (var i = 0, nLen = aPropLists.length; i < nLen; i += 2) {

			var oObj = aPropLists[i];
			if (!oObj) { continue; }

			var oProps = aPropLists[i + 1];

			var sObj = fpGetString(oObj);

			for (var k in oProps) if (oProps.hasOwnProperty(k)) {
				oRet[sObj + ':' + k] = oProps[k];
			}

			// oRet[sObj] = oProps;

		}

		return oRet;

	},

	/**
		특정 진행값의 상황에서의 각 객체가 가져야 할 속성 값을 지정한다.

		@method set
		@param {Number} nFrame 진행값
		@param {Array} aPropLists 객체와 속성 목록이 번갈아 들어있는 배열

		@return {jindo.Keyframe}
		@chainable

		@history 1.12.0 Update 객체로 배열이나 함수를 지정하여 여러개를 동시에 지정하거나 함수의 리턴값을 사용하여 지정할 수 있도록 개선

		@example
			var keyframe = new jindo.Keyframe();
			...
			keyframe.set(0.0, [
				elFoo, {
					'scrollTop' : 100,
					'@left' : '200px',
					'@transform' : 'translateY(30px) rotate(30deg)'
				}
			]);
			
			keyframe.set(1.0, [
				elFoo, {
					'scrollTop' : jindo.Effect.bounce(100), // 특정 속성에 대해서 다른 효과로 변화하도록 지정 가능
					'@left' : '200px',
					'@transform' : 'translateY(-100px) rotate(270deg)'
				}
			]);

			keyframe.set(0.5, [
				[ elFoo, elBar ], {
					'@left' : '100px'
				}
			]);

			keyframe.set(0.5, [
				function() { return elFoo; }, {
					'@left' : '100px'
				}
			]);

			keyframe.set(0.5, [
				function() { return [ elFoo, elBar ]; }, {
					'@left' : '100px'
				}
			]);
	**/
	/**
		특정 객체가 각 진행값의 상황에서의 가져야 할 속성 값을 지정한다.

		@method set
		@param {HTMLElement} elObj 객체
		@param {Object} oProps 객체가 각 상황에서 가져야 할 속성들

		@return {jindo.Keyframe}
		@chainable

		@example
			keyframe.set(jindo.$('cover'), { // Case #1
				'@background-color' : {
					0.0 : '#444',
					1.0 : '#aaa'
				},
				'scrollTop' : {
					0.0 : 30,
					0.5 : 50,
					1.0 : 200
				}
			});

			keyframe.set(jindo.$('cover'), { // Case #2
				0.0 : {
					'@background-color' : '#444',
					'scrollTop' : 30
				},
				0.5 : {
					'scrollTop' : 50
				},
				1.0 : {
					'@background-color' : '#aaa',
					'scrollTop' : 200
				}
			});
	**/	
	set : function(nFrame, aPropLists) {

		if (typeof nFrame === 'number') {

			this._aKeyframeLists.push({ frame : nFrame, propLists : aPropLists });
			this._oPreprocessed = null;
			this._bPreprocessed = false;
			this._nCurIdx = null;

			return this;

		}

		var elObj = nFrame;
		var oProps = aPropLists;

		var oEachRate = {};
		var caseNum = null;

		var sPropsName;

		for (var sMainKey in oProps) if (oProps.hasOwnProperty(sMainKey)) {

			caseNum = caseNum || (isNaN(sMainKey) ? 1 : 2);

			var oLists = oProps[sMainKey];
			for (var sSubKey in oLists) if (oLists.hasOwnProperty(sSubKey)) {

				nFrame = caseNum === 1 ? sSubKey : sMainKey;
				sPropsName = caseNum === 1 ? sMainKey : sSubKey;

				oEachRate[nFrame] = oEachRate[nFrame] || {};
				oEachRate[nFrame][sPropsName] = oLists[sSubKey];
			}

		}

		for (var sValue in oEachRate) if (oEachRate.hasOwnProperty(sValue)) {
			nFrame = sValue*1;
			this.set(nFrame, [ elObj, oEachRate[sValue] ]);
		}		

		return this;

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// UTIL 성격의 메서드
	///////////////////////////////////////////////////////////////////////////////////////////////////
	_oProperPrefix : {},

	// 지정된 스타일에 적당한 CSS prefix 얻기
	_getProperPrefix : function(sType) {

		var oProperPrefix = this._oProperPrefix;
		if (sType in oProperPrefix) { // 캐싱되어 있는 값이 있으면 그걸 쓰기
			return oProperPrefix[sType];
		}

		var oBodyStyle = document.body.style;
		var aPrefix = [ 'webkit', '', 'Moz', 'O', 'ms' ];
		var sPrefix, sFullType;

		var fReplacer = function(s) { return s.toUpperCase(); };

		for (var i = 0, nLen = aPrefix.length; i < nLen; i++) {
			sPrefix = aPrefix[i];
			sFullType = sPrefix + (sPrefix ? sType.replace(/^[a-z]/, fReplacer) : sType);
			if (sFullType in oBodyStyle) {
				return (oProperPrefix[sType] = sPrefix);
			}
		}

		return (oProperPrefix[sType] = '');

	},

	// Jindo 하위버젼을 사용할 것을 대비해서 CSS prefix 를 붙혀주는 코드를 별도 구현
	_getCSSKey : function(sName) {

		var self = this;
		var sPrefix = '';

		var sFullname = sName.replace(/^(\-(webkit|o|moz|ms)\-)?([a-z]+)/, function(_, __, _sPrefix, sType) {
			sPrefix = _sPrefix || self._getProperPrefix(sType); // prefix 가 명시적으로 지정되어 있지 않으면 적당한 prefix 을 얻어서 지정
			if (sPrefix) { sType = sType.replace(/^[a-z]/, function(s) { return s.toUpperCase(); }); }
			return sType;
		}).replace(/\-(\w)/g, function(_, sChar) { // -소문자 를 대문자로 변경
			return sChar.toUpperCase();
		});

		return (({ 'o' : 'O', 'moz' : 'Moz', 'webkit' : 'Webkit' })[sPrefix] || sPrefix) + sFullname;

	},

	// Jindo 하위버젼을 사용할 것을 대비해서 CSS prefix 를 붙혀주는 코드를 별도 구현
	_getCSSVal : function(sName) {

		var self = this;

		var sFullname = sName.replace(/(^|\s)(\-(webkit|moz|o|ms)\-)?([a-z]+)/g, function(_, sHead, __, sPrefix, sType) {
			sPrefix = sPrefix || self._getProperPrefix(sType); // prefix 가 명시적으로 지정되어 있지 않으면 적당한 prefix 을 얻어서 지정
			return sHead + (sPrefix && '-' + sPrefix + '-') + sType;
		});

		return sFullname;

	},

	/**
		transform CSS 속성값을 파싱
		예)
			_parseTransformText('scale3d(2, 1.5, 1) translate(100px, 30px) rotate(10deg)');

			-> {
				'scaleX' : '2',
				'scaleY' : '1.5',
				'scaleZ' : '1',
				'translateX' : '100px',
				'translateY' : ' 30px',
				'rotate' : '10deg'
			}
	**/
	_parseTransformText : function(sText) {

		sText = sText || '';

		var oRet = {};

		sText.replace(/([\w\-]+)\(([^\)]*)\)/g, function(_, sKey, sVal) {

			var aVal = sVal.split(/\s*,\s*/);

			switch (sKey) {
			case 'translate3d':
			case 'scale3d':
			case 'skew3d':
				sKey = sKey.replace(/3d$/, '');
				oRet[sKey + 'Z'] = aVal[2];
				// cont. X, Y 도 마저 셋팅 되도록 일부러 break 안 넣었음

			case 'translate':
			case 'scale':
			case 'skew':
				oRet[sKey + 'X'] = aVal[0];

				if (typeof aVal[1] === 'undefined') {
					if (sKey === 'scale') { oRet[sKey + 'Y'] = aVal[0]; }
				} else {
					oRet[sKey + 'Y'] = aVal[1];
				}

				break;

			default:
				oRet[sKey] = aVal.join(',');
				break;
			}

		});

		return oRet;

	},

	/**
		Effect 컴퍼넌트의 기능을 사용 할 수 없는 시작값과 종료값을 가진 Effect 객체를 동작 할 수 있게 만들어 주는 함수

		var my = jindo.Effect.linear();
		 
		my.start = 'scale3d(2, 1.5, 1) translate(100px, 30px) rotate(10deg)';
		my.end = 'translateX(300px)';
		 
		var func = ..._getTransformFunction(my);
		func(0.5); // 'scaleX(2) scaleY(1.5) scaleZ(1) translateX(200px) translateY(30px) rotate(10deg)'
	**/
	_getTransformFunction : function(fEffect) {

		var sKey;

		var vDepa = fEffect.start;
		var vDest = fEffect.end;

		// 시작값과 종료값을 각각 파싱
		var oDepa = this._parseTransformText(vDepa);
		var oDest = this._parseTransformText(vDest);

		var oProp = {};

		// 시작값에 있는 내용으로 속성들 셋팅
		for (sKey in oDepa) if (oDepa.hasOwnProperty(sKey)) {
			// 시작값, 종료값 셋팅 (만약 종료값이 지정되어 있지 않으면 1 또는 0 셋팅)
			oProp[sKey] = [ oDepa[sKey], oDest[sKey] || (/^scale/.test(sKey) ? 1 : 0) ];
		}

		// 종료값에 있는 내용으로 속성들 셋팅
		for (sKey in oDest) if (oDest.hasOwnProperty(sKey) && !(sKey in oDepa)) { // 이미 셋팅되어 있지 않는 경우에만
			// 시작값, 종료값 셋팅 (만약 시작값이 지정되어 있지 않으면 1 또는 0 셋팅)
			oProp[sKey] = [ oDepa[sKey] || (/^scale/.test(sKey) ? 1 : 0), oDest[sKey] ];
		}

		// Effect 함수를 대체 할 함수 만듬
		var fpFunc = function(nValue) {

			var aRet = [];
			var aBackup = [ fEffect.start, fEffect.end ];

			// 각 속성마다 루프를 돌아 계산함
			for (var sKey in oProp) if (oProp.hasOwnProperty(sKey)) {

				fEffect.start = oProp[sKey][0];
				fEffect.end = oProp[sKey][1];

				aRet.push(sKey + '(' + fEffect(nValue) + ')');
			}

			fEffect.start = aBackup[0];
			fEffect.end = aBackup[1];

			// 계산 결과 반환
			return aRet.join(' ');

		};

		fpFunc.start = vDepa;
		fpFunc.end = vDest;

		return fpFunc;

	}

}).extend(jindo.Component);
/**
	@fileOverview 레이어를 보여주고 숨겨주거나 특정 애니메이션 효과를 적용하는 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	LayerEffect 컴포넌트는 레이어를 애니메이션 효과를 적용하여 보여주거나 숨기고, 강조하는 컴포넌트.
	@class jindo.LayerEffect
	@extends jindo.Component
	@uses jindo.Transition
	
	@keyword layer, effect, animation, 레이어, 효과, 애니메이션
**/
jindo.LayerEffect = jindo.$Class({
	/** @lends jindo.LayerEffect.prototype */
	
	/**
		LayerEffect 컴포넌트를 초기화한다.
		@constructor
		@param {HTMLElement} el 효과를 적용할 엘리먼트
	**/
	$init : function(el) {
		this.setLayer(el);
		var self = this;
		this._htTransitionGetterSetter = {
			getter: function(sKey){
				return jindo.$Element(self._el)[sKey]();
			},
			setter: function(sKey, nValue) {
				jindo.$Element(self._el)[sKey](parseFloat(nValue));
			}
		};
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 가져온다.
		
		@method getLayer
		@return {HTMLElement} 
	**/
	getLayer : function() {
		return this._el;
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 설정한다.
		
		@method setLayer
		@param {HTMLElement} el 레이어 엘리먼트
		@return {this}
	**/
	setLayer : function(el) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		
		var elToMeasure = this._el.cloneNode(true);
		var welToMeasure = jindo.$Element(elToMeasure);
		welToMeasure.opacity(0);
		this._wel.after(welToMeasure);
		welToMeasure.show();
		//css position
		this._sLayerCSSPosition = welToMeasure.css("position");
		
		var htOffset = welToMeasure.offset();
		welToMeasure.css({
			position : "absolute",
			top : "0px",
			left : "0px"
		});
		
		//css left, top
		var htNewOffset = welToMeasure.offset();
		this._sLayerCSSLeft = htOffset.left - htNewOffset.left + "px";
		this._sLayerCSSTop = htOffset.top - htNewOffset.top + "px";
		this._sLayerBGColor = welToMeasure.css("backgroundColor");
		
		//layer size
		this._nLayerWidth = welToMeasure.width();
		this._nLayerHeight = welToMeasure.height();
		welToMeasure.width(this._nLayerWidth);
		welToMeasure.height(this._nLayerHeight);
		
		//css width, height, overflow
		this._sLayerCSSWidth = welToMeasure.css("width");
		this._sLayerCSSHeight = welToMeasure.css("height");
		this._sLayerCSSOverflowX = this._wel.css("overflowX");
		this._sLayerCSSOverflowY = this._wel.css("overflowY");
		this._sLayerCSSFontSize = this._wel.css("fontSize");
		this._sLayerCSSFontSizeUnit = this._sLayerCSSFontSize.match(/^\-?[0-9\.]+(%|px|pt|em)?$/i)[1];
		welToMeasure.css({
			"overflow" : "hidden",
			"width" : 0,
			"height" : 0
		});
		
		this._nSlideMinWidth = welToMeasure.width() + 1;
		this._nSlideMinHeight = welToMeasure.height() + 1; 
		welToMeasure.leave();
			
		return this;
	},
	
	_transform : function(){
		this._wel.css({
			"overflowX": "hidden",
			"overflowY": "hidden"
		});
	},
	
	_restore : function() {
		this._wel.css({
			"position": this._sLayerCSSPosition,
			"overflowX": this._sLayerCSSOverflowX,
			"overflowY": this._sLayerCSSOverflowY
		});
	},
	
	_fireEventBefore : function(bTransform) {
		if (bTransform) {
			this._transform();
		}
		/**
			애니메이션 효과가 시작하기 직전
			
			@event before
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elLayer 애니메이션이 적용된 레이어 엘리먼트
			@param {Function} stop 수행시 애니메이션 효과가 시작되지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oLayerEffect.attach("before", function(oCustomEvent) { ... });
		**/
		return this.fireEvent("before", {
			elLayer : this.getLayer()
		});
	},
	
	_fireEventAppear : function() {
		/**
			애니메이션 효과가 적용되어 숨겨져있던 레이어가 보이기 시작한 시점 (보여주기 효과에서만 발생)
			
			@event appear
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elLayer 애니메이션이 적용된 레이어 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oLayerEffect.attach("appear", function(oCustomEvent) { ... });
		**/
		this.fireEvent("appear", {
			elLayer : this.getLayer()
		});
	},
	
	_fireEventEnd : function() {
		this._restore();
		/**
			애니메이션 효과가 종료된 직후
			
			@event end
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elLayer 애니메이션이 적용된 레이어 엘리먼트
			@example
				// 커스텀 이벤트 핸들링 예제
				oLayerEffect.attach("end", function(oCustomEvent) { ... });
		**/
		this.fireEvent("end", {
			elLayer : this.getLayer()
		});
	},
	
	_getTransition : function() {
		return (this._oTransition) ? this._oTransition : this._oTransition = new jindo.Transition({bCorrection : true});
	},
	
	_afterHide : function() {
		this._wel.hide().opacity(1);
		this._wel.css({
			"top": this._sLayerCSSTop,
			"left": this._sLayerCSSLeft,
			"width": this._sLayerCSSWidth,
			"height": this._sLayerCSSHeight,
			"fontSize": this._sLayerCSSFontSize
		});
	},
	
	_onShowTransitionEnd : function(oCustomEvent) {
		this._getTransition().detach("end", arguments.callee);
		this._fireEventEnd();
	},
	
	_onHideTransitionEnd : function(oCustomEvent) {
		this._getTransition().detach("end", arguments.callee);
		this._afterHide();
		this._fireEventEnd();
	},
	
	_getOption : function(htDefault, ht) {
		for (var s in ht) {
			htDefault[s] = ht[s];
		}
		return htDefault;
	},
	
	/**
		레이어를 fadeIn하여 보여준다.
		레이어의 투명도를 높여 서서히 보여지는 효과를 준다.
		
		@method fadeIn
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.fadeIn();
			oLayerEffect.fadeIn({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	fadeIn : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible() && this._wel.opacity() > 0;
		
		if (bVisible) {
			htOption.nDuration *= ((1 - this._wel.opacity()) / 1);
		} else {
			this._wel.opacity(0);
			this._wel.show();
		}
		
		if (htOption.nDuration > 0) {
			this._fireEventBefore(true);
			var self = this,
				oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
			oTransition.attach({
				playing : function(oCustomEvent){
					if (oCustomEvent.nStep === 1) {
						this.detach("playing", arguments.callee);
						if (!bVisible) {
							self._fireEventAppear();
						}
					}
				},
				end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
			}).queue(htOption.nDuration, this._wel.$value(), {
				"@opacity" : jindo.Effect.linear(1)
			});
			
			if (htOption.fCallback) {
				oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
			}
			oTransition.start();
		}
		return this;
	},
	
	/**
		레이어를 fadeOut하여 숨긴다.
		레이어의 투명도를 줄여 서서히 사려져가는 효과를 준다.
		
		@method fadeOut
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.fadeOut();
			oLayerEffect.fadeOut({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	fadeOut : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible() && this._wel.opacity() > 0;
		
		if (bVisible) {
			this._fireEventBefore();
			
			htOption.nDuration *= (this._wel.opacity() / 1);
			var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
			oTransition.attach({
				end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
			}).queue(htOption.nDuration, this._wel.$value(), {
				"@opacity" : jindo.Effect.linear(0)
			});
			
			if (htOption.fCallback) {
				oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
			}
			oTransition.start();
		} 
		return this;
	}, 
	
	/**
		레이어를 slideDown하여 보여준다.
		레이어의 높이를 높여 미끄러져 내려가는 듯한 효과를 준다.
		
		@method slideDown
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.slideDown();
			oLayerEffect.slideDown({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	slideDown : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
		
		if (Math.ceil(this._wel.height()) < this._nLayerHeight) {
			if (this._fireEventBefore(true)) {
				if (!bVisible) {
					this._wel.css("height", 0).show().height(this._nSlideMinHeight);
				} else {
					htOption.nDuration = Math.ceil(htOption.nDuration * ((this._nLayerHeight - this._wel.height()) / (this._nLayerHeight - this._nSlideMinHeight)));
				}
				
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				oTransition.attach({
					playing : function(oCustomEvent){
						if (oCustomEvent.nStep === 1) {
							this.detach("playing", arguments.callee);
							if (!bVisible) {
								self._fireEventAppear();
							}
						}
					},
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 slideUp하여 숨긴다.
		레이어의 높이를 줄여 미끄러져 올라가는 듯한 효과를 준다.
		
		@method slideUp
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.slideUp();
			oLayerEffect.slideUp({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	slideUp : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
			
		if (bVisible) {
			if (this._fireEventBefore(true)) {
				htOption.nDuration = Math.ceil(htOption.nDuration * (this._wel.height() / this._nLayerHeight));
				
				var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				oTransition.attach({
					end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					height: jindo.Effect.cubicEaseOut(this._nSlideMinHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 grow하여 보여준다.
		레이어의 높이와 너비를 동시에 넓혀 늘어나는 듯한 효과를 준다.
		
		@method grow
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.grow();
			oLayerEffect.grow({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	grow : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
		
		if (Math.ceil(this._wel.height()) < this._nLayerHeight) {
			if (this._fireEventBefore(true)) {
				if (!bVisible) {
					this._wel.css({
						width : 0,
						height : 0
					}).show().width(this._nSlideMinWidth).height(this._nSlideMinHeight);
				} else {
					htOption.nDuration = Math.ceil(htOption.nDuration * ((this._nLayerHeight - this._wel.height()) / (this._nLayerHeight - this._nSlideMinHeight)));
				}
				
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				oTransition.attach({
					playing : function(oCustomEvent){
						if (oCustomEvent.nStep === 1) {
							this.detach("playing", arguments.callee);
							if (!bVisible) {
								self._fireEventAppear();
							}
						}
					},
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					width: jindo.Effect.cubicEaseOut(this._nLayerWidth),
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 shrink하여 숨긴다.
		레이어의 높이와 너비를 동시에 줄여 찌그러뜨리는 듯한 효과를 준다.
		
		@method shrink
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.shrink();
			oLayerEffect.shrink({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	shrink : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
			
		if (bVisible) {
			if (this._fireEventBefore(true)) {
				htOption.nDuration = Math.ceil(htOption.nDuration * (this._wel.height() / this._nLayerHeight));
				
				var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				oTransition.attach({
					end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					width: jindo.Effect.cubicEaseOut(this._nSlideMinWidth),
					height: jindo.Effect.cubicEaseOut(this._nSlideMinHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	},
	
	/**
		레이어를 unfold하여 보여준다.
		레이어의 너비를 넓히고나서 높이를 높여 접힌것을 펴는 듯한 효과를 준다.
		
		@method unfold
		@param {Object} [htOption]
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nWidth=1] 너비의 최소값 (px)
			@param {Number} [htOption.nHeight=1] 높이의 최소값 (px)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.unfold();
			oLayerEffect.unfold({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nWidth : 1, //너비의 최소값 (px)
				nHeight : 1, //높이의 최소값 (px)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	unfold : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nWidth : this._nSlideMinWidth,
			nHeight : this._nSlideMinHeight
		}, htOption || {});
		
		var bVisible = this._wel.visible(),
			nWidthDuration, nHeightDuration;
		
		if (!bVisible) {
			this._wel.css({
				width : 0,
				height : 0
			}).show().width(Math.max(htOption.nWidth, this._nSlideMinWidth)).height(Math.max(htOption.nHeight, this._nSlideMinHeight));
			nWidthDuration = htOption.nDuration / 2;
			nHeightDuration = nWidthDuration;
		} else {
			nWidthDuration = (htOption.nDuration / 2) * (this._nLayerWidth - this._wel.width()) / this._nLayerWidth;
			nHeightDuration = (htOption.nDuration / 2) * (this._nLayerHeight - this._wel.height()) / this._nLayerHeight;
		}
		
		if (nHeightDuration > 0) {
			var self = this;
			if (this._fireEventBefore(true)) {
				var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				oTransition.attach({
					playing : function(oCustomEvent){
						if (oCustomEvent.nStep === 1) {
							this.detach("playing", arguments.callee);
							if (!bVisible) {
								self._fireEventAppear();
							}
						}
					},
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
				}).queue(nWidthDuration, this._htTransitionGetterSetter, {
					width: jindo.Effect.cubicEaseOut(this._nLayerWidth)
				}).queue(nHeightDuration, this._htTransitionGetterSetter, {
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	},
	
	/**
		레이어를 fold하여 숨긴다.
		레이어의 높이를 줄이고나서 너비를 줄여 접는 듯한 효과를 준다.
		
		@method fold
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nWidth=1] 너비의 최소값 (px)
			@param {Number} [htOption.nHeight=1] 높이의 최소값 (px)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.fold();
			oLayerEffect.fold({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nWidth : 1, //너비의 최소값 (px)
				nHeight : 1, //높이의 최소값 (px)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	fold : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nWidth : this._nSlideMinWidth,
			nHeight : this._nSlideMinHeight
		}, htOption || {});
		
		var bVisible = this._wel.visible(),
			nWidthDuration, nHeightDuration;
		
		if (bVisible) {
			nHeightDuration = (htOption.nDuration / 2) * this._wel.height() / this._nLayerHeight;
			nWidthDuration = (htOption.nDuration / 2) * this._wel.width() / this._nLayerWidth;
			if (nWidthDuration > 0) {
				if (this._fireEventBefore(true)) {
					var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
					
					oTransition.attach({
						end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
					}).queue(nHeightDuration, this._htTransitionGetterSetter, {
						height: jindo.Effect.cubicEaseOut(Math.max(htOption.nHeight, this._nSlideMinHeight))
					}).queue(nWidthDuration, this._htTransitionGetterSetter, {
						width: jindo.Effect.cubicEaseOut(Math.max(htOption.nWidth, this._nSlideMinWidth))
					});
					
					if (htOption.fCallback) {
						oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
					}
					oTransition.start();
				}
			} 
		}
		return this;
	},
	
	/**
		레이어를 pullUp하여 보여준다.
		레이어의 하단 위치는 고정되어있고 높이값만 늘어나 끌어올리는 듯한 효과를 준다.
		
		@method pullUp
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.pullUp();
			oLayerEffect.pullUp({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	pullUp : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
		
		if (Math.ceil(this._wel.height()) < this._nLayerHeight) {
			if (this._fireEventBefore(true)) {
				this._wel.css("position", "absolute");
				if (!bVisible) {
					this._wel.css({
						"height" : 0,
						"top" : parseInt(this._sLayerCSSTop, 10) + this._nLayerHeight - this._nSlideMinHeight + "px"
					}).show().height(this._nSlideMinHeight);
				} else {
					htOption.nDuration = Math.ceil(htOption.nDuration * ((this._nLayerHeight - this._wel.height()) / (this._nLayerHeight - this._nSlideMinHeight)));
				}
				
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					playing : function(oCustomEvent){
						if (oCustomEvent.nStep === 1) {
							this.detach("playing", arguments.callee);
							if (!bVisible) {
								self._fireEventAppear();
							}
						}
					},
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
				}).attach({
					playing : function(oCustomEvent) {
						self._wel.css("top", parseInt(self._sLayerCSSTop, 10) + self._nLayerHeight - self._wel.height() + "px");
					}
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	},
	
	/**
		레이어를 pushDown하여 숨긴다.
		레이어의 하단 위치는 고정되어있고 높이값만 줄어들어 눌러내리는 듯한 효과를 준다.
		
		@method pushDown
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.pushDown();
			oLayerEffect.pushDown({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	pushDown : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500
		}, htOption || {});
		
		var bVisible = this._wel.visible();
			
		if (bVisible) {
			if (this._fireEventBefore(true)) {
				this._wel.css("position", "absolute");
				htOption.nDuration = Math.ceil(htOption.nDuration * (this._wel.height() / this._nLayerHeight));
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					playing : function(oCustomEvent) {
						self._wel.css("top", parseInt(self._sLayerCSSTop, 10) + self._nLayerHeight - self._wel.height() + "px");
					},
					end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					height: jindo.Effect.cubicEaseOut(this._nSlideMinHeight)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 condense하여 보여준다.
		레이어의 크기를 줄이고 투명도를 높이는 효과를 준다.
		
		@method condense
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nScale=2] 효과 시작시 레이어의 확장배율
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.condense();
			oLayerEffect.condense({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nScale : 2, //효과 시작시 레이어의 확장배율
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	condense : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nScale : 2
		}, htOption || {});
		
		var bVisible = this._wel.visible() && this._wel.opacity() > 0;
		
		if (bVisible) {
			htOption.nDuration *= ((1 - this._wel.opacity()) / 1);
		} else {
			this._wel.opacity(0);
			this._wel.show();
			this._wel.css({
				"left": (parseInt(this._sLayerCSSLeft, 10) - (this._nLayerWidth / 2)) + "px",
				"top": (parseInt(this._sLayerCSSTop, 10) - (this._nLayerHeight / 2)) + "px",
				"width": (parseInt(this._sLayerCSSWidth, 10) * htOption.nScale) + "px",
				"height": (parseInt(this._sLayerCSSHeight, 10) * htOption.nScale) + "px",
				"fontSize": (parseInt(this._sLayerCSSFontSize, 10) * htOption.nScale) + this._sLayerCSSFontSizeUnit 
			});
		}
		
		if (htOption.nDuration > 0) {
			if (this._fireEventBefore(true)) {
				this._wel.css("position", "absolute");
				var self = this,
					elLayer = self.getLayer();
				
				var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
			
				oTransition.attach({
					playing : function(oCustomEvent){
						if (oCustomEvent.nStep === 1) {
							this.detach("playing", arguments.callee);
							if (!bVisible) {
								self._fireEventAppear();
							}
						}
					},
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					width: jindo.Effect.cubicEaseOut(this._nLayerWidth),
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight)
				}, elLayer, {
					"@left": jindo.Effect.cubicEaseOut(this._sLayerCSSLeft),
					"@top": jindo.Effect.cubicEaseOut(this._sLayerCSSTop),
					"@fontSize": jindo.Effect.cubicEaseOut(this._sLayerCSSFontSize),
					"@opacity": jindo.Effect.linear(1)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 expand하여 숨긴다.
		레이어르 크기를 확장하고 투명도를 줄이는 효과를 준다.
		
		@method expand
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nScale=2] 효과 시작시 레이어의 확장배율
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.expand();
			oLayerEffect.expand({
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nScale : 2, //확장할 배율
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	expand : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nScale : 2
		}, htOption || {});
		
		if (this._wel.visible() && this._wel.opacity() > 0) {
			if (this._fireEventBefore(true)) {
				htOption.nDuration *= ((this._wel.opacity()) / 1);
				this._wel.css("position", "absolute");
				
				if (this._wel.css("left") == "auto") {
					this._wel.css("left", this._sLayerCSSLeft);
				}
				if (this._wel.css("top") == "auto") {
					this._wel.css("top", this._sLayerCSSTop);
				}
				var oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					end : jindo.$Fn(this._onHideTransitionEnd, this).bind(this)
				}).queue(htOption.nDuration, this._htTransitionGetterSetter, {
					width: jindo.Effect.cubicEaseOut(this._nLayerWidth * htOption.nScale),
					height: jindo.Effect.cubicEaseOut(this._nLayerHeight * htOption.nScale)
				}, this.getLayer(), {
					"@left": jindo.Effect.cubicEaseOut((parseInt(this._sLayerCSSLeft, 10) - (parseInt(this._sLayerCSSWidth, 10)) / 2 + "px")),
					"@top": jindo.Effect.cubicEaseOut((parseInt(this._sLayerCSSTop, 10) - (parseInt(this._sLayerCSSHeight, 10)) / 2 + "px")),
					"@fontSize": jindo.Effect.cubicEaseOut(parseInt(this._sLayerCSSFontSize, 10) + this._sLayerCSSFontSizeUnit, parseInt(this._sLayerCSSFontSize, 10) * 2 + this._sLayerCSSFontSizeUnit),
					"@opacity": jindo.Effect.linear(0)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	},
	
	/**
		레이어를 shake하여 강조한다.
		레이어를 좌우로 흔드는 효과를 준다.
		
		@method shake
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nWidth=20] 흔들 너비 (px)
			@param {Number} [htOption.nCount=3] 흔들 횟수
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.shake();
			oLayerEffect.shake({ 
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nWidth : 20, //흔들 너비 (px)
				nCount : 3, //흔들 횟수
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	shake : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nWidth : 20,
			nCount : 3
		}, htOption || {});
		
		if (this._wel.visible()) {
			if (this._fireEventBefore()) {
				this._wel.css("position", "absolute");
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this),
					abort : function(){
						self._wel.css("left", this._sLayerCSSLeft);
					}
				}).queue(htOption.nDuration, this.getLayer(), {
					"@left": jindo.Effect.wave(htOption.nCount)(this._sLayerCSSLeft, htOption.nWidth + "px")
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 blink하여 강조한다.
		투명도를 지정하여 깜빡이는 효과를 준다.
		
		@method blink
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nOpacity=0] 투명도 (0~1 사이의 값)
			@param {Number} [htOption.nCount=1] 깜빡일 횟수
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.blink();
			oLayerEffect.blink({ 
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nOpacity : 0, //투명도 (0~1 사이의 값)
				nCount : 1, //깜빡일 횟수
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				}
			});
	**/
	blink : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nOpacity : 0,
			nCount : 1
		}, htOption || {});
		
		if (this._wel.visible()) {
			if (this._fireEventBefore()) {
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this),
					abort : function(){
						self._wel.opacity(1);
					}
				}).queue(htOption.nDuration, this.getLayer(), {
					"@opacity": jindo.Effect.wave(htOption.nCount)(1, htOption.nOpacity)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 flicker하여 강조한다.
		배경색을 지정하여 깜빡이는 효과를 준다.
		
		@method flicker
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.sBackgroundColor="#ffff00"] 지정할 배경색 ex) "#ffffff" || "rgb(100, 100, 100)"
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.flicker();
			oLayerEffect.flicker({ 
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				sBackgroundColor : "#ffff00", //지정할 배경색 ex) "#ffffff" || "rgb(100, 100, 100)"
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				} 
			});
	**/
	flicker : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			sBackgroundColor : "#ffff00" 
		}, htOption || {});
		
		var sBackgroundFrom = (this._sLayerBGColor == "transparent" || this._sLayerBGColor == "rgba(0, 0, 0, 0)") ? "#ffffff" : this._sLayerBGColor; 
		
		if (this._wel.visible()) {
			if (this._fireEventBefore()) {
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
			
				oTransition.attach({
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this),
					abort : function(){
						self._wel.css("backgroundColor", self._sLayerBGColor);
					}
				}).queue(htOption.nDuration, this.getLayer(), {
					"@backgroundColor": jindo.Effect.cubicEaseIn(htOption.sBackgroundColor, sBackgroundFrom)
				}).queue(function(){
					self._wel.css("backgroundColor", self._sLayerBGColor);
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}, 
	
	/**
		레이어를 bounce하여 강조한다.
		레이어가 위로 튀어오르고 바운스되는듯한 효과를 준다.
		
		@method bounce
		@param {Object} [htOption] 옵션
			@param {Number} [htOption.nFPS=30] 효과 애니메이션 적용 fps
			@param {Number} [htOption.nDuration=500] 효과 애니메이션 적용시간 (ms)
			@param {Number} [htOption.nHeight=50] 바운스될 높이 (px)
			@param {Function} [htOption.fCallback] 효과 애니메이션이 완료된 이후에 수행될 콜백함수<br/>기본 값 : function(){return this;}
		@return {this}
		@example
			oLayerEffect.bounce();
			oLayerEffect.bounce({ 
				nFPS : 30, //효과 애니메이션 적용 fps
				nDuration : 500, //효과 애니메이션 적용시간 (ms)
				nHeight : 50, 바운스될 높이 (px)
				fCallback : function() { //효과 애니메이션이 완료된 이후에 수행될 콜백함수
					//this -> LayerEffect의 인스턴스
				} 
			});
	**/
	bounce : function(htOption) {
		htOption = this._getOption({
			nFPS : 30,
			nDuration : 500,
			nHeight : 50
		}, htOption || {});
		
		if (this._wel.visible()) {
			if (this._fireEventBefore()) {
				this._wel.css("position", "absolute");
				
				var self = this,
					oTransition = this._getTransition().fps(htOption.nFPS).abort().detachAll();
				
				oTransition.attach({
					end : jindo.$Fn(this._onShowTransitionEnd, this).bind(this),
					abort : function() {
						self._wel.css("top", self._sLayerCSSTop);
					}
				}).queue(htOption.nDuration / 5, this.getLayer(), {
					"@top": jindo.Effect.easeOut(this._sLayerCSSTop, (parseInt(this._sLayerCSSTop, 10) - htOption.nHeight) + "px")
				}).queue(htOption.nDuration / 5 * 4, this.getLayer(), {
					"@top": jindo.Effect.bounce(this._sLayerCSSTop)
				});
				
				if (htOption.fCallback) {
					oTransition.queue(jindo.$Fn(htOption.fCallback, this).bind(this));
				}
				oTransition.start();
			}
		}
		return this;
	}
}).extend(jindo.Component);
/**
	@fileOverview js파일을 동적으로 로드하는 컴포넌트
	@author senxation
	@version 1.14.0
**/

/**
	jindo.LazyLoading 컴포넌트는 js파일을 동적으로 로드합니다.
	
	@class jindo.LazyLoading
	@static
	
	@keyword lazy, loading, 지연, 로딩, 성능, defer
**/
jindo.LazyLoading = {
	_waLoading : jindo.$A([]),
	_waLoaded : jindo.$A([]),
	_whtScript : jindo.$H({}),
	_whtCallback : jindo.$H({})
};

/**
	js파일을 동적으로 로드한다.
	
	@method load
	@static
	@param {String} sUrl 로드할 js파일의 경로
	@param {Function} fCallback js파일 로드 완료후 실행할 콜백함수
	@param {String} [sCharset="utf-8"] 문자셋
	@remark
		이미 로드된 파일은 다시 로드하지 않지만, 콜백함수(fCallback)는 이미 로드되어 있더라도 수행된다.
		경로가 정확하다면 항상 로드가 성공한다고 가정하고 로드중인 파일은 다시 로드할 수 없다. (ie는 로드의 실패여부를 판단할 수 없다.)
	@return {Boolean} 현재 로드중인 js파일을 로드하는경우에만 false를 리턴한다. (로드중인 파일은 다시 로드하지 않지만, 콜백은 바인딩된다.)   
**/
/**
	js파일을 동적으로 로드한다.
	
	@method load
	@static
	@param {String} aUrl 로드할 js파일의 경로 목록
	@param {Function} fCallback js파일 로드 완료후 실행할 콜백함수
	@param {String} [sCharset="utf-8"] 문자셋
	@remark
		이미 로드된 파일은 다시 로드하지 않지만, 콜백함수(fCallback)는 이미 로드되어 있더라도 수행된다.
		경로가 정확하다면 항상 로드가 성공한다고 가정하고 로드중인 파일은 다시 로드할 수 없다. (ie는 로드의 실패여부를 판단할 수 없다.)
	@return {Boolean} 요청한 js파일목록 중에 하나라도 이미 로드중인 파일인 경우 false를 리턴한다. (로드중인 파일은 다시 로드하지 않지만, 콜백은 바인딩된다.)   
**/
jindo.LazyLoading.load = function(sUrl, fCallback, sCharset) {

	if (typeof fCallback != "function") {
		fCallback = function(){};
	}

	if (sUrl instanceof Array) {

		var fLoad = arguments.callee;
		var bRet = true;

		var nLen = sUrl.length;
		var nRemained = nLen;

		for (var i = 0; i < nLen; i++) {
			bRet &= this.load(sUrl[i], function() {
				nRemained--;
				if (nRemained === 0) { fCallback(); }
			}, sCharset);
		}

		return bRet;

	}

	this._queueCallback(sUrl, fCallback);
	if (this._checkIsLoading(sUrl)) {
		return false;
	}
	
	if (this._checkAlreadyLoaded(sUrl)) {
		this._doCallback(sUrl);
		return true;
	}
	
	this._waLoading.push(sUrl);
	
	var self = this;
	var elHead = document.getElementsByTagName("head")[0]; 
	var elScript = document.createElement("script");
	elScript.type = "text/javascript";
	elScript.charset = sCharset || "utf-8";
	elScript.src = sUrl;
	this._whtScript.add(sUrl, elScript);
	
	if ('onload' in elScript) {
		elScript.onload = function() {
			self._waLoaded.push(sUrl);
			self._waLoading = self._waLoading.refuse(sUrl);
			self._doCallback(sUrl);
		};
	} else {
		elScript.onreadystatechange = function() {
		    if(this.readyState == "complete" || this.readyState == "loaded") {
				self._waLoaded.push(sUrl);
				self._waLoading = self._waLoading.refuse(sUrl);
				self._doCallback(sUrl);
				this.onreadystatechange = null;
		    }
		};		
	}

	elHead.appendChild(elScript);
	return true;
};

jindo.LazyLoading._queueCallback = function(sUrl, fCallback) {
	var aCallback = this._whtCallback.$(sUrl);
	if (aCallback) {
		aCallback.push(fCallback);
	} else {
		this._whtCallback.$(sUrl, [fCallback]);
	}
};

jindo.LazyLoading._doCallback = function(sUrl) {
	var aCallback = this._whtCallback.$(sUrl).concat();
	for (var i = 0; i < aCallback.length; i++) {
		this._whtCallback.$(sUrl).splice(i, 1);
		aCallback[i]();
	}
};

/**
	로드중인 파일을 로드 중단한다. script 태그도 제거된다.
	
	@method abort
	@static
	@param {String} sUrl 로드중인 js파일의 경로
	@return {Boolean} 성공적으로 중단한경우 true, 로딩중이 아니면 false를 리턴한다.
**/
jindo.LazyLoading.abort = function(sUrl) {
	if (this._checkIsLoading(sUrl)) {
		var elScript = this.getScriptElement(sUrl);
		this._waLoading = this._waLoading.refuse(sUrl);
		
		if ('onload' in elScript) {
			elScript.onload = null;
		} else {
			elScript.onreadystatechange = null;	
		}		
		jindo.$Element(elScript).leave();
		this._whtScript.remove(sUrl);
		this._whtCallback.remove(sUrl);
		return true;
	} else {
		return false;
	}
};

jindo.LazyLoading._checkAlreadyLoaded = function(sUrl) {
	return this._waLoaded.has(sUrl);
};

jindo.LazyLoading._checkIsLoading = function(sUrl) {
	return this._waLoading.has(sUrl);
};

/**
	로드된 js파일 URL의 배열을 가져온다.
	
	@method getLoaded
	@static
	@return {Array} URL의 배열
**/
jindo.LazyLoading.getLoaded = function() {
	return this._waLoaded.$value();
};

/**
	로드중인 js파일 URL의 배열을 가져온다.
	
	@method getLoading
	@static
	@return {Array} URL의 배열
**/
jindo.LazyLoading.getLoading = function() {
	return this._waLoading.$value();
};

/**
	로드를 위해 생성된 script 엘리먼트를 가져온다.
	
	@method getScriptElement
	@static
	@param {String} sUrl js파일의 경로
	@return {HTMLElement} `<script>`
**/
jindo.LazyLoading.getScriptElement = function(sUrl) {
	return this._whtScript.$(sUrl) || null;
};/**
	@fileOverview 외부의 모든 문서를 가리는 사용자 대화창을 생성하는 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	외부의 모든 문서를 가리는 사용자 대화창을 생성하는 컴포넌트
	
	@class jindo.ModalDialog
	@extends jindo.Dialog
	@uses jindo.Foggy
	@keyword modaldialog, dialog, 모달다이얼로그, 다이얼로그, 대화창, 가리는
**/
jindo.ModalDialog = jindo.$Class({
	/** @lends jindo.ModalDialog.prototype */
	
	/**
		Modal Dialog 컴포넌트를 생성한다.
		
		@constructor
		@param {Object} [htOption] 옵션 해시테이블
			@param {String} [htOption.sClassPrefix="dialog-"] 클래스명 접두어
			@param {Object} [htOption.LayerPosition] jindo.LayerPosition 컴포넌트를 위한 옵션 값
			@param {Object} [htOption.Foggy] jindo.Foggy 컴포넌트를 위한 옵션 값
		@example
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
					//다이얼로그 레이어가 보여지기 전에 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//e.stop(); 수행시 보여지지 않음
				},
				show : function(e) {
					//다이얼로그 레이어가 보여진 후 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				},
				beforeHide : function(e) {
					//다이얼로그 레이어가 숨겨지기 전에 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//e.stop(); 수행시 숨겨지지 않음
				},
				hide : function(e) {
					//다이얼로그 레이어가 숨겨진 후 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				}
			});
	**/
	$init : function(htOption) {
		var htDefaultOption = {
			Foggy : { //Foggy 컴포넌트를 위한 옵션 (jindo.Foggy 참고)
				nShowDuration : 150, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)  
				nShowOpacity : 0.8, //(Number) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)      
				nHideDuration : 150, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)  
				nHideOpacity : 0, //(Number) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
				sEffect : "linear", // (String) jindo.Effect의 종류
				nFPS : 30 //(Number) 효과가 재생될 초당 frame rate  
			}
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._initFoggy();
	},
	
	/**
		Foggy 컴포넌트를 초기화한다.
		@ignore
	**/
	_initFoggy : function() {
		var self = this;
		this._oFoggy = new jindo.Foggy(this.option("Foggy")).attach({
			show : function(e) {
				/**
					다이얼로그가 화면에 보여진 후에 발생
					
					@event show
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 레이어
					@example
						// 커스텀 이벤트 핸들링 예제
						oComponent.attach("show", function(oCustomEvent) { ... });
				**/
				self.fireEvent("show", { elLayer : self._elLayer });
			},
			hide : function() {
				self.detachAll("close").detachAll("confirm").detachAll("cancel");
				self._detachEvents();
				self._welLayer.hide();
				self._welLayer.leave();
				self._bIsShown = false;
				/**
					다이얼로그가 화면에서 감춰진 다음에 발생
					
					@event hide
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 레이어
					@example
						// 커스텀 이벤트 핸들링 예제
						oComponent.attach("hide", function(oCustomEvent) { ... });
				**/
				self.fireEvent("hide", { elLayer : self._elLayer });
			}
		});
		
		//컴포넌트에 의해 생성된 fog레이어에 대한 설정
		this._oFoggy.getFog().className = this.option("sClassPrefix") + 'fog'; 
	},
	
	/**
		생성된 Foggy 컴포넌트의 인스턴스를 가져온다.
		
		@method getFoggy
		@return {jindo.Foggy}
	**/
	getFoggy : function() {
		return this._oFoggy;
	},
	
	/**
		다이얼로그 레이어를 보여준다.
		
		@method show
		@remark 다이얼로그 레이어는 설정된 레이어의 템플릿으로부터 만들어져 document.body에 append된다.
		@param {Object} htTemplateProcess 템플릿에 대체하기 위한 데이터를 가지는 Hash Table
		@param {Object} htEventHandler 다이얼로그 내부에서 발생하는 이벤트를 처리하는 핸들러들
		@example
			//다이얼로그 레이어에 닫기, 취소, 확인 버튼이 모두 존재하는경우 각각의 버튼에 대한 핸들러를 함께 등록한다. 
			var oModalDialog = new jindo.ModalDialog();
			
			oModalDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
			
			oModalDialog.show({ text : "<strong>확인하시겠습니까?</strong>" }, {
				close : function(e) {
					jindo.$Element("status").text("oDialog의 레이어에서 닫기 버튼이 클릭되었습니다.");
					//e.stop() 수행시 레이어가 닫히지 않는다.
				},
				cancel : function(e) {
					jindo.$Element("status").text("oDialog의 레이어에서 취소 버튼이 클릭되었습니다.");
					//e.stop() 수행시 레이어가 닫히지 않는다.
				},
				confirm : function(e) {
					jindo.$Element("status").text("oDialog의 레이어에서 확인 버튼이 클릭되었습니다.");
					//e.stop() 수행시 레이어가 닫히지 않는다.
				}
			});	
	**/
	show : function(htTemplateProcess, htEventHandler) {
		if (!this.isShown()) {
			this.attach(htEventHandler);
			
			document.body.appendChild(this._elLayer);
			this._welLayer.html(this._template.process(htTemplateProcess || {}));
			
			var htCustomEvent = { elLayer : this._elLayer }; 
			
			/**
				다이얼로그가 화면에 보여지기 전에 발생
				
				@event beforeShow
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elLayer 다이얼로그 레이어
				@param {Function} stop 이벤트 진행을 중지하고 싶을 때 호출하면 레이어 출력이 중지됨
				@example
					// 커스텀 이벤트 핸들링 예제
					oComponent.attach("beforeShow", function(oCustomEvent) {
						...
						// 특정 조건에서 다이얼로그를 열지 않기를 원하는 경우 stop()을 호출합니다.
						oCustomEvent.stop();
						...
					});
			**/
			if (this.fireEvent("beforeShow", htCustomEvent)) {
				this._welLayer.show();
				this._attachEvents();
				this.getLayerPosition().setPosition();
				this._bIsShown = true;
				this._oFoggy.show(this._elLayer);
			}
		}
	},
	
	/**
		다이얼로그 레이어를 숨긴다.
		
		@method hide
		@remark 다이얼로그 레이어가 숨겨지는 동시에 모든 이벤트가 제거되고 document.body에서 제거된다.
	**/
	hide : function() {
		/**
			다이얼로그가 화면에서 감춰지기 전에 발생
			
			@event beforeHide
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elLayer 다이얼로그 레이어
			@param {Function} stop 이벤트 진행을 중지하고 싶을 때 호출하면 레이어가 감춰지는게 중지됨
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("beforeHide", function(oCustomEvent) {
					...
					// 특정 조건에서 다이얼로그를 닫지 않기를 원하는 경우 stop()을 호출합니다.
					oCustomEvent.stop();
					...
				});
		**/
		if (this.fireEvent("beforeHide", { elLayer : this._elLayer })) {
			this._oFoggy.hide();
		} 
	}
}).extend(jindo.Dialog);	/*jshint eqeqeq: false, white : false, sub: true, undef: true, evil : true, browser: true, -W099 : true, -W014 : true, -W041 : true, -W083 : true, -W027 : true */

/**
    순차적으로 이루어지는 애니메이션 컴포넌트

    @author hooriza
    @version 1.14.0
    
    @class jindo.Morph
    @extends jindo.Component
    @uses jindo.Effect
    @keyword 애니메이션, animation, transition

	@history 1.12.0 Update Keyframe 객체를 재생목록에 넣을 수 있는 pushKeyframe 메서드 추가
	@history 1.11.0 Bug 애니메이션이 진행되고 있는 도중에 pause 하고 clear 호출 후, 다시 play 할 경우 오류 수정
    @history 1.10.0 Bug bUseTranstion = true일 경우, pause 메소드 버그 수정
    @history 1.10.0 Bug bUseTranstion = true일 경우, 시작점이 반영되지 않는 버그 수정
    @history 1.10.0 Bug bUseTranstion = true일 경우, display = none인 엘리먼트를 css transition으로 변환할때 다음 애니메이션이 진행되지 않는 버그 수정
    
    @history 1.9.0 release 최초 릴리즈
**/
jindo.Morph = jindo.$Class({

	/**
		컴포넌트 생성
		@constructor

		@param {Hash} [oOptions] 옵션
			@param {Function} [oOptions.fEffect=jindo.Effect.linear] 애니메이션에 사용되는 jindo.Effect 의 함수들
			@param {Boolean} [oOptions.bUseTransition=true] CSS Transition 를 사용할지 여부, 사용할꺼면 true, 아니면 false
	**/
	$init : function(oOptions) {

		this.option({
			'fEffect' : jindo.Effect.linear,
			'bUseTransition' : true
		}).option(oOptions);

		var oStyle = document.body.style;

		// transition CSS 지원하는 환경인지?
		this._bTransitionSupport = (
			'transition' in oStyle ||
			'webkitTransition' in oStyle ||
			'MozTransition' in oStyle ||
			'OTransition' in oStyle ||
			'msTransition' in oStyle
		);

		var oAgent = jindo.$Agent();
		var oOS = oAgent.os();
		var oNavigator = oAgent.navigator();

		this._bHasTransformRenderBug = oOS.ios && parseInt(oOS.version, 10) === 5 && oNavigator.msafari;

		this._aQueue = []; // 큐
		this._aIngItem = null; // 현재 진행되고 있는 항목

		this._oRAF = null;
		this._bPlaying = null; // 플레이 중인지
		this._nPtr = 0; // 현재 포인터
		this._nPausePassed = 0; // 일시정지시 어느 시점에서 일시정지 되었는지
		this._aRepeat = []; // 반복 구현을 위한 스택

		this._sTransitionEnd = ( // transitionEnd 이벤트 이름 설정
			('webkitTransition' in oStyle && 'webkitTransitionEnd') ||
			('transition' in oStyle && 'transitionend') ||
			('MozTransition' in oStyle && 'transitionend') ||
			('OTransition' in oStyle && 'oTransitionEnd') ||
			('msTransition' in oStyle && 'MSTransitionEnd')
		);

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// PUSH 메서드군
	///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
		애니메이션 동작을 재생목록에 넣음
		
		@method pushAnimate
		
		@param {Number} nDuration 변경 할일을 몇 ms 동안 진행되게 할지
		@param {Array} aLists 애니메이션을 진행 할 객체와 속성 목록
			@param {Object} aLists.0 어떤 객체에 대해서 진행 할지
			@param {Hash} aLists.1 어떤 속성들을 변경 할지
			@param {Object} [aLists.2] 어떤 객체에 대해서 진행 할지 (2)
			@param {Hash} [aLists.3] 어떤 속성들을 변경 할지 (2)
			@param {Object} [aLists.4] 어떤 객체에 대해서 진행 할지 (3)
			@param {Hash} [aLists.5] 어떤 속성들을 변경 할지 (3)
			...
		
		@return {this}
		
		@example
			oMorph.pushAnimate(3000, [
				elFoo, {
					'@left' : '300px',
					'scrollTop' : 100
				},
				elBar, {
					'scrollLeft' : 500,
					'@backgroundColor' : '#f00'
				}
			]).play();
	**/
	pushAnimate : function(nDuration, aLists) {

		if (aLists && !(aLists instanceof Array)) { throw Error('aLists should be a instance of Array'); }

		aLists = [].concat(aLists);
		aLists.duration = nDuration;

		this._aQueue.push(aLists);

		return this;

	},

	/**
		Keyframe 객체를 재생목록에 넣음

		@method pushKeyframe

		@param {Number} nDuration 변경 할일을 몇 ms 동안 진행되게 할지
		@param {jindo.Keyframe} oKeyframe Keyframe 객체

		@return {this}
	**/
	pushKeyframe : function(nDuration, oKeyframe) {
		this._aQueue.push({ action : 'keyframe', args : { duration : nDuration, keyframe : oKeyframe } });
		return this;
	},

	/**
		일정시간 또는 다른 jindo.Morph 의 애니메이션이 끝나기를 기다림
		
		@method pushWait
		@param {Number|jindo.Morph} vItem 기다리게 할 ms 단위의 시간 또는 다른 애니메이션 객체
		@param {Number|jindo.Morph} [vItem2] 기다리게 할 ms 단위의 시간 또는 다른 애니메이션 객체 (2)
		@param {Number|jindo.Morph} [vItem3] 기다리게 할 ms 단위의 시간 또는 다른 애니메이션 객체 (3)
		...
		
		@example
			oMorph
			.pushWait(3000) // 3초 기다리기
			.pushWait(oOtherMorph); // 다른 morph 객체가 끝날때까지 기다리기

		@return {this}
	**/
	pushWait : function(nDuration) {

		var oMorph;

		// 인자를 여러개 지정 할 수 있음
		for (var i = 0, nLen = arguments.length; i < nLen; i++) {

			var vItem = arguments[i];

			if (vItem instanceof this.constructor) { // Morph 객체가 들어왔으면
				this._aQueue.push(vItem);
			} else { // 숫자가 들어왔으면
				this.pushAnimate(vItem, []);
			}

		}

		return this;

	},

	/**
		실행 할 함수를 재생목록에 넣음
		
		@method pushCall
		@param {Function} fpCallback 순서가 되었을 때 실행 할 함수
		
		@return {this}
		
		@example
			oMorph.pushCall(function() {
				alert('애니메이션이 시작될꺼임');
			}).pushAnimate(3000,
				elFoo, {
					'@left' : '300px',
					'scrollTop' : 100
				}
			).pushCall(function() {
				alert('애니메이션이 끝났음');
			}).play();
	**/
	pushCall : function(fpCallback) {
		this._aQueue.push(fpCallback);
		return this;
	},

	/**
		반복 구역 시작 지점을 재생목록에 넣음
		
		@method pushRepeatStart
		@param {Number} [nTimes=1] 몇 번 반복할껀지 (무한반복할꺼면 Infinity 를 지정)
		@return {this}
	**/
	pushRepeatStart : function(nTimes) {

		if (typeof nTimes === 'undefined') { nTimes = 1; }

		var sLabel = 'L' + Math.round(new Date().getTime() * Math.random());
		this._aRepeat.push(sLabel);

		this._pushLabel(sLabel, nTimes);
		return this;

	},

	/**
		goto 명령으로 이동하는데 사용되는 라벨을 재생목록에 넣음
		
		@ignore
		@method _pushLabel
		@param {String} sLabel 라벨명
		@return {this}
	**/
	_pushLabel : function(sLabel, nTimes) {

		if (typeof nTimes === 'undefined') { nTimes = Infinity; }
		this._aQueue.push({ action : 'label', args : { label : sLabel, times : nTimes, loops : 0 } });

		return this;

	},

	/**
		반복 구역 종료 지점을 재생목록에 넣음
		
		@method pushRepeatEnd
		@return {this}
	**/
	pushRepeatEnd : function() {

		var self = this;
		var sLabel = this._aRepeat.pop();

		this._aQueue.push({ action : 'goto', args : { label : sLabel } });

		return this;

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// flow 동작 구현
	///////////////////////////////////////////////////////////////////////////////////////////////////

	// Morph 객체가 끝나기를 기다리기
	_waitMorph : function(oMorph) {

		var self = this;

		// 이미 Morph 가 재생중이 아니면 그만둠
		if (!oMorph.isPlaying()) {
			return true;
		}

		var fHandler = function() {
			// 핸들러를 해제하고
			oMorph.detach('end', fHandler).detach('pause', fHandler);
			// 다음 큐의 항목을 처리
			self._flushQueue();
		};

		// 지정한 Morph 객체가 끝나거나 일시정지되면
		oMorph.attach('end', fHandler).attach('pause', fHandler);

		return false;

	},

	// 라벨 이름에 맞는 인덱스 얻기
	_getLabelIndex : function(sLabel) {

		var aItem = null;

		for (var i = 0, nLen = this._aQueue.length; i < nLen; i++) {
			aItem = this._aQueue[i];
			if (aItem.action === 'label' && aItem.args.label === sLabel) { return i; }
		}

		return -1;

	},

	// 반복문의 끝부분 인덱스 얻기
	_getRepeatEndIndex : function(sLabel, nFrom) {

		var aItem = null;

		for (var i = nFrom || 0, nLen = this._aQueue.length; i < nLen; i++) {
			aItem = this._aQueue[i];
			if (aItem.action === 'goto' && aItem.args.label === sLabel) { return i; }
		}

		return -1;

	},

	// 다음 큐의 항목을 처리
	_flushQueue : function() {

		var bSync, aItem;
		var self = this;

		var oKeyframe, nPausePassed, aCompiledItem;

		do {

			// 비동기적으로 처리하는 상황이라고 일단 설정
			bSync = false;

			// 현재 큐의 항목 얻음
			aItem = this._aIngItem = this._aQueue[this._nPtr];

			// 큐에 아무것도 없으면 더이상 재생할게 없으므로 그만둠
			if (!aItem) {

				this._bPlaying = false;

				/**
					애니메이션이 종료 되었을 때(더이상 진행할 내용이 없을때) 발생
					@event end
				**/
				if (!aItem) {
					this.fireEvent('end');
				}

				return;
			}

			// 포인터를 다음으로 이동
			this._nPtr++;

			if (aItem instanceof Function) { // 함수를 실행해야 하는 상황 (pushCall)
				aItem.call(this);
				bSync = true;
				continue;
			} else if (aItem instanceof this.constructor) { // Morph 을 기다려야 하는 상황 (pushWait(oMorph))
				bSync = this._waitMorph(aItem);
				continue;
			} else if (typeof aItem === 'number') { // 일정시간 멈춰야 하는 상황 (pushWait(300))
				setTimeout(function() { self._flushQueue(); }, aItem);
				continue;
			} else if (aItem.action === 'label') { // 라벨 (pushRepeatStart)

				if (++aItem.args.loops > aItem.args.times) { // times 를 넘겨 실행되었으면

					var nIndex = this._getRepeatEndIndex(aItem.args.label, this._nPtr);
					aItem.args.loops = 0;

					// 반복문이 종료되는 시점으로 이동
					if (nIndex > -1) { this._goto(nIndex + 1); }

				}

				bSync = true;
				continue;
			} else if (aItem.action === 'goto') { // 특정 라벨로 이동 (pushRepeatEnd)
				this._goto(aItem.args.label);
				bSync = true;
				continue;
			} else if (aItem.action === 'keyframe') { // Keyframe 객체 실행 (pushKeyframe)

				oKeyframe = aItem.args.keyframe;
				nPausePassed = this._nPausePassed;
				aCompiledItem = this._aCompiledItem = aItem.args;

				bSync = aCompiledItem.duration < 0;

				if (bSync) {
					this._processKeyframe(1.0, oKeyframe);
					continue;
				}

				this._playKeyframe(nPausePassed, oKeyframe);
				this._nPausePassed = 0;
				continue;
			}

			// 애니메이션 진행 (pushAnimate)

			aCompiledItem = this._aCompiledItem;
			nPausePassed = this._nPausePassed;

			if (!nPausePassed) { // 중간에 일시정지 된 상태가 아니면
				aCompiledItem = this._aCompiledItem = this._compileItem(aItem); // 컴파일
			} else { // 중간이 일시정지 된 상태면
				// 나머지는 전부 다 RAF 로 돌리도록 강제 변경
				for (var i = 0, nLen = aCompiledItem.length; i < nLen; i++) {
					aCompiledItem[i].sTimingFunc = '';
				}
				aCompiledItem.allCSS = false;
			}

			if (aCompiledItem.length === 0) { // 애니메이션 진행 할 게 없으면 그냥 setTimeout
				setTimeout(function() { self._flushQueue(); }, aCompiledItem.duration);
				continue;
			}

			// console.log('_flushQueue', aCompiledItem);

			bSync = aCompiledItem.duration < 0;

			if (bSync) {
				this._processItem(1.0, true); // 마지막 상태로 바로 셋팅
				continue;
			}

			this._playAnimate(nPausePassed);
			this._nPausePassed = 0;

		} while(bSync); // 동기적으로 처리하는 상황이면 다음 큐 항목 계속해서 처리

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// 애니메이션 동작 구현
	///////////////////////////////////////////////////////////////////////////////////////////////////

	// Keyframe 객체 애니메이션 구현
	_playKeyframe : function(nPausePassed, oKeyframe) {

		var self = this;
		this._nStart = new Date().getTime() - nPausePassed;

		var aCompiledItem = this._aCompiledItem;
		var nDuration = aCompiledItem.duration;

		(function loop() {

			self._oRAF = self._requestAnimationFrame(function() {

				var nStart = self._nStart;

				if (self._oRAF === null) { return; }
				self._oRAF = null;

				var nPer = Math.min(1, Math.max(0, (new Date().getTime() - nStart) / nDuration));
				oKeyframe.frame(nPer);

				if (nPer < 1) {
					loop();
				} else {
					self.fireEvent('timerEnd');
					self._flushQueue();
				}

			});

		})();

	},

	_processKeyframe : function(nRate, oKeyframe) {
		oKeyframe.preprocess().frame(nRate);
	},

	// 애니메이션 수행
	_playAnimate : function(nPausePassed) {

		var self = this;

		this._nStart = new Date().getTime() - nPausePassed; // 시작시간
		this._nIng = 2; // CSS 와 RAF 두 종류를 사용해서 애니메이션 해야함

		// 처음부터 진행하는거면 처음 상태로 셋팅
		if (!nPausePassed) {
			this._processItem(0.0, true, 3/*ALL*/, true);
		}

		var aCompiledItem = this._aCompiledItem;
		// console.log(aCompiledItem);

		if (aCompiledItem.allCSS) { // 전부다 CSS 로 돌려야 하는 상황이면
			this._nIng--; // RAF 는 돌릴 필요 없으니까 nIng 하나 감소
		} else { // 일부는 RAF 로 돌려야 하는 상황이면
			this._animationLoop(true); // RAF 돌리기
		}

		// CSS 로 돌리기
		(function() {

			// CSS 를 적용해야 하는 것 적용

			// CSS 애니메이션을 진행
			// aTransitionCache 에는 Transition CSS 가 지정된 객체들의 배열이 반환됨
			var aTransitionCache = self._processItem(1.0, true, 1/*CSS*/).transitionCache;

			if (!aTransitionCache || aCompiledItem.duration === 0) {
				if (--self._nIng === 0) {
					self._flushQueue();
				}
				return;
			}

			var welObj = null;
			var nLen = aTransitionCache.length;

			for (var i = 0; i < nLen; i++) {
				welObj = aTransitionCache[i];
				break;
			}

			// 현재 항목의 애니메이션이 모두 끝났을 때 호출됨 (일시정지 하면서 끝난 경우 bPause 는 true)
			var fpNext = function(bPause) {

				var oItem;
				var aShouldReset = [];

				while (oItem = aTransitionCache.pop()) {

					// 완전한 중단을 위해 0.0001ms 로 지정
					// oItem.css(self._getCSSKey('transitionProperty'), 'none');
					oItem.css(self._getCSSKey('transitionDuration'), '0.0001ms');
					aShouldReset.push(oItem);

				}

				aTransitionCache = null;

				// 0.0001ms 로 지정했던걸 곧바로 0 으로 지정
				(window.requestAnimationFrame || window.setTimeout)(function() {

					// if (self._bPlaying) {
					// 	aShouldReset = null;
					// 	return;
					// }

					while (oItem = aShouldReset.pop()) {
						oItem.css(self._getCSSKey('transitionDuration'), '0');
						oItem.css(self._getCSSKey('transitionProperty'), 'none');
					}

					aShouldReset = null;

				}, 0);

				self.fireEvent('transitionEnd');

				// CSS, RAF 둘다 처리했고 일시정지하는 상황이 아니면
				if (--self._nIng === 0 && !bPause) {
					self._requestAnimationFrame(function() {
						// 큐에 있는 다음 항목 처리
						self._flushQueue();
					});
				}

			};

			// 변화시키는 모든 엘리먼트가 안 보이는 상태이면
			if (!welObj) {
				fpNext();
				return;
			}

			var elObj = welObj.$value();

			var fpOnTransitionEnd = function(bPause) {
				elObj.removeEventListener(self._sTransitionEnd, self._fpOnTransitionEnd, true);
				self._fpOnTransitionEnd = null;
				fpNext(bPause === true); // 일시정지 하면서 호출 된 상황인지
			};

			self._fpOnTransitionEnd = function(evt) {
				// console.log('on fpOnTransitionEnd', evt);
				fpOnTransitionEnd(evt);
			};

			// transitionEnd 이벤트 핸들러 등록
			elObj.addEventListener(self._sTransitionEnd,  self._fpOnTransitionEnd, true);

		})();

	},

	/**
	 * RAF 돌리기
	 * @param bSetStatic 상수를 사용한 값도 셋팅할꺼면 true, 변화하는 값만 셋팅할꺼면 false
	 */
	_animationLoop : function(bSetStatic) {

		var self = this;

		this._oRAF = this._requestAnimationFrame(function() {

			var nStart = self._nStart;
			var nDuration = self._aCompiledItem.duration;

			if (self._oRAF === null) { return; }
			self._oRAF = null;

			var nPer = Math.min(1, Math.max(0, (new Date().getTime() - nStart) / nDuration));
			self._processItem(nPer, bSetStatic, 2/*RAF*/);

			if (nPer < 1) {
				self._animationLoop();
			} else {
				self.fireEvent('timerEnd');
				if (--self._nIng === 0) {
					self._flushQueue();
				}
			}

		});

	},

	/**
	 * @param nRate 얼마나 진행 시킬지
	 * @param bSetStatic 상수를 사용한 값도 셋팅할꺼면 true, 변화하는 값만 셋팅할꺼면 false
	 * @param nTargetType 셋팅할 대상을 지정 (1 : CSS Transition 를 쓰는 것, 2 : RAF 를 쓰는 것)
	 * @param bPause 정지하기 위해 호출하는 거면
	 */
	_processItem : function(nRate, bSetStatic, nTargetType, bPause) {

		var oRet = {
			// 셋팅되어야 하는 일반 프로퍼티(CSS 속성이 아닌) 목록 (bPause 가 true 일때만 채워짐)
			// 나중에 pause 메서드의 뒷부분에서 사용된다.
			normalPropsToPause : [],

			// Transition 스타일에 설정된 엘리먼트들을 담는 배열
			// 나중에 transtion 스타일을 리셋 해주기 위해 사용된다.
			transitionCache : []
		};

		var aNormalPropsToPause = oRet.normalPropsToPause;
		var aTransitionCache = oRet.transitionCache;

		var self = this;

		var aCompiledItem = this._aCompiledItem;
		var nDuration = aCompiledItem.duration;

		if (nDuration === 0) { nDuration = 1; }
		else if (nDuration < 0) { nDuration = 0; }

		var oObj, welObj, oProps;

		var vProp, nType;

		var sStyleKey;
		var bHasTransformRenderBug = this._bHasTransformRenderBug;

		nTargetType = nTargetType || (1/*CSS*/ | 2/*RAF*/);

		/**
			애니메이션 진행을 위해 값을 설정하기 직전에 발생
			@event beforeProgress

			@stoppable

			@param {Number} nRate 진행률 (0~1 사이의 값)
			@param {Function} stop 호출 시 값을 설정하지 않음
		**/
		if (!this.fireEvent('beforeProgress', { 'nRate' : nRate })) {
			return;
		}

		var aLists = [], oListProp;

		for (var i = 0, oItem; oItem = aCompiledItem[i]; i++) {

			oObj = oItem.oObj;
			welObj = oItem.welObj;
			oProps = oItem.oProps;

			var sObjTimingFunc = oItem.sTimingFunc;
			if (sObjTimingFunc && (nTargetType & 1)) {

				// Transition CSS 를 먹여도 실행되지 않는 문제 해결
				welObj && welObj.$value().clientHeight;

				if (!('@transition' in oProps) && !bPause) {
					if (!('@transitionProperty' in oProps)) { welObj.css(this._getCSSKey('transitionProperty'), 'all'); }
					if (!('@transitionDuration' in oProps)) { welObj.css(this._getCSSKey('transitionDuration'), (nDuration / 1000).toFixed(3) + 's'); }
					if (!('@transitionTimingFunction' in oProps)) { welObj.css(this._getCSSKey('transitionTimingFunction'), sObjTimingFunc); }
				}

				aTransitionCache.push(welObj);

			}

			oListProp = {};
			aLists.push(oObj, oListProp);

			// 현재 지정된 종료 transform 을 유지한채 (nRate:1) 멈추고 싶을때 AppleWebKit/534.30 에서 발생하는 문제 회피
			if (bPause && nRate === 1 && '@transform' in oProps && /AppleWebKit\/534\.30/.test(navigator.userAgent)) {
				welObj.css(this._getCSSKey('transform'), '');
				oObj.clientHeight;
			}

			for (var sKey in oProps) if (oProps.hasOwnProperty(sKey)) {

				vProp = oProps[sKey];
				sStyleKey = /^@(.*)$/.test(sKey) && RegExp.$1;

				nType = sObjTimingFunc && sStyleKey ? 1/*CSS*/ : 2/*RAF*/;

				// 지금꺼가 바꿔야 하는게 아니면 그만둠
				if (!(nTargetType & nType)) {
					continue;
				}

				if (typeof vProp === 'function') { vProp = vProp(nRate); }
				else if (!bSetStatic) { continue; }

				// CSS 스타일 속성인 경우
				if (sStyleKey) {
					if (/transition/.test(sKey)) { vProp = this._getCSSVal(vProp); }

					if (bHasTransformRenderBug && '@transform' === sKey && ('@left' in oProps || '@top' in oProps)) {
						oObj.clientHeight;
					}

					welObj.css(this._getCSSKey(sStyleKey), vProp);

				// 일반 속성인 경우
				} else {

					if (bPause) {
						// 중지시킬때 일반 속성은 바로 셋팅하지 않고 나중에 셋팅하기 위해 배열에 넣어둠
						aNormalPropsToPause.push([ oObj, sKey, vProp ]);
					} else {
						oObj[sKey] = vProp;
					}
				}

				oListProp[sKey] = vProp;

			}

		}

		/**
			애니메이션 진행을 위해 값을 설정한 직후에 발생
			@event progress

			@param {Array} aLists 설정 한 애니메이션 정보 (객체와 프로퍼티 목록이 번갈아가며 존재)
			@param {Number} nRate 진행률 (0~1 사이의 값)
		**/
		this.fireEvent('progress', { 'aLists' : aLists, 'nRate' : nRate });

		return oRet;

	},

	/**
		pushAnimate 로 지정된 내용들을 애니메이션을 돌리기 쉬운 형태로 바꾸는 메서드
		
		BEFORE :
			[ 'foo', { '@left' : '100px' }, 'bar' : { '@top' : jindo.Effect.bounce('50px') } ]

		AFTER :
			[
				{
					oObj : 'foo',
					welObj : jindo.$Element('foo'),
					sTimingFunc : 'ease-out',
					oProps : {
						'@left' : function(p) { ... }
					}
				},
				{
					oObj : 'bar',
					welObj : jindo.$Element('bar'),
					sTimingFunc : null,
					oProps : {
						'@top' : function(p) { ... }
					}
				}
			]
	*/
	_compileItem : function(aItem) {

		var bFoundShouldRAF = aItem.length == 0; // 타이머로 동작해야 하는 속성이 발견된 경우

		var aRet = [];
		aRet.duration = aItem.duration;

		var oObj, welObj, oProps;
		var vDepa, vDest;

		var oCompiledProps;

		var bIsStyleKey, sStyleKey;

		// 옵션에 지정된 기본 효과 얻기
		var fDefaultEffect = this.option('fEffect');

		for (var i = 0, nLen = aItem.length; i < nLen; i += 2) {

			var fObjEffect, // 객체에서 사용하는 이펙트 함수
				sObjTimingFunc = null; // 객체에서 사용하는 CSS 타이밍 함수

			oObj = aItem[i];
			welObj = jindo.$Element(oObj);
			oProps = aItem[i + 1];
			oCompiledProps = {};

			var bHasProps = false;

			// 각 엘리먼트에 할당되어야 하는 값을 얻음
			for (var sKey in oProps) if (oProps.hasOwnProperty(sKey)) {

				var fPropEffect, // 프로퍼티에서 사용하는 이펙트 함수
					sPropTimingFunc; // 프로퍼티에서 사용하는 CSS 타이밍함수

				vDest = oProps[sKey];
				bIsStyleKey = /^@(.*)$/.test(sKey);

				sStyleKey = RegExp.$1;

				// 목표값이 배열 형태이면 시작값도 지정된 상태
				if (vDest instanceof Array) {
					vDepa = vDest[0];
					vDest = vDest[1];
				} else if (bIsStyleKey) { // 키값이 CSS 이면 시작값을 현재 상태로부터 얻음
					vDepa = welObj.css(this._getCSSKey(sStyleKey));
				} else { // 키값이 CSS 가 아닌경우의 시작값을 현재 상태로부터 얻음
					vDepa = oObj[sKey];
				}

				vDepa = (vDepa === 0 ? vDepa : vDepa || '');

				// 이 속성을 변경할때 사용할 이펙트
				fPropEffect = typeof vDest === 'function' ? vDest.effectConstructor : fDefaultEffect;
				sPropTimingFunc = this._getEffectCSS(fPropEffect) || '';

				// transform 스타일이면
				if (/^@transform$/.test(sKey)) {

					if (typeof vDest === 'function') { vDest = vDest.end; }
					oCompiledProps[sKey] = this._getTransformFunction(vDepa, vDest, fPropEffect, oObj);
					if (jindo.m) {
						var osInfo = jindo.m.getOsInfo();
						if (/matrix/.test(vDepa) || /matrix/.test(vDest)) {
							// 2.x 버젼에서는 matrix CSS 에 transition 이 적용이 안되서 무조건 타이머 쓰도록 보정
							if (osInfo.android && parseFloat(osInfo.version) < 3) {
								sPropTimingFunc = '';
							}
						}
					}

				} else {

					// '@left' : jindo.Effect.bounce('250px') 형태로 사용했을떄
					if (typeof vDest === 'function') {
						if ('setStart' in vDest) { vDest.setStart(vDepa); }
						oCompiledProps[sKey] = vDest;
					// '@left' : '250px' 형태로 사용했을떄
					} else {
						try {
							oCompiledProps[sKey] = fPropEffect(vDepa, vDest);
						} catch(e) {
							// px -> % 또는 % -> px 인 경우 문제~!
							if (!/^unit error/.test(e.message)) { throw e; }
							oCompiledProps[sKey] = vDest;
						}
					}

				}

				var fProp = oCompiledProps[sKey];
				if (typeof fProp === 'function' && fProp(0) === fProp(1)) { // 시작값과 종료값이 같으면 그만둠
					delete oCompiledProps[sKey];
					continue;
				}

				if (bIsStyleKey) { // 키 값이 CSS 이면
					// 객체에 CSS 타이밍함수가 안 정해져 있으면 이 속성의 CSS 타이밍함수 쓰기
					if (sObjTimingFunc === null) {
						sObjTimingFunc = sPropTimingFunc;
					// 객체에 이미 CSS 타이밍함수가 정해져있고 이 속성에서 쓰는거랑 다르면 객체 전체에서 CSS 타이밍함수 안 쓰기
					} else if (sObjTimingFunc !== sPropTimingFunc) {
						sObjTimingFunc = '';
					}
				} else { // 키 값이 CSS 가 아니면 CSS 를 사용한 효과구현 안하게
					sPropTimingFunc = '';
				}

				bFoundShouldRAF = bFoundShouldRAF || !sPropTimingFunc;
				bHasProps = true;

			}

			// 안보이는 상태면 무조건 RAF 쓰게 함
			if (!welObj.visible()) {
				sObjTimingFunc = null, bFoundShouldRAF = true;
			}

			bHasProps && aRet.push({
				'oObj' : oObj, 'welObj' : welObj, 'oProps' : oCompiledProps,
				'sTimingFunc' : sObjTimingFunc
			});

		}

		// RAF 를 사용해야 하는 속성이 하나도 없으면 allCSS 를 true 로
		aRet.allCSS = !bFoundShouldRAF;

		return aRet;

	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// public 메서드 구현
	///////////////////////////////////////////////////////////////////////////////////////////////////

	/**
		현재 재생위치부터 재생목록에 들어있는 일을 수행
		
		@method play
		@return {this}
	**/
	play : function() {

		if (!this._bPlaying) {
			this._bPlaying = true;

			/**
				애니메이션이 재생이 시작 되었을 때 발생
				@event play
			**/
			this.fireEvent('play');
			this._flushQueue();

		}

		return this;

	},

	/**
		재생 위치를 맨 처음으로 변경
		@method reset
		@return {this}
	**/
	reset : function() {
		return this._goto(0);
	},

	/**
		애니메이션 수행 중단
		@method pause

		@param {Number} [nRate] 중단 위치 (0(시작상태)~1(종료상태) 사이의 값을 지정 할 수 있으며, 생략시 현 상태로 중단한다)

		@return {this}
	**/
	pause : function(nRate) {

		// $Element('ball').css({
		// 	'transform' : 'translateX(100px) scale(1.5) rotate(45deg)',
		// 	// 'transitionProperty' : 'none',
		// 	'transitionDuration' : '0.0001ms'
		// });

		// return;

		// this._requestAnimationFrame(function() {
		// 	$Element('ball').css({
		// 		'transitionDuration' : '0'
		// 	});
		// }, 0);

		// console.log(this._fpOnTransitionEnd);

		// return;

		if (!this._bPlaying) { return this; }

		this._cancelAnimationFrame(this._oRAF);
		this._oRAF = null;

		var aCompiledItem = this._aCompiledItem;
		var nDuration = aCompiledItem.duration;

		if (typeof nRate === 'undefined') {
			var nPassed = new Date().getTime() - this._nStart;
			nRate = nPassed / nDuration;
		}

		nRate = Math.max(0, Math.min(1, nRate));

		var aNormalPropsToPause = null;

		if (aCompiledItem.keyframe) {
			this._processKeyframe(nRate, aCompiledItem.keyframe);
		} else {
			aNormalPropsToPause = this._processItem(nRate, true, 3/*ALL*/, true).normalPropsToPause;
		}

		this._nPtr--;
		this._nPausePassed = Math.round(nDuration * nRate);

		if (this._fpOnTransitionEnd) {
			this._fpOnTransitionEnd(true);
		}

		// console.log('aNormalPropsToPause', aNormalPropsToPause);

		// 일반속성을 중지 시키면서 바로 셋팅하면 일부 모바일단말기에서 제대로 셋팅되지 않는 문제 회피
		if (aNormalPropsToPause) {
			for (var i = 0, nLen = aNormalPropsToPause.length; i < nLen; i++) {
				var aNormalProp = aNormalPropsToPause[i];
				aNormalProp[0][aNormalProp[1]] = aNormalProp[2];
			}
		}

		this._bPlaying = false;

		/**
			애니메이션이 재생이 정지 되었을 때 발생
			@event pause
		**/
		this.fireEvent('pause');

		return this;

	},

	/**
		지정된 라벨로 실행 포인터를 이동함
		
		@ignore
		@method _goto
		@param {String} sLabel 라벨명
		@return {this}
	**/
	/**
		지정된 목록 위치로 실행 포인터를 이동함
		
		@ignore
		@method _goto
		@param {Number} nIndex 목록 위치
		@return {this}
	**/
	_goto : function(nIndex) {

		var sLabel = nIndex;

		if (typeof nIndex === 'number') {
			nIndex = nIndex || 0;
		} else {
			nIndex = this._getLabelIndex(sLabel);
			if (nIndex === -1) throw 'Label not found';
		}

		this._nPtr = nIndex;
		this._nPausePassed = 0;

		return this;

	},

	/**
		현재 재생중인 상태인지 반환
		
		@method isPlaying
		@return {Boolean} 재생중이면 true, 재생중이 아니면 false
	**/
	isPlaying : function() {
		return this._bPlaying || false;
	},

	/**
		재생목록을 모두 삭제함
		@method clear
		@return {this}
	**/
	clear : function() {

		this._aQueue.length = 0;
		this._aRepeat.length = 0;
		this._nPtr = 0;
		this._nPausePassed = 0;

		return this;

	},

	/**
		현재 재생 위치를 얻음
		
		@ignore
		@method _getPointer
		@return {Number} 현재 재생 위치
	**/
	_getPointer : function() {
		return this._nPtr;
	},

	// Effect 함수를 CSS timing-function 스타일로 변환
	_getEffectCSS : function(fEffect) {

		var bUseTransition = this.option('bUseTransition') && this._bTransitionSupport;

		// Transition 를 쓰지않도록 셋팅되어 있으면 RAF 사용
		if (!bUseTransition) { return null; }

		// progress 나 beforeProgress 핸들러가 등록되어 있으면 RAF 사용
		if (
			(this._htEventHandler.progress && this._htEventHandler.progress.length) ||
			(this._htEventHandler.beforeProgress && this._htEventHandler.beforeProgress.length)
		) { return null; }

		// toString 함수가 구현되어 있으면 그거 사용
		if (fEffect.hasOwnProperty('toString')) {
			return fEffect.toString();
		}

		switch (fEffect) {
		case jindo.Effect.linear:
			return 'linear'; break;
		case jindo.Effect.cubicEase:
			return 'ease'; break;
		case jindo.Effect.cubicEaseIn:
			return 'ease-in'; break;
		case jindo.Effect.cubicEaseOut:
			return 'ease-out'; break;
		case jindo.Effect.cubicEaseInOut:
			return 'ease-in-out'; break;
		default:
			if (fEffect.cubicBezier && Math.max.apply(Math, fEffect.cubicBezier) <= 1 && Math.min.apply(Math, fEffect.cubicBezier) >= 0) {
				return 'cubic-bezier(' + fEffect.cubicBezier.join(',') + ')';
			}
			break;
		}

		// CSS 에 없는 timing-function 이면 RAF 사용
		return null;

	},

	// jindo.m 이 없을 수 도 있기 때문에 별도 구현
	_requestAnimationFrame : function(fFunc) {

		var ret;
		var self = this;
 
		var fWrap = function() {

			if (ret === self._oLastRAF) {
				self._oLastRAF = null;
				fFunc();
			}
 
		};
 
		if (window.requestAnimationFrame) {
			ret = requestAnimationFrame(fWrap);
		} else {
			ret = setTimeout(fWrap, 1000 / 60);
		}
 
		return (this._oLastRAF = ret);

	},

	// jindo.m 이 없을 수 도 있기 때문에 별도 구현
	_cancelAnimationFrame : function(nRAF) {

		var ret;

		if (window.cancelAnimationFrame) {
			ret = cancelAnimationFrame(nRAF);
		} else {
			ret = clearTimeout(nRAF);
		}
 
		this._oLastRAF = null;
 
		return ret;

	},	

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/// UTIL 성격의 메서드
	///////////////////////////////////////////////////////////////////////////////////////////////////
	_oProperPrefix : {},

	// 지정된 스타일에 적당한 CSS prefix 얻기
	_getProperPrefix : function(sType) {

		var oProperPrefix = this._oProperPrefix;
		if (sType in oProperPrefix) { // 캐싱되어 있는 값이 있으면 그걸 쓰기
			return oProperPrefix[sType];
		}

		var oBodyStyle = document.body.style;
		var aPrefix = [ 'webkit', '', 'Moz', 'O', 'ms' ];
		var sPrefix, sFullType;

		var fReplacer = function(s) { return s.toUpperCase(); };

		for (var i = 0, nLen = aPrefix.length; i < nLen; i++) {
			sPrefix = aPrefix[i];
			sFullType = sPrefix + (sPrefix ? sType.replace(/^[a-z]/, fReplacer) : sType);
			if (sFullType in oBodyStyle) {
				return (oProperPrefix[sType] = sPrefix);
			}
		}

		return (oProperPrefix[sType] = '');

	},

	// Jindo 하위버젼을 사용할 것을 대비해서 CSS prefix 를 붙혀주는 코드를 별도 구현
	_getCSSKey : function(sName) {

		var self = this;
		var sPrefix = '';

		var sFullname = sName.replace(/^(\-(webkit|o|moz|ms)\-)?([a-z]+)/, function(_, __, _sPrefix, sType) {
			sPrefix = _sPrefix || self._getProperPrefix(sType); // prefix 가 명시적으로 지정되어 있지 않으면 적당한 prefix 을 얻어서 지정
			if (sPrefix) { sType = sType.replace(/^[a-z]/, function(s) { return s.toUpperCase(); }); }
			return sType;
		}).replace(/\-(\w)/g, function(_, sChar) { // -소문자 를 대문자로 변경
			return sChar.toUpperCase();
		});

		return (({ 'o' : 'O', 'moz' : 'Moz', 'webkit' : 'Webkit' })[sPrefix] || sPrefix) + sFullname;

	},

	// Jindo 하위버젼을 사용할 것을 대비해서 CSS prefix 를 붙혀주는 코드를 별도 구현
	_getCSSVal : function(sName) {

		var self = this;

		var sFullname = sName.replace(/(^|\s)(\-(webkit|moz|o|ms)\-)?([a-z]+)/g, function(_, sHead, __, sPrefix, sType) {
			sPrefix = sPrefix || self._getProperPrefix(sType); // prefix 가 명시적으로 지정되어 있지 않으면 적당한 prefix 을 얻어서 지정
			return sHead + (sPrefix && '-' + sPrefix + '-') + sType;
		});

		return sFullname;

	},

	/**
		transform-styled 문자열을 matrix 문자열로 바꾸는 함수
	**/
	_getMatrixObj : function(sTransform, elBox) {

		sTransform = sTransform.replace(/\b(translate(3d)?)\(\s*([^,]+)\s*,\s*([^,\)]+)/g, function(_1, key, _2, x, y) {

			// translate 와 tranalate3d 에서 % 단위의 값을 px 로 변환
			if (/%$/.test(x)) { x = parseFloat(x) / 100 * elBox.offsetWidth + 'px'; }
			if (/%$/.test(y)) { y = parseFloat(y) / 100 * elBox.offsetHeight + 'px'; }

			return key + '(' + x + ',' + y;

		}).replace(/\b(translate([XY]))\(\s*([^\)]+)/g, function(_, key, type, val) {

			// translateX 와 translateY 에서 % 단위의 값을 px 로 변환
			if (type === 'X' && /%$/.test(val)) { val = parseFloat(val) / 100 * elBox.offsetWidth + 'px'; }
			else if (type === 'Y' && /%$/.test(val)) { val = parseFloat(val) / 100 * elBox.offsetHeight + 'px'; }

			return key + '(' + val;

		});

		var getMatrixValue;
		var CSSMatrix = window.WebKitCSSMatrix || window.MSCSSMatrix || window.OCSSMatrix || window.MozCSSMatrix || window.CSSMatrix;

		// CSSMatrix 객체를 지원하는 브라우저면
		if (CSSMatrix) {

			// 그냥 CSSMatrix 의 toString 기능을 사용
			getMatrixValue = function(sTransform) {
				return new CSSMatrix(sTransform).toString();
			};

		// CSSMatrix 객체를 지원하지 않는 브라우저면
		} else {

	        var sID = 'M' + Math.round(new Date().getTime() * Math.random());
	        var oAgent = jindo.$Agent().navigator();

	        var sPrefix = oAgent.firefox ? 'moz' : (oAgent.ie ? 'ms' : 'o');
			var sTransformKey = '-' + sPrefix + '-transform';

	        var elStyleTag = document.createElement('style');
	        elStyleTag.type = "text/css";

	        var elHTML = document.getElementsByTagName('html')[0];
	        elHTML.insertBefore(elStyleTag, elHTML.firstChild);

	        var oSheet = elStyleTag.sheet || elStyleTag.styleSheet;

	        var elDummy = document.createElement('div');
	        elDummy.id = sID;

	        var oComputedStyle = window.getComputedStyle(elDummy, null);

	        // 임시로 DOM 을 생성하고 getComputedStyle 로부터 얻은 값을 사용
			getMatrixValue = function(sTransform) {

				var sRet = null;

				oSheet.insertRule('#' + sID + ' { ' + sTransformKey + ': ' + sTransform + ' !important; }', 0);
	        	document.body.insertBefore(elDummy, document.body.firstChild);
				sRet = oComputedStyle.getPropertyValue(sTransformKey);

		        document.body.removeChild(elDummy);
				oSheet.deleteRule(0);
				
				return sRet;

			};

		}

		// transform 문자열을 matrix 로 변환
		var sVal = getMatrixValue(sTransform);

		// hello(foo,bar,baz) 형태의 값을 얻었으면
		if (/^([^\(]+)\(([^\)]*)\)$/.test(sVal)) {
			return {
				key : RegExp.$1,
				val : RegExp.$2.replace(/\s*,\s*/g, ' ') // 쉼표를 빈칸으로 변경
			};
		}

		// 기본 matrix 값 반환
		return { key : 'matrix', val : '1 0 0 1 0 0' };

	},

	// matrix(...) 를 matrix3d(...) 로 변환
	_convertMatrix3d : function(oTransformObj) {

		if (oTransformObj.key === 'matrix3d') { return oTransformObj; }

		var aVal = oTransformObj.val.split(' ');
		oTransformObj.key = 'matrix3d';

		// matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1).
		aVal.splice(2, 0, '0'); aVal.splice(3, 0, '0'); aVal.splice(6, 0, '0'); aVal.splice(7, 0, '0');
		aVal.splice(8, 0, '0'); aVal.splice(9, 0, '0'); aVal.splice(10, 0, '1'); aVal.splice(11, 0, '0');
		aVal.splice(14, 0, '0'); aVal.splice(15, 0, '1');

		oTransformObj.val = aVal.join(' ');

		return oTransformObj;

	},

	/**
		transform CSS 속성값을 파싱
		예)
			_parseTransformText('scale3d(2, 1.5, 1) translate(100px, 30px) rotate(10deg)');

			-> {
				'scaleX' : '2',
				'scaleY' : '1.5',
				'scaleZ' : '1',
				'translateX' : '100px',
				'translateY' : ' 30px',
				'rotate' : '10deg'
			}
	**/
	_parseTransformText : function(sText) {

		sText = sText || '';

		var oRet = {};

		sText.replace(/([\w\-]+)\(([^\)]*)\)/g, function(_, sKey, sVal) {

			var aVal = sVal.split(/\s*,\s*/);

			switch (sKey) {
			case 'translate3d':
			case 'scale3d':
			case 'skew3d':
				sKey = sKey.replace(/3d$/, '');
				oRet[sKey + 'Z'] = aVal[2];
				// cont. X, Y 도 마저 셋팅 되도록 일부러 break 안 넣었음

			case 'translate':
			case 'scale':
			case 'skew':
				oRet[sKey + 'X'] = aVal[0];

				if (typeof aVal[1] === 'undefined') {
					if (sKey === 'scale') { oRet[sKey + 'Y'] = aVal[0]; }
				} else {
					oRet[sKey + 'Y'] = aVal[1];
				}

				break;

			default:
				oRet[sKey] = aVal.join(',');
				break;
			}

		});

		return oRet;

	},

	/**
		Effect 컴퍼넌트의 기능을 사용 할 수 없는 시작값과 종료값을 가진 Effect 객체를 동작 할 수 있게 만들어 주는 함수

		var my = jindo.Effect.linear();
		 
		my.start = 'scale3d(2, 1.5, 1) translate(100px, 30px) rotate(10deg)';
		my.end = 'translateX(300px)';
		 
		var func = ..._getTransformFunction(my);
		func(0.5); // 'scaleX(2) scaleY(1.5) scaleZ(1) translateX(200px) translateY(30px) rotate(10deg)'
	**/
	_getTransformFunction : function(sDepa, sDest, fEffect, elBox) {

		var sKey;

		var oDepa, oDest;

		// matrix transform 이 바뀌는거면
		if (/matrix/.test(sDepa + sDest)) {

			// 둘다 matric 객체로 변환
			oDepa = this._getMatrixObj(sDepa, elBox);
			oDest = this._getMatrixObj(sDest, elBox);

			// 종류가 다르면 범용적으로 맞출 수 있는 matrix3d 로 변환
			if (oDepa.key !== oDest.key) {
				oDepa = this._convertMatrix3d(oDepa);
				oDest = this._convertMatrix3d(oDest);
			}

			fEffect = fEffect(oDepa.val, oDest.val);

			return function(nRate) {
				return nRate === 1 ? sDest : oDepa.key + '(' + fEffect(nRate).replace(/ /g, ',') + ')';
			};

		}

		// 시작값과 종료값을 각각 파싱
		oDepa = this._parseTransformText(sDepa);
		oDest = this._parseTransformText(sDest);

		var oProp = {};

		// 시작값에 있는 내용으로 속성들 셋팅
		for (sKey in oDepa) if (oDepa.hasOwnProperty(sKey)) {
			// 시작값, 종료값 셋팅 (만약 종료값이 지정되어 있지 않으면 1 또는 0 셋팅)
			oProp[sKey] = fEffect(oDepa[sKey], oDest[sKey] || (/^scale/.test(sKey) ? 1 : 0));
		}

		// 종료값에 있는 내용으로 속성들 셋팅
		for (sKey in oDest) if (oDest.hasOwnProperty(sKey) && !(sKey in oDepa)) { // 이미 셋팅되어 있지 않는 경우에만
			// 시작값, 종료값 셋팅 (만약 시작값이 지정되어 있지 않으면 1 또는 0 셋팅)
			oProp[sKey] = fEffect(oDepa[sKey] || (/^scale/.test(sKey) ? 1 : 0), oDest[sKey]);
		}

		var fpFunc = function(nRate) {
			var aRet = [];
			for (var sKey in oProp) if (oProp.hasOwnProperty(sKey)) {
				aRet.push(sKey + '(' + oProp[sKey](nRate)+ ')');
			}
			/*
			aRet = aRet.sort(function(a, b) {
				return a === b ? 0 : (a > b ? -1 : 1);
			});
			*/

			return aRet.join(' ');
		};

		return fpFunc;

	}

}).extend(jindo.Component);
/**
	@fileOverview 마우스 제스쳐 컴포넌트
	@author TarauS
	@version 1.14.0
**/
/**
	마우스 제스쳐 컴포넌트
	
	@class jindo.MouseGesture
	@extends jindo.Component
	@keyword mousegesture, gesture, 마우스제스쳐, 제스쳐
**/
jindo.MouseGesture = jindo.$Class({
	/**
		@lends jindo.MouseGesture.prototype
	**/

	/**
		라인이 그려질 캔버스 객체
		@type {Element}
	**/
	_elCanvas : null,
	/**
		Canvas Element의 Drawing Context
		@type {Object}
	**/
	_oDC : null,
	/**
		이벤트 핸들러 저장 객체
		@type {HashTable}
	**/
	_htEventHandler : {},
	/**
		사용자의 마우스가 움직인 점의 목록
		@type {Array}
	**/
	_aPointList : [],
	/**
		저장된 점의 개수
		@type {Number}
	**/
	_nPointCount : 0,
	/**
		라인을 그리는 방법 (vml, canvas)
		@type {String}
	**/
	_sDrawingType : "",
	/**
		모바일 사파리인지를 저장하는 변수
		@type {Boolean}
	**/
	_bMobileSafari : false,

	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션 객체
			@param {String} [htOption.sLineColor="#FF0000"] 선 색상
			@param {Number} [htOption.nLineThickness=5] 선 두께
			@param {Number} [htOption.nFilteringDistance=10] 유효 분석 거리 (두 점 사이의 간격이, 이 값 이상일 때만 분석 데이터로 사용)
			@param {Window} [htOption.elTargetWindow=window] 선이 그려질 윈도우 객체
		@example
			var oMouseGestureInstance = new jindo.MouseGesture({
			    "sLineColor" : "#FF0000",   // 라인 컬러
			    "nLineThickness" : 5,       // 라인 두께
			    "nFilteringDistance" : 10,  // 유효 분석 거리 (두 점 사이의 간격이, 이 값 이상일 때만 분석 데이터로 사용)
			    "elTargetWindow" : window   // 라인이 그려질 윈도우 객체
			});
	 *	
			oMouseGestureInstance.attach("gesture", function(oGestureEvent){
			    console.log(oGestureEvent.sCode, oGestureEvent.aCodeList);
			    for(var i=0; i<eGesture.aCodeList.length; i++){
			        switch(eGesture.aCodeList[i]){
			        case 1: sCode += "↗";break;
			        case 2: sCode += "→";break;
			        case 3: sCode += "↘";break;
			        case 4: sCode += "↓";break;
			        case 5: sCode += "↙";break;
			        case 6: sCode += "←";break;
			        case 7: sCode += "↖";break;
			        case 8: sCode += "↑";break;
			        }
			    }
			    console.log("result" : sCode);
			}
	**/
	$init : function(htOption){

		var self = this;

		// 기본 옵션 설정
		this.option({
			"sLineColor" : "#FF0000",
			"nLineThickness" : 5,
			"nFilteringDistance" : 10,
			"elTargetWindow" : window
		});
		// 사용자 옵션 설정
		this.option(htOption);

		// 마우스 다운 이벤트 핸들러 등록 (모바일 사파리는 터치 이벤트 등록)
		var sUserAgent = window.navigator.userAgent.toLowerCase();
		this._bMobileSafari = (/mobile/.test(sUserAgent) && /safari/.test(sUserAgent)) || /iphone/.test(sUserAgent);

		var oDoc = this.option("elTargetWindow").document;

		oDoc.addEventListener && oDoc.addEventListener('mousedown', function() {
			self._htEventHandler["setted_context_menu"] = oDoc.oncontextmenu;
			oDoc.oncontextmenu = function(){return false;};
		}, true);

		this._htEventHandler["mouse_down"] = jindo.$Fn(this._onMouseDown, this).attach(oDoc, this._bMobileSafari ? "touchstart" : "mousedown", true);

		// 캔버스 생성
		this._createCanvas();
	},

	/**
		캔버스 생성 함수
		- IE의 경우에는 VML을 위한 네임 스페이스를 정의하고, VML Element들을 위치시킬 DIV Element를 생성
		- IE 외의 CanvasAPI를 지원하는 경우에는, Canvas Element를 생성
	**/
	_createCanvas : function(){

		var elCanvas = jindo.$("<canvas>");

		if(elCanvas.getContext) { // jindo.$Agent().navigator().ie){
			// Canvas Element 생성
			this._elCanvas = elCanvas;
			this._oDC = this._elCanvas.getContext("2d");
			this._sDrawingType = "canvas";
			this._oDC.globalCompositeOperation = "destination-over";
		} else {
			// 네임 스페이스 생성
			if(!this.option("elTargetWindow").document.namespaces["vml_nhn"]){
				this.option("elTargetWindow").document.namespaces.add("vml_nhn", "urn:schemas-microsoft-com:vml");
			}
			// VML을 위한 스타일 정의
			var elStyle = this.option("elTargetWindow").document.createStyleSheet();
			elStyle.cssText = "vml_nhn\\:shape, vml_nhn\\:stroke {behavior:url(#default#VML); display:inline-block; position:absolute;width:1px;height:1px;};";
			this._elCanvas = jindo.$("<div>");
			this._sDrawingType = "vml";
		}
		
		jindo.$Element(this._elCanvas).css({"position":"absolute", "top" : "0px", "left" : "0px"}).hide().prependTo(this.option("elTargetWindow").document.body);
	},

	/**
		생성된 캔버스 엘리먼트를 화면에 표시하는 함수
	**/
	_showCanvas : function(){
		var htDocumentSize = jindo.$Document(this.option("elTargetWindow").document).clientSize();
		var htScrollPosition = jindo.$Document(this.option("elTargetWindow").document).scrollPosition();
		
		if(this._sDrawingType == "canvas"){
			this._elCanvas.width = htDocumentSize.width;
			this._elCanvas.height = htDocumentSize.height;
		}

		// 캔버스의 크기를 브라우저의 크기게 맞게 조정
		jindo.$Element(this._elCanvas).css({"top" : htScrollPosition.top +"px", "width" : htDocumentSize.width+"px", "height" : htDocumentSize.height+"px", "zIndex" : 999999}).show();
	},

	// 화면에 표시된 캔버스 엘리먼트를 감추고, 그려진 내용을 초기화하는 함수
	_hideCanvas : function(){
		if(this._elCanvas){
			if(this._sDrawingType == "vml"){
				this._elCanvas.innerHTML = "";
			}else if(this._sDrawingType == "canvas"){
				this._oDC.beginPath();
				this._oDC.clearRect(0, 0, this._elCanvas.offsetWidth, this._elCanvas.offsetHeight);
				this._oDC.closePath();
			}
			jindo.$Element(this._elCanvas).hide();
		}
	},

	/**
		캔버스 엘리먼트에 두 점의 좌표를 이용하여 라인을 그리는 함수
	 *
		@param {Object} htStartPosition 시작 점의 좌표 정보를 가진 객체 ({nX : 123, nY:123})
		@param {Object} htEndPosition 끝 점의 좌표 정보를 가진 객체 ({nX : 456, nY:456})
	**/
	_drawLine : function(htStartPosition, htEndPosition){
		// VML을 이용하여 라인을 그림
		if(this._sDrawingType == "vml"){
			var sPath = " m "+(htStartPosition.nX*1-5)+","+(htStartPosition.nY*1-5)+" l "+(htEndPosition.nX*1-5)+","+(htEndPosition.nY*1-5);
			var sHTML = '<vml_nhn:shape coordsize="1 1" strokeweight="'+this.option("nLineThickness")+'pt" strokecolor="'+this.option("sLineColor")+'" path="'+sPath+'"><vml_nhn:stroke endcap="round" /></vml_nhn:shape>';
			this._elCanvas.insertAdjacentHTML("BeforeEnd",sHTML);
		// 캔버스 API를 이용하여 라인을 그림
		}else if(this._sDrawingType == "canvas"){
			this._oDC.save();
			this._oDC.beginPath();
			this._oDC.lineCap = "round";
			this._oDC.lineWidth = this.option("nLineThickness") + 2;
			this._oDC.strokeStyle = this.option("sLineColor");
			this._oDC.moveTo(htStartPosition.nX,htStartPosition.nY);
			this._oDC.lineTo(htEndPosition.nX,htEndPosition.nY);
			this._oDC.stroke();
			this._oDC.closePath();
			this._oDC.restore();
		}
	},

	/**
		이벤트 객체로부터 이벤트가 발생한 좌표 정보를 계산하여, 좌표 목록 배열에 저장하고, 계산된 좌표를 리턴하는 함수
		- 모바일 버전의 사파리의 경우에는, 터치 이벤트에 대한 좌표 정보를 계산
		- 위의 경우가 아닌 경우에는 pos() 함수를 이용하여 계산
	 *
		@param {WrappingEvent} weTarget 좌표를 계산할 이벤트 객체
		@return {Object} 좌표 정보를 저장하고 있는 객체
	**/
	_addPointList : function(weTarget){
		// 좌표 정보를 계산
		var htPosition;
		if(this._bMobileSafari){
			htPosition = {
				"pageX": weTarget._event.targetTouches[0].clientX,
				"pageY": weTarget._event.targetTouches[0].clientY
			};
		}else{
			htPosition = weTarget.pos();
		}

		// 결과 객체 생성
		var htResult = {
			"nX": htPosition.clientX,
			"nY": htPosition.clientY
		};

		// 좌표 정보 저장 배열에 추가
		this._aPointList.push(htResult);
		this._nPointCount++;

		return htResult;
	},

	/**
		MouseDown 이벤트 핸들러
		- MouseMove 및 MouseUp 이벤트 핸들러 등록
		- MouseDown 이벤트가 발생한 좌표 저장
	 *
		@param {WrappingEvent} weMouseDown 마우스 다운 이벤트 객체
	**/
	_onMouseDown : function(weMouseDown){
		if(weMouseDown.mouse().right || this._bMobileSafari){
			weMouseDown.stop();
			// 이벤트가 발생한 좌표 정보를 저장
			this._addPointList(weMouseDown);
			// 이벤트 핸들러 등록
			this._htEventHandler["mouse_move"] = jindo.$Fn(this._onMouseMove, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			this._htEventHandler["mouse_up"] = jindo.$Fn(this._onMouseUp, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			// setCapture() 수행 (IE에서 로딩된 플래시 객체 위에서 이벤트 처리를 하기 위한 목적)
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.setCapture();
			}
		}
	},

	/**
		MouseMove 이벤트 핸들러
		- 첫 이동일 경우, 감춰진 캔버스를 보여지도록 설정
		- MouseMove 이벤트가 발생한 좌표와, 바로 전에 저장된 좌표를 이용하여 라인을 그림
	 *
		@param {WrappingEvent} weMouseMove 마우스 무브 이벤트 겍체
	**/
	_onMouseMove : function(weMouseMove){
		// 이벤트가 발생한 좌표 정보를 저장
		var htPosition = this._addPointList(weMouseMove);

		if(this._nPointCount === 2){
			this._showCanvas();
		}

		// 두 점을 이용하여 라인을 그림
		if(this._nPointCount % 2){ // VML로 그릴 때, 느려지는 현상이 있어 2번에 1번 꼴로 라인을 그리도록 함
			this._drawLine({
				"nX": this._aPointList[this._nPointCount - 3]["nX"],
				"nY": this._aPointList[this._nPointCount - 3]["nY"]
			}, htPosition);
		}
	},

	/**
		저장된 좌표 정보를 바탕으로 사용자의 마우스 이동 방향을 계산하여 리턴하는 함수
		- 두 점의 거리가 옵션의 nFilteringDistance보다 작은 경우에는 계산에서 제외 시킴
		- 두 점의 기울기를 바탕으로 방향을 결정
		- 중복된 방향 값을 제거
	 *
		@return {Object} 최종 계산된 방향 정보 객체
	**/
	_recognitionGesture : function(){
		var nX, nY, nBeforeX, nBeforeY, nGradient, nAbsGradient, nResult, nDistance;
		var aFilteredList = [], aResult = [];
		var nBaseGradient1 = Math.tan(22.5 * Math.PI / 180);
		var nBaseGradient2 = Math.tan(67.5 * Math.PI / 180);

		// 저장된 좌표들을 루프를 돔
		for(var i=1; i<this._aPointList.length; i++){
			nX = this._aPointList[i]["nX"];
			nY = this._aPointList[i]["nY"];
			nBeforeX = this._aPointList[i-1]["nX"];
			nBeforeY = this._aPointList[i-1]["nY"];
			nDistance = Math.sqrt(Math.pow(nY - nBeforeY, 2) + Math.pow(nX - nBeforeX, 2));

			// 두 점의 거리(nDistance)가 옵션에 정의된 nFilteringDistance 보다 큰 경우에만 기울기를 계산
			if(nDistance > this.option("nFilteringDistance")){// || aResultList[aResultList.length-1] != nResult){
				// 두 점의 기본 기울기를 계산
				nGradient = -(nY - nBeforeY) / (nX - nBeforeX);
				nAbsGradient = Math.abs(nGradient);

				// 두 점의 기울기와 좌표 정보를 이용하여, 두 점의 방향을 계산 함
				if(nAbsGradient >= nBaseGradient2){
					if(nY < nBeforeY){
						nResult = 8;
					}else{
						nResult = 4;
					}
				}else if(nAbsGradient < nBaseGradient1){
					if(nX < nBeforeX){
						nResult = 6;
					}else{
						nResult = 2;
					}
				}else if(nAbsGradient >= nBaseGradient1 && nAbsGradient < nBaseGradient2){
					if(nGradient > 0){
						nResult = 1;
					}else{
						nResult = 3;
					}
					if(nX < nBeforeX){
						nResult += 4;
					}
				}
				aFilteredList.push(nResult);
			}
		}
		
		// 필터링 및 기본 방향 계산이 끝난 데이터를 루프를 돌며, 중복된 값을 제거
		for(i=1; i<aFilteredList.length; i++){
			if(aResult.length === 0){
				aResult.push(aFilteredList[i]);
			}else{
				if(aResult[aResult.length-1] != aFilteredList[i]){
					aResult.push(aFilteredList[i]);
				}
			}
		}
		
		// 최종 계산된 결과를 리턴
		return {
			"aCodeList" : aResult,
			"sCode" : aResult.join("")
		};
	},

	/**
		MouseUp 이벤트 핸들러
		- 등록된 이벤트 핸들러 해제
		- 컨텍스트 메뉴에 대한 이벤트 핸들러 복원
		- 저장된 좌표 정보를 바탕으로, 점들의 방향 값들을 구하여, gesture 이벤트 발생
		- 변수 초기화 및 캔버스 감추기
	 *
		@param {WrappingEvent} weMouseUp 마우스 업 이벤트 객체
	**/
	_onMouseUp : function(weEvent){
		if(weEvent.mouse().right || this._bMobileSafari){
			weEvent.stop();

			// 등록된 이벤트 핸들러 해제
			if(this._htEventHandler["mouse_move"]){
				this._htEventHandler["mouse_move"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			}
			
			if(this._htEventHandler["mouse_up"]){
				this._htEventHandler["mouse_up"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			}
			
			// 컨텍스트 메뉴에 대한 이벤트 핸들러 복원
			if((this._aPointList.length && !this._bMobileSafari) || 'setted_context_menu' in this._htEventHandler){

				if (!('setted_context_menu' in this._htEventHandler)) {
					this._htEventHandler["setted_context_menu"] = this.option("elTargetWindow").document.oncontextmenu;
					this.option("elTargetWindow").document.oncontextmenu = function(){return false;};
				}

				setTimeout(jindo.$Fn(function(){
					this.option("elTargetWindow").document.oncontextmenu = this._htEventHandler["setted_context_menu"];
					delete this._htEventHandler["setted_context_menu"];
				}, this).bind(), 1);
			}
			
			// releaseCapture() 수행
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.releaseCapture();
			}
			
			// 저장된 좌표 정보를 바탕으로 방향 값을 계산하여 커스텀 이벤트 발생
			var htResult = this._recognitionGesture();
			if(htResult.sCode){
				/**
					사용자가 오른쪽 마우스를 누른 후, 드래그 후
					
					@event gesture
					@param {String} sType 커스텀 이벤트명
					@param {Array} aCodeList 제스처 코드 목록
					@param {String} sCode 코드명
					@example
						// 커스텀 이벤트 핸들링 예제
						// 사용자가 오른쪽 마우스를 누른 후, 드래그 후에 발생하는 이벤트
						oMouseGesture.attach("gesture", function(eGestureEvent){
						    // 사용자가 취한 제스쳐에 대한 정보를 담고 있는 oGestureEvent 객체를 파라미터로 받음
						    // oGestureEvent 객체에 있는 sCode와 aCodeList 값에 맵핑된 기능을 수행 함
						    var sCode = eGesture.sCode+" : ";
						    for(var i=0; i<eGesture.aCodeList.length; i++){
						        switch(eGesture.aCodeList[i]){
						        case 1: sCode += "↗";break;
						        case 2: sCode += "→";break;
						        case 3: sCode += "↘";break;
						        case 4: sCode += "↓";break;
						        case 5: sCode += "↙";break;
						        case 6: sCode += "←";break;
						        case 7: sCode += "↖";break;
						        case 8: sCode += "↑";break;
						        }
						    }
						     
						    if(eGesture.sCode == "8")jindo.$Element("elLayer").show();
						    else if(eGesture.sCode == "4") jindo.$Element("elLayer").hide();
						    else if(eGesture.sCode == "2") jindo.$("elLayer").style.background = "green";
						    else if(eGesture.sCode == "6") jindo.$("elLayer").style.background = "blue";
						    jindo.$("elDebug").value = sCode;
						});
				**/
				this.fireEvent("gesture", htResult);
			}
	
			// 초기화
			this._nPointCount = 0;
			this._aPointList = [];
			this._hideCanvas();
		}
	},

	/**
		컴포넌트 소멸자
		
		@method destroy
	**/
	destroy : function(){
		jindo.$Element(this._elCanvas).leave();
		this._elCanvas = null;
		this._oDC = null;
		this._htEventHandler = null;
		this._nPointcount = null;
		this._aPointList = null;
		this._sDrawingType = null;
		this._bMobileSafari = null;
	}
}).extend(jindo.Component);/**
	@fileOverview 다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트 
	@author senxation
	@version 1.14.0
**/
/**
	다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트
	
	@class jindo.MultipleAjaxRequest
	@extends jindo.Component
	@keyword multipleajaxrequest, ajax, request, response, 멀티플에이잭스리퀘스트, 에이잭스, 리퀘스트, 요청, 응답, 직렬, 병렬
**/
jindo.MultipleAjaxRequest = jindo.$Class({
	/** @lends jindo.MultipleAjaxRequest.prototype */
	
	_bIsRequesting : false,
	
	/**
		컴포넌트를 생성한다.
		
		@constructor
		@param {Object} [htOption] 옵션 Hash Table
			@param {String} [htOption.sMode="parallel"] 요청 방식. 기본은 병렬로 요청. "serial"일 경우 직렬로 요청
		@example
			var oMultipleAjaxRequest = new jindo.MultipleAjaxRequest({ 
				sMode : "parallel" //요청 방식. 기본은 병렬로 요청. "serial"일 경우 직렬로 요청
			}).attach({
				start: function(oCustomEvent) {
					//요청이 시작될 때 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	aAjax : (Array) request() 메서드에 전달되었던 aAjax 배열 
					//	htMetaData : (HashTable) request() 메서드에 전달되었던 htMetaData
					//}
				},
				beforeEachRequest: function(oCustomEvent){
					//각각의 요청 이전에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
					//	nIndex : (Number) 요청 순서
					//}
				},
				afterEachResponse: function(oCustomEvent){
					//각각의 응답 이후에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
					//	nIndex : (Number) 요청 순서
					//}
				},
				complete: function(oCustomEvent){
					//모든 응답이 완료된 이후에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	aResponse : (Array) 모든 요청의 jindo.$Ajax.Response 객체의 배열
					//	htMetaData : (HashTable) request메서드에서 선언한 Hash Table 
					//}
					
				}
			});
	**/
	$init : function(htOption){
		var htDefaultOption = {
			sMode : "parallel" //기본은 병렬로 요청. "serial"일 경우 직렬로 요청
		};
		this.option(htDefaultOption);
		this.option(htOption);
	},
	
	/**
		요청이 진행중인지 여부를 가져온다.
		
		@method isRequesting
		@return {Boolean} 요청 진행 여부
	**/
	isRequesting : function() {
		return this._bIsRequesting;
	},
	
	/**
		요청을 수행한다.
		
		@method request
		@param {Array} aAjax 요청을 위한 정보를 담은 Hash Table의 배열
		@param {Object} complete 커스텀 이벤트에 전달될 Hash Table
		@return {Boolean} 요청이 성공적으로 시작되었는지 여부
		@example
			var oAjax1 = {
				sUrl : "1.js", //요청할 URL
				htOption : { //jindo.$Ajax의 option객체 (jindo.$Ajax 참고)
					type : "xhr",
					method : "get"
				},
				htParameter : null //jindo.$Ajax.request를 수행시 전달할 파라미터 Hash Table 객체
			};
			
			var htAjax2 = {
				sUrl : "22.js",
				htOption : {
					type : "xhr",
					method : "get"
				},
				htParameter : null
			};
			
			var htAjax3 = {
				sUrl : "3.js",
				htOption : {
					type : "xhr",
					method : "get"
				},
				htParameter : null
			};
			
			oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjaxhtAjax sRequestName : "요청이름" });
	**/
	request : function(aAjax, htMetaData) {
		if (this.isRequesting()) { //요청이 진행중이면 중단한다.
			return false;
		}
		if (!(aAjax instanceof Array)) {
			aAjax = [aAjax];
		}
		if (typeof htMetaData == "undefined") {
			htMetaData = {};
		}
		this._htMetaData = htMetaData;
		
		switch (this.option("sMode")) {
			case "parallel" :
				this._parallelRequest(aAjax);
				break;	
			case "serial" :
				this._serialRequest(aAjax);
				break;
			default :
				return false;
		}
		return true;
	},
	
	_fireEventStart : function() {
		this._bIsRequesting = true;
		
		/**
			요청이 시작될 때
			
			@event start
			@param {String} sType 커스텀 이벤트명
			@param {Array} aAjax request() 메서드에 전달되었던 aAjax 배열
			@param {Object} htMetaData request() 메서드에 전달되었던 htMetaData
			@param {Function} stop 수행시 요청을 시작하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("start", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("start", {
			aAjax : this._aAjax,
			htMetaData : this._htMetaData
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventBeforeEachRequest : function(nIndex) {
		/**
			각각의 요청 이전
			
			@event beforeEachRequest
			@param {String} sType 커스텀 이벤트명
			@param {jindo.$Ajax} oAjax 해당 요청의 jindo.$Ajax 객체
			@param {Number} nIndex 요청 순서
			@param {Function} stop 수행시 요청을 시작하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("beforeEachRequest", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("beforeEachRequest", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventAfterEachResponse : function(nIndex) {
		/**
			각각의 요청 이후
			
			@event afterEachResponse
			@param {String} sType 커스텀 이벤트명
			@param {jindo.$Ajax} oAjax 해당 요청의 jindo.$Ajax 객체
			@param {Number} nIndex 요청 순서
			@param {Function} stop 수행시 더이상 요청이 진행되지 않고 모든 응답이 완료되어도 complete 커스텀 이벤트 발생하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("afterEachRequest", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("afterEachResponse", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	/**
		병렬 요청
		@param {Array} aAjax
		@ignore
	**/
	_parallelRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		if (this._fireEventStart()) {
			var self = this;
			jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
				var fParallelResponseHandler = function(oResponse){
					oResponse._constructor = self._aAjax[i];
					var nIndex = self._findAjaxObjectIndexOfResponse(oResponse._constructor);
					self._aResponse[nIndex] = oResponse;
					self._aStatus[nIndex] = true;
					
					if (self._fireEventAfterEachResponse(nIndex)) {
						if (self._hasCompletedGotResponsesOfParallelResponses()) {
							self._complete();
						}	
					}
				};
				self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
				htAjax.htOption.onload = fParallelResponseHandler;
				htAjax.htOption.onerror = fParallelResponseHandler;
				htAjax.htOption.ontimeout = fParallelResponseHandler;
				self._aAjax[i].option(htAjax.htOption);
				
				if (self._fireEventBeforeEachRequest(i)){
					self._aAjax[i].request(htAjax.htParameter || {});	
				} else {
					jindo.$A.Break();
				}
			});
		}
		
	},
	
	/**
		병렬 요청시 응답이 몇번째 Ajax 요청에 대한 응답인지 찾는다.
		@param {Object} oAjax
		@return {Number}
	**/
	_findAjaxObjectIndexOfResponse : function(oAjax) {
		return jindo.$A(this._aAjax).indexOf(oAjax);
	},
	
	/**
		병렬 요청의 응답이 모두 완료되었는지 확인한다.
	**/
	_hasCompletedGotResponsesOfParallelResponses : function() {
		var bResult = true;
		jindo.$A(this._aStatus).forEach(function(bStatus){
			if (!bStatus) {
				bResult = false;
				jindo.$A.Break();
			} 
		});
		return bResult;
	},
	
	/**
		직렬 요청
		@param {Array} aAjax
		@ignore
	**/
	_serialRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		var self = this;
		jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
			var fSerialRequestHandler = function(e){
				e._constructor = self._aAjax[i];
				self._aResponse.push(e);
				self._serialRequestNext();
			};
			self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
			htAjax.htOption.onload = fSerialRequestHandler;
			htAjax.htOption.onerror = fSerialRequestHandler;
			htAjax.htOption.ontimeout = fSerialRequestHandler;
			self._aAjax[i].option(htAjax.htOption);
		});
		
		if (this._fireEventStart()) {
			if (this._fireEventBeforeEachRequest(0)) {
				this._aAjax[0].request(this._aAjaxData[0].htParameter || {});
				this._aStatus[0] = true;
			}
		}
	},
	
	/**
		직렬 요청시 다음 요청을 수행하거나 응답 완료
		@param {Array} aAjax
		@ignore
	**/
	_serialRequestNext : function() {
		var nIndex = -1;
		for (var i = 0; i < this._aStatus.length; i++) {
			if(!this._aStatus[i]) {
				this._aStatus[i] = true;
				nIndex = i;
				break;
			}
		}
		
		if (nIndex > 0) {
			if (this._fireEventAfterEachResponse(nIndex - 1)) {
				if (this._fireEventBeforeEachRequest(nIndex)) {
					this._aAjax[nIndex].request(this._aAjaxData[nIndex].htParameter || {});
				}
			}
		} else if (nIndex == -1) {
			if (this._fireEventAfterEachResponse(this._aStatus.length - 1)) {
				this._complete();
			}
		}
	},
	
	/**
		요청정보들을 초기화한다.
		@ignore
	**/
	_reset : function() {
		this._aAjaxData.length = 0;
		this._aAjax.length = 0;
		this._aStatus.length = 0;
		this._aResponse.length = 0;
		this._htMetaData = null;
		
		delete this._aAjaxData;
		delete this._aAjax;
		delete this._aStatus;
		delete this._aResponse;
		delete this._htMetaData;
		
		this._bIsRequesting = false;
	},
	
	/**
		요청을 중단한다.
		
		@method abort
		@remark 다수의 요청중에 현재까지의 모든 요청이 중단되고, 수행되지 않은 요청은 더 이상 진행되지 않는다.
	**/
	abort : function() {
		jindo.$A(this._aAjax).forEach(function(oAjax){
			oAjax.abort();
		});
		this._reset();
	},
	
	/**
		응답이 완료되었을때 수행되어 완료 이벤트(complete)를 발생
		@ignore
	**/
	_complete : function() {
		var aResponse = this._aResponse.concat(),
			htMetaData = {},
			sProp;
		for (sProp in this._htMetaData) {
			htMetaData[sProp] = this._htMetaData[sProp];
		}
		
		this._reset();
		/**
			모든 응답이 완료된 이후
			
			@event complete
			@param {String} sType 커스텀 이벤트명
			@param {Array} aResponse 모든 요청의 jindo.$Ajax.Response 객체의 배열
			@param {Object} htMetaData request메서드에서 선언한 Hash Table
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("complete", function(oCustomEvent) { ... });
		**/
		this.fireEvent("complete", {
			aResponse : aResponse,
			htMetaData : htMetaData
		});	
	}

}).extend(jindo.Component);	/**
    @fileOverview Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
    @author hooriza, modified by senxation
    @version 1.14.0
**/
/**
    Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
    
    @class jindo.NumberFormatter
    @extends jindo.Formatter
    @requires jindo.TextRange
    @requires jindo.Timer
    @keyword numberformatter, formatter, comma, number, 넘버포맷터, 포맷터, 콤마
**/
jindo.NumberFormatter = jindo.$Class({
    /** @lends jindo.NumberFormatter.prototype */
    /**
        NumberFormatter 컴포넌트를 생성한다.
        
        @constructor
        @param {HTMLElement} el 숫자만 입력하게 만들 입력폼 엘리먼트
        @param {Object} [htOption] 옵션 객체
            @param {Number} [htOption.nDecimalPoint=2] 표시할 소수점 자리
            @param {Boolean} [htOption.bPaintOnload=true] 로드시에 paint() 수행여부
            @param {Boolean} [htOption.bActivateOnload=true] 로드시에 activate() 수행여부
        @example 
            var oNumberFormatter = new jindo.NumberFormatter(jindo.$('foo'), { 
                nDecimalPoint : 2, //(Number) 소수점 몇째자리까지 표시할 것인지
            }).attach({
                beforeChange : function(oCustomEvent) { 
                    //전달되는 이벤트 객체 e = {
                    //  elInput : (HTMLElement) Text Input 엘리먼트
                    //  sText : (String) Text Input 의 값
                    //  sStartMark : (String)
                    //  sEndMark : (String)
                    //} 
                },
                change : function(oCustomEvent) {
                    //전달되는 이벤트 객체 e = {
                    //  elInput : (HTMLElement) Text Input 엘리먼트
                    //}
                }
            });

        @remark
            Firefox 에서는 한글을 입력했을때 입력폼 내용이 모두 사라지는 버그가 있으므로
            입력폼 엘리먼트의 ime-mode 스타일을 disabled 로 하는 것을 권장한다.
    **/ 
    $init : function(el, htOption) {
        this.option({
            nDecimalPoint : 0 //(Number) 소수점 몇째자리까지 표시할 것인지
        });
        this.option(htOption || {});
    
        this.attach('beforeChange', function(oCustomEvent) {
            var sText = oCustomEvent.sText;
            var sOutput = '';
            var nDecimalPoint = this.option("nDecimalPoint");
            var sStartMark = oCustomEvent.sStartMark;
            var sEndMark = oCustomEvent.sEndMark;
            
            if (nDecimalPoint === 0) {
                // 숫자랑 마크빼고 전부 삭제
                sText = sText.replace(new RegExp('[^0-9' + sStartMark + sEndMark + ']', 'g'), '');
                // 맨 앞에 있는 숫자 0 없애기         
                sText = sText.replace(/^0+/, '');
                sText = sText.replace(new RegExp('^0*' + sStartMark + '0*' + sEndMark + '0*'), sStartMark + sEndMark);  
            } else {
                
                var count = 0;
                var aMatch = [];
                sText.replace(new RegExp('((?:[0-9]|'+sStartMark+sEndMark+')\\.|[0-9]|' + sStartMark + '|' +sEndMark + ')', 'g'),function(m){
                    if(/\.$/.test(m)){
                        if(count==0){
                            count++;
                            aMatch.push(m);
                        }else{
                            aMatch.push(m.replace(".",""));
                        }
                    }else{
                        aMatch.push(m);
                    }
                });
                sText = aMatch?aMatch.join(""):"";
                
                // 맨 앞에 있는 숫자 0 없애기         
                
                if(!(new RegExp('^(?:0|[0-9]\\.(?:[0-9]*?))' + sStartMark + sEndMark+"$").test(sText))){
                    sText = sText.replace(/^0+/, '');
                }
                // // 숫자랑 . 마크빼고 전부 삭제
                // sText = sText.replace(new RegExp('[^0-9\.' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
                // sText = sText.replace(/\.{2,}/g, ".");
                // // 맨 앞에 있는 . 없애기         
                // sText = sText.replace(/^\.+/, '');
                // // 소수점 2개가 없도록
                // sText = sText.replace(/(\.[^.]*?)(\.)/g, function(){
                    // return arguments[1];
                // });
                // // 맨 앞에 있는 숫자 0 없애기          
                // sText = sText.replace(/^0+/, '');
                // sText = sText.replace(new RegExp('^0*' + oCustomEvent.sStartMark + '0*' + oCustomEvent.sEndMark + '0*'), oCustomEvent.startMark + oCustomEvent.endMark);
                // sText = sText.replace(new RegExp("^0([^\."+ oCustomEvent.sStartMark + oCustomEvent.sEndMark +"]+?)", "g"), function(){
                    // return arguments[1];
                // });
            }

            sOutput = this._convertCurrency(sText);
            if (nDecimalPoint > 0) {
                sOutput = this._limitDecimalPoint(sOutput, nDecimalPoint);
            }
            
            oCustomEvent.sText = sOutput;
        });

    },
    
    /**
        Text Input의 설정된 값을 가져온다.
        
        @method getValue
        @return {String}
        @example
            "12,345,678.12"
            oNumberFormatter.getValue(); -> "12345678.12"
    **/
    getValue : function() {
        return this._el.value.replace(new RegExp("[,"+ this._aMarks[0] + this._aMarks[1] + "]+?", "g"), "");
    },

    _convertCurrency : function(sText) {
        var nDot = 0,
            sReturn = "",
            nDotPosition = sText.indexOf("."),
            nLastPosition = sText.length;
            
        if (nDotPosition > -1) {
            nLastPosition = nDotPosition - 1;
        }
        
        //세자리마다 ,찍어 통화형식으로 만들기
        for (var i = sText.length; i >= 0; i--) {
            var sChar = sText.charAt(i);
            if (i > nLastPosition) {
                sReturn = sChar + sReturn;
                continue;
            }
            if (/[0-9]/.test(sChar)) {
                if (nDot >= 3) {
                    sReturn = ',' + sReturn;
                    nDot = 0;
                }
                nDot++;
                sReturn = sChar + sReturn;
            } else if (sChar == this._aMarks[0] || sChar == this._aMarks[1]) {
                sReturn = sChar + sReturn;
            }
        }
        
        return sReturn;
    },
    
    _limitDecimalPoint : function(sText, nDecimalPoint) {
        var sReturn = "",
            nDotPosition = sText.indexOf("."),
            nLastPosition = sText.length;
            
        if (nDotPosition > -1) {
            nLastPosition = nDotPosition - 1;
        }
        
        //소수점 이하 자리수 제한
        nDotPosition = sText.indexOf(".");
        if (nDotPosition > -1 && nDecimalPoint > 0) {
            var nDecimalCount = 0;
            for (var i = 0; i < sText.length; i++) {
                var sChar = sText.charAt(i),
                    bIsNumber = /[0-9]/.test(sChar);
                
                if (bIsNumber) {
                    if (nDecimalCount == nDecimalPoint) {
                        continue;
                    }
                    if (i > nDotPosition) {
                        nDecimalCount++;
                    }
                }
                sReturn += sChar;
            }   
        } else {
            sReturn = sText;
        }
        
        return sReturn;
    }
}).extend(jindo.Formatter);/**
	@fileOverview Text Input의 숫자 값을 증감 버튼을 클릭(Click)이나 마우스 휠(Wheel) 동작으로 증감 시킬 수 있는 컴포넌트
	@version 1.14.0
**/
/**
	Text Input의 숫자 값을 +/- 버튼 클릭이나 마우스 휠동작으로 증감시킬 수 있는 컴포넌트
	
	@class jindo.NumericStepper
	@extends jindo.UIComponent
	@keyword numericstepper, stepper, number, 증감, 숫자, 뉴메릭스테퍼, 스테퍼
**/
jindo.NumericStepper = jindo.$Class({
	/** @lends jindo.NumericStepper.prototype */
		
	_bIsOnFocus : false, // Input Box에 focus 여부
	/**
		NumericStepper 컴포넌트를 초기화한다.
		
		@constructor
		@param {HTMLElement} el 베이스(기준) 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="ns-"] 클래스명 접두어
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 컴포넌트 활성화여부
			@param {Boolean} [htOption.bUseMouseWheel=false] 마우스 휠 사용 여부
			@param {Number} [htOption.nStep=1] 증감(+/-)이 일어나는 단
			@param {Number} [htOption.nDecimalPoint=0] 소수점 몇째자리까지 표현할 것인지 지정
			@param {Number} [htOption.nMin=-Infinity] 최소값
			@param {Number} [htOption.nMax=Infinity] 최대값
			@param {Number} [htOption.nDefaultValue=0] Input Element에 표시 될 기본 값
			@param {Boolean} [htOption.bInputReadOnly=true] Input element가 직접입력 불가능한지 여부
		@example
			// HTML
			<div id="number_stepper"> <!-- 기준 엘리먼트 -->
				<h4>0~10까지의 값만 선택가능 (1단위)</h4>
				<input type="text" class="ns-input" /> <!-- input[type=text] (필수) -->
				<button type="button" class="ns-plus">+</button> <!-- 증가 버튼 (필수) -->
				<button type="button" class="ns-minus">-</button> <!-- 감소 버튼 (필수) -->
			</div>
			
			// JavaScript
			//include jindo.Componenet.js
			//include jindo.UIComponent.js
			//include jindo.NumericStepper.js
			 
			//0~10까지의 값을 1단위로 선택 가능한 NumericStepper 를 생성한다.
			var oNumericStepper = new jindo.NumericStepper("number_stepper",{
				sClassPrefix : 'ns-',
				nStep : 1,
				nMin : 0,
				nMax : 10,
				nDefaultValue : 0
	});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el); //Base 엘리먼트 설정
		
		this.option({
			sClassPrefix : 'ns-', 	// (String) Class Prefix
			bActivateOnload : true, // (Boolean) 로드시 컴포넌트 활성화여부
			bUseMouseWheel : false,	// (Boolean) 마우스 휠 사용 여부
			nStep : 1,				// (Number) 가감(+/-)이  일어나는 단위
			nDecimalPoint : 0,		// (Number) 소수점 몇째자리까지 표현할 것인지 지정
			nMin : -Infinity,		// (Number) 최소값	
			nMax : Infinity,		// (Number) 최대값
			nDefaultValue : 0, 		// (Number) Text Input에 디폴트로 지정될 값
			bInputReadOnly : true	// (Boolean) Text Input에 직접입력 불가능하도록 지정
		});
		this.option(htOption || {});
		
		this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._wfPlusClick = jindo.$Fn(this._onPlusClick, this);
		this._wfMinusClick = jindo.$Fn(this._onMinusClick, this);
		this._wfWheel = jindo.$Fn(this._onWheel, this);
		this._wfFocus = jindo.$Fn(this._onFocus, this);
		this._wfBlur = jindo.$Fn(this._onBlur, this);
		
		if(this.option("bActivateOnload")) {
			this.activate();	
		}
	},

	/**
		컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		@ignore
	**/
	_assignHTMLElements : function() {
		var sPrefix = this.option("sClassPrefix");
		this._elInput = jindo.$$.getSingle("." + sPrefix + "input",this._el);
		this._elPlusButton = jindo.$$.getSingle("." + sPrefix + "plus",this._el);
		this._elMinusButton = jindo.$$.getSingle("." + sPrefix + "minus",this._el);
	},
	
	/**
		입력창의 값을 기본값으로 리셋 시킨다.
		
		@method reset
	**/
	reset : function() {
		this._elInput.value = this.option("nDefaultValue").toFixed(this.option("nDecimalPoint"));
	},
	
	/**
		지정된 숫자 값을 가져온다.
		
		@method getValue
		@return {Number} 
	**/
	getValue : function() {
		return parseFloat(this._elInput.value);
	},
	
	/**
		숫자 값을 설정한다.
		
		@method setValue
		
		@history 1.3.0 Bug 잘못된 범위의 값을 지정 했을 때 change 이벤트가 발생하지 않는 문제 수정 
	**/
	setValue : function(n) {
		if (typeof n !== "number") {
			n = this.option("nDefaultValue");
		}
		
		// n = n.toFixed(this.option("nDecimalPoint"));
		var nMin = this.option("nMin"),
			nMax = this.option("nMax"),
			htParam = {
				"nValue" : n,
				"nMin" : nMin, 
				"nMax" : nMax
			};
		
		/**
			 값이 바뀌기 직전에 발생
			
			@event beforeChange
			@param {String} sType 커스텀 이벤트명
			@param {Number} nValue 변경하려 한 값
			@param {Number} nMin 옵션에서 정의한 최소값
			@param {Number} nMax 옵션에서 정의한 최대값
			@param {Function} stop 실행시 값이 변경되지 않는다
			@example
				// 커스텀 이벤트 핸들링 예제
				oNumericStepper.attach("beforeChange", function(oCustomEvent) {
					alert(oCustomEvent.nValue);     //변경되려한 값
					alert(oCustomEvent.nMin);       //옵션에서 정의한 최소값
					alert(oCustomEvent.nMax);       //옵션에서 정의한 최대값
				});
		**/
		if(!this.fireEvent("beforeChange", htParam)){
			return;
		}
		
		if (htParam.nValue > nMax || htParam.nValue < nMin){
			/**
				지정된 최소/최대값을 초과할때 발생
				
				@event overLimit
				@param {String} sType 커스텀 이벤트명
				@param {Number} nValue 변경하려 한 값
				@param {Number} nMin 옵션에서 정의한 최소값
				@param {Number} nMax 옵션에서 정의한 최대값
				@example
					// 커스텀 이벤트 핸들링 예제
					oNumericStepper.attach("overLimit", function(oCustomEvent) {
						alert(oCustomEvent.nValue);     //변경하려한 값
						alert(oCustomEvent.nMin);       //옵션에서 정의한 최소값
						alert(oCustomEvent.nMax);       //옵션에서 정의한 최대값
					});
			**/
			this.fireEvent("overLimit", htParam);
			htParam.nValue = Math.max(nMin, Math.min(nMax, htParam.nValue));
		}
		
		this._elInput.value = htParam.nValue.toFixed(this.option("nDecimalPoint"));
		
		/**
			 값이 바뀌고 난 뒤 발생
			
			@event change
			@param {String} sType 커스텀 이벤트명
			@param {Number} nValue 변경하려 한 값
			@param {Number} nMin 옵션에서 정의한 최소값
			@param {Number} nMax 옵션에서 정의한 최대값
			@example
				// 커스텀 이벤트 핸들링 예제
				oNumericStepper.attach("change", function(oCustomEvent) {
					alert(oCustomEvent.nValue);     //변경하려한 값
					alert(oCustomEvent.nMin);       //옵션에서 정의한 최소값
					alert(oCustomEvent.nMax);       //옵션에서 정의한 최대값
				});
		**/
		this.fireEvent("change", htParam);
	},
	
	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this._el;
	},
	
	/**
		컴포넌트의 Input 엘리먼트를 가져온다.
		
		@method getInputElement
		@return {HTMLElement}
	**/
	getInputElement : function() {
		return this._elInput;
	},
	
	/**
		컴포넌트의 Plus 버튼 엘리먼트를 가져온다.
		
		@method getPlusElement
		@return {HTMLElement}
	**/
	getPlusElement : function() {
		return this._elPlusButton;
	},
	
	/**
		컴포넌트의 Minus 버튼 엘리먼트를 가져온다.
		
		@method getMinusElement
		@return {HTMLElement}
	**/
	getMinusElement : function() {
		return this._elMinusButton;
	},
	
	/**
		Text Input의 focus여부를 가져온다.
		
		@method isFocused
		@return {Boolean}
	**/
	isFocused : function() {
		return this._bIsOnFocus;
	},
	
	_onActivate : function() {
		var elInput = this.getInputElement();
		this._wfPlusClick.attach(this.getPlusElement(), "click");
		this._wfMinusClick.attach(this.getMinusElement(), "click");
		this._wfFocus.attach(elInput, "focus");
		this._wfBlur.attach(elInput, "blur");
		
		if (this.option("bUseMouseWheel")) {
			this._wfWheel.attach(elInput, "mousewheel");
		}
		
		this._elInput.readOnly = this.option("bInputReadOnly");
		this.reset();
	},
	
	_onDeactivate : function() {
		var elInput = this.getInputElement();
		this._wfPlusClick.detach(this.getPlusElement(), "click");
		this._wfMinusClick.detach(this.getMinusElement(), "click");
		this._wfFocus.detach(elInput, "focus");
		this._wfBlur.detach(elInput, "blur");
		this._wfWheel.detach(elInput, "mousewheel");	
	},

	_onMinusClick : function(we) {
		this.setValue(this.getValue() - this.option("nStep"));
	},
	
	_onPlusClick : function(we) {
		this.setValue(this.getValue() + this.option("nStep"));
	},
	
	_onWheel : function(we) {
		if(this.isFocused()){
			we.stop(jindo.$Event.CANCEL_DEFAULT);
			if( we.mouse().delta > 0) {
				this._onPlusClick();
			} else {
				this._onMinusClick();
			}
		}
	},
	
	_onFocus : function(we) {
		this._bIsOnFocus = true;
	},
	
	_onBlur : function(we) {
		this._bIsOnFocus = false;
		this.setValue(this.getValue());
		this._elInput.readOnly = this.option("bInputReadOnly");
	}
}).extend(jindo.UIComponent);	/**
	@fileOverview 리스트에 페이지 목록 매기고 페이지에 따른 네비게이션을 구현한 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	리스트에 페이지 목록 매기고 페이지에 따른 네비게이션을 구현한 컴포넌트
	기본 목록은 마크업에 static하게 정의되어있고, 페이지 이동을위해 클릭시마다 보여줄 아이템 목록을 Ajax Call을 통해 받아온다.
	페이지 컴포넌트가 로드되면 .loaded 클래스명이 추가된다.
	
	@class jindo.Pagination
	@extends jindo.UIComponent
	@keyword pagination, page, 페이지, 목록
**/
jindo.Pagination = jindo.$Class({
	/** @lends jindo.Pagination.prototype */
	
	/**
		@constructor
		@param {String | HTMLElement} sId 페이지목록을 생성할 엘리먼트 id 혹은 엘리먼트 자체
		@param {Object} [htOption] 옵션 객체
			@param {Boolean} [htOption.bActivateOnload=true] Pagination 컴포넌트가 로딩될 때 활성화시킬지 여부. false로 설정하는 경우에는 oPagination.activate()를 호출하여 따로 활성화 시켜줘야 한다.
			@param {Number} [htOption.nItem=10] 리스트의 전체 아이템 개수
			@param {Number} [htOption.nItemPerPage=10] 한 페이지에 표시 될 아이템의 개수를 정의한다.
			@param {Number} [htOption.nPagePerPageList=10] 페이지 목록에 표시 될 페이지의 개수를 정의한다.
			@param {Number} [htOption.nPage=1] Pagination 컴포넌트가 로딩되었을 때 보여 주는 페이지이다. 기본값으로는 1이 설정된다. 아래의 이미지에서는 12페이지를 선택한 경우이다.
			@param {String} [htOption.sMoveUnit="pagelist"] 이전/다음 버튼을 누르는 경우 한 페이지씩(page) 또는 페이지 목록(pagelist) 단위로 이동하게 해주는 설정 값이다.
			<ul>
			<li>pagelist : nPagePerPageList로 설정한 값 기준으로 이동한다.(기본값 기준으로 10페이지)</li>
			<li>page : 한 페이지 씩 이동한다.</li>
			</ul>
			@param {Boolean} [htOption.bAlignCenter=false] bAlignCenter 옵션 값은 현재 페이지가 항상 가운데에 오도록 정렬해주는 값이다. 이전 또는 다음 버튼을 눌러서 페이지를 이동하는 경우 이동 된 페이지가 중앙에 오게 된다.<br/>※ bAlignCenter를 사용할 때는 sMoveUnit이 항상 "page"로 설정되어야 한다.
			@param {String} [htOption.sInsertTextNode=""] 페이지 목록에서 페이지의 마크업들을 연결해주는 문자열이다. 설정 값에 따라서 각각의 페이지를 보여주는 노드 (예 <a href="#">11</a><a href="#">12</a>에서 a태그)를 " " 또는 " "등으로 설정해서 변경할 수 있다. (위의 예에서는 a태그 사이의 간격이 한 줄 또는 하나의 공백문자로 변경되게 된다.)<br/>※ 주의할 점은 이 옵션에 따라 렌더링이 달라질 수 있다는 점이다.
			@param {String} [htOption.sClassPrefix=""] 클래스명 접두어
			@param {String} [htOption.sClassFirst="first-child"] 페이지 목록에서 첫 번째 페이지 항목에 추가되는 클래스명
			@param {String} [htOption.sClassLast="last-child"] 페이지 목록에서 마지막 페이지 항목에 추가되는 클래스명
			@param {String} [htOption.sPageTemplate] 1, 2, 3, .. 과 같은 페이지를 보여주는 엘리먼트를 어떤 마크업으로 보여줄 지를 설정한다. {=page}가 페이지 번호로 교체된다. (jindo.$Template 참고)<br/>기본 값 : `<a href='#'>{=page}</a>`
			@param {String} [htOption.sCurrentPageTemplate] 페이지 목록에서 보여주고 있는 현재 페이지를 어떻게 보여줄 지 설정하는 마크업 템플릿이다. {=page}가 현재 페이지 번호로 교체된다. (jindo.$Template 참고)<br/>기본 값 : `<strong>{=page}</strong>`
			@param {HTMLElement} [htOption.elFirstPageLinkOn] 페이지 목록에서 페이지의 맨 처음으로 이동하는 버튼으로 사용되는 엘리먼트이다. 처음으로 이동할 수 있는 경우만 노출되며 값을 지정하지 않거나 `pre_end` 클래스 명을 가진 a 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 `pre_end` 클래스 명을 가지고 있는 a 엘리먼트
			@param {HTMLElement} [htOption.elPrevPageLinkOn] 페이지 목록에서 이전 페이지 또는 이전 페이지목록으로 이동하는 버튼으로 사용되는 엘리먼트이다. 이전으로 이동할 수 있는 경우만 노출되며 값을 지정하지 않거나 pre 클래스 명을 가진 a 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 pre 클래스 명을 가지고 있는 a 엘리먼트
			@param {HTMLElement} [htOption.elNextPageLinkOn] 페이지 목록에서 다음 페이지 또는 다음 페이지목록으로 이동하는 버튼으로 사용되는 엘리먼트이다. 다음으로 이동할 수 있는 경우만 노출되며 값을 지정하지 않거나 next 클래스 명을 가진 a 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 next 클래스 명을 가지고 있는 a 엘리먼트
			@param {HTMLElement} [htOption.elLastPageLinkOn] 페이지 목록에서 페이지의 맨 마지막으로 이동하는 버튼으로 사용되는 엘리먼트이다. 마지막으로 이동할 수 있는 경우만 노출되며 값을 지정하지 않거나 `next_end` 클래스 명을 가진 a 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 `next_end` 클래스 명을 가지고 있는 a 엘리먼트
			@param {HTMLElement} [htOption.elFirstPageLinkOff] elFirstPageLinkOn과는 반대로 처음으로 이동할 수 없는 경우에 사용자에게 비활성화된 상태를 보여주기 위한 엘리먼트이다. 값을 지정하지 않거나 `pre_end` 클래스 명을 가진 span 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 `pre_end` 클래스 명을 가지고 있는 span 엘리먼트
			@param {HTMLElement} [htOption.elPrevPageLinkOff] elPrevPageLinkOn과는 반대로 이전으로 이동할 수 없는 경우에 사용자에게 비활성화된 상태를 보여주기 위한 엘리먼트이다. 값을 지정하지 않거나 pre 클래스 명을 가진 span 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 pre 클래스 명을 가지고 있는 span 엘리먼트
			@param {HTMLElement} [htOption.elNextPageLinkOff] elNextPageLinkOn과는 반대로 다음으로 이동할 수 없는 경우에 사용자에게 비활성화된 상태를 보여주기 위한 엘리먼트이다. 값을 지정하지 않거나 next 클래스 명을 가진 span 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 next 클래스 명을 가지고 있는 span 엘리먼트
			@param {HTMLElement} [htOption.elLastPageLinkOff] elLastPageLinkOn과는 반대로 마지막으로 이동할 수 없는 경우에 사용자에게 비활성화된 상태를 보여주기 위한 엘리먼트이다. 값을 지정하지 않거나 `next_end` 클래스 명을 가진 span 엘리먼트가 존재하지 않으면 버튼이 생성되지 않는다.<br/>기본 값 : 페이지 목록 엘리먼트 아래의 `next_end` 클래스 명을 가지고 있는 span 엘리먼트
		@example 
			var oPagination = new jindo.Pagination("paginate", {
				nItem : 1000, //(Number) 전체 아이템 개수
				nItemPerPage : 10, //(Number) 한 페이지에 표시될 아이템 개수
				nPagePerPageList : 10, //(Number) 페이지목록에 표시될 페이지 개수
				nPage : 1, //(Number) 초기 페이지
				sMoveUnit : "pagelist", //(String) 페이지목록 이동시 이동 단위 "page" || "pagelist"
				bAlignCenter : false, //(Boolean) 현재페이지가 항상 가운데 위치하도록 정렬. sMoveUnit이 "page"일 때만 사용
				sInsertTextNode : "", //(String) 페이지리스트 생성시에 각각의 페이지 노드를 한줄로 붙여쓰지 않게 하기 위해서는 "\n" 또는 " "를 설정한다. 이 옵션에 따라 렌더링이 달라질 수 있다.
				sClassPrefix : "pagination-", //(String) 컴포넌트에서 사용되는 클래스의 Prefix 
				sClassFirst : "first-child", //(String) 첫번째 페이지리스트에 추가될 클래스명
				sClassLast : "last-child", //(String) 마지막 페이지리스트에 추가될 클래스명
				sPageTemplate : "<a href='#'>{=page}</a>", //(String) 페이지에 대한 템플릿. {=page}부분이 페이지 번호로 대치된다. 
				sCurrentPageTemplate : "<strong>{=page}</strong>", //(String) 현재페이지에 대한 템플릿. {=page}부분이 페이지 번호로 대치된다.
				elFirstPageLinkOn : (HTMLElement) '처음' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 pre_end 클래스명을 가지는 a 엘리먼트이다.
				elPrevPageLinkOn : (HTMLElement) '이전' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 pre 클래스명을 가지는 a 엘리먼트이다.
				elNextPageLinkOn : (HTMLElement) '다음' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 next 클래스명을 가지는 a 엘리먼트이다.
				elLastPageLinkOn : (HTMLElement) '마지막' 링크엘리먼트. 기본 값은 기준 엘리먼트 아래 next_end 클래스명을 가지는 a 엘리먼트이다.
				elFirstPageLinkOff : (HTMLElement) '처음' 엘리먼트. 기본 값은 기준 엘리먼트 아래 pre_end 클래스명을 가지는 span 엘리먼트이다.
				elPrevPageLinkOff : (HTMLElement) '이전' 엘리먼트. 기본 값은 기준 엘리먼트 아래 pre 클래스명을 가지는 span 엘리먼트이다.
				elNextPageLinkOff : (HTMLElement) '다음' 엘리먼트. 기본 값은 기준 엘리먼트 아래 next 클래스명을 가지는 span 엘리먼트이다.
				elLastPageLinkOff : (HTMLElement) '마지막' 엘리먼트. 기본 값은 기준 엘리먼트 아래 next_end 클래스명을 가지는 span 엘리먼트이다.
			}).attach({
				beforeMove : function(oCustomEvent) {
					//페이지 이동이 수행되기 직전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nPage : (Number) 이동하려는 페이지
					//}
					//oCustomEvent.stop()을 수행하면 페이지 이동(move 이벤트)이 일어나지 않는다.
				},
				move : function(oCustomEvent) {
					//페이지 이동이 완료된 이후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nPage : (Number) 현재 페이지
					//}
				},
				click : function(oCustomEvent) {
					//페이지 이동을 위한 숫자나 버튼을 클릭했을때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nPage : (Number) 클릭해서 이동할 페이지
					//	weEvent : (jindo.$Event) click시 발생되는 jindo.$Event 객체
					//}
					//oCustomEvent.stop()을 수행하면 페이지 이동(beforeMove, move 이벤트)이 일어나지 않는다.
				}
			});
	**/
	$init : function(sId, htOption){
		this._elPageList = jindo.$(sId);
		this._welPageList = jindo.$Element(this._elPageList);
		this._waPage = jindo.$A([]);
		
		this._fClickPage = jindo.$Fn(this._onClickPageList, this);
		
		this.option({
			bActivateOnload : true,
			nItem : 10,
			nItemPerPage : 10,
			nPagePerPageList : 10,
			nPage : 1,
			sMoveUnit : "pagelist",
			bAlignCenter : false,
			sInsertTextNode : "",
			sClassPrefix : "",
			sClassFirst : "first-child",
			sClassLast : "last-child",
			sPageTemplate : "<a href='#'>{=page}</a>",
			sCurrentPageTemplate : "<strong>{=page}</strong>",
			elFirstPageLinkOn : jindo.$$.getSingle("a." + this._wrapPrefix("pre_end"), this._elPageList),
			elPrevPageLinkOn : jindo.$$.getSingle("a." + this._wrapPrefix("pre"), this._elPageList),
			elNextPageLinkOn : jindo.$$.getSingle("a." + this._wrapPrefix("next"), this._elPageList),
			elLastPageLinkOn : jindo.$$.getSingle("a." + this._wrapPrefix("next_end"), this._elPageList),
			elFirstPageLinkOff : jindo.$$.getSingle("span." + this._wrapPrefix("pre_end"), this._elPageList),
			elPrevPageLinkOff : jindo.$$.getSingle("span." + this._wrapPrefix("pre"), this._elPageList),
			elNextPageLinkOff : jindo.$$.getSingle("span." + this._wrapPrefix("next"), this._elPageList),
			elLastPageLinkOff : jindo.$$.getSingle("span." + this._wrapPrefix("next_end"), this._elPageList)
		});
		this.option(htOption || {});
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	option : function(sName, vValue) {
		var oThis = jindo.Component.prototype.option.apply(this, arguments);

		// setter 로써 쓰일때만
		if (typeof sName === 'object' || typeof vValue != 'undefined') {
			var sMoveUnit = this.option('sMoveUnit');
			var bAlignCenter = this.option('bAlignCenter');
			
			// 올바르지 않은 옵션 상태일때
			if (bAlignCenter && sMoveUnit === 'pageunit') {
				throw new Error('Invalid Option : sMoveUnit can\'t be set to "pageunit" when bAlignCenter is true.');
			}
		}
		
		return oThis;
	},
	
	/**
		클래스명에 Prefix 를 붙힘
		@param {String} sClassName
	**/
	_wrapPrefix : function(sClassName) {
		var sClassPrefix = this.option('sClassPrefix');
		return sClassPrefix ? sClassPrefix + sClassName.replace(/_/g, '-') : sClassName;
	},
	
	/**
		기준 엘리먼트를 구한다.
		
		@method getBaseElement
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this._elPageList;
	},
	
	/**
		전체 아이템의 개수를 리턴한다.
		
		@method getItemCount
		@return {Number} 아이템 개수
	**/
	getItemCount : function() {
		return this.option("nItem");
	},
	
	/**
		전체 아이템의 개수를 설정한다.
		
		@method setItemCount
		@param {Number} n 아이템 개수
	**/
	setItemCount : function(n) {
		this.option({"nItem" : n});
	},
	
	/**
		한 페이지에 보여줄 아이템의 개수를 구한다.
		
		@method getItemPerPage
		@return {Number} 한 페이지에 보여줄 아이템의 개수
	**/
	getItemPerPage : function() {
		return this.option("nItemPerPage");
	},
	
	/**
		한 페이지에 보여줄 아이템의 개수를 설정한다.
		
		@method setItemPerPage
		@param {Object} n 아이템 개수
	**/
	setItemPerPage : function(n) {
		this.option("nItemPerPage", n);
	},
	
	/**
		현재 페이지를 리턴한다.
		
		@method getCurrentPage
		@return {Number} 현재 페이지
	**/
	getCurrentPage : function() {
		return this._nCurrentPage;
	},
	
	/**
		해당 페이지의 첫번째 아이템이 전체 중 몇 번째 아이템인지 구한다.
		
		@method getFirstItemOfPage
		@param {Number} n 페이지 번호
		@return {Number} 
	**/
	getFirstItemOfPage : function(n) {
		return this.getItemPerPage() * (n - 1) + 1;
	},
	
	/**
		아이템의 인덱스로부터 몇번째 페이지인지를 구한다.
		
		@method getPageOfItem
		@param {Number} n 아이템의 인덱스
		@return {Number} 
	**/
	getPageOfItem : function(n) {
		return Math.ceil(n / this.getItemPerPage());	
	},
	
	_getLastPage : function() {
		return Math.ceil(this.getItemCount() / this.getItemPerPage());
	},

	_getRelativePage : function(sRelative) {
		var nPage = null;
		var bMovePage = this.option("sMoveUnit") == "page";
		var nThisPageList = this._getPageList(this.getCurrentPage());
		
		switch (sRelative) {
		case "pre_end" :
			nPage = 1;
			break;
			
		case "next_end" :
			nPage = this._getLastPage();
			break;
			
		case "pre":
			nPage = bMovePage ? this.getCurrentPage() - 1 : (nThisPageList - 1) * this.option("nPagePerPageList");
			break;
			
		case "next":
			nPage = bMovePage ? this.getCurrentPage() + 1 : (nThisPageList) * this.option("nPagePerPageList") + 1;
			break;
		}
		
		return nPage;
	},
	
	/**
		몇번째 페이지 리스트인지 구함
		@param {Number} nThisPage
	**/
	_getPageList : function(nThisPage) {
		if (this.option("bAlignCenter")) {
			var nLeft = Math.floor(this.option("nPagePerPageList") / 2);
			var nPageList = nThisPage - nLeft;
			nPageList = Math.max(nPageList, 1);
			nPageList = Math.min(nPageList, this._getLastPage()); 
			return nPageList;
		}
		return Math.ceil(nThisPage / this.option("nPagePerPageList"));
	},
	
	_isIn : function(el, elParent) {
		if (!elParent) {
			return false;
		}
		return (el === elParent) ? true : jindo.$Element(el).isChildOf(elParent); 
	},
	
	_getPageElement : function(el) {
		for (var i = 0, nLength = this._waPage.$value().length; i < nLength; i++) {
			var elPage = this._waPage.get(i);
			if (this._isIn(el, elPage)) {
				return elPage;
			}
		}
		return null;
	},
	
	_onClickPageList : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var nPage = null,
			htOption = this.option(),
			el = we.element;
			
		if (this._isIn(el, htOption.elFirstPageLinkOn)) {
			nPage = this._getRelativePage("pre_end");
		} else if (this._isIn(el, htOption.elPrevPageLinkOn)) {
			nPage = this._getRelativePage("pre");
		} else if (this._isIn(el, htOption.elNextPageLinkOn)) {
			nPage = this._getRelativePage("next");
		} else if (this._isIn(el, htOption.elLastPageLinkOn)) {
			nPage = this._getRelativePage("next_end");				
		} else {
			var elPage = this._getPageElement(el);
			if (elPage) {
				nPage = parseInt(jindo.$Element(elPage).text(), 10);
			} else {
				return;
			}
		}	
		
		/**
			페이지 이동을 위한 숫자나 버튼을 클릭했을때 발생
			
			@event click
			@param {String} sType 커스텀 이벤트명
			@param {Number} nPage 클릭해서 이동할 페이지
			@param {jindo.$Event} weEvent 클릭 이벤트 객체
			@param {Function} stop 페이지 이동을 정지한다
			@example
				// 커스텀 이벤트 핸들링 예제
				oPagination.attach("click", function(oCustomEvent) {
					// 클릭한 페이지 번호
					var nClickedPage = oCustomEvent.nPage;
					
					// 만약, 페이지를 이동하고 싶지 않다면
					// oCustomEvent.stop()을 호출하여 중지할 수 있다.
					if( nClickedPage === 0 ) {
						oCustomEvent.stop();
					}
				});
		**/
		if (!this.fireEvent("click", { nPage: nPage, weEvent : we })) {
			return;
		}
		
		this.movePageTo(nPage);
	},
	
	_convertToAvailPage : function(nPage) {
		var nLastPage = this._getLastPage();
		nPage = Math.max(nPage, 1);
		nPage = Math.min(nPage, nLastPage); 
		return nPage;
	},
	
	/**
		지정한 페이지로 이동하고 페이지 목록을 다시 그린다.
		이동하기전 beforeMove, 이동후에 move 커스텀 이벤트를 발생한다.
		
		@method movePageTo
		@param {Number} nPage 이동할 페이지
		@param {Boolean} [bFireEvent] 커스텀 이벤트의 발생 여부 (디폴트 true)
	**/
	movePageTo : function(nPage, bFireEvent){
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		nPage = this._convertToAvailPage(nPage);
		this._nCurrentPage = nPage;
		
		if (bFireEvent) {
			/**
				페이지 이동이 수행되기 직전에 발생
				
				@event beforeMove
				@param {String} sType 커스텀 이벤트명
				@param {Number} nPage 이동하게 될 페이지
				@param {Function} stop 페이지 이동을 정지한다
				@example
					// 커스텀 이벤트 핸들링 예제
					oPagination.attach("beforeMove", function(oCustomEvent) {
						// 이동하게 될 페이지
						var nDstPage = oCustomEvent.nPage;
						
						// 만약, 페이지를 이동하고 싶지 않다면
						// oCustomEvent.stop()을 호출하여 중지할 수 있다.
						if( nDstPage === 0 ) {
							oCustomEvent.stop();
						}
					});
			**/
			if (!this.fireEvent("beforeMove", {
				nPage: nPage
			})) {
				return;
			}
		}
		
		this._paginate(nPage);
		
		if (bFireEvent) {
			/**
				페이지 이동이 완료된 시점에서 발생
				
				@event move
				@param {String} sType 커스텀 이벤트명
				@param {Number} nPage 사용자 클릭의 결과로 이동한 페이지
				@example
					// 커스텀 이벤트 핸들링 예제
					oPagination.attach("move", function(oCustomEvent) {
						// 사용자  클릭의 결과로 이동한 페이지
						var nCurrentPage = oCustomEvent.nPage;
					});
			**/
			this.fireEvent("move", {
				nPage: nPage
			});
		}
	},
	
	/**
		페이징을 다시 그린다.
		
		@method reset
		@param {Number} nItemCount 아이템의 개수가 바뀌었을 경우 설정해준다.
	**/
	reset : function(nItemCount) {
		if (typeof nItemCount == "undefined") {
			nItemCount = this.option("nItem");
		}  
		
		this.setItemCount(nItemCount);
		this.movePageTo(1, false);
	},
	
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && this._welPageList.preventTapHighlight(true);
		this._fClickPage.attach(this._elPageList, "click");
		this.setItemCount(this.option("nItem"));
		this.movePageTo(this.option("nPage"), false);
		this._welPageList.addClass(this._wrapPrefix("loaded"));	
	},
	
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && this._welPageList.preventTapHighlight(false);
		this._fClickPage.detach(this._elPageList, "click");
		this._welPageList.removeClass(this._wrapPrefix("loaded"));	
	},
	
	_addTextNode : function() {
		var sTextNode = this.option("sInsertTextNode");
		this._elPageList.appendChild(document.createTextNode(sTextNode));		
	},
	
	_paginate : function(nPage){
		this._empty();
		this._addTextNode();
		
		var htOption = this.option(),
			elFirstPageLinkOn = htOption.elFirstPageLinkOn, 
			elPrevPageLinkOn = htOption.elPrevPageLinkOn,
			elNextPageLinkOn = htOption.elNextPageLinkOn,
			elLastPageLinkOn = htOption.elLastPageLinkOn,
			elFirstPageLinkOff = htOption.elFirstPageLinkOff,
			elPrevPageLinkOff = htOption.elPrevPageLinkOff, 
			elNextPageLinkOff = htOption.elNextPageLinkOff, 
			elLastPageLinkOff = htOption.elLastPageLinkOff,
			nLastPage = this._getLastPage(),
			nThisPageList = this._getPageList(nPage),
			nLastPageList = this._getPageList(nLastPage);
		
		if (nLastPage === 0) {
			this._welPageList.addClass(this._wrapPrefix("no-result"));
		} else if (nLastPage == 1) {
			this._welPageList.addClass(this._wrapPrefix("only-one")).removeClass(this._wrapPrefix("no-result"));
		} else {
			this._welPageList.removeClass(this._wrapPrefix("only-one")).removeClass(this._wrapPrefix("no-result"));
		}
		
		var nFirstPageOfThisPageList, nLastPageOfThisPageList;
		if (htOption.bAlignCenter) {
			var nLeft = Math.floor(htOption.nPagePerPageList / 2);
			nFirstPageOfThisPageList = nPage - nLeft;
			nFirstPageOfThisPageList = Math.max(nFirstPageOfThisPageList, 1);
			nLastPageOfThisPageList = nFirstPageOfThisPageList + htOption.nPagePerPageList - 1;
			if (nLastPageOfThisPageList > nLastPage) {
				nFirstPageOfThisPageList = nLastPage - htOption.nPagePerPageList + 1;
				nFirstPageOfThisPageList = Math.max(nFirstPageOfThisPageList, 1);
				nLastPageOfThisPageList = nLastPage;
			}
		} else {
			nFirstPageOfThisPageList = (nThisPageList - 1) * htOption.nPagePerPageList + 1;
			nLastPageOfThisPageList = (nThisPageList) * htOption.nPagePerPageList;
			nLastPageOfThisPageList = Math.min(nLastPageOfThisPageList, nLastPage);
		}
		
		if (htOption.sMoveUnit == "page") {
			nThisPageList = nPage;
			nLastPageList = nLastPage;
		}

		//first
		if (nPage > 1) {
			if (elFirstPageLinkOn) {
				this._welPageList.append(elFirstPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elFirstPageLinkOff) {
				this._welPageList.append(elFirstPageLinkOff);
				this._addTextNode();
			}
		}

		//prev
		if (nThisPageList > 1) {
			if (elPrevPageLinkOn) {
				this._welPageList.append(elPrevPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elPrevPageLinkOff) {
				this._welPageList.append(elPrevPageLinkOff);
				this._addTextNode();
			}	
		}		

		var el, wel;
		for (var i = nFirstPageOfThisPageList; i <= nLastPageOfThisPageList ; i++) {
			if (i == nPage) {
				el = jindo.$(jindo.$Template(htOption.sCurrentPageTemplate).process({ page : i.toString() }));
			} else {
				el = jindo.$(jindo.$Template(htOption.sPageTemplate).process({ page : i.toString() }));
				this._waPage.push(el);
			}
				
			wel = jindo.$Element(el);
			if (i == nFirstPageOfThisPageList) {
				wel.addClass(this._wrapPrefix(this.option("sClassFirst")));
			}
			if (i == nLastPageOfThisPageList) {
				wel.addClass(this._wrapPrefix(this.option("sClassLast")));
			}
			this._welPageList.append(el);
			
			this._addTextNode();
		}

		//next
		if (nThisPageList < nLastPageList) {
			if (elNextPageLinkOn) {
				this._welPageList.append(elNextPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elNextPageLinkOff) {
				this._welPageList.append(elNextPageLinkOff);
				this._addTextNode();
			}
		}
		
		//last
		if (nPage < nLastPage) {
			if (elLastPageLinkOn) {
				this._welPageList.append(elLastPageLinkOn);
				this._addTextNode();
			}
		} else {
			if (elLastPageLinkOff) {
				this._welPageList.append(elLastPageLinkOff);
				this._addTextNode();
			}
		}
	},
	
	_empty : function(){
		var htOption = this.option();
		this.option({
			elFirstPageLinkOn : this._clone(htOption.elFirstPageLinkOn),
			elPrevPageLinkOn : this._clone(htOption.elPrevPageLinkOn),
			elNextPageLinkOn : this._clone(htOption.elNextPageLinkOn),
			elLastPageLinkOn : this._clone(htOption.elLastPageLinkOn),
			elFirstPageLinkOff : this._clone(htOption.elFirstPageLinkOff),
			elPrevPageLinkOff : this._clone(htOption.elPrevPageLinkOff),
			elNextPageLinkOff : this._clone(htOption.elNextPageLinkOff),
			elLastPageLinkOff : this._clone(htOption.elLastPageLinkOff)
		});
		this._waPage.empty();
		this._welPageList.empty();
	},
	
	_clone : function(el) {
		if (el && el.cloneNode) {
			return el.cloneNode(true);
		}
		return el;
	}
}).extend(jindo.UIComponent);
/**
	@fileOverview 실시간 순위 변화를 보여주는 롤링 차트 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	실시간 순위 변화를 보여주는 롤링 차트 컴포넌트
	
	@class jindo.RollingChart
	@extends jindo.UIComponent
	@uses jindo.Rolling
	@keyword rollingchart, 롤링차트, 차트, chart
**/
jindo.RollingChart = jindo.$Class({
	/** @lends jindo.RollingChart.prototype */
		
	_nIndexOfRolling : 0, //현재 롤링되고있는 아이템의 인덱스
	_bIsRolling : false, //롤링 중인지 여부

	/**
		롤링차트 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el 기준 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="rollingchart-"] 클래스명 접두어
			@param {String} [htOption.sDirection="down"] 롤링될 방향
			<ul>
			<li>"down" : 아래</li>
			<li>"up" : 위</li>
			</ul>
			@param {Number} [htOption.nFPS=50] 롤링을 그려줄 초당 프레임수
			@param {Number} [htOption.nDuration=300] 롤링될 시간
			@param {Number} [htOption.nRollingInterval=100] 각 롤링간의 시간간격
			@param {String} [htOption.sUrl=""] 요청 url
			@param {String} [htOption.sRequestType="jsonp"] 요청타입
			@param {String} [htOption.sRequestMethod="get"] 요청방식
			@param {Object} [htOption.htRequestParameter=null] 요청 파라미터
			@param {Number} [htOption.nRequestInterval=10000] 새로운 목록을 가져올 시간 간격 (ms)
			@param {Boolean} [htOption.bActivateOnload=true] 초기화시 activate 여부
		@example
			var oRollingChart = new jindo.RollingChart(jindo.$('rolling_chart'), {
				sDirection : 'down', //롤링될 방향 "down" || "up"
				nFPS : 50, //롤링을 그려줄 초당 프레임수
				nDuration : 300, //롤링될 시간
				nRollingInterval : 50, //각 롤링간의 시간간격
				sUrl : "test.php", //요청 url
				sRequestType : "jsonp", //요청타입
				sRequestMethod : "get", //요청방식
				htRequestParameter : { p : 11 }, //요청 파라미터
				nRequestInterval : 5000, //새로운 목록을 가져올 시간 간격 (ms)
				bActivateOnload : true //(Boolean) 초기화시 activate 여부
			}).attach({
				request : function(oCustomEvent) {
					//롤링될 새로운 목록을 요청하기 전에 발생
					//oCustomEvent.stop(); 수행시 요청하지 않음
				},
				response : function(oCustomEvent) {
					//목록을 성공적으로 받아온 이후에 발생
					//이벤트 객체 oCustomEvent = {
					//	htResponseJSON : (HashTable) 응답의 JSON 객체
					//}
					//oCustomEvent.stop(); 수행시 새로 받아온 목록을 업데이트 하지 않음
				},
				beforeUpdate : function(oCustomEvent) {
					//새 목록을 받아온 후 기존 목록에 적용하기 이전에 발생 
					//oCustomEvent.stop(); 수행시 새로 받아온 목록을 업데이트 하지 않음
				},
				beforeRolling : function(oCustomEvent) {
					//새 목록이 추가되고 각각의 롤링이 시작되기전 발생.
					//이벤트 객체 oCustomEvent = {
					//	nIndex : (Number) 현재 롤링될 목록의 번호
					//}
				},
				afterRolling : function(oCustomEvent) {
					//새 목록이 추가되고 각각의 롤링이 종료된 후 발생.
					//이벤트 객체 oCustomEvent = {
					//	nIndex : (Number) 현재 롤링된 목록의 번호
					//}
				},
				afterUpdate : function(oCustomEvent) {
					//모든 롤링이 끝난 이후에 발생
				}
			});
	**/
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sClassPrefix : 'rollingchart-', //Default Class Prefix
			sDirection : 'down', //롤링될 방향 "down" || "up"
			nFPS : 50, //롤링을 그려줄 초당 프레임수 
			nDuration : 300, //롤링될 시간
			nRollingInterval : 100, //각 롤링간의 시간간격
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : null, //(Object) 파라미터
			nRequestInterval : 10000, //새로운 목록을 가져올 시간 간격 (ms)
			bActivateOnload : true //(Boolean) 초기화시 activate 여부
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._el = jindo.$(el);

		this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._initTimer();
		this._initRolling();
		
		if (this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.
		}
	},

	/**
		컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
	**/
	_assignHTMLElements : function() {
		this._elList = jindo.$$.getSingle("ol", this._el);
		this._aItems = jindo.$$("> li", this._elList);
	},
	
	/**
		챠트의 리스트 엘리먼트를 가져온다.
		
		@method getList
		@return {HTMLElement}
	**/
	getList : function() {
		return this._elList;
	},
	
	/**
		챠트 리스트의 아이템 엘리먼트를 가져온다.
		
		@method getItems
		@return {HTMLElement}
	**/
	getItems : function() {
		return this._aItems;
	},
	
	/**
		각 챠트 리스트 아이템에 롤링을 위한 리스트를 가져온다.
		
		@method getListOfItem
		@param {HTMLElement} elItem
	**/
	getListOfItem : function(elItem) {
		return jindo.$$.getSingle("ul", elItem);
	},
	
	/**
		챠트가 롤링중인지 여부를 가져온다.
		
		@method isRolling
		@return {Boolean}
	**/
	isRolling : function() {
		return this._bIsRolling;	
	},
	
	_initTimer : function() {
		this._oRequestTimer = new jindo.Timer();
	},
	
	/**
		일정 간격으로 Ajax 요청을 위한 Timer 객체를 가져온다.
		
		@method getTimer
		@return {jindo.Timer}
	**/
	getTimer : function() {
		return this._oRequestTimer;
	},
	
	_initRolling : function() {
		var self = this;
		this._oRollingEventHandler = {
			"end" : function(){
				setTimeout(function(){
					/**
						새 목록이 추가되고 각각의 롤링이 종료된 후
						
						@event afterRolling
						@param {String} sType 커스텀 이벤트명
						@param {Number} nIndex 현재 롤링된 목록의 번호
						@example
							// 커스텀 이벤트 핸들링 예제
							oRollingChart.attach("afterRolling", function(oCustomEvent) { ... });
					**/
					self.fireEvent("afterRolling", { nIndex : self._nIndexOfRolling });
					self._roll(self._nIndexOfRolling + 1);	
				}, self.option("nRollingInterval"));
			}
		};
		this._oRolling = new jindo.Rolling(this._el, {
			nFPS : this.option("nFPS"),
			nDuration : this.option("nDuration"),
			sDirection : 'vertical',
			fEffect : jindo.Effect.linear
		});
	},
	
	/**
		롤링 컴포넌트의 인스턴스를 가져온다.
		
		@method getRolling
		@return {jindo.Rolling}
	**/
	getRolling : function() {
		return this._oRolling;
	},
	
	/**
		Rolling이 적용될 아이템을 번호로 정한다. ////////////// 
		@param {Number} n
		@ignore
	**/
	_setItemIndexToRolling : function(n) {
		var elList = this.getListOfItem(this.getItems()[n]);
		var oRolling = this.getRolling();
		oRolling._el = elList;
		oRolling._elList = elList;
	},

	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		var self = this;

		this.getTimer().start(function(){
			self._stopRequest();
			self._request();
			return true;
		}, this.option("nRequestInterval"));
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		this.getTimer().abort();
	},
	
	/**
     * @ignore
     * @param {String} sQuery 쿼리. 생략시 현재 입력된 input의 값
     */
    _request: function(sQuery){
		if (this.isRolling()) {
			return;
		}
		
        var htOption = this.option();
        var sUrl = htOption.sUrl;
        var htParameter = htOption.htRequestParameter;
		var self = this;        
        this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = { htResponseJSON : oResponse.json() };
					/**
						목록을 성공적으로 받아온 이후
						
						@event response
						@param {String} sType 커스텀 이벤트명
						@param {Object} htResponseJSON 응답의 JSON 객체
						@param {Function} stop 수행시 새로 받아온 목록을 업데이트 하지 않음
						@example
							// 커스텀 이벤트 핸들링 예제
							oRollingChart.attach("response", function(oCustomEvent) { ... });
					**/
					if(!self.fireEvent("response", htParam)) {
						return;
					}
					
					/**
						새 목록을 받아온 후 기존 목록에 적용하기 이전
						
						@event beforeUpdate
						@param {String} sType 커스텀 이벤트명
						@param {Function} stop 수행시 새로 받아온 목록을 업데이트 하지 않음
						@example
							// 커스텀 이벤트 핸들링 예제
							oRollingChart.attach("beforeUpdate", function(oCustomEvent) { ... });
					**/
					if(!self.fireEvent("beforeUpdate")) {
						return;
					}
					
					var oChart = htParam.htResponseJSON;
					self._addItemToRolling(oChart);
					self.getRolling().getTransition().attach(self._oRollingEventHandler);
					self._roll(0);
                } 
                catch (e) {
                }
            }
        });
        
		/**
			롤링될 새로운 목록을 요청하기 전
			
			@event request
			@param {String} sType 커스텀 이벤트명
			@param {Function} stop 수행시 요청하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oRollingChart.attach("request", function(oCustomEvent) { ... });
		**/
		if (!self.fireEvent("request")) {
			return;
		}
		
		this._oAjax.request(htParameter);
    },
	
	_stopRequest: function(){
        try {
            this._oAjax.abort();
            this._oAjax = null;
        } 
        catch (e) {
        }
	},
	
	_addItemToRolling : function(oChart) {
		var self = this;
		var sDirection = this.option("sDirection");
		
		jindo.$A(this.getItems()).forEach(function(el, i){
			var wel = jindo.$Element(jindo.$("<li>"));
			wel.html(oChart.items[i]);
			var elList = self.getListOfItem(el);
			if(sDirection == "down") {
				elList.insertBefore(wel.$value(), elList.firstChild);
				elList.scrollTop = 9999;
			}
			else {
				jindo.$Element(elList).append(wel.$value());
				elList.scrollTop = 0;	
			}
		});
	},
	
	_removeItemRolled : function() {
		var self = this;
		var sDirection = this.option("sDirection");
		
		jindo.$A(this.getItems()).forEach(function(el, i){
			if(sDirection == "down") {
				jindo.$Element(jindo.$$("li", self.getListOfItem(el))[1]).leave();
			}
			else {
				var elList = self.getListOfItem(el);
				jindo.$Element(jindo.$$.getSingle("li", elList)).leave();
				elList.scrollTop = 0;	
			}
			
		});
		this._nIndexOfRolling = 0;
	},

	_roll : function(n) {
		this._bIsRolling = true;
		this._nIndexOfRolling = n;
		/**
			새 목록이 추가되고 각각의 롤링이 시작되기전
			
			@event beforeRolling
			@param {String} sType 커스텀 이벤트명
			@param {Number} nIndex 롤링될 목록의 번호
			@example
				// 커스텀 이벤트 핸들링 예제
				oRollingChart.attach("beforeRolling", function(oCustomEvent) { ... });
		**/
		this.fireEvent("beforeRolling", { nIndex : n });
		var nIndex = n;
		if (nIndex == this.getItems().length) {
			this._removeItemRolled();
			this._nIndexOfRolling = 0;
			this.getRolling().getTransition().detach(this._oRollingEventHandler);
			this._bIsRolling = false;
			/**
				새 목록이 추가되고 각각의 롤링이 종료된 후
				
				@event afterUpdate
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oRollingChart.attach("afterUpdate", function(oCustomEvent) { ... });
			**/
			this.fireEvent("afterUpdate");
			return;
		}
			
		this._setItemIndexToRolling(nIndex);
		
		var nDistance = 1;
		if (this.option("sDirection") == "down") {
			nDistance = -1;
		}
		this.getRolling().moveBy(nDistance);
	}
}).extend(jindo.UIComponent);	/**
	@fileOverview 마우스의 롤오버 액션을 커스텀 이벤트 핸들링으로 쉽게 컨트롤할 수 있게 도와주는 컴포넌트
	@version 1.14.0
**/
/**
	마우스 이벤트에 따라 롤오버효과를 쉽게 처리할 수 있게 도와주는 컴포넌트
	RolloverArea 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	
	@class jindo.RolloverArea
	@extends jindo.UIComponent
	@keyword rolloverarea, area, 롤오버에어리어
**/
jindo.RolloverArea = jindo.$Class({
	/** @lends jindo.RolloverArea.prototype */
	  
	/**
		RolloverArea 컴포넌트를 초기화한다.
		
		@constructor
		@param {HTMLElement} el 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="rollover"] RolloverArea 컴포넌트가 적용될 HTMLElement의 클래스명
			@param {String} [htOption.sClassPrefix="rollover-"] MouseOver, MouseDown이벤트 발생시 HTMLElement에 추가될 클래스명의 Prefix
			@param {Boolean} [htOption.bCheckMouseDown=true] MouseDown, MouseUp 이벤트를 사용여부. (false면 down, up시 클래스가 추가되지 않으며, 커스텀 함수도 발생하지 않음)
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 초기화 시점에 컴포넌트를 활성화(이벤트 바인딩) 시킬지 여부. false로 지정한경우에는 사용자가 직접 activate함수를 사용하여 활성화시킬수 있다.
			@param {Object} [htOption.htStatus] 이벤트 발생시 추가될 클래스명
			@param {String} [htOption.htStatus.sOver="over"] MouseOver 이벤트 발생시 추가될 클래스명
			@param {String} [htOption.htStatus.sDown="down"] MouseDown 이벤트 발생시 추가될 클래스명
		@example
			var oRolloverArea = new jindo.RolloverArea(document.body,{bActivateOnload:false, ... });
			oRolloverArea.activate();
		@example
			var oRolloverArea = new jindo.RolloverArea(document.body,{
			sClassPrefix : 'rollover-', htStatus : {
				sOver : "over", // MouseOver시 추가되는 클래스명 "rollover-over"
				sDown : "down" // MouseDown시 추가되는 클래스명 "rollover-down"
			}});
	**/
	$init : function(el, htOption) {
		this.option({ 
			sClassName : "rollover", 
			sClassPrefix : "rollover-",
			bCheckMouseDown : true,
			bActivateOnload : true,
			htStatus : {
				sOver : "over",
				sDown : "down"
			} 
		});
		this.option(htOption || {});
		
		this._elArea = jindo.$(el);
		this._aOveredElements = [];
		this._aDownedElements = [];
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_addOvered : function(el) {
		this._aOveredElements.push(el);
	},
	
	_removeOvered : function(el) {
		this._aOveredElements.splice(jindo.$A(this._aOveredElements).indexOf(el), 1);
	},
	
	_addStatus : function(el, sStatus) {
		jindo.$Element(el).addClass(this.option('sClassPrefix') + sStatus);
	},
	
	_removeStatus : function(el, sStatus) {
		jindo.$Element(el).removeClass(this.option('sClassPrefix') + sStatus);
	},
	
	_isInnerElement : function(elParent, elChild) {
		return elParent === elChild ? true : jindo.$Element(elParent).isParentOf(elChild);
	},
	
	/**
		RolloverArea를 활성화시킨다.
		@return {this}
	**/
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(true);
		this._wfMouseOver.attach(this._elArea, 'mouseover');
		this._wfMouseOut.attach(this._elArea, 'mouseout');
		if (this.option("bCheckMouseDown")) {
			this._wfMouseDown.attach(this._elArea, 'mousedown');
			this._wfMouseUp.attach(document, 'mouseup');
		}
	},
	
	/**
		RolloverArea를 비활성화시킨다.
		@return {this}
	**/
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(false);
		this._wfMouseOver.detach(this._elArea, 'mouseover');
		this._wfMouseOut.detach(this._elArea, 'mouseout');
		this._wfMouseDown.detach(this._elArea, 'mousedown');
		this._wfMouseUp.detach(document, 'mouseup');
		
		this._aOveredElements.length = 0;
		this._aDownedElements.length = 0;
	},
	
	_findRollover : function(el) {
		var sClassName = this.option('sClassName');
		return jindo.$$.test(el, '.' + sClassName) ? el : jindo.$$.getSingle('! .' + sClassName, el);
	},
	
	_onMouseOver : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			}
			
			this._addOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			/**
				MouseOver 이벤트 발생시 (적용된 Element에 마우스가 커서가 올라간 경우)
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 추가되지 않는다.
				@example
					oRolloverArea.attach("over", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('over', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			} 
			
			this._removeOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			/**
				MouseOut 이벤트 발생시 (적용된 Element에서 마우스가 빠져나간 경우)
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 제거되지 않는다.
				@example
					oRolloverArea.attach("out", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('out', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseDown : function(we) {
		var el = we.element,
			htParam;
			
		while ((el = this._findRollover(el))) {
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			this._aDownedElements.push(el);
			
			/**
				MouseDown 이벤트 발생시 (적용된 Element 위에서 마우스 버튼이 눌린 경우 발생)
				
				@event down
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement}element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 추가되지 않는다
				@example
					oRolloverArea.attach("down", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('down', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sDown);
			}
			
			el = el.parentNode;
		}
	},
	
	_onMouseUp : function(we) {
		var el = we.element,
			aTargetElementDatas = [],		
			aDownedElements = this._aDownedElements,
			htParam,
			elMouseDown,
			i;
		
		for (i = 0; (elMouseDown = aDownedElements[i]); i++) {
			aTargetElementDatas.push({ 
				element : elMouseDown,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (jindo.$A(aDownedElements).indexOf(el) > -1) {
				continue;
			}
			
			aTargetElementDatas.push({ 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (i = 0; (htParam = aTargetElementDatas[i]); i++) {
			/**
				MouseUp 이벤트 발생시 (적용된 Element에 마우스를 눌렀다가 놓은경우 발생)
				
				@event up
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function}stop 수행시 클래스명이 제거되지 않는다
				@example
					oRolloverArea.attach("up", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('up', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sDown);
			}		
		}
		
		this._aDownedElements = [];
	}
}).extend(jindo.UIComponent);
/**
	@fileOverview jindo.RolloverArea와 달리 mousedown/mouseup이 아닌 click과 dbclick이벤트를 체크하는 컴포넌트
	@version 1.14.0
**/
/**
	RolloverArea와 달리 mousedown/mouseup이 아닌 click이벤트를 체크하는 컴포넌트
	RolloverClick 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	
	@class jindo.RolloverClick
	@extends jindo.UIComponent
	@uses jindo.RolloverArea
	@keyword rolloverclick, click, 롤오버클릭
**/
jindo.RolloverClick = jindo.$Class({
	/** @lends jindo.RolloverClick.prototype */
	
	/**
		RolloverClick 컴포넌트를 초기화한다.
		
		@constructor
		@param {HTMLElement} el RolloverArea에 적용될 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 초기화 시점에 컴포넌트를 활성화(이벤트 바인딩) 시킬지 여부. false로 지정한경우에는 사용자가 직접 activate함수를 사용하여 활성화시킬수 있다.
			@param {String} [htOption.sCheckEvent="click"] 체크할 마우스이벤트명. "mousedown" 혹은 "mouseup"으로 대체가능
			@param {Boolean} [htOption.bCheckDblClick=false] 더블클릭 이벤트를 체크할것인지 여부
			@param {Object} [htOption.RolloverArea] jindo.RolloverArea에 적용될 옵션 (RolloverArea 컴포넌트 문서 참고)
		@exmaple
			var oRolloverClick = new jindo.RolloverClick(document.body,{bActivateOnload:flase, ... });
			oRolloverClick.activate();
	**/
	$init : function(el, htOption) {
		this.option({ 
			bActivateOnload : true,
			sCheckEvent : "click",
			bCheckDblClick : false, // (Boolean) 더블클릭이벤트를 체크할 지 여부
			RolloverArea : { //RolloverArea에 적용될 옵션 객체
				sClassName : "rollover", // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
				sClassPrefix : "rollover-", // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
				bCheckMouseDown : false,
				bActivateOnload : false,
				htStatus : {
					sOver : "over", // (String) mouseover시 추가될 클래스명
					sDown : "down" // (String) mousedown시 추가될 클래스명
				}  
			}
		});
		this.option(htOption || {});
		
		var self = this;
		this._oRolloverArea = new jindo.RolloverArea(el, this.option("RolloverArea")).attach({
			over : function(oCustomEvent) {
				/**
					MouseOver 이벤트 발생시(적용된 Element에 마우스가 커서가 올라간 경우)
					
					@event over
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 이벤트가 발생 Element
					@param {Object} htStatus htStatus 옵션 값
					@param {jindo.$Event} weEvent 이벤트 객체
					@param {Function} stop 수행시 클래스명이 추가되지 않는다
					@example
						oRolloverClick.attach("over", function(oCustomEvent) { ... });
				**/
				if (!self.fireEvent("over", oCustomEvent)) {
					oCustomEvent.stop();
				}
			},
			out : function(oCustomEvent) {
				/**
					MouseOut 이벤트 발생시(적용된 Element에서 마우스가 빠져나간 경우)
					
					@event out
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 이벤트가 발생 Element
					@param {Object} htStatus htStatus 옵션 값
					@param {jindo.$Event} weEvent 이벤트 객체
					@param {Function} stop 수행시 클래스명이 제거되지 않는다
					@example
						oRolloverClick.attach("out", function(oCustomEvent) { ... });
				**/
				if (!self.fireEvent("out", oCustomEvent)) {
					oCustomEvent.stop();
				}
			}
		});
		this._wfClick = jindo.$Fn(this._onClick, this);
		this._wfDblClick = jindo.$Fn(this._onClick, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onClick : function(we) {
		var elRollover = we.element,
			sType = "click";
			
		if (we.type == "dblclick") {
			sType = we.type;
		}
		
		while ((elRollover = this._oRolloverArea._findRollover(elRollover))) {
			/**
				click 이벤트 발생시(적용된 Element 위에서 마우스가 클릭된경우 발생)
				
				@event click
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@example
					oRolloverClick.attach("click", function(oCustomEvent) { ... });
			**/
			/**
				dblclick 이벤트 발생시(적용된 Element에 마우스를 눌렀다가 놓은 경우 발생)
				
				@event dblclick
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@example
					oRolloverClick.attach("dblclick", function(oCustomEvent) { ... });
			**/
			this.fireEvent(sType, { 
				element : elRollover,
				htStatus : this._oRolloverArea.option("htStatus"),
				weEvent : we
			});
			
			elRollover = elRollover.parentNode;
		}
	},
	
	/**
		RolloverClick를 활성화시킨다.
		@return {this}
	**/
	_onActivate : function() {
		this._wfClick.attach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		if (this.option("bCheckDblClick")) {
			this._wfDblClick.attach(this._oRolloverArea._elArea, 'dblclick');
		}
		this._oRolloverArea.activate();
	},
	
	/**
		RolloverClick를 비활성화시킨다.
		@return {this}
	**/
	_onDeactivate : function() {
		this._wfClick.detach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		this._wfDblClick.detach(this._oRolloverArea._elArea, 'dblclick');
		this._oRolloverArea.deactivate();
	}
}).extend(jindo.UIComponent);/**
	@fileOverview 영역내의 값을 마우스 클릭 또는 드래그로 선택하는 슬라이더 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	영역내의 값을 마우스 클릭 또는 드래그로 선택하는 슬라이더 컴포넌트
	
	@class jindo.Slider
	@extends jindo.UIComponent
	@uses jindo.DragArea
	
	@keyword slider, thumb, track, 슬라이더
**/
jindo.Slider = jindo.$Class({
	/** @lends jindo.Slider.prototype */
	_elTrack : null,
	_aThumbs : null,
	_aPoses : null,
	_htSwap : null,
	
	/**
		Slider 컴포넌트를 생성한다.
		@constructor
		@param {String | HTMLElement} el Thumb이 움직이는 바탕이 되는 Track Element (id 혹은 엘리먼트 자체)
		@param {Object} [oOptions] 옵션 객체
			@param {String} [oOptions.sClassPrefix="slider-"] 클래스명 접두어
			@param {Boolean} [oOptions.bVertical=false] 슬라이더 세로 여부
			@param {Boolean} [oOptions.bJump=true] 슬라이더의 트랙 클릭시 thumb 객체의 이동 여부
			@param {Boolean} [oOptions.bDragOnTrack=true] 트랙에 마우스다운이후 드래그가능한지 여부
			@param {String} [oOptions.sClassPrefix="slider-"] 슬라이더를 구현할 객체의 클래스명 접두어
			@param {Number} [oOptions.nMinValue=0] 슬라이더의 최소값
			@param {Number} [oOptions.nMaxValue=0] 슬라이더의 최대값
			@param {Function} [oOptions.fAdjustValue=null] 슬라이더의 값을 원하는 값으로 조절하는 함수
			@param {Boolean} [oOptions.bActivateOnload=true] 컴포넌트 로드시 activate 여부
		@example
			var oSlider = new jindo.Slider(jindo.$('sample'), {
				fAdjustValue : function(nValue) {
					// value의 소숫점을 제거한다.
					return Math.round(nValue / 10) * 10;
				}});
				
			alert("value : " + oSlider.values()); // 소숫점이 제거된 value 노출.
		@example
			var alpha = new jindo.Slider(jindo.$('alpha'),{
				 sClassPrefix : 'slider-',
				 bVertical : false, //슬라이더 세로 여부
				 bJump : true, //트랙에 클릭하여 이동가능한지 여부
				 bDragOnTrack : true, //트랙에 마우스다운이후 드래그가능한지 여부
				 nMinValue : 0, 
				 nMaxValue : 1,
				 fAdjustValue : null,(Function) 값을 조절하기 위한 함수
				 bActivateOnload : true //(Boolean) 컴포넌트 로드시 activate 여부
			}).attach({
				beforeChange : function(oCustomEvent){
					//Thumb이 움직이기 전에 발생
					//oCustomEvent.stop()을 실행하면 change 이벤트가 발생하지 않고 중단된다.
				},
				change : function(oCustomEvent){
					//Thumb을 Drop한 이후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	nIndex : (Number)
					//	nPos : (Number)
					//	nValue : (Number)
					//}
				}
			});
	**/
	
	$init : function(el, oOptions) {
		this.option({
			sClassPrefix : 'slider-',
			bVertical : false,
			bJump : true,
			bDragOnTrack : true,
			fAdjustValue : null,
			nMinValue : 0,
			nMaxValue : 1,
			bActivateOnload : true
		});
		this.option(oOptions || {});
		
		// 가로모드인지 세로모드인지에 따라 서로 다른 값을 사용하도록 변수 지정
		if (!this.option('bVertical')) {
			this._htSwap = {
				y : 'nY',
				x : 'nX',
				clientX : 'clientX',
				pageX : 'pageX',
				offsetWidth : 'offsetWidth',
				left : 'left'
			};
		} else {
			this._htSwap = {
				y : 'nX',
				x : 'nY',
				clientX : 'clientY',
				pageX : 'pageY',
				offsetWidth : 'offsetHeight',
				left : 'top'
			};
		}
		
		// Thumbs 들과 각각의 값을 저장할 공간 만들기
		this._elTrack = jindo.$(el);
		this._aThumbs = jindo.$$('.' + this.option('sClassPrefix') + 'thumb', this._elTrack);
		this._sRand = 'S' + parseInt(Math.random() * 100000000, 10);
		jindo.$ElementList(this._aThumbs).addClass(this._sRand);

		this._aPoses = this.positions();
		this._onTrackMouseDownFn = jindo.$Fn(this._onTrackMouseDown, this);
		this._initDragArea();
		
		if (this.option("bActivateOnload")){
			this.activate();		
		}
	},
	
	/**
		Track 엘리먼트를 구한다.
		
		@method getTrack
		@return {HTMLElement} 
	**/
	getTrack : function() {
		return this._elTrack;
	},
	
	/**
		n번째 Thumb 엘리먼트를 구한다.
		
		@method getThumb
		@param {Number} nIndex 몇 번째 인지
		@return {HTMLElement} 
	**/
	getThumb : function(nIndex) {
		return this._aThumbs[nIndex];
	},
	
	_initDragArea : function() {
		var self = this;
		var htSwap = this._htSwap;
		
		// 컴포넌트 내부에서 사용하는 다른 컴포넌트 초기화
		this._oDragArea = new jindo.DragArea(this._elTrack, { 
			sClassName : this._sRand, 
			bFlowOut : false 
		}).attach({
			beforeDrag : function(oCustomEvent) {
				var nIndex = self._getThumbIndex(oCustomEvent.elHandle);
				var htParam = { 
					nIndex : nIndex,
					nPos : oCustomEvent[htSwap.x],
					bJump : false
				};
				
				/**
					Thumb이 움직이기 전에 발생
					
					@event beforeChange
					@param {String} sType 커스텀 이벤트명
					@param {Function} stop 수행시 값이 바뀌지 않으며, change 이벤트가 발생하지 않고 중단된다.
					@example
						// Thumb이 움직이기 전에 발생 될 함수 구현.
						oSlider.attach("beforeChange", function(oCustomEvent) { ... });
				**/
				if (!self.fireEvent('beforeChange', htParam)) {
					oCustomEvent.stop();
					return false;
				}
				
				oCustomEvent[htSwap.x] = self._getAdjustedPos(nIndex, htParam.nPos);
				oCustomEvent[htSwap.y] = null;
			},
			drag : function(oCustomEvent) {
				var nIndex = self._getThumbIndex(oCustomEvent.elHandle);
				var nPos = oCustomEvent[htSwap.x];
				if (nPos != self._aPoses[nIndex]) {
					self._aPoses[nIndex] = nPos;
					self._fireChangeEvent(nIndex);
				}
			}
		});
	},
	
	/**
		적용된 DragArea 객체를 가져온다.
		
		@method getDragArea
		@return {jindo.DragArea}
	**/
	getDragArea : function() {
		return this._oDragArea; 
	},
	
	_fireChangeEvent : function(nIndex) {
		var nPos = this._getPosition(nIndex);
		/**
			Thumb을 Drop한 이후 발생
			
			@event change
			@param {String} sType 커스텀 이벤트명
			@param {Number} nIndex 위치 값을 가져올 Thumb의 index (생략시 모든 Thumb의 위치 값 배열을 리턴)
			@param {Number} nPos 설정할 위치 값(pixel단위)
			@param {Number} nValue drop 이후의 슬라이더 값
			@example
				// Thumb을 Drop한 이후 발생 단계에 실행 될 함수 구현.
				oSlider.attach("change", function(oCustomEvent) { ... });
		**/
		this.fireEvent('change', {
			nIndex : nIndex,
			nPos : nPos,
			nValue : this._getValue(nIndex, nPos)
		});
	},

	/**
		컴포넌트를 활성화시킨다.
	**/
	_onActivate : function() {
		this.getDragArea().activate();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elTrack).preventTapHighlight(true);
		this._onTrackMouseDownFn.attach(this._elTrack, 'mousedown');
	},
	
	/**
		컴포넌트를 비활성화시킨다.
	**/
	_onDeactivate : function() {
		this.getDragArea().deactivate();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elTrack).preventTapHighlight(false);
		this._onTrackMouseDownFn.detach(this._elTrack, 'mousedown');
	},
	
	_onTrackMouseDown : function(we) {
		if (!this.option('bJump')) {
			return;
		}
		
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		var nIndex = 0;
		var htSwap = this._htSwap;
		var el = we.element;
		var sClass = '.' + this.option('sClassPrefix') + 'thumb';
		var bThumb = jindo.$$.test(el, sClass) || jindo.$$.getSingle('! ' + sClass, el);
		if (bThumb) {
			return;
		}
		
		var nPos = we.pos()[htSwap.pageX]; // 클릭한 위치
		nPos -= jindo.$Element(this._elTrack).offset()[htSwap.left];
		
		var nMaxDistance = 9999999;
		
		// 가장 가까운 Thumb 찾기
		for (var i = 0, oThumb; (oThumb = this._aThumbs[i]); i++) {
			var nThumbPos = parseInt(jindo.$Element(oThumb).css(htSwap.left), 10) || 0;
			nThumbPos += parseInt(oThumb[htSwap.offsetWidth] / 2, 10);
			
			var nDistance  = Math.abs(nPos - nThumbPos);
			
			if (nDistance < nMaxDistance) {
				nMaxDistance = nDistance;
				nIndex = i;
			}
		}

		nPos -= parseInt(this._aThumbs[nIndex][htSwap.offsetWidth] / 2, 10);
		this.positions(nIndex, nPos);
		
		if (this.option("bDragOnTrack")) {
			this.getDragArea().startDragging(this._aThumbs[nIndex]);
		}
	},
	
	_getTrackInfo : function(nIndex) {
		var htSwap = this._htSwap;
		var oThumb = this._aThumbs[nIndex];
		var nThumbSize = oThumb[htSwap.offsetWidth];
		var nTrackSize = this._elTrack[htSwap.offsetWidth];
		var nMaxPos = nTrackSize - nThumbSize;
		var nMax = this.option('nMaxValue');
		var nMin = this.option('nMinValue');
		
		return {
			maxPos : nMaxPos,
			max : nMax,
			min : nMin
		};
	},
	
	/**
		옵션의 fAdjustValue가 적용된 value를 구한다.
		@param {Object} nIndex
		@param {Object} nPos
		@ignore
	**/
	_getValue : function(nIndex, nPos) {
		if (typeof nPos == 'undefined') {
			nPos = this._getPosition(nIndex);
		}

		var oInfo = this._getTrackInfo(nIndex);
		var maxPos = 0;
        
        if(oInfo.maxPos !== 0 ){
            maxPos = nPos * (oInfo.max - oInfo.min) / oInfo.maxPos;
        }
		// var nValue = Math.min(Math.max(nPos * (oInfo.max - oInfo.min) / oInfo.maxPos + oInfo.min, oInfo.min), oInfo.max);
		var nValue = maxPos + oInfo.min;
        nValue = Math.min(Math.max(nValue, Math.min(oInfo.min, oInfo.max)), Math.max(oInfo.min, oInfo.max));

		var fAdjust = this.option('fAdjustValue');
		if (fAdjust) {
			nValue = fAdjust.call(this, nValue);
		}
		
		return nValue;
	},
	
	/**
		옵션의 fAdjustValue가 적용된 포지션을 구한다.
		@param {Object} nIndex
		@param {Object} nPos
		@ignore
	**/
	_getAdjustedPos : function(nIndex, nPos) {
		var nAdjustedPos = nPos;
		var oInfo = this._getTrackInfo(nIndex);
		
		var fAdjust = this.option('fAdjustValue');
		if (fAdjust) {
			var nValue = Math.min(Math.max(nAdjustedPos * (oInfo.max - oInfo.min) / oInfo.maxPos + oInfo.min, oInfo.min), oInfo.max);
			var nAfterValue = fAdjust.call(this, nValue);
			
			if (nValue != nAfterValue) {
				nAdjustedPos = oInfo.maxPos * (nAfterValue - oInfo.min) / (oInfo.max - oInfo.min);
			}
		}
		
		nAdjustedPos = Math.max(nAdjustedPos, 0);
		nAdjustedPos = Math.min(nAdjustedPos, oInfo.maxPos);
		
		return nAdjustedPos;		
	},
	
	_getThumbIndex : function(oThumb) {
		for (var i = 0, len = this._aThumbs.length; i < len; i++) {
			if (this._aThumbs[i] == oThumb) {
				return i;
			}
		}
			
		return -1;
	},
	
	_getPosition : function(nIndex) {
		var sPos = jindo.$Element(this._aThumbs[nIndex]).css(this._htSwap.left);
		return (sPos == "auto") ? 0 : parseInt(sPos, 10);
	},
	
	_setPosition : function(nIndex, nPos) {
		this._aPoses[nIndex] = nPos;
		jindo.$Element(this._aThumbs[nIndex]).css(this._htSwap.left, nPos + 'px');
	},
	
	/**
		pixel단위로 Thumb의 위치 값을 가져온다.
		
		@method positions
		@param {Number} [nIndex] 위치 값을 가져올 Thumb의 index (생략시 모든 Thumb의 위치 값 배열을 리턴)
		@return {Number | Array}
		@example 
			oSlider.positions(0);
			oSlider.positions();
	**/
	/**
		pixel단위로 Thumb의 위치 값을 설정한다.
		
		@method positions
		@param {Number} nIndex 위치 값을 설정할 Thumb의 index
		@param {Number} nPos 설정할 위치 값(pixel단위)
		@param {Boolean} bFireEvent 커스텀 이벤트를 발생할지의 여부
		@return {this} 인스턴스 자신
		@example 
			oSlider.positions(0, 100);
	**/
	positions : function(nIndex, nPos, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}

		switch (arguments.length) {
			case 0:
				var aPoses = [];
				jindo.$A(this._aThumbs).forEach(function(el, i){
					aPoses[i] = this._getPosition(i);
				}, this);
				return aPoses;
	
			case 1:
				return this._getPosition(nIndex);
				
			default:
				if (bFireEvent) {
					var htParam = { 
						nIndex : nIndex,
						nPos : nPos,
						bJump : true
					};
					if (this.fireEvent('beforeChange', htParam)) {
						var nAfterPos = this._getAdjustedPos(nIndex, htParam.nPos);
						var bChanged = (nAfterPos != this._aPoses[nIndex]);
	
						this._setPosition(nIndex, nAfterPos);
						if (bChanged) {
							this._fireChangeEvent(nIndex);
						}
					}
				    return this;
				}
				this._setPosition(nIndex, this._getAdjustedPos(nIndex, nPos));
			    return this;
		} 
	},
	
	/**
		옵션으로 설정한 nMinValue, nMaxValue에 대한 상대 값으로 해당 Thumb의 위치 값을 가져온다.
		
		@method values
		@param {Number} [nIndex] Value를 가져올 Thumb의 index (생략시 모든 Thumb의 위치 값 배열을 리턴)
		@return {Number | Array}
		@example 
			oSlider.values(0);
			oSlider.values();
	**/
	/**
		옵션으로 설정한 nMinValue, nMaxValue에 대한 상대 값으로 해당 Thumb의 위치 값을 설정한다.
		
		@method values
		@param {Number} nIndex Value를 설정할 Thumb의 index
		@param {Number} nValue 설정할 위치 값
		@param {Boolean} bFireEvent 커스텀 이벤트를 발생할지의 여부
		@return {this} 인스턴스 자신
		@example 
			oSlider.values(0, 0.5);
	**/
	values : function(nIndex, nValue, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		switch (arguments.length) {
			case 0:
				var aValues = [];
				for (var i = 0, len = this._aThumbs.length; i < len; i++) {
					aValues[i] = this._getValue(i);
				}
				return aValues;
				
			case 1:
				return this._getValue(nIndex, this.positions(nIndex)); //수정
	
			default:
				var oInfo = this._getTrackInfo(nIndex);
				this.positions(nIndex, ((nValue - oInfo.min) * oInfo.maxPos / (oInfo.max - oInfo.min)) || 0, bFireEvent);
				return this;
		}
	}
}).extend(jindo.UIComponent);/**
	@fileOverview 이미지 스크롤바 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	이미지 스크롤바 컴포넌트
	ScrollBar 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게합니다.
	스크롤바의 위치와 크기는 마크업의 정의에 따라 커스터마이징할 수 있습니다.
	박스내 내용이 고정되어있고 변하지 않는 경우에 사용합니다.
	
	@class jindo.ScrollBar
	@extends jindo.UIComponent
	@uses jindo.Slider
	@uses jindo.RolloverArea
	@uses jindo.Transition
	@keyword scrollbar, 스크롤바
**/
jindo.ScrollBar = new jindo.$Class({
	/** @lends jindo.ScrollBar.prototype */

	_bMouseEnter : false,
	_bIsEventAttachedForCommon : false,
	_bIsEventAttachedForVertical : false,
	_bIsEventAttachedForHorizontal : false,
	
	/**
		@constructor
		@param {HTMLElement} el
		@param {Object} [oOption] 옵션
			@param {String} [oOption.sClassPrefix="scrollbar-"] 클래스명 접두어
			@param {Number} [oOption.nDelta=16] 스크롤 속도
			@param {String} [oOption.sClassNameForRollover="rollover"] Rollover에 반응할 클래스명
			@param {Boolean} [oOption.bActivateOnload=true] 컴포넌트 로드시 activate() 수행여부
		@example
			var oScrollBar = new jindo.ScrollBar("scroll", {
				sClassPrefix : "scrollbar-", // (String) Class Prefix
				nDelta : 16, // (Number) 스크롤 속도
				sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
				bActivateOnload : true
			}).attach({
				scroll : function(oCustomEvent) {
					//스크롤위치가 바뀔 때 마다 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	sDirection : (String) "left" 또는 "top"
					//	nPosition : (Number) 스크롤된 위치
					//}
				}
			});
	**/	
	$init : function(el, oOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			nDelta : 16, //스크롤 속도
			sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
			bActivateOnload : true
		});
		
		this.option(oOption || {});
		
		this._el = jindo.$(el);
		this._oOldPos = { left : null, top : null };
		
		this._oTimer = new jindo.Timer();
		this._oTransition = new jindo.Transition().fps(30);
		
		this._wfOnMouseEnter = jindo.$Fn(this._onMouseEnter, this);
		this._wfOnMouseLeave = jindo.$Fn(this._onMouseLeave, this);
		
		this._wfOnWheel = jindo.$Fn(this._onWheel, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);

		this._assignHTMLElements();
		this._initialize4Tablet();
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_assignHTMLElements : function(){
		var el = this._el,
			sClassPrefix = this.option("sClassPrefix");

		this._elBox = jindo.$$.getSingle("."+sClassPrefix+"box", el);
		this._elContent = jindo.$$.getSingle("."+sClassPrefix+"content", el);
		
		var welBox = jindo.$Element(this._elBox),
			welContent = jindo.$Element(this._elContent);
			
		this._oBoxSize = {
			nWidth: welBox.width(),
			nHeight: welBox.height()
		};
		
		this._oContentSize = {
			nWidth: welContent.width(),
			nHeight: welContent.height()
		};

		this._oHorizontal = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"h", el)
		};
		
		var oH = this._oHorizontal;
		if (oH.elScrollBar) {
			oH.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oH.elScrollBar);
			oH.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oH.elTrack);
			oH.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oH.elThumb);
			oH.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oH.elThumb);
			oH.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oH.elThumb);			
			oH.elButtonLeft = jindo.$$.getSingle("." + sClassPrefix + "button-left", oH.elScrollBar);
			oH.elButtonRight = jindo.$$.getSingle("." + sClassPrefix + "button-right", oH.elScrollBar);
		}
		
		this._oVertical = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"v", el)
		};
		var oV = this._oVertical;
		if (oV.elScrollBar) {
			oV.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oV.elScrollBar);
			oV.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oV.elTrack);
			oV.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oV.elThumb);
			oV.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oV.elThumb);
			oV.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oV.elThumb);
			oV.elButtonUp = jindo.$$.getSingle("." + sClassPrefix + "button-up", oV.elScrollBar);
			oV.elButtonDown = jindo.$$.getSingle("." + sClassPrefix + "button-down", oV.elScrollBar);
		}
	},
	
	/**
		box 엘리먼트를 가져온다.
		
		@method getBox
		@return {HTMLElement}
	**/
	getBox : function() {
		return this._elBox;
	},
	
	/**
		content 엘리먼트를 가져온다
		
		@method getContent
		@return {HTMLElement}
	**/
	getContent : function() {
		return this._elContent;
	},
	
	/**
		초기 로딩시 정해진 박스의 크기를 가져온다.
		
		@method getDefaultBoxSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number), 
				nHeight : (Number)
			}
	**/
	getDefaultBoxSize : function() {
		return this._oBoxSize;
	},
	
	/**
		초기 로딩시 정해진 박스의 크기를 가져온다.
		
		@method getDefaultContentSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number), 
				nHeight : (Number)
			}
	**/
	getDefaultContentSize : function() {
		return this._oContentSize;
	},
	
	/**
		가로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
		
		@method getScrollBarHorizontal
		@return {Object}
		@example
			var oScrollBarHorizontal = {
				elScrollBar : (HTMLElement),
				elTrack : (HTMLElement),
				elThumb : (HTMLElement),
				elThumbHead : (HTMLElement),
				elThumbBody : (HTMLElement),
				elThumbFoot : (HTMLElement),
				elButtonLeft : (HTMLElement), 
				elButtonRight : (HTMLElement)
			}
	**/
	getScrollBarHorizontal : function() {
		return this._oHorizontal;
	},
	
	/**
		세로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
		
		@method getScrollBarVertical
		@return {Object}
		@example
			var oScrollBarVertical = {
				elScrollBar : (HTMLElement),
				elTrack : (HTMLElement),
				elThumb : (HTMLElement),
				elThumbHead : (HTMLElement),
				elThumbBody : (HTMLElement),
				elThumbFoot : (HTMLElement),
				elButtonUp : (HTMLElement), 
				elButtonDown : (HTMLElement)
			}
	**/
	getScrollBarVertical : function() {
		return this._oVertical;
	},
	
	/**
		가로 스크롤에 해당하는 슬라이더 객체를 가져온다.
		
		@method getSliderHorizontal
		@return {jindo.Slider}
	**/
	getSliderHorizontal : function() {
		return this._oSliderHorizontal || null;
	},
	
	/**
		세로 스크롤에 해당하는 슬라이더 객체를 가져온다.
		
		@method getSliderVertical
		@return {jindo.Slider}
	**/
	getSliderVertical : function() {
		return this._oSliderVertical || null;
	},
	
	/**
		RolloverArea 객체를 가져온다.
		
		@method getRolloverArea
		@return {jindo.RolloverArea}
	**/
	getRolloverArea : function() {
		return this._oRolloverArea;
	},
	
	_attachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function attach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).addClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).addClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).addClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).addClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).addClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).addClass(sClassNameForRollover);
				}
			}
		}
		
		function attachH() {
			if (!self._bIsEventAttachedForHorizontal) {
				attach(oH);
			}
			self._bIsEventAttachedForHorizontal = true;
		}
		
		function attachV() {
			if (!self._bIsEventAttachedForVertical) {
				attach(oV);
			}
			self._bIsEventAttachedForVertical = true;
		}
		
		//공통 이벤트
		if(!this._bIsEventAttachedForCommon) {
			this._initSliders();
			this._initRolloverArea();
			
			this._wfOnMouseEnter.attach(this._el, "mouseenter");
			this._wfOnMouseLeave.attach(this._el, "mouseleave");
			this._wfOnWheel.attach(document, "mousewheel");
			this._wfOnMouseUp.attach(document, "mouseup");
			this._bIsEventAttachedForCommon = true;
			jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
		}

		//방향이 없으면 전부
		if (!sDirection) {
			attachH();
			attachV();
		}
		if (sDirection == "horizontal") {
			attachH();
		}
		if (sDirection == "vertical") {
			attachV();
		}
	},
	
	_detachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function detach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).removeClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).removeClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).removeClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).removeClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).removeClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).removeClass(sClassNameForRollover);
				}
			}
		}
		
		function detachH() {
			if (self._bIsEventAttachedForHorizontal) {
				detach(oH);
			}
			self._bIsEventAttachedForHorizontal = false;
		}
		
		function detachV() {
			if (self._bIsEventAttachedForVertical) {
				detach(oV);
			}
			self._bIsEventAttachedForVertical = false;
		}

		//방향이 없으면 전부
		if (!sDirection) {
			detachH();
			detachV();
		}
		else if (sDirection == "horizontal") {
			detachH();
		}
		else if (sDirection == "vertical") {
			detachV();
		}

		//공통 이벤트
		if(this._bIsEventAttachedForCommon && !this._bIsEventAttachedForHorizontal && !this._bIsEventAttachedForVertical) {
			this._wfOnMouseEnter.detach(this._el, "mouseenter");
			this._wfOnMouseLeave.detach(this._el, "mouseleave");
			this._wfOnWheel.detach(document, "mousewheel");
			this._wfOnMouseUp.detach(document, "mouseup");
			this._bMouseEnter = false;
			this._bIsEventAttachedForCommon = false;
			this.getRolloverArea().deactivate();
			jindo.$Element(this._el).addClass(sClassPrefix + "noscript");	
		}
	},
	
	_activateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.activate();
			this.getBox().scrollLeft = 0;
			this.setScrollLeft(0);
		}
	},
	
	_activateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.activate();
			this.getBox().scrollTop = 0;
			this.setScrollTop(0);
		}
	},
	
	/**
		스크롤바의 동작을 활성화한다.
		@param {String} sDirection "vertical" || "horizontal" || null
	**/
	_onActivate : function(sDirection) {
		this._attachEvent(sDirection || null);
		this._activate4Tablet();
		
		if(!sDirection) {
			this._activateH();
			this._activateV();
			jindo.$Element(this._el).removeClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._activateH();
			return;
		}
		if(sDirection == "vertical") {
			this._activateV();
			return;
		}
	},
	
	_deactivateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.deactivate();
			this.getContent().style.left = "0px";
			this.getBox().scrollLeft = 0;
		}
	},
	
	_deactivateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.deactivate();
			this.getContent().style.top = "0px";
			this.getBox().scrollTop = 0;
		}
	},
	
	/**
		스크롤바의 동작을 비활성화한다.
		@param {String} sDirection "vertical" || "horizontal" || null
	**/
	_onDeactivate : function(sDirection) {
		this._detachEvent(sDirection || null);
		this._deactivate4Tablet();
		
		if(!sDirection) {
			this._deactivateH();
			this._deactivateV();
			jindo.$Element(this._el).addClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._deactivateH();
			return;
		}
		if(sDirection == "vertical") {
			this._deactivateV();
			return;
		}
	},
	
	_initSliders : function() {
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();		
		
		if (oH.elScrollBar) {

			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			
			this._oSliderHorizontal = new jindo.Slider(oH.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: false,
				nMinValue: 0,
				nMaxValue: this._nScrollWidth
			});
			this._oSliderHorizontal._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderHorizontal.attach({
				beforeChange: function(oCustomEvent){
					var nTrackWidth = jindo.$Element(this.getTrack()).width(),
						nThumbWidth = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).width(),
						nAvailWidth = nTrackWidth - nThumbWidth;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailWidth); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@left" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollLeft(self._oSliderHorizontal._getValue(0, parseInt(oCustomEvent2.sValue, 10)));
							}
						});
					} else {
						self.setScrollLeft(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}
		
		if (oV.elScrollBar) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();

			this._oSliderVertical = new jindo.Slider(oV.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: true,
				nMinValue: 0,
				nMaxValue: this._nScrollHeight
			});
			this._oSliderVertical._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderVertical.attach({
				beforeChange: function(oCustomEvent){
					var nTrackHeight = jindo.$Element(this.getTrack()).height(),
						nThumbHeight = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).height(),
						nAvailHeight = nTrackHeight - nThumbHeight;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailHeight); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@top" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollTop(self._oSliderVertical.values(0));
							}
						});
					} else {
						self.setScrollTop(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}		
		
	},

	_initRolloverArea : function(){
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			sClassNameForRollover = this.option("sClassNameForRollover");
			
		this._oRolloverArea = new jindo.RolloverArea(this._el, {
			sClassName : sClassNameForRollover, // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
			sClassPrefix : sClassPrefix // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
		}).attach({
			over: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("over", oCustomEvent.element);
			},
			down: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseDown(oCustomEvent.element);
				self._onRollover("down", oCustomEvent.element);
			},
			up: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseUp(oCustomEvent.element);
				self._onRollover("up", oCustomEvent.element);
			},
			out: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("out", oCustomEvent.element);
			}
		});
	},
	
	/**
		content의 내용의 크기가 달라졌을때 스크롤바의 이동 값을 재설정해준다.
		
		@method reset
	**/	
	reset : function() {
		var oSliderH = this.getSliderHorizontal(),
			oSliderV = this.getSliderVertical();
		
		if (oSliderH) {
			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			oSliderH.option("nMaxValue", this._nScrollWidth);
			this.setScrollLeft(0);
		}
		if (oSliderV) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();
			oSliderV.option("nMaxValue", this._nScrollHeight);
			this.setScrollTop(0);			
		}
		
		this._elBox.scrollLeft = 0;
		this._elBox.scrollTop = 0;		
	},
	
	/**
		가로 스크롤이 화면에 표시되었는지 여부를 가져온다.
		
		@method hasScrollBarHorizontal
		@return {Boolean} 
	**/
	hasScrollBarHorizontal : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarHorizontal();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");	
		}
		return false;
		
	},
	
	/**
		세로 스크롤이 화면에 표시되었는지 여부를 가져온다.
		
		@method hasScrollBarVertical
		@return {Boolean} 
	**/
	hasScrollBarVertical : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarVertical();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");
		}
		return false;
	},
	
	/**
		세로 스크롤바의 포지션을 설정한다.
		
		@method setScrollTop
		@param {Number} n 포지션 값
		@remark 0.1.2 버전부터 slider 0.3.2버전 필요
	**/
	setScrollTop : function(n) {
		n = Math.min(n, this._nScrollHeight || 0);
		n = Math.max(n, 0);
		n = Math.round(n);

		var htParam = {
			sDirection : "top",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("top", (htParam.nPosition * -1) + "px");
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.values(0, htParam.nPosition, false); //커스텀 이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},

	/**
		가로 스크롤바의 포지션을 설정한다.
		
		@method setScrollLeft
		@param {Number} n 포지션 값
		@remark 0.1.2 버전부터 slider 0.3.2버전 필요
	**/
	setScrollLeft : function(n) {
		n = Math.min(n, this._nScrollWidth || 0);
		n = Math.max(n, 0);
		n = Math.round(n);
		
		var htParam = {
			sDirection : "left",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("left", (htParam.nPosition * -1) +"px");
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.values(0, htParam.nPosition, false); //커스텀 이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},
	
	/**
		세로 스크롤바의 포지션을 상대 값으로 설정한다.
		
		@method setScrollTopBy
		@param {Number} n 상대적인 포지션 값
	**/
	setScrollTopBy : function(n) {
		this.setScrollTop(this.getScrollTop()+n);
	},

	/**
		가로 스크롤바의 포지션을 상대 값으로 설정한다.
		
		@method setScrollLeftBy
		@param {Number} n 상대적인 포지션 값
	**/
	setScrollLeftBy : function(n) {
		this.setScrollLeft(this.getScrollLeft()+n);
	},

	/**
		컨텐트 영역의 세로 스크롤 위치를 구한다.
		
		@method getScrollTop
		@return {Number} 세로 스크롤 위치
	**/
	getScrollTop : function() {
		return parseInt(jindo.$Element(this._elContent).css("top"), 10) * -1;
	},
	
	/**
		컨텐트 영역의 가로 스크롤 위치를 구한다.
		
		@method getScrollLeft
		@return {Number} 가로 스크롤 위치
	**/
	getScrollLeft : function() {
		return parseInt(jindo.$Element(this._elContent).css("left"), 10) * -1;
	},
	
	_getElementType : function(wel) {
		var sClassPrefix = this.option("sClassPrefix");
		
		if (wel.hasClass(sClassPrefix+"track")) {
			return "track";
		}
		else if (wel.hasClass(sClassPrefix+"thumb")) {
			return "thumb";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-down")) {
			return "button-down";
		}
		else if (wel.hasClass(sClassPrefix+"button-left")) {
			return "button-left";
		}
		else if (wel.hasClass(sClassPrefix+"button-right")) {
			return "button-right";
		}
		else {
			return false;
		}
	},
	
	_fireScrollEvent : function(htParam) {
		/**
			스크롤위치가 바뀔 때
			
			@event scroll
			@param {String} sType 커스텀 이벤트명
			@param {String} sDirection 
			<ul>
			<li>"left"</li>
			<li>"top"</li>
			</ul>
			@param {Number} nPosition 스크롤된 위치
			@example
				//커스텀 이벤트 핸들링 예제
				oScrollBar.attach("scroll", function(oCustomEvent) { ... });
		**/

		if (this._oOldPos[htParam.sDirection] === htParam.nPosition) { return; }
		this._oOldPos[htParam.sDirection] = htParam.nPosition;

		this.fireEvent("scroll", htParam);
	},
	
	_onWheel : function(we) {
		if (!this._bMouseEnter) {
			return;
		}
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var nDelta = we.mouse().delta,
			nDirection  = nDelta===0?0:nDelta / Math.abs(nDelta) * -1,
			n = Math.ceil(Math.abs(nDelta)) * nDirection * this.option("nDelta"),
			bH = this.hasScrollBarHorizontal(),
			bV = this.hasScrollBarVertical();
			
		if (!bH && !bV) {
			return;
		}
		
		if (this.hasScrollBarVertical() && this._bIsEventAttachedForVertical) {
			this.setScrollTop(this.getScrollTop()+n);
			return;
		}
		
		this.setScrollLeft(this.getScrollLeft()+n);
	},
	
	_onMouseDown : function(el) {
		var wel = jindo.$Element(el),
			self = this,
			setScrollBy,
			sElementType = this._getElementType(wel);
		
		switch (sElementType) {
			case "button-up" :
				setScrollBy = function (n){
					self.setScrollTopBy(~~(n * -1));
				};
			break;
			case "button-down" :
				setScrollBy = function (n){
					self.setScrollTopBy(n);
				};
			break;
			case "button-left" :
				setScrollBy = function (n){
					self.setScrollLeftBy(~~(n * -1));
				};
			break;
			case "button-right" :
				setScrollBy = function (n){
					self.setScrollLeftBy(n);
				};
			break;
			default :
			return;
		}
		
		setScrollBy(16);
		this._oTimer.start(function(){
			setScrollBy(16);
			return true;
		}, 100);
		
	},
	
	_onMouseUp : function(el) {
		this._oTimer.abort();
	},
	
	_onMouseEnter : function(we) {
		this._bMouseEnter = true;
	},
	
	_onMouseLeave : function(we) {
		this._bMouseEnter = false;
	},
	
	_onRollover : function(sType, el) {
		var wel = jindo.$Element(el),
			sClassPrefix = this.option("sClassPrefix"),
			sElementType = this._getElementType(wel);
		
		switch (sType) {
			case "over" :
				wel.addClass(sClassPrefix + sElementType + "-over");		
			break;
			case "down" :
				wel.addClass(sClassPrefix + sElementType + "-hold");
			break;
			case "up" :
				wel.removeClass(sClassPrefix + sElementType + "-hold");
			break;
			case "out" :
				wel.removeClass(sClassPrefix + sElementType + "-over");
			break;
		}
		
	},
	
	_initialize4Tablet : function() {
		
		this._fpOnTouchDragStart = jindo.$Fn(function(oEvent) {
			this._oPos4Tablet = oEvent.pos();
		}, this);
		
		this._fpOnTouchDragMove = jindo.$Fn(function(oEvent) {
			
			if (!this._oPos4Tablet) { return; }
			
			var oOldPos = this._oPos4Tablet;
			var oNewPos = oEvent.pos();
			
			this.setScrollLeftBy(oOldPos.pageX - oNewPos.pageX);
			this.setScrollTopBy(oOldPos.pageY - oNewPos.pageY);

			this._oPos4Tablet = oNewPos;
			
			oEvent.stopDefault();
			
		}, this);
		
		this._fpOnTouchDragEnd = jindo.$Fn(function(oEvent) {
			this._oPos4Tablet = null;
		}, this);
		
	},
	
	_activate4Tablet : function() {
		
		var elEl = this._elContent;
		
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(true);
		
		this._fpOnTouchDragStart.attach(elEl, 'touchstart');
		this._fpOnTouchDragMove.attach(elEl, 'touchmove');
		this._fpOnTouchDragEnd.attach(elEl, 'touchend');
		
	},
	
	_deactivate4Tablet : function() {
		
		var elEl = this._elContent;
		
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(false);
		
		this._fpOnTouchDragStart.detach(elEl, 'touchstart');
		this._fpOnTouchDragMove.detach(elEl, 'touchmove');
		this._fpOnTouchDragEnd.detach(elEl, 'touchend');
		
	}
	
}).extend(jindo.UIComponent);
/**
	@fileOverview 정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
	ScrollBox 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게 한다.
	ScrollBar 컴포넌트와 다르게 박스내의 내용이 유동적으로 변할 때 스크롤이 나타나거나 사라지고 막대의 길이도 자동으로 구해진다.
	
	@class jindo.ScrollBox
	@extends jindo.ScrollBar
	@keyword scrollbox, 스크롤박스
**/
jindo.ScrollBox = new jindo.$Class({
	/** @lends jindo.ScrollBox.prototype */

	/**
		@constructor
		@param {HTMLElement} el
		@param {Object} [htOption] 옵션
			@param {String} [htOption.sClassPrefix="scrollbar-"] 클래스명 접두어
			@param {String} [htOption.sOverflowX="auto"] 가로스크롤을 보여주는 방법
			<ul>
			<li>"auto" : 자동</li>
			<li>"scroll" : 항상</li>
			<li>"hidden" : 보이지않음</li>
			</ul>
			@param {String} [htOption.sOverflowY="auto"] 세로스크롤을 보여주는 방법
			<ul>
			<li>"auto" : 자동</li>
			<li>"scroll" : 항상</li>
			<li>"hidden" : 보이지않음</li>
			</ul>
			@param {String} [htOption.sClassNameForRollover="rollover"] Rollover에 반응할 클래스명
			@param {Number} [htOption.nDelta=16] 스크롤 속도
			@param {Boolean} [htOption.bAdjustThumbSize=true] Thumb의 크기가 Content의 크기에따라 자동으로 변할지 여부
			@param {Number} [htOption.nMinThumbSize=50] bAdjustThumbSize가 true일경우 크기가 변해도 최소로 유지될 크기
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 로드시 activate() 수행여부
		@example
			var oScrollBox = new jindo.ScrollBox("scroll", {
				sClassPrefix : "scrollbar-", // (String) Class Prefix
				sOverflowX : "auto", // (String) 가로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음) 
				sOverflowY : "auto", // (String) 세로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음)
				bAdjustThumbSize : true, // (Boolean) Thumb의 크기가 Content의 크기에따라 자동으로 변할지 여부
				nMinThumbSize : 50, // (Number) bAdjustThumbSize가 true일경우 크기가 변해도 최소로 유지될 크기
				nDelta : 16 // (Number) 스크롤 속도
			});
	**/
	$init : function(el, htOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			bActivateOnload : true,
			sOverflowX : "auto",
			sOverflowY : "auto",
				bAdjustThumbSize : true,
			nMinThumbSize : 50,
			nDelta : 16 //스크롤 속도
		});
		
		this.option(htOption || {});
		
		this._el = jindo.$(el);
		
		if (this.option("bActivateOnload")) {
			this.activate();
			this.reset();
		}
	},
	
	/**
		스크롤바의 보임/숨김 여부를 자동으로 설정한다.
		
		@method reset
	**/
	reset : function() {
		this._autoToggleScrollBar();
		
		//보정을 위한 상태설정		
		var oStatusH = this.hasScrollBarHorizontal();
		var oStatusV = this.hasScrollBarVertical();
		
		this._adjustBoxSize();
		this._adjustContentSize();
		
		//보정
		this._autoToggleScrollBar();
		if (oStatusH != this.hasScrollBarHorizontal() || oStatusV != this.hasScrollBarVertical()) {
			this._adjustBoxSize();
			this._adjustContentSize();
		}
		
		this._autoToggleAvailability();
		this._adjustTrackSize();
		this._adjustThumbSize();
		this.$super.reset();
	},

	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		//활성화 로직 ex)event binding
		this.$super._onActivate();
		this.reset();
	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		this.$super._onDeactivate();
		this._adjustBoxSize();
	},

	/**
		스크롤 박스의 크기를 설정한다.
		
		@method setSize
		@param {Number} [nWidth] 가로 크기
		@param {Number} [nHeight] 세로 크기
	**/
	setSize : function(nWidth, nHeight) {
		if (nWidth) {
			//jindo.$Element(this._el).width(nWidth);
			jindo.$Element(this._el).css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._el).height(nHeight);
			jindo.$Element(this._el).css("height", nHeight + "px");
		}

		this.setBoxSize(nWidth, nHeight);

		this._oBoxSize = {
			nWidth : jindo.$Element(this._elBox).width(),
			nHeight : jindo.$Element(this._elBox).height()
		};
		this.reset(); 
	},

	/**
		컨텐트 엘리먼트의 크기를 구한다.
		
		@method getContentSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getContentSize : function() {
		var welContent = jindo.$Element(this._elContent);
		
		return {
			nWidth : parseInt(welContent.width(), 10),
			nHeight : parseInt(welContent.height(), 10)
		};
	},

	/**
		컨텐트 엘리먼트의 크기를 설정한다.
		
		@method setContentSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 세로 크기
	**/	
	setContentSize : function(nWidth, nHeight) {
		var welContent = jindo.$Element(this._elContent);
		
		if (nWidth) {
			if (nWidth == Infinity) {
				welContent.css("width", "");
			}
			else {
				welContent.css("width", nWidth + "px");	
			}
			
		}

		if (nHeight) {
			if (nHeight == Infinity) {
				welContent.css("height", "auto");
			}
			else {
				welContent.css("height", nHeight + "px");	
			}
		}
		this.$super.reset();
	},
	
	/**
		박스 엘리먼트의 크기를 구한다.
		
		@method getBoxSize
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getBoxSize : function() {
		var welBox = jindo.$Element(this._elBox);
		return {
			nWidth : parseInt(welBox.width(), 10),
			nHeight : parseInt(welBox.height(), 10)
		};
	},
	
	/**
		박스 엘리먼트의 크기를 설정한다.
		
		@method setBoxSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 가로 크기
	**/
	setBoxSize : function(nWidth, nHeight) {
		var welBox = jindo.$Element(this._elBox);
		if (nWidth) {
			//jindo.$Element(this._elBox).width(nWidth);
			welBox.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._elBox).height(nHeight);
			welBox.css("height", nHeight + "px");
		}
		this.$super.reset();
	},

	/**
		트랙 엘리먼트의 크기를 구한다.
		
		@method getTrackSize
		@param {Object} ht 엘리먼트 객체들
			@param {HTMLElement} ht.elScrollBar 스크롤바 엘리먼트
			@param {HTMLElement} ht.elTrack 트랙 엘리먼트
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getTrackSize : function(ht) {
		if (!ht.elScrollBar) {
			return {
				nWidth : 0,
				nHeight : 0
			};	
		}
		var welTrack = jindo.$Element(ht.elTrack);
		return {
			nWidth : parseInt(welTrack.width(), 10),
			nHeight : parseInt(welTrack.height(), 10)
		};
	},
	
	/**
		트랙 엘리먼트의 크기를 설정한다.
		
		@method setTrackSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 세로 크기
	**/
	setTrackSize : function(o, nWidth, nHeight) {
		var welTrack = jindo.$Element(o.elTrack);
		if (nWidth) {
			//jindo.$Element(o.elTrack).width(nWidth);
			welTrack.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(o.elTrack).height(nHeight);
			welTrack.css("height", nHeight + "px");
		}
	},
	
	/**
		가로스크롤이 생겨야하는 상황인지 판단한다.
		
		@method isNeededScrollBarHorizontal
		@return {Boolean}
	**/
	isNeededScrollBarHorizontal : function() {
		
		if(this.option("sOverflowX") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();
		
		if (this.getScrollBarHorizontal().elScrollBar && this.option("sOverflowX") != "hidden") {
			if(this.hasScrollBarVertical()) {
				if(oContentSize.nWidth > oBoxSize.nWidth - jindo.$Element(this.getScrollBarVertical().elScrollBar).width()) {
					return true;	
				}
			}
			if (oContentSize.nWidth > oBoxSize.nWidth){
				return true;	
			}
		}
		return false;
	},
	
	/**
		세로스크롤이 생겨야하는 상황인지 판단한다.
		
		@method isNeededScrollBarVertical
		@return {Boolean}
	**/
	isNeededScrollBarVertical : function() {
		
		if(this.option("sOverflowY") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();

		if (this.getScrollBarVertical().elScrollBar && this.option("sOverflowY") != "hidden") {
			if(this.hasScrollBarHorizontal()) {
				if(oContentSize.nHeight > oBoxSize.nHeight - jindo.$Element(this.getScrollBarHorizontal().elScrollBar).height()) {
					return true;	
				}
			}
			if(oContentSize.nHeight > oBoxSize.nHeight) {
				return true;	
			}
		}
		return false;
	},
	
	_autoToggleScrollBar : function() {
		
		if (!this.isActivating()) {
			return;
		}
		
		var sClassPrefix = this.option("sClassPrefix");
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var welScrollBar; 
		var bAjustThumbSize = this.option("bAdjustThumbSize");
		
		var bV = this.isNeededScrollBarVertical();
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (bV) {
				welScrollBar.addClass(sClassPrefix + "show");
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px"); //ie6에서 문제때문에 스크롤바를 보여준 직후에 (trackSize를 조절해주기 이전) Thumb사이즈를 0로 만들어준다.
			}
		}
		var bH = this.isNeededScrollBarHorizontal();
		if (oH.elScrollBar) {
			welScrollBar = jindo.$Element(oH.elScrollBar);
			if (bH) {
				welScrollBar.addClass(sClassPrefix + "show");	
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oH.elThumb && bAjustThumbSize) {
				jindo.$Element(oH.elThumb).css("width", "0px");
			}
		}

		//세로스크롤 안생기고, 가로스크롤생긴후에 세로스크롤이 필요해지는 경우!		
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (this.isNeededScrollBarVertical()) {
				welScrollBar.addClass(sClassPrefix + "show"); 
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px");
			}	
		}
	},
	
	/**
		Track의 길이를 자동 조절한다.
	**/
	_adjustTrackSize : function() {
		if (!this.isActivating()) {
			return;
		}
		var oBoxSize = this.getDefaultBoxSize();
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		var bH = this.isNeededScrollBarHorizontal();
		//가로 스크롤
		if (bH && oH.elScrollBar) {
			var nTrackWidth = oBoxSize.nWidth;

			var wel = jindo.$Element(oH.elScrollBar);
			wel.css("top", oBoxSize.nHeight - wel.height() + "px");
		
			//세로 스크롤도 있는경우
			var nVerticalWidth = 0;
			if (this.hasScrollBarVertical() && oV.elScrollBar) {
				nVerticalWidth = parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				nTrackWidth -= nVerticalWidth;
			}	
			wel.width(nTrackWidth); //가로스크롤의 크기 조절
			
			var nButtonLeftWidth = 0;
			if (oH.elButtonLeft) {
				nButtonLeftWidth = parseInt(jindo.$Element(oH.elButtonLeft).width(), 10);
				nTrackWidth -= nButtonLeftWidth;
			}
			if (oH.elButtonRight) {
				nTrackWidth -= parseInt(jindo.$Element(oH.elButtonRight).width(), 10);
			}

			jindo.$Element(oH.elTrack).css("left", nButtonLeftWidth + "px"); //가로스크롤의 위치 조절
			
			this.setTrackSize(oH, nTrackWidth, null);
		}

		var bV = this.isNeededScrollBarVertical();		
		//세로 스크롤
		if (bV && oV.elScrollBar) {
			var nTrackHeight = oBoxSize.nHeight;
			
			//가로 스크롤도 있는경우
			var nHorizontalHeight = 0;
			if (this.hasScrollBarHorizontal() && oH.elScrollBar) {
				nHorizontalHeight = parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				nTrackHeight -= nHorizontalHeight;
			}
			
			if (oV.elButtonUp) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonUp).height(), 10);
			}
			if (oV.elButtonDown) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonDown).height(), 10);
				//jindo.$Element(oV.elButtonDown).css("bottom", nHorizontalHeight +"px");
			}
			
			this.setTrackSize(oV, null, nTrackHeight);
		}
		
	},
	
	/**
		ScrollBar 가 생성되었을 경우의 Box 사이즈를 설정해준다.
	**/
	_adjustBoxSize : function() {
		var oBoxSize = this.getDefaultBoxSize();
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var bV = this.hasScrollBarVertical();
		var bH = this.hasScrollBarHorizontal();
		
		this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
		
		if (this.isActivating()) {
			//가로 스크롤
			if (bH && oH.elScrollBar) {
				var nHeight = oBoxSize.nHeight;
				nHeight -= parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				this.setBoxSize(null, nHeight);
			}
			//세로 스크롤
			if (bV && oV.elScrollBar) {
				var nWidth = oBoxSize.nWidth;
				nWidth -= parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				this.setBoxSize(nWidth, null);
			}
	
			//가로, 세로스크롤 모두 없는 경우에 Box와 Content사이즈가 같게 설정
	//		//if (!bH && !bV) {
	//			//this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
	//		//}
		}
	},
	
	_adjustContentSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		var oBoxSize = this.getBoxSize();
		var bV = this.option("sOverflowY") != "hidden";
		var bH = this.option("sOverflowX") != "hidden";	
		var nWidth, nHeight;
		//가로, 세로스크롤 중 하나만 존재하는 경우에는 Content사이즈를 조절해 줌
		//세로 스크롤
		if (bV && !bH) {
			nWidth = oBoxSize.nWidth;
		}
		//가로 스크롤
		if (bH && !bV) {
			nHeight = oBoxSize.nHeight;
		}
		
		this.setContentSize(nWidth || Infinity, nHeight || Infinity);
	},

	_adjustThumbSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		if (!this.option("bAdjustThumbSize")) {
			return;
		}
		
		var nMinThumbSize = this.option("nMinThumbSize");
		if(typeof nMinThumbSize == "undefined"){
			nMinThumbSize = 50;
		}
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var nGap;

		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		if (oV.elScrollBar) {
					
			var oTrackSizeV = this.getTrackSize(oV);
			var nThumbHeight = Math.floor(parseInt(oTrackSizeV.nHeight * oBoxSize.nHeight / oContentSize.nHeight, 10));
			if(isNaN(nThumbHeight)){
				nThumbHeight = 0;
			}
			if (nThumbHeight < nMinThumbSize) {
				nThumbHeight = nMinThumbSize;
			}
			if (nThumbHeight >= oTrackSizeV.nHeight) {
				nThumbHeight = oTrackSizeV.nHeight;
			}
			jindo.$Element(oV.elThumb).height(nThumbHeight);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oV.elThumbHead) {
				nGap += jindo.$Element(oV.elThumbHead).height();
			}
			if(oV.elThumbFoot) {
				nGap += jindo.$Element(oV.elThumbFoot).height();
			}
			if(oV.elThumbBody) {
				jindo.$Element(oV.elThumbBody).height(nThumbHeight - nGap);
			}
		}
		
		if (oH.elScrollBar) {
			var oTrackSizeH = this.getTrackSize(oH);
			var nThumbWidth = Math.floor(parseInt(oTrackSizeH.nWidth * oBoxSize.nWidth / oContentSize.nWidth, 10));
			if(isNaN(nThumbWidth)){
				nThumbWidth = 0;
			}
			if (nThumbWidth < nMinThumbSize) {
				nThumbWidth = nMinThumbSize;
			}
			//max 값과 같은 경우
			if (nThumbWidth >= oTrackSizeH.nWidth) {
				nThumbWidth = oTrackSizeH.nWidth;
			}
			jindo.$Element(oH.elThumb).width(nThumbWidth);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oH.elThumbHead) {
				nGap += jindo.$Element(oH.elThumbHead).width();
			}
			if(oH.elThumbFoot) {
				nGap += jindo.$Element(oH.elThumbFoot).width();
			}
			if(oH.elThumbBody) {
				jindo.$Element(oH.elThumbBody).width(nThumbWidth - nGap);	
			}
		}
	},
	
	_autoToggleAvailability : function(){
		var sClassPrefix = this.option("sClassPrefix");
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		if (oH.elScrollBar) {
			//deactivate
			if (this.option("sOverflowX") == "scroll" && oBoxSize.nWidth >= oContentSize.nWidth) {
				jindo.$Element(oH.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("horizontal");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}	
			} else {
				jindo.$Element(oH.elScrollBar).removeClass(sClassPrefix + "disabled");
				
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("horizontal");
				}
			}	
		}
		
		if (oV.elScrollBar) {
			if (this.option("sOverflowY") == "scroll" && oBoxSize.nHeight >= oContentSize.nHeight) {
				jindo.$Element(oV.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("vertical");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}
			} else {
				jindo.$Element(oV.elScrollBar).removeClass(sClassPrefix + "disabled");
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("vertical");
				}
			}
		}
	}
}).extend(jindo.ScrollBar);/**
	@fileOverview 특정 영역안의 지정된 객체를 단일/다중 선택가능하게 하는 컴포넌트 
	@author senxation
	@version 1.14.0
**/
/**
	특정 영역안의 지정된 객체를 단일/다중 선택가능하게 하는 컴포넌트
	 
	@class jindo.SelectArea
	@extends jindo.UIComponent
	@keyword selectearea, 셀렉트에어리어, 선택, 단일, 다중, 영역
**/
jindo.SelectArea = jindo.$Class({
	/** @lends jindo.SelectArea.prototype */
	
	_waToggleCandidate : null,
	_waSelected : null,
	_aSizeInfo : null,
	
	/**
		@constructor
		@param {HTMLElement} el 기준 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="selectable"]
			@param {Object} [htOption.htStatus={sSelected:"sSelected"//선택되었을때}] 엘리먼트의 상태에 따라 추가되는 클래스명
			@param {Boolean} [htOption.bMultiSelection=true] 다중 선택 가능 여부
			@param {Boolean} [htOption.bDragSelect=true] 다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
			@param {Number} [htOption.nThreshold=5] 드래스 선택이 시작되기위한 최소 마우스이동거리
			@param {Boolean} [htOption.bDeselectAllOutside=true] 다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
			@param {Boolean} [htOption.bRemainOne=false] 단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
			@param {Boolean} [htOption.bToggleSelected=false] 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)
			@param {Boolean} [htOption.bActivateOnload=true] 초기화시 activate() 수행여부
		@example
			var oSelectArea = new jindo.SelectArea(jindo.$("select"), {
				bActivateOnload : true, //(Boolean) 초기화시 활성여부
				sClassName : "selectable", //(String) 셀렉트 가능한 엘리먼트에 지정된 클래스명
				htStatus : {
					sSelected : "selected" //(String) 셀렉트된 엘리먼트에 추가되는 클래스명
				},
				bMultiSelection : true, //다중 선택 가능 여부
				bDragSelect : true, //다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
				nThreshold : 5,
				bDeselectAllOutside : true, //다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
				bRemainOne : false, //단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
				bToggleSelected : false // 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)
			}).attach({
				selectStart : function(oCustomEvent) {
					//선택가능한 객체 위에서 마우스다운되었을때 발생
					//oCustomEvent = {
					//	vLastSelected : (Array || HTMLElement) 이전에 선택된 객체,
					//	elSelectable : (HTMLElement) 마우스다운된 선택가능한 객체,
					//	bWithinSelected : (Boolean) 이전에 선택된 객체들 중에서 선택이 시작되었는지 여부,
					//	weEvent : (jindo.$Event) mousedown 이벤트
					//}
				},
				beforeSelect : function(oCustomEvent) {
					//객체가 선택되기 전 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택될 객체,
					//	nIndex : (Number) 선택될 객체의 인덱스,
					//	bSelectedAgain : (Boolean) 이전 선택된 객체가 선택하려는 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					//}
				},
				select : function(oCustomEvent) {
					//객체가 선택된 후 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택된 객체,
					//	nIndex : (Number) 선택된 객체의 인덱스,
					//	bSelectedAgain : (Boolean) 이전 선택된 객체가 선택된 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					//}
				},
				beforeDeselect : function(oCustomEvent) {
					//객체가 선택해제되기 전 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택해제될 객체,
					//	nIndex : (Number) 선택해제될 객체의 인덱스
					//}
				},
				deselect : function(oCustomEvent) {
					//객체가 선택해제된 후 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택해제된 객체,
					//	nIndex : (Number) 선택해제된 객체의 인덱스
					//}
				},
				change : function(oCustomEvent) {
					//선택된 값이 이전 선택 값과 달라졌을 때 발생
				},
				selectEnd : function(oCustomEvent) {
					//선택이 종료되었을 때 발생
					//oCustomEvent = {
					//	vSelected : (Array || HTMLElement) 선택된 객체
					//}
				},
				dragStart : function(oCustomEvent) {
					//다중선택시 drag를 시작할 때 발생
				},
				dragSelecting : function(oCustomEvent) {
					//drag되어 설정된 선택영역안에 선택가능한 객체가 변경될때 발생 
					//oCustomEvent = { 
					//	aSelectable : (Array) 선택영역안에 포함된 객체
					//}
				},
				dragEnd : function(oCustomEvent) {
					//다중선택시 drag가 끝났을 때 발생
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el); 
		var htDefaultOption = {
			bActivateOnload : true, //(Boolean) 초기화시 활성여부
			sClassName : "selectable", //(String) 셀렉트 가능한 엘리먼트에 지정된 클래스명
			htStatus : {
				sSelected : "selected" //(String) 셀렉트된 엘리먼트에 추가되는 클래스명
			},
			bMultiSelection : true, //다중 선택 가능 여부
			bDragSelect : true, //다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
			nThreshold : 5,
			bDeselectAllOutside : true, //다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
			bRemainOne : false, //단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
			bToggleSelected : false // 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)   
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._waToggleCandidate = jindo.$A([]);
		this._waSelected = jindo.$A([]);
		this._sCtrl = (jindo.$Agent().os().mac) ? "meta" : "ctrl";
		this._welRectIndicator = null;
		this._wfDragStart = jindo.$Fn(this._onDragSelectStart, this);
		this._wfSelectStart = jindo.$Fn(this._onDragSelectStart, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		this._wfMouseUpWithinSelected = jindo.$Fn(this._onMouseUpWithinSelected, this);
		this._wfCompute = jindo.$Fn(this._computeSizeAndPos, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	/**
		기준 엘리먼트의 모든 셀렉트가능한 엘리먼트를 가져온다.
		
		@method getSelectableElement
		@return {Array}
	**/
	getSelectableElement : function() {
		return jindo.$$("." + this.option("sClassName"), this._el);
	},
	
	isSelectable : function(el) {
		return jindo.$Element(el).isChildOf(this._el) && jindo.$$.test(el, "." + this.option("sClassName"));
	},
	
	/**
		지정된 셀렉트가능한 엘리먼트가 전체 셀렉트가능한 엘리먼트중 몇번째 엘리먼트인지 가져온다.
		
		@method getIndex
		@param {HTMLElement} el 순서를 얻고자 하는 엘리먼트
		@return {Number} n
	**/
	getIndex : function(el) {
		return jindo.$A(this.getSelectableElement()).indexOf(el);
	},
	
	/**
		지정된 엘리먼트를 선택한다.
		
		@method select
		@param {Array || HTMLElement} a 선택할 엘리먼트 또는 배열
		@param {Boolean} bRemainSelected 이미 선택된 엘리먼트를 선택해제하지 않고 남겨둘지 여부 (디폴트는 단독으로 선택됨)
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
		@remark bMultiSelection 옵션이 false이면 bRemainSelected를 true로 지정하여도 기존 선택이 모두 해제된다.
	**/
	select : function(a, bRemainSelected, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bRemainSelected == "undefined") {
			bRemainSelected = false;
		}
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		
		if (!bRemainSelected || !this.option("bMultiSelection")) {
			this.deselectAll(false);
		}
		
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		
		var htStatus = this.option("htStatus");
		
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			var wel = jindo.$Element(el);
			
			var htCustomEvent = { 
				elSelectable : el,
				nIndex : this.getIndex(el),
				bSelectedAgain : (a.length === 1 && this._vLastSelected === a[0])
			};
			
			/**
				객체가 선택되기 전
				
				@event beforeSelect
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elSelectable 선택될 객체
				@param {Number} nIndex 선택될 객체의 인덱스
				@param {Boolean} bSelectedAgain 이전 선택된 객체가 선택하려는 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
				@param {Function} stop 수행시 객체가 선택되지 않음
				@example
					커스텀 이벤트 핸들링 예제
					oSelectArea.attach("beforeSelect", function(oCustomEvent) { ... });
			**/
			if (this.isSelectable(el) && !this.isSelected(el) && this.fireEvent("beforeSelect", htCustomEvent)) {
				
				htCustomEvent = { 
					elSelectable : el,
					nIndex : this.getIndex(el),
					bSelectedAgain : (a.length === 1 && this._vLastSelected === a[0])
				};
				
				wel.addClass(htStatus.sSelected);
				this._waSelected.push(el);
				/**
					객체가 선택된 후
					
					@event select
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elSelectable 선택된 객체
					@param {Number} nIndex 선택된 객체의 인덱스
					@param {Boolean} bSelectedAgain 이전 선택된 객체가 선택된 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					@example
						// 커스텀 이벤트 핸들링 예제
						oSelectArea.attach("select", function(oCustomEvent) { ... });
				**/
				this.fireEvent("select", htCustomEvent);
			}
		}
		
		if (bFireChangeEvent) {
			this._fireChangeEvent(aLastSelected);
		}
		
		return this;
	},
	
	/**
		지정된 엘리먼트를 선택해제한다.
		
		@method deselect
		@param {Array || HTMLElement} a 선택해제할 엘리먼트 또는 배열
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
	**/
	deselect : function(a, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		
		var htStatus = this.option("htStatus");
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			var wel = jindo.$Element(el);
			var htParam = { 
				elSelectable : el, 
				nIndex : this.getIndex(el) 
			};
			
			/**
				객체가 선택해제되기 전
				
				@event beforeDeselect
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elSelectable 선택해제될 객체
				@param {Number} nIndex 선택해제될 객체의 인덱스
				@param {Function} stop 수행시 객체가 선택해제되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("beforeDeselect", function(oCustomEvent) { ... });
			**/
			if (this.isSelectable(el) && this.isSelected(el) && this.fireEvent("beforeDeselect", htParam)) {
				wel.removeClass(htStatus.sSelected);
				this._waSelected = this._waSelected.refuse(el);
				/**
					객체가 선택해제된 후
					
					@event deselect
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elSelectable 선택해제된 객체
					@param {Number} nIndex 선택해제된 객체의 인덱스
					@example
						// 커스텀 이벤트 핸들링 예제
						oSelectArea.attach("deselect", function(oCustomEvent) { ... });
				**/
				this.fireEvent("deselect", htParam);
			}
		}
		
		if (bFireChangeEvent) {
			this._fireChangeEvent(aLastSelected);
		}
		
		return this;
	},
	
	/**
		모든 선택된 엘리먼트를 선택해제한다.
		
		@method deselectAll
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this}
	**/
	deselectAll : function(bFireChangeEvent) {
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		this.deselect(this.getSelected(), bFireChangeEvent);
		return this;
	},
	
	/**
		지정된 엘리먼트를 선택반전한다.
		
		@method toggle
		@param {Array || HTMLElement} a 선택해제할 엘리먼트 또는 배열
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
	**/
	toggle : function(a, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			if (!this.isSelected(el)) {
				this.select(el, true, bFireChangeEvent);
			} else {
				this.deselect(el, bFireChangeEvent);
			}
		}
		return this;
	},
	
	/**
		선택된 엘리먼트를 가져온다.
		
		@method getSelected
		@return {Array || HTMLElement}
		@remark 다중 선택된 경우 리턴되는 배열은 선택된 순서정보를 포함한다.
	**/
	getSelected : function() {
		if (this._waSelected.length() > 0) {
			return (this._waSelected.length() === 1) ? this._waSelected.get(0) : this._waSelected.$value();
		}
		return null;
	},
	
	/**
		지정된 엘리먼트의 선택여부를 리턴한다.
		
		@method isSelected
		@param {HTMLElement} el 선택 여부를 알고자 하는 엘리먼트
		@return {Boolean}
	**/
	isSelected : function(el) {
		return this._waSelected.has(el);
	},
	
	_getSelectableUntil : function(el) {
		var aReturn = el;
		var elFrom = this._elStartPoint;
		if (elFrom && this.isSelected(elFrom)) {
			var wa = jindo.$A(this.getSelectableElement());
			var nFrom = wa.indexOf(elFrom);
			var nTo = wa.indexOf(el);
			aReturn = wa.slice(Math.min(nFrom, nTo), Math.min(nFrom, nTo) + Math.abs(nFrom - nTo) + 1).$value();
		} 
		return aReturn;
	},
	
	_findSelectableElement : function(el) {
		var sClassName = this.option("sClassName");
		return (jindo.$$.test(el, "." + sClassName)) ? el : jindo.$$.getSingle("! ." +sClassName, el); 
	},
	
	_isChanged : function(aLastSelected) {
		var waLast = jindo.$A(aLastSelected),
			a = this._convertArray(this.getSelected());
			
		if (aLastSelected.length != a.length) {
			return true;
		}
		
		for (var i = 0; i < a.length; i++) {
			if (!waLast.has(a[i])) {
				return true;
			}
		}
		
		return false;
	},
	
	_fireChangeEvent : function(aLastSelected) {
		if (this._isChanged(aLastSelected)) {
			/**
				선택된 값이 이전 선택 값과 달라졌을 때 발생
				
				@event change
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("change", function(oCustomEvent) { ... });
			**/
			this.fireEvent("change");
		}
	},
	
	_convertArray : function(a) {
		if (!(a instanceof Array)) {
			if (a) {
				a = [a];
			} else {
				a = [];
			}
		}
		return a;
	},
	
	_onMouseDown : function(we) {
		var htKey = we.key();
		var htMouse = we.mouse(true);
		
		if (htMouse.scrollbar) { return; }
		
		var elSelectable = this._findSelectableElement(we.element);
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		this._vLastSelected = this.getSelected();
		this._waSelectable = jindo.$A(this.getSelectableElement());
		this._waLastSelected = jindo.$A(this._convertArray(this._vLastSelected));
		
		if (elSelectable) { //select
			var bWithinSelected = jindo.$A(this._convertArray(this._vLastSelected)).has(elSelectable);
			
			/**
				선택가능한 객체 위에서 마우스다운되었을때
				
				@event selectStart
				@param {String} sType 커스텀 이벤트명
				@param {Array || HTMLElement} vLastSelected 이전에 선택된 객체
				@param {HTMLElement} elSelectable 마우스다운된 선택가능한 객체
				@param {Boolean} bWithinSelected 이전에 선택된 객체들 중에서 선택이 시작되었는지 여부
				@param {jindo.$Event} weEvent mousedown 이벤트
				@param {Function} stop 수행시 선택이 시작되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("selectStart", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("selectStart", {
				vLastSelected : this._vLastSelected,
				elSelectable : elSelectable,
				bWithinSelected : bWithinSelected,
				weEvent : we
			})) {
				if (bWithinSelected && !htKey.shift && !htKey[this._sCtrl]) {
					this._elWaitMouseUp = elSelectable;
					this._wfMouseUpWithinSelected.attach(this._elWaitMouseUp, "mouseup");
				} else {
					var bRemainSelected = false;
					if (this.option("bMultiSelection")) {
						if (htKey.shift) {
							if (htKey[this._sCtrl]) {
								bRemainSelected = true;
							}
							var aSelectable = this._getSelectableUntil(elSelectable);
							if (aSelectable == elSelectable) {
								this._elStartPoint = elSelectable;	
							}
							this.select(aSelectable, bRemainSelected, false);
						} else {
							this._elStartPoint = elSelectable;
							if (htKey[this._sCtrl]) {
								this.toggle(elSelectable, false);
							} else {
								this.select(elSelectable, bRemainSelected, false);
							}
						} 
					} else {
						if (!this.option("bRemainOne") && this.option("bToggleSelected") && this.getSelected() == elSelectable) { //when trying select selected by itself
							this.deselect(elSelectable, false);
						} else {
							this.select(elSelectable, bRemainSelected, false);
						}
					}
					
					this._fireChangeEvent(aLastSelected);
					/**
						선택이 종료되었을 때
						
						@event selectEnd
						@param {String} sType 커스텀 이벤트명
						@param {Array || HTMLElement} vSelected 선택된 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oSelectArea.attach("selectEnd", function(oCustomEvent) { ... });
					**/
					this.fireEvent("selectEnd", {
						vSelected : this.getSelected()
					});
				}
			}
		} else { //drag
			this._wfMouseUp.attach(document, "mouseup");
			this._wfCompute.attach(window, "resize").attach(this._el, "scroll");
			
			if (this.option("bMultiSelection") && this.option("bDragSelect")) {
				this._bOverThreshold = null;
				this._htDragStartPos = we.pos();
				this._htDragStartPos.scrollTop = this._el.scrollTop;
				this._htDragStartPos.scrollLeft = this._el.scrollLeft;
				this._wfMouseMove.attach(document, "mousemove");
			}
		}
	},
	
	_onDragSelectStart : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
	},
	
	_getRectangleElement : function() {
		if (!this._welRectIndicator && this.option("bMultiSelection") && this.option("bDragSelect")) {
			this._welRectIndicator = jindo.$Element(jindo.$('<div style="position:absolute;left:-10px;top:-10px;width:1px;height:1px;margin:0;padding:0;border:1px dotted black;z-index:99999;">'));
			this._welRectIndicator.appendTo(this._el);
		} 
		return this._welRectIndicator;
	},
	
	/**
		드래그 선택시 보여지는 사각 선택영역 엘리먼트를 가져온다.
		
		@method getRectangleElement
		@return {HTMLElement} 
	**/
	getRectangleElement : function() {
		return this._getRectangleElement().$value();
	},
	
	_computeSizeAndPos : function() {
		var aSizeInfo = this._aSizeInfo = [];
			
		jindo.$A(this.getSelectableElement()).forEach(function(el){
			aSizeInfo.push([
				el, el.offsetLeft, el.offsetTop, el.offsetLeft + el.offsetWidth, el.offsetTop + el.offsetHeight
			]);
		});
	},
	
	_onMouseMove : function(we) {
		this._htDragEndPos = we.pos();
		var welRect = this._getRectangleElement(), elRect = welRect.$value();
		var nGapX = this._htDragEndPos.pageX - this._htDragStartPos.pageX;
		var nGapY = this._htDragEndPos.pageY - this._htDragStartPos.pageY;
		var nX = this._htDragStartPos.layerX;
		var nY = this._htDragStartPos.layerY;
		
		var nThreshold = this.option("nThreshold");
		if (nThreshold && !this._bOverThreshold) {
			var nDistance = Math.sqrt(nGapX * nGapX + nGapY * nGapY);
			
			if (nThreshold > nDistance){
				return;
			}
			
			/**
				다중선택시 drag를 시작할 때
				
				@event dragStart
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragStart", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragStart");
			this._bOverThreshold = true;
			this._computeSizeAndPos();
			this._nRectX = nX;
			this._nRectY = nY;
			this._nDragDirectionX = 1;
			this._nDragDirectionY = 1;
			welRect.offset(nY, nX);
			
			if (!we.key()[this._sCtrl]) {
				this.deselectAll(false);
			} 
		}
		var nWidth = nGapX;
		var nHeight = nGapY;
		this._placeRect(nX, nY, nWidth, nHeight);
		
		this._setToggleCandidate(this._getSelectableByRect([elRect, elRect.offsetLeft, elRect.offsetTop, elRect.offsetLeft + elRect.offsetWidth, elRect.offsetTop + elRect.offsetHeight]));
	},
	
	_placeRect : function(nX, nY, nWidth, nHeight) {
		var welRect = this._getRectangleElement();
		welRect.show();
		this._nDragDirectionX = (nX > this._nRectX ) ? 1 : -1;
		this._nDragDirectionY = (nY > this._nRectY ) ? 1 : -1;
	
		nWidth -= ((this._el.scrollLeft - this._htDragStartPos.scrollLeft) * this._nDragDirectionX);
		nHeight -= ((this._el.scrollTop - this._htDragStartPos.scrollTop) * this._nDragDirectionY);

		welRect.width(Math.max(Math.abs(nWidth), 2)).height(Math.max(Math.abs(nHeight), 2));
		
		nX += Math.min(nWidth, 0);
		nY += Math.min(nHeight, 0);
		welRect.css("left", nX + "px").css("top", nY + "px");
	},
	
	_getSelectableByRect : function(aRect) { //[welRect.$value(), nX, nY, nX + nWidth, nY + nHeight]
		var aReturn = [];
		
		jindo.$A(this._aSizeInfo).forEach(function(aSelectable){
			if (aSelectable[1] < aRect[3] && aSelectable[3] > aRect[1] && aSelectable[2] < aRect[4] && aSelectable[4] > aRect[2]) {
				aReturn.push(aSelectable[0]);
				jindo.$A.Continue();
			}
		});
		
		return aReturn;
	},
	
	_setToggleCandidate : function(a) {
		a = this._convertArray(a);

		var bChanged = false;
		if (this._waToggleCandidate.length() != a.length) {
			bChanged = true;
		}
		
		var htStatus = this.option("htStatus");
		
		//clear
		var wa = jindo.$A(a);
		var waRemove = jindo.$A([]);
		this._waToggleCandidate.forEach(function(el, i){
			if (!wa.has(el)) {
				waRemove.push(el);
				bChanged = true;
			}
		});
		
		//dragSelecting
		if (bChanged) {
			waRemove.forEach(function(el){
				this._waToggleCandidate = this._waToggleCandidate.refuse(el);
				jindo.$Element(el).toggleClass(htStatus.sSelected);
			}, this);
			
			wa.forEach(function(el){
				if (this.isSelected(el)) {
					jindo.$Element(el).removeClass(htStatus.sSelected);
				} else {
					jindo.$Element(el).addClass(htStatus.sSelected);	
				}
			}, this);
			
			this._waToggleCandidate = jindo.$A(this._waToggleCandidate.$value().concat(a)).unique();
			/**
				drag되어 설정된 선택영역안에 선택가능한 객체가 변경될때 발생
				
				@event dragSelecting
				@param {String} sType 커스텀 이벤트명
				@param {Array} aSelectable 선택영역안에 포함된 객체
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragSelecting", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragSelecting", { aSelectable : this._waToggleCandidate.$value() });
		}
	},
	
	_onMouseUp : function(we) {
		var bDeselectAll = (!this.isDragging() && !we.key()[this._sCtrl] && (!this.option("bRemainOne") && this.option("bDeselectAllOutside"))),
			bHasCandidate = this._waToggleCandidate.length(),
			aLastSelected = this._convertArray(this.getSelected()).concat();
		
		if (bDeselectAll) {
			this.deselectAll(false);
		}
		if (bHasCandidate) {
			this._elStartPoint = this._waToggleCandidate.$value()[0];
			this.toggle(this._waToggleCandidate.$value());
		}
		this._fireChangeEvent(aLastSelected);
		
		this._stopDragging();
	},
	
	/**
		이미 선택된 엘리먼트내에서 클릭하여 선택하려고할때 mouseup이전에 이 메서드가 호출되면 선택되지 않는다.
		
		@method stopSelecting
		@remark 다중선택시 이미 선택된 엘리먼트내에서 선택하려고하는 경우에는 mouseup시에 선택이 되게 된다.
		@return {this}
	**/
	stopSelecting : function() {
		this._wfMouseUpWithinSelected.detach(this._elWaitMouseUp, "mouseup");
		return this;
	},
	
	/**
		셀렉트를 위해 드래그되고 있는지 여부를 가져온다.
		
		@method isDragging
		@return {Boolean}
	**/
	isDragging : function() {
		return this._bOverThreshold;
	},
	
	_restore : function() {
		jindo.$ElementList(this._waToggleCandidate.$value()).removeClass(this.option("htStatus").sSelected);
		this.deselectAll(false);
		if (this._waLastSelected.$value().length) {
			this.select(this._waLastSelected.$value(), false, false);
		}
	},
	
	_stopDragging : function() {
		this._waToggleCandidate.empty();
		this._htDragStartPos = null;
		this._htDragEndPos = null;
		this._wfMouseMove.detach(document, "mousemove");
		this._wfMouseUp.detach(document, "mouseup");
		this._wfCompute.detach(window, "resize").detach(this._el, "scroll");
		
		if (this.isDragging()) {
			this._bOverThreshold = null;
			this._getRectangleElement().hide();
			/**
				다중선택시 drag가 끝났을 때
				
				@event dragEnd
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragEnd", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragEnd");
		}
	},
	
	/**
		셀렉트를 위한 drag를 중단한다.
		드래그 이전에 선택되어있던 상태로 복귀된다.
		
		@method stopDragging
		@return {this}
	**/
	stopDragging : function() {
		if (this.isDragging()) {
			this._restore();
			this._stopDragging();
		}
		return this;
	},
	
	_onMouseUpWithinSelected : function(we) {
		this.stopSelecting();
		
		var elSelectable = this._findSelectableElement(we.element);
		if (elSelectable && elSelectable == we.currentElement) {
			this.deselectAll(false);
			this.select(elSelectable, false, true);
		}
	},
	
	_onActivate : function() {
		this._sMozUserSelect = this._wel.css("MozUserSelect");
		this._wel.css("MozUserSelect", "none");
		
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(true);
		this._wfMouseDown.attach(this._el, "mousedown");
		this._wfDragStart.attach(this._el, "dragstart");
		this._wfSelectStart.attach(this._el, 'selectstart');
	},
	
	_onDeactivate : function() {
		this._wel.css("MozUserSelect", this._sMozUserSelect || '');
		
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(false);
		this._wfMouseDown.detach(this._el, "mousedown");
		this._wfDragStart.detach(this._el, "dragstart");
		this._wfSelectStart.detach(this._el, 'selectstart');
	}
	
}).extend(jindo.UIComponent);
/**
    @fileOverview 셀렉트박스의 디자인을 대체하기 위한 HTML Component
    @version 1.14.0
**/
/**
    HTML Select 엘리먼트를 대체하여 디자인을 적용하는 컴포넌트
    
    @class jindo.SelectBox
    @extends jindo.HTMLComponent
    @uses jindo.Timer
    @uses jindo.LayerManager
    @uses jindo.LayerPosition
    @uses jindo.RolloverClick
    @keyword selectbox, 셀렉트박스
**/
jindo.SelectBox = jindo.$Class({
    /** @lends jindo.SelectBox.prototype */
    sTagName : 'select',
    
    _bDisabled : false, 
    _sPrevValue : null, //select의 이전 값
    _nSelectedIndex : 0, //선택된 index
    //_bRealFocused : false, //탭키 이동으로 실제로 포커스되었는지의 여부
    
    /**
        SelectBox 컴포넌트를 초기화한다.
        
        @constructor
        @param {HTMLElement} el 기준엘리먼트
        @param {Object} [htOption] 옵션 객체
            @param {String} [htOption.sClassPrefix="selectbox-"] Default Class Prefix. 컴포넌트에 의해 처리되는 클래스명의 앞에 붙을 접두어.
            @param {Number} [htOption.nWidth=null] 가로 사이즈, null시 자동
            @param {Number} [htOption.nHeight=null] 목록의 최대 높이. 지정한 값보다 커지면 스크롤 생김, null시 자동
            @param {Boolean} [htOption.bUseLayerPosition=true] LayerPosition 컴포넌트로 위치 설정할지 여부. true지정시 layer엘리먼트가 document.body로 append된다.
            @param {Array} [htOption.aOptionHTML=[]] 목록에서 option 내부에 html을 적용하고 싶을 경우 option 엘리먼트의 개수에 맞게 값을 설정한다. 배열의 각 요소는 html 문자열형태이어야한다. null 값 지정시 option 엘리먼트에 지정된 text명과 동일하게 표현된다.
            @param {Array} [htOption.aOptionLabel=[]] aOptionHTML이 설정된 option이 선택된 경우에 레이블영역에 보여질 html내용. 배열의 각 요소는 문자열형태이어야한다. null 값 지정시 aOptionHTML과 동일하게 표현된다.
            @param {Object} [htOption.LayerPosition] 목록 레이어의 위치조절을 위한 jindo.LayerPosition 컴포넌트에 적용될 옵션
            @param {Object} [htOption.LayerManager] 목록 레이어의 노출조절을 위한 jindo.LayerManager 컴포넌트에 적용될 옵션
        @example
            var oSelectBox = new jindo.SelectBox(jindo.$("select"), {
            aOptionHTML : [
                null,
                "<div>a</div>",
                "<div><input type='text'></div>"
            ]});
        @example
            var oSelectBox = new jindo.SelectBox(jindo.$("select"), {
            aOptionHTML : [
                null,
                "<div>a</div>",
                "<div><input type='text'></div>"
                ],
            aOptionLabel : [
                null,
                null,
                "직접입력"
            ]});
    **/
    $init : function(el, htOption) {
        this._aItemData = [];
        this._aListItem = [];
        this._aOptions = [];
        
        this.option({
            sClassPrefix : 'selectbox-', //Default Class Prefix
            nWidth : null,
            nHeight : null,
            bUseLayerPosition : true, //LayerPosition 컴포넌트로 위치 설정할지 여부
            aOptionHTML : [],
            aOptionLabel : [],
            LayerPosition : { //LayerPosition 컴포넌트에서 사용할 옵션
                sPosition : "outside-bottom", //목록의 위치. LayerPosition 컴포넌트에서 사용할 옵션
                sAlign : "left", //목록의 정렬. LayerPosition 컴포넌트에서 사용할 옵션
                nTop : 0, //선택박스와 목록의 상하 간격. LayerPosition 컴포넌트에서 사용할 옵션
                nLeft : 0 //선택박스와 목록의 좌우 간격. LayerPosition 컴포넌트에서 사용할 옵션
            },
            LayerManager : {
                sCheckEvent : "mousedown", // {String} 어떤 이벤트가 발생했을 때 레이어를 닫아야 하는지 설정
                nShowDelay : 20, //{Number} 보여주도록 명령을 한 뒤 얼마 이후에 실제로 보여질지 지연시간 지정 (ms)
                nHideDelay : 0 //{Number} 숨기도록 명령을 한 뒤 얼마 이후에 실제로 숨겨지게 할지 지연시간 지정 (ms)
            }
        });
        this.option(htOption || {});

        this._el = jindo.$(el);
        this._assignHTMLElements(); //컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
        if(this.option("bUseLayerPosition")) {
            this._initLayerPosition();
        }
        this._initLayerManager();
        this._initRolloverClick();
        this._oTimer = new jindo.Timer();
        this._wfOnFocusSelect = jindo.$Fn(this._onFocusSelect, this);
        this._wfOnBlurSelect = jindo.$Fn(this._onBlurSelect, this);
        this._wfOnMouseDownBox = jindo.$Fn(this._onMouseDownBox, this);
        this._wfOnMouseDownList = jindo.$Fn(this._onMouseDownList, this);
        
        this._wfOnKeyDown = jindo.$Fn(this._onKeyDown, this);
        this._wfOnMouseWheel = jindo.$Fn(function(e){
            e.stop(jindo.$Event.CANCEL_DEFAULT);
            this._elLayer.scrollTop -= e.mouse().delta * 16;
        }, this); //ie6 에서 셀렉트박스에서 스크롤할 경우 선택 값이 바뀌는 것을 방지하고 직접스크롤시키도록 수정

        var self = this;
        
        this._wfOnMouseWheelOnBody = jindo.$Fn(function() {
            if (self.option("bUseLayerPosition")) {
                setTimeout(function() { self.getLayerPosition().setPosition(); }, 0);
            }
        }, this);
        
        this._oAgent = jindo.$Agent(); 
        this.activate(); //컴포넌트를 활성화한다.
    },

    /**
        컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
    **/
    _assignHTMLElements : function() {
        var sPrefix = this.option("sClassPrefix"),
            el = this._el;
            
        this._wel = jindo.$Element(el);
        this._elSelect  = jindo.$$.getSingle('select.' + sPrefix + 'source', el);
        this._sSelectInnerHTML = this._elSelect.innerHTML; //초기의 innerHtml을 구함
        this._elOptionDefault = jindo.$$.getSingle('option.' + sPrefix + 'default', el);
        this._elSelectOptionGroup   = jindo.$$.getSingle('select.' + sPrefix + 'source-option-group', el);
        this._elBox     = jindo.$$.getSingle('.' + sPrefix + 'box', el);
        this._elLabel   = jindo.$$.getSingle('.' + sPrefix + 'label', el);
        this._elLayer   = jindo.$$.getSingle('.' + sPrefix + 'layer', el);
        this._elList    = jindo.$$.getSingle('.' + sPrefix + 'list', el);
        this._elList.innerHTML = "";
        this._elSelectList  = jindo.$('<ul>');
        this._elList.insertBefore(this._elSelectList, this._elList.firstChild);
    },
    
    /**
        select 엘리먼트를 가져온다.
        
        @method getSelectElement
        @return {HTMLElement} 
    **/
    getSelectElement : function() {
        return this._elSelect;
    },
    
    /**
        box 엘리먼트(클래스명 "box")를 가져온다.
        
        @method getBoxElement
        @return {HTMLElement} 
    **/
    getBoxElement : function() {
        return this._elBox;
    },
    
    /**
        label 엘리먼트(클래스명 "label")를 가져온다.
        
        @method getLabelElement
        @return {HTMLElement} 
    **/
    getLabelElement : function() {
        return this._elLabel;
    },
    
    /**
        layer 엘리먼트(클래스명 "layer")를 가져온다.
        
        @method getLayerElement
        @return {HTMLElement} 
    **/
    getLayerElement : function() {
        return this._elLayer;
    },
    
    /**
        list 엘리먼트(클래스명 "list")를 가져온다.
        
        @method getListElement
        @return {HTMLElement} 
    **/
    getListElement : function() {
        return this._elList;
    },
    
    /**
        list 엘리먼트 내부의 실제 목록 ul 엘리먼트를 가져온다.
        
        @method getSelectListElement
        @return {HTMLElement} 
    **/
    getSelectListElement : function() {
        return this._elSelectList;
    },
    
    _limitWidth : function() {
        var nWidth = this.option("nWidth");
        if (nWidth) {
            jindo.$Element(this.getBoxElement()).css({
                "width": nWidth + "px",
                "overflowX": "hidden"
            });
            jindo.$Element(this.getLayerElement()).css({
                "width": nWidth + "px",
                "overflowX": "hidden",
                "overflowY": "auto"
            });
        }
    },
    
    _limitHeight : function() {
        var nHeight = this.option("nHeight");
        if (nHeight) {
            var welLayer = jindo.$Element(this.getLayerElement()),
                elToMeasure = welLayer.$value().cloneNode(true),
                welToMeasure = jindo.$Element(elToMeasure),
                nLayerHeight;
                
            welToMeasure.opacity(0);
            welLayer.after(welToMeasure);
            welToMeasure.show();
            
            //layer size
            nLayerHeight = welToMeasure.height();
            welToMeasure.leave();
            
            if (nHeight < nLayerHeight) { //높이값 제한
                welLayer.css({
                    "height": nHeight + "px",
                    "overflowX": "hidden",
                    "overflowY": "auto"
                });
            }
        }
    },
    
    _initLayerManager : function() {
        var self = this,
            sPrefix = this.option("sClassPrefix"),
            elSelect = this.getSelectElement();
            
        this._oLayerManager = new jindo.LayerManager(this.getLayerElement(), this.option("LayerManager")).attach({
            beforeShow : function(oCustomEvent) {
                /**
                    레이어가 열리기 직전 발생
                    
                    @event open
                    @param {String} sType 커스텀 이벤트명
                    @param {Function} stop 레이어가 열리지 않게 하기위해 호출하는 메서드
                    @example
                        // open 커스텀 이벤트 핸들링
                        oSelectBox.attach("open", function(oCustomEvent) { ... });
                    @example
                        // 레이어가 열리지 않도록 처리
                        oSelectBox.attach("open", function(oCustomEvent) {
                            oCustomEvent.stop();
                        });
                **/
                if(self.fireEvent("open")) {
                    self._limitWidth();
                    self._limitHeight();
                    
                    setTimeout(function(){ //focus때문에 delay
                        try { elSelect.focus(); } catch(e) {}
                    }, 10);
                    self._wel.addClass(sPrefix + 'open');
                    
                    if (self.option("bUseLayerPosition")) {
                        self.getLayerPosition().setPosition(); //레이어가 항상보이도록 포지셔닝을 LayerPosition에 위임
                    }
                } else {
                    oCustomEvent.stop();
                }
            },
            show : function(oCustomEvent) {
                self._paintSelected();
            },
            beforeHide : function(oCustomEvent) {
                /**
                    레이어가 닫히기 직전 발생
                    
                    @event close
                    @param {String} sType 커스텀 이벤트명
                    @param {Function} stop 레이어가 닫히지 않게 하기위해 호출하는 메서드
                    @example
                        // close 커스텀 이벤트 핸들링
                        oSelectBox.attach("close", function(oCustomEvent) { ... });
                    @example
                        // 레이어가 닫히지 않도록 처리
                        oSelectBox.attach("open", function(oCustomEvent) {
                            oCustomEvent.stop();
                        });
                **/
                if(self.fireEvent("close")) {
                    self._wel.removeClass(sPrefix + 'open');
                    // .removeClass(sPrefix + 'focused');
                    // setTimeout(function(){ //focus때문에 delay
                        // try { self.getSelectElement().blur(); } catch(e) {}
                    // }, 10);
                } else {
                    oCustomEvent.stop();
                    // setTimeout(function(){ //focus때문에 delay
                        // try { elSelect.focus(); } catch(e) {}
                    // }, 10);
                }
            }
        }).link(this.getBoxElement()).link(this.getLayerElement());
    },
    
    /**
        LayerManager 객체를 가져온다.
        
        @method getLayerManager
        @return {jindo.LayerManager}
    **/
    getLayerManager : function() {
        return this._oLayerManager;
    },
    
    _initRolloverClick : function() {
        var self = this,
            sPrefix = this.option("sClassPrefix");
        
        this._oRolloverClick = new jindo.RolloverClick(this.getSelectListElement(), {
            sCheckEvent : "mouseup",
            RolloverArea : {
                sClassName : sPrefix + "item",
                sClassPrefix : sPrefix + "item-"  
            }
        }).attach({
            over : function(oCustomEvent) {
                if (self._welOvered) {
                    self._welOvered.removeClass(sPrefix + "item-over"); 
                }
                var wel = jindo.$Element(oCustomEvent.element);
                wel.addClass(sPrefix + "item-over");
                self._welOvered = wel;
            },
            out : function(oCustomEvent) {
                oCustomEvent.stop();
            },
            click : function(oCustomEvent) {
                
                var nLastSelectedIndex = self._nSelectedIndex;
                var nSelectedIndex = -1;
                
                jindo.$A(self._aItemData).forEach(function(htData, nIndex){
                    if (htData.elItem === oCustomEvent.element) {
                        nSelectedIndex = nIndex;
                        jindo.$A.Break();
                    }
                });
                
                // click 이벤트 핸들러에서 stop 한경우 선택되지 않도록
                /**
                    아이템을 클릭하면 발생
                    
                    @event click
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nIndex 클릭한 옵션의 인덱스
                    @param {jindo.$Event} weEvent click 이벤트 객체
                    @param {Function} stop 아이템이 선택되지 않도록 하기위해 호출하는 메서드
                    @example
                        // click 커스텀 이벤트 핸들링
                        oSelectBox.attach("click", function(oCustomEvent) { ... });
                    @example
                        // 선택이 되지 않도록 처리
                        oSelectBox.attach("click", function(oCustomEvent) {
                            oCustomEvent.stop();
                        });
                **/
                if (!self.fireEvent("click", {
                    nIndex : nSelectedIndex,
                    weEvent : oCustomEvent.weEvent
                })) {
                    return;
                }
                
                if (nSelectedIndex !== -1) {
                    self.setValue(self._aItemData[nSelectedIndex].sValue);
                }
                
                nSelectedIndex = self.getSelectedIndex();
                
                if (nSelectedIndex != nLastSelectedIndex) {
                    jindo.$Element(self.getSelectElement()).fireEvent("change"); //이미 선언된 select의 onchange핸들러 수행을 위해 이벤트 트리거링
                    self.fireEvent("change", { 
                        nIndex : nSelectedIndex, 
                        nLastIndex : nLastSelectedIndex 
                    }); 
                }
                
                if (!jindo.$Element(oCustomEvent.element).hasClass(sPrefix + "notclose")) {
                    self.getLayerManager().hide(); //선택이 제대로 이뤄졌을 경우에 hide
                } 
            }
        });
    },
    
    /**
        RolloverClick 객체를 가져온다.
        
        @method getRolloverClick
        @return {jindo.RolloverClick}
    **/
    getRolloverClick : function() {
        return this._oRolloverClick;
    },
    
    _initLayerPosition : function() {
        this._oLayerPosition = new jindo.LayerPosition(this.getBoxElement(), this.getLayerElement(), this.option("LayerPosition"));
    },
    
    /**
        LayerPosition 객체를 가져온다.
        
        @method getLayerPosition
        @return {jindo.LayerPosition}
    **/
    getLayerPosition : function() {
        return this._oLayerPosition;
    },

    /**
        컴포넌트를 활성화한다.
    **/
    _onActivate : function() {
        // this.$super._onActivate();
        jindo.HTMLComponent.prototype._onActivate.apply(this);

        var sPrefix = this.option("sClassPrefix"),
            elSelect = this.getSelectElement();
        
        this._limitWidth(); 
        this._wel.removeClass(sPrefix + "noscript");
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this.getListElement()).preventTapHighlight(true);
        this._wfOnFocusSelect.attach(elSelect, "focus");
        this._wfOnBlurSelect.attach(elSelect, "blur");
        this._wfOnMouseDownBox.attach(this.getBoxElement(), "mousedown");
        this._wfOnMouseDownList.attach(this.getListElement(), "mousedown");
        this._wfOnKeyDown.attach(elSelect, "keydown");
        this._wfOnMouseWheel.attach(elSelect, "mousewheel");
        this._wfOnMouseWheelOnBody.attach(document, "mousewheel"); 
        
        this.paint();
        this._sPrevValue = this.getValue();
    },
    
    /**
        컴포넌트를 비활성화한다.
    **/
    _onDeactivate : function() {
        this.getLayerManager().hide();
        var sPrefix = this.option("sClassPrefix"),
            elSelect = this.getSelectElement();
            
        this._wel.addClass(sPrefix + "noscript");
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this.getListElement()).preventTapHighlight(false);
        this._wfOnFocusSelect.detach(elSelect, "focus");
        this._wfOnBlurSelect.detach(elSelect, "blur");
        this._wfOnMouseDownBox.detach(this.getBoxElement(), "mousedown");
        this._wfOnMouseDownList.detach(this.getListElement(), "mousedown");
        this._wfOnKeyDown.detach(elSelect, "keydown");
        this._wfOnMouseWheel.detach(elSelect, "mousewheel");
        this._wfOnMouseWheelOnBody.detach(document, "mousewheel"); 

        // this.$super._onDeactivate();
        jindo.HTMLComponent.prototype._onDeactivate.apply(this);
    },
    
    /**
        text 값에 대한 option의 value를 가져온다.
        
        @method getValueOf
        @param {String} sText text 값
        @return {String}
    **/
    getValueOf : function (sText) {
        for (var i = 0, oItemData; (oItemData = this._aItemData[i]); i++) {
            if (oItemData.sText == sText) {
                return oItemData.sValue;
            }
        }
        return null;
    },
    
    /**
        Select의 value를 가져온다.
        
        @method getValue
        @return {String}
    **/
    getValue : function() {
        var eEle = this.getSelectElement();
        return eEle.selectedIndex === -1 ? '' : eEle.options[eEle.selectedIndex].value;
    },
    
    /**
        Select의 text를 가져온다.
        
        @method getText
        @return {String}
    **/
    getText : function() {
        var oData = this._aItemData[this._nSelectedIndex];
        return oData && oData.sText || '';
    },
    
    /**
        Select의 html를 가져온다.
        옵션의 aOptionHTML을 설정한 경우에 리턴 값을 가진다.
        
        @method getHTML
        @return {String}
    **/
    getHTML : function() {
        return this.getLabelElement().innerHTML;
    },
    
    /**
        SelectBox의 value를 설정한다.
        
        @method setValue
        @param {String} sValue 
    **/
    setValue : function(sValue) {
        this.getSelectElement().value = sValue;
        this._sPrevValue = this.getValue();
        this._paint();
    },

    /**
        선택된 index를 가져온다.
        
        @method getSelectedIndex
        @return {Number}
    **/
    getSelectedIndex : function() {
        return this.getSelectElement().selectedIndex;
    },

    /**
        nIndex번째 옵션을 선택한다.
        disabled 된것에 대해 처리한다.
        
        @method setSelectedIndex
        @param {Object} nIndex 선택할 옵션의 순서 (0부터 시작)
    **/
    setSelectedIndex : function(nIndex, bFireEvent) {
        if (typeof bFireEvent == "undefined") {
            bFireEvent = true;
        }
        
        if (this._isSelectable(nIndex)) {
            var nLastSelectedIndex = this.getSelectedIndex();
            this._setSelectedIndex(nIndex);
            this._paint();
            
            if (bFireEvent && nLastSelectedIndex != nIndex) {
                this.fireEvent("change", { nIndex : nIndex, nLastIndex : nLastSelectedIndex }); 
            }
            return true;
        }
        return false;
    },
    
    _setSelectedIndex : function(nIndex) {
        this.getSelectElement().selectedIndex = nIndex; //선택된 index는 이메서드를 그릴때 정의
    },
    
    _isSelectable : function(nIndex) {
        var htItem = this._aItemData[nIndex];
        if (!htItem || htItem.bDisabled || htItem.bDefault) {
            return false;
        } else {
            return true;
        }
    },

    /**
        Select의 option 엘리먼트들을 가져온다.
        
        @method getOptions
        @return {Array}
    **/
    getOptions : function() {
        return this._aOptions;
    },
    
    /**
        List내의 아이템 엘리먼트(li)들을 가져온다.
        
        @method getListItems
        @return {Array}
    **/
    getListItems : function() {
        return this._aListItem;
    },
    
    /**
        셀렉트박스가 disabled 되었는지 여부를 가져온다.
        
        @method getDisabled
    **/
    getDisabled : function() {
        return this._bDisabled;
    },
    
    /**
        보여질 옵션 그룹을 설정한다.
        source 엘리먼트 내에 &lt;option class="selectbox-default"&gt; 엘리먼트가 선언되어있어야한다.
        옵션 그룹을 설정하기 위해 기본으로 설정된 source-option-group 셀렉트 엘리먼트가 선언되어있어야한다. 
        option 중 지정된 옵션 그룹명(option-group-그룹명)을 가진 엘리먼트만 보여진다.
        
        @method setOptionGroup
        @param {String} sName 옵션 그룹 명
        @return {Boolean} 설정 완료 여부
        @example
            <!-- 수행 전 구조 -->
            <div>
                <select class="selectbox-source">
                    <option value="0" class="selectbox-default">팀을 선택하세요</option>
                </select>
                <select class="selectbox-source-option-group"> <!--옵션 그룹을 설정하기 위한 보이지 않는 select-->
                    <option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
                    <option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
                    <option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
                    <option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
                    <option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
                    <option value="5" class="selectbox-option-group-1">SPSUI TF</option>
                    <option value="6" class="selectbox-option-group-2">플래시UI1팀</option> 
                    <option value="7" class="selectbox-option-group-2">플래시UI2팀</option>
                    <option disabled="disabled" class="selectbox-option-group-2">----------------------</option>
                    <option value="8" class="selectbox-option-group-2">RIA기술팀</option>
                    <option value="9" class="selectbox-option-group-3">UI기술기획팀</option>
                    <option value="10" class="selectbox-option-group-3">웹표준화팀</option>
                    <option value="11" class="selectbox-option-group-3">오픈UI기술팀</option>
                    <option value="12" class="selectbox-option-group-3">인터널서비스</option>
                </select>
                <div class="selectbox-box">
                    <div class="selectbox-label">팀을 선택하세요</div>
                </div>
                <div class="selectbox-layer">
                    <div class="selectbox-list"><ul style="height: auto;"/></div>
                </div>
            </div>
            
            setOptionGroup("1")
            
            <!-- 수행 후 구조 -->
            <div>
                <select class="selectbox-source">
                    <option value="0" class="selectbox-default">팀을 선택하세요</option>
                    <option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
                    <option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
                    <option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
                    <option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
                    <option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
                    <option value="5" class="selectbox-option-group-1">SPSUI TF</option>
                </select>
                <select class="selectbox-source-option-group"> <!--옵션 그룹을 설정하기 위한 보이지 않는 select-->
                    <option value="1" class="selectbox-option-group-1">Ajax UI1팀</option>
                    <option value="2" class="selectbox-option-group-1">Ajax UI2팀</option>
                    <option value="3" class="selectbox-option-group-1">Ajax UI3팀</option>
                    <option value="4" class="selectbox-option-group-1">Ajax UI4팀</option>
                    <option disabled="disabled" class="selectbox-option-group-1">----------------------</option>
                    <option value="5" class="selectbox-option-group-1">SPSUI TF</option>
                    <option value="6" class="selectbox-option-group-2">플래시UI1팀</option> 
                    <option value="7" class="selectbox-option-group-2">플래시UI2팀</option>
                    <option disabled="disabled" class="selectbox-option-group-2">----------------------</option>
                    <option value="8" class="selectbox-option-group-2">RIA기술팀</option>
                    <option value="9" class="selectbox-option-group-3">UI기술기획팀</option>
                    <option value="10" class="selectbox-option-group-3">웹표준화팀</option>
                    <option value="11" class="selectbox-option-group-3">오픈UI기술팀</option>
                    <option value="12" class="selectbox-option-group-3">인터널서비스</option>
                </select>
                <div class="selectbox-box">
                    <div class="selectbox-label">팀을 선택하세요</div>
                </div>
                <div class="selectbox-layer">
                    <div class="selectbox-list">
                        <ul>
                            <li class="selectbox-item">Ajax UI1팀</li>
                            <li class="selectbox-item">Ajax UI2팀</li>
                            <li class="selectbox-item">Ajax UI3팀</li>
                            <li class="selectbox-item">Ajax UI4팀</li>
                            <li class="selectbox-item-disabled">----------------------</li>
                            <li class="selectbox-item">SPSUI TF</li>
                        </ul>
                    </div>
                </div>
            </div>
    **/
    setOptionGroup : function(sName) {
        if (!this._elSelectOptionGroup || !this._elOptionDefault) {
            return false;
        }
        
        var elSelect = this.getSelectElement(),
            sPrefix = this.option('sClassPrefix'),
            aGroupOption = jindo.$$("." + sPrefix + "option-group-" + sName, this._elSelectOptionGroup),
            elOptionDefault = this._elOptionDefault = this._elOptionDefault.cloneNode(true);
        
        elSelect.innerHTML = "";
        elSelect.appendChild(elOptionDefault);
        this._nSelectedIndex = 0; 
        for (var i = 0; i < aGroupOption.length; i++) {
            elSelect.appendChild(aGroupOption[i].cloneNode(true));
        }
        this._sPrevValue = this.getValue();
        
        this.paint();
        return true;
    },
    
    /**
        선택된 값이 있는지 여부를 가져온다.
        Default 옵션이 선택된 경우에 false를 리턴한다.
        
        @method isSelected
    **/
    isSelected : function() {
        return !this._aItemData[this.getSelectedIndex()].bDefault;
    },
    
    /**
        선택된 값을 초기화하여 default 값으로 되돌린다.
        
        @method setDefault
    **/
    setDefault : function() {
        var nDefaultOption = -1;
            
        jindo.$A(this._aItemData).forEach(function(o, i) {
            if (o.bDefault || o.bSelected) {
                nDefaultOption = i; 
            }
        });
        
        if (nDefaultOption < 0) { //default나 selected="selected" 된거 없으면 첫번째 옵션이 default 
            nDefaultOption = 0;
        } 
        
        this._nSelectedIndex = nDefaultOption;
        this._setSelectedIndex(nDefaultOption);
        this._sPrevValue = this.getValue();
        
        this._paint();
    },
    
    /**
        셀렉트박스를 다시 그린다.
        
        @method paint
    **/
    paint : function() {
        this._paintList();
        this._paintSelected();
        this._paintLabel();
        this.getLayerManager().setLayer(this.getLayerElement());
    },
    
    /**
        타이머로 체크하여 계속 다시 그림
        @ignore
    **/
    _paint : function() {
        this._paintSelected();
        this._paintLabel();
    },
    
    /**
        현재 설정된 값을 box의 label에 그린다.
        @ignore
    **/
    _paintLabel : function() {
        var welLabel = jindo.$Element(this.getLabelElement()),
            sHTML = this.option("aOptionHTML")[this._nSelectedIndex] || "",
            sLabel = this.option("aOptionLabel")[this._nSelectedIndex] || "",
            sText = this.getText();
            
        if (sHTML) {
            if (sLabel) {
                welLabel.html(sLabel);
            } else {
                welLabel.html(sHTML);
            }
        } else {
            welLabel.text(sText);
        }
        welLabel.attr("unselectable", "on");
    },
    
    /**
        현재 설정된 값을 list에 그린다.
        @ignore
        @update : 2012.08. createDocumentFragment 방식으로 변경
    **/
    _paintList : function() {
        var sPrefix = this.option('sClassPrefix');
        this._aOptions = jindo.$$('option', this.getSelectElement());
        var aOptions = this._aOptions;
        this._aItemData = [];
        this._aListItem = [];
        
        this._nSelectedIndex = 0; 
        var elList = this.getSelectListElement();
        elList.innerHTML = "";
        if (this.option("nHeight")) { /* 높이값 되돌리기 */
            jindo.$Element(this.getLayerElement()).css("height", "auto");
        }
        
        var aHTML = [], aTempKey = [];
        
        for (var i = 0, elOption; (elOption = aOptions[i]); i++) {
            var welOption = jindo.$Element(elOption),
                bDefault = welOption.hasClass(sPrefix + 'default'),
                bSelected = welOption.attr("selected") == "selected",
                bDisabled = bDefault || elOption.disabled,
                sHTML = this.option("aOptionHTML")[i] || "",
                sText = welOption.text() || "",
                sValue = welOption.attr("value");
                
            if (!sValue) {
                welOption.attr("value", sText);
                sValue = sText;
            }
            
            this._aItemData[i] = {
                elOption : elOption,
                elItem : null,
                sHTML : sHTML,
                sText : sText,
                sValue : sValue,
                
                bDisabled : bDisabled,
                bSelected : bSelected,
                bDefault : bDefault
            };
            
            // <li> 태그 만들기
            var elItem = null,
                htItem = this._aItemData[i];
                
            if (!htItem.bDefault) {
                
                aHTML.push([
                    '<li style="', htItem.elOption.style.cssText, '" ', // <option> 에 적용된 스타일 그대로 적용하기
                    'class="', htItem.elOption.className, ' ',
                    sPrefix + (htItem.bDisabled ? 'item-disabled' : 'item'),
                    '" unselectable="on">',
                    htItem.sHTML || jindo.$S(htItem.sText).escapeHTML(),
                    '</li>'
                ].join(''));
                
                aTempKey.push(i);
            }
            
        }
        
        elList.innerHTML = aHTML.join('');
        
        var aChildLIs = elList.childNodes;
        for (var j = 0, elChild; elChild = aChildLIs[j]; j++) {
            this._aListItem.push(elChild);
            this._aItemData[aTempKey[j]].elItem = elChild;
        }
        
        if (jindo.$Element(this.getLayerElement()).visible()) {
            this._limitWidth();
            this._limitHeight();
        }
        
        if (this._elSelect.disabled) {
            this.disable();
            return;
        }
        this.enable();
    },
    
    /**
        레이어가 열리면, 현재 선택된 아이템을 하이라이팅하고 scrollTop을 보정
        @ignore
    **/
    _paintSelected : function() {
        var sPrefix = this.option('sClassPrefix'),
            n = this.getSelectedIndex(),
            htItem,
            nPrevSelectedIndex = this._nSelectedIndex;
            
        if (this._welSelected) {
            this._welSelected.removeClass(sPrefix + "item-selected");
            this._welSelected = null;
        }
        if (this._welOvered) {
            this._welOvered.removeClass(sPrefix + "item-over");
            this._welOvered = null;
        }
        
        n = Math.min(n, this._aItemData.length - 1);
        this._nSelectedIndex = n; //선택된 index는 이메서드를 그릴때 정의
        
        htItem = this._aItemData[n];
        if (htItem && htItem.elItem) {
            var elSelected = htItem.elItem,
                welSelected = jindo.$Element(elSelected);
                
            this._welSelected = this._welOvered = welSelected;
            welSelected.addClass(sPrefix + "item-selected").addClass(sPrefix + "item-over");    
            
            if (this.isLayerOpened()) {
                var elLayerElement = this.getLayerElement();
                var nHeight = parseInt(jindo.$Element(elLayerElement).css("height"), 10),
                    nOffsetTop = elSelected.offsetTop,
                    nOffsetHeight = elSelected.offsetHeight,
                    nScrollTop = elLayerElement.scrollTop,
                    bDown;
                
                if (nPrevSelectedIndex < n) {
                    bDown = true;
                } else {
                    bDown = false;
                }
                if (nOffsetTop < nScrollTop || nOffsetTop > nScrollTop + nHeight) {
                    elLayerElement.scrollTop = nOffsetTop;
                }
                if (bDown) {
                    if (nOffsetTop + nOffsetHeight > nHeight + nScrollTop) {
                        elLayerElement.scrollTop = (nOffsetTop + nOffsetHeight - nHeight);
                    }
                } else {
                    if (nOffsetTop < nScrollTop) {
                        elLayerElement.scrollTop = nOffsetTop;
                    }
                }
            }
        }
    },
    
    /**
        Select 레이어가 열려있는지 여부를 가져온다.
        
        @method isLayerOpened
        @return {Boolean}
    **/
    isLayerOpened : function() {
        return this.getLayerManager().getVisible(); 
    },
    
    /**
        SelectBox를 disable 시킨다.
        마우스로 클릭하더라도 목록 레이어가 펼쳐지지 않는다.
        
        @method disable
    **/
    disable : function() {
        this.getLayerManager().hide();
        var sPrefix = this.option("sClassPrefix");
        this._wel.addClass(sPrefix + 'disabled');
        this.getSelectElement().disabled = true;
        this._bDisabled = true;
    },
    
    /**
        SelectBox를 enable 시킨다.
        
        @method enable
    **/
    enable : function() {
        var sPrefix = this.option("sClassPrefix");
        this._wel.removeClass(sPrefix + 'disabled');
        this.getSelectElement().disabled = false;
        this._bDisabled = false;
    },
    
    /**
        레이어를 연다.
        
        @method open
        @return {this}
    **/
    open : function() {
        if (!this._bDisabled) {
            this.getLayerManager().show();
        }
        return this;
    },
    
    /**
        레이어를 닫는다.
        
        @method close
        @return {this}
    **/
    close : function() {
        this.getLayerManager().hide();
        return this;
    },
    
    _onMouseDownBox : function(we){
        we.stop(jindo.$Event.CANCEL_DEFAULT);
        if (!this._bDisabled) {
            this.getLayerManager().toggle();
        }
    },
    
    _onMouseDownList : function(we){
        if (!jindo.$$.getSingle("! ." + this.option("sClassPrefix") + "notclose", we.element)) {
            we.stop(jindo.$Event.CANCEL_DEFAULT);
        }
    },
    
    /**
        현재 index로부터 선택가능한 다음 index를 구한다.
        @param {Number} nIndex
        @param {Number} nTarget
        @ignore
    **/
    _getSelectableIndex : function(nIndex, nDirection, nTargetIndex) {
        var nFirst = -1,
            nLast = this._aItemData.length - 1,
            i;
        
        for (i = 0; i < this._aItemData.length; i++) {
            if (this._isSelectable(i)) {
                if (nFirst < 0) {
                    nFirst = i; 
                }
                else {
                    nLast = i;
                }
            }
        }
        
        switch (nDirection) {
            case -1 :
                if (nIndex == nFirst) {
                    return nIndex;
                }
                for (i = nIndex - 1; i > nFirst; i--) {
                    if (this._isSelectable(i)) {
                        return i;
                    }                   
                }
                return nFirst;
            
            case 1 :
                if (nIndex == nLast) {
                    return nIndex;
                }
                for (i = nIndex + 1; i < nLast; i++) {
                    if (this._isSelectable(i)) {
                        return i;
                    }                   
                }
                return nLast;
            
            case Infinity :
                return nLast;
            
            case -Infinity :
                return nFirst;
        }
    },
    
    _onKeyDown : function(we){
        var htKey = we.key();
        
        if ((this._oAgent.os().mac && this._oAgent.navigator().safari) || (this._oAgent.navigator().ie && this._oAgent.navigator().version == 6)) {
            var nKeyCode = htKey.keyCode;
            if (nKeyCode != 9) {
                //mac용 사파리에서는 select에서의 keydown을 중단. tab 제외
                we.stop(jindo.$Event.CANCEL_DEFAULT);
            }
            var nSelectedIndex = this.getSelectedIndex(),
                nTargetIndex = nSelectedIndex;
                
            // 콤보박스에서 발생한 이벤트도 처리하는 경우
            switch (nKeyCode) {
                case 37: // LEFT:
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, -1);
                    break;
                    
                case 38: // UP:
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, -1);
                    break;
                
                case 39: // RIGHT
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, 1);
                    break;
                    
                case 40: // DOWN
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, 1);
                    break;
                    
                case 33: // PGUP
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, -Infinity);
                    break;
                    
                case 34: // PGDN
                    nTargetIndex = this._getSelectableIndex(nSelectedIndex, Infinity);
                    break;
                case 13: // ENTER
                    this.getLayerManager().hide();
                    break;
                case 9 : // TAB
                    this.getLayerManager().hide();
                    break;  
            }
            
            var oParam = {
                nIndex: nTargetIndex,
                nLastIndex: parseInt(this._nSelectedIndex, 10)
            };
            
            this._setSelectedIndex(nTargetIndex);
            this._paint();
            if (oParam.nIndex != oParam.nLastIndex) {
                this.fireEvent("change", oParam);   
            }
        } else {
            if(this.isLayerOpened() && (htKey.enter || htKey.keyCode == 9)) {
                    // var elSelect = this.getSelectElement();
                    // setTimeout(function(){ //focus때문에 delay
                        // console.log(elSelect);
                        // try { elSelect.focus(); } catch(e) {}
                    // }, 10);
                    this.getLayerManager().hide();
            }
        }
    },
    
    _restoreLeftTimer : null,
    
    _onFocusSelect : function(we){
        var sPrefix = this.option('sClassPrefix'),
            wel = this._wel,
            elSelect = this.getSelectElement(),
            self = this;
        
        if (!this._restoreLeftTimer) {

            var sLeft = elSelect.style.left || '';  
            elSelect.style.left = 'auto';
            
            this._restoreLeftTimer = setTimeout(function() {
                elSelect.style.left = sLeft;
                self._restoreLeftTimer = null;
            }, 0);
            
        }
             
        if(!this.isLayerOpened()) {
            /**
                셀렉트박스가 포커스를 얻으면 발생
                
                @event focus
                @param {String} sType 커스텀 이벤트명
                @param {Function} stop 포커스 되지않게 하기위해 호출하는 메서드
                @example
                    // focus 커스텀 이벤트 핸들링
                    oSelectBox.attach("focus", function(oCustomEvent) { ... });
                @example
                    // 키보드 탭키로 포커스 되지 않도록 처리. select 엘리먼트의 blur()가 실행된다.
                    oSelectBox.attach("focus", function(oCustomEvent) {
                        oCustomEvent.stop();
                    });
            **/
            if (!this.fireEvent("focus")) {
                this.getSelectElement().blur();
                return;
            }
            // if (this.fireEvent("focus")) {
                // //this._bRealFocused = true;  
            // } else {
                // this.getSelectElement().blur();
                // return;
            // }
        }
        wel.addClass(sPrefix + 'focused');  
        
        //mac용 사파리에서는 타이머 돌지 않음
        if (!(this._oAgent.os().mac && this._oAgent.navigator().safari)) {
            this._oTimer.start(function(){
            
                var sValue = self.getValue();
                if (!!self._sPrevValue && self._sPrevValue != sValue) {
                    var nSelectedIndex = self.getSelectElement().selectedIndex;
                    //Disable default는 다시 선택되지 않도록. ie는 선택이되네..
                    if (!self._isSelectable(nSelectedIndex)) {
                        var nDiff = -(self._nSelectedIndex - nSelectedIndex);
                        nDiff = (nDiff > 0) ? 1 : -1;
                        self._setSelectedIndex(self._getSelectableIndex(self._nSelectedIndex, nDiff, nSelectedIndex));
                        return true;
                    }
                    
                    var oParam = {
                        nIndex: nSelectedIndex,
                        nLastIndex: parseInt(self._nSelectedIndex, 10)
                    };
                    
                    self._paint();
                    
                    /**
                        선택한 아이템이 바뀌었을때 발생
                        
                        @event change
                        @param {String} sType 커스텀 이벤트명
                        @param {Number} nIndex 선택된 옵션의 인덱스
                        @param {Number} nLastIndex 선택되기 전의 옵션의 인덱스
                        @example
                            oSelectBox.attach("change", function(oCustomEvent) { ... });
                    **/
                    if (oParam.nIndex != oParam.nLastIndex) {
                        self.fireEvent("change", oParam);   
                    }
                    
                    self._sPrevValue = sValue;
                }
                
                return true;
            }, 10);
        }
    },
    
    _onBlurSelect : function(we){
        var self = this,
            sPrefix = this.option('sClassPrefix');
            
        //if (true || this._bRealFocused) { //레이어가 오픈되지 않고 focus되었던 경우에만 blur 발생
            
            /**
                셀렉트박스가 포커스를 잃으면 발생
                
                @event blur
                @param {String} sType 커스텀 이벤트명
                @example
                    // blur 커스텀 이벤트 핸들링
                    oSelectBox.attach("blur", function(oCustomEvent) { ... });
            **/
            this.fireEvent("blur");
            this._wel.removeClass(sPrefix + 'focused');
            //this._bRealFocused = false;
        //}
        //console.log(234920320);
        setTimeout(function(){
            self._oTimer.abort();   
        }, 10); //마우스로 선택된것도 체크되도록
    }
}).extend(jindo.HTMLComponent); /**
	@fileOverview 별점 입력 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	jindo.StarRating 컴포넌트는 마우스 이동, 클릭으로 별점을 입력받습니다.
	
	@class jindo.StarRating
	@extends jindo.UIComponent
	@keyword starrating, rating, 별점수, 스타레이팅
**/
jindo.StarRating = jindo.$Class({
	/** @lends jindo.StarRating.prototype */
		
	/**
		컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el 베이스(기준) 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {Number} [htOption.nStep=1] 설정가능한 값의 단계 ex) 1, 0.5, 0.25
			@param {Number} [htOption.nMaxValue=10] 최대값
			@param {Number} [htOption.nDefaultValue=0] 로드시 기본으로 설정할 값
			@param {Boolean} [htOption.bSnap=false] MouseMove시 step별로 스냅시킬지 여부
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 activate() 수행여부
		@example
			oStarRating = new jindo.StarRating(jindo.$("star_rating"), {
				nStep : 1, //설정가능한 값의 단계 ex) 1, 0.5, 0.25
				nMaxValue : 10, //최대값
				nDefaultValue : 0, //로드시 기본으로 설정할 값
				bSnap : false, //MouseMove시 step별로 스냅시킬지 여부
				bActivateOnload : true //로드시 컴포넌트 활성화여부
			}).attach({
				move : function(oCustomEvent) {
					//마우스가 별점 위에서 이동될 때 발생
					//이벤트 객체 oCustomEvent = {
					//	nValue : (Number) 마우스이동에 따른 값 (변환되기 전 값)
					//	nValueToBeSet : (Number) 실제 적용될 값 (nStep 옵션에 따라 변환된 값)
					//}
				},
				out : function(oCustomEvent) {
					//마우스가 별점 위에서 벗어났을 때 발생
				},
				set : function(oCustomEvent) {
					// 값이 설정되었을 때 발생
					//이벤트 객체 oCustomEvent = {
					//	nValue : (Number) 설정된 값
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		//옵션 초기화
		var htDefaultOption = {
			nStep : 1, //설정가능한 값의 단계 ex) 1, 0.5, 0.25
			nMaxValue : 10, //최대값
			nDefaultValue : 0, //로드시 기본으로 설정할 값
			bSnap : false, //MouseMove시 step별로 스냅시킬지 여부
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		//Base 엘리먼트 설정
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);

		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._assignHTMLElements();
		
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseLeave = jindo.$Fn(this._onMouseLeave, this);
		this._wfClick = jindo.$Fn(this._onClick, this);
		
		//활성화
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},

	/**
		컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
	**/
	_assignHTMLElements : function() {
		this._elRatingElement = jindo.$$.getSingle("span", this.getBaseElement());
		this._welRatingElement = jindo.$Element(this._elRatingElement);
	},
	
	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this._el;
	},

	/**
		별점의 점수를 표시할 엘리먼트를 구한다.
		
		@method getRatingElement
		@return {HTMLElement}
	**/
	getRatingElement : function() {
		return this._elRatingElement;
	},
	
	/**
		설정된 값을 구한다.
		
		@method getValue
		@return {Number} 0과 option의 maxValue 사이의 값
	**/
	getValue : function() {
		return this._nValue;	
	},
	
	/**
		활성화된 RatingElement의 가로 길이로부터 설정된 값을 구한다.
		
		@method getValueByWidth
		@return {Number} 0과 option의 maxValue 사이의 값
	**/
	getValueByWidth : function() {
		return this._welRatingElement.width() / this._nBaseWidth * this.option("nMaxValue");	
	},
	
	/**
		실제로 설정될 값을 가져온다.
		
		@method getValueToBeSet
		@param {Number} nValue 설정하고자 하는 값
		@return {Number} nStep 옵션에 따라 변환된 값.
		@example
			//nStep옵션이 1인 경우
			oStarRating.getValueToBeSet(3.15); // 3
	**/
	getValueToBeSet : function(nValue) {
		nValue = this._round(nValue, this.option("nStep"));
		nValue = Math.min(nValue, this.option("nMaxValue"));
		nValue = Math.max(nValue, 0);
		return nValue;
	},
	
	/**
		 값을 설정한다.
		
		@method setValue
		@param {Number} nValue 0과 option의 maxValue 사이의 값
		@param {Boolean} bFireEvent "set" 커스텀 이벤트를 발생할지 여부
		@return {this}
	**/
	setValue : function(nValue, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}

		var nMaxValue = this.option("nMaxValue");
		nValue = this.getValueToBeSet(nValue);
		
		var nWidth = this._nBaseWidth * nValue / nMaxValue;
		nWidth = Math.min(nWidth, this._nBaseWidth);
		
		this._welRatingElement.width(nWidth);
		this._nValue = nValue;
		
		if (bFireEvent) {
			/**
				 값이 설정되었을 때
				
				@event set
				@param {String} sType 커스텀 이벤트명
				@param {Number} nValue 설정된 값
				@example
					// 커스텀 이벤트 핸들링 예제
					oStarRating.attach("set", function(oCustomEvent) { ... });
			**/
			this.fireEvent("set", { nValue : this._nValue });
		}
		
		return this;
	},
	
	/**
		 값을 초기화한다.
		
		@method reset
		@return {this}
	**/
	reset : function() {
		var nValue = this.option("nDefaultValue") || 0;
		this.setValue(nValue, false);
		return this;
	},
	
	/**
		소수점단위로도 반올림
		@ignore
		@param {Number} nValue 반올림할 값
		@param {Number} nStep 반올림 단위 (ex 0.5)
	**/
	_round : function(nValue, nStep) { //9.9,  0.5
		var nResult = nValue,
			nFloor = Math.floor(nValue), //9
			nMaxCandidate = nFloor + 1,
			nCompare = 1,
			nTempCompare,
			nCandidate,
			nFixed;
		
		for (nCandidate = nFloor; nCandidate <= nMaxCandidate; nCandidate += nStep) {
			nTempCompare = Math.abs(nValue - nCandidate);
			if (nTempCompare <= nCompare) {
				nCompare = nTempCompare;
				nResult = nCandidate;
			} 
		}
		
		return nResult.toFixed(Math.max((nStep.toString().length - 2), 0));
	},
	
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		var el = this.getBaseElement();
		this._wfMouseMove.attach(el, "mousemove");
		this._wfMouseLeave.attach(el, "mouseleave");
		this._wfClick.attach(el, "click");
		
		this._nBaseWidth = this._wel.width();
		this.reset();
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		var el = this.getBaseElement();
		this._wfMouseMove.detach(el, "mousemove");
		this._wfMouseLeave.detach(el, "mouseleave");
		this._wfClick.detach(el, "click");
	},
	
	_onMouseMove : function(we) {
		var nOffsetX = we.pos(true).offsetX + 1,
			nWidth = (nOffsetX > this._nBaseWidth) ? this._nBaseWidth : nOffsetX,
			nValue;
		
		if (this.option("bSnap")) {
			nValue = nOffsetX / this._nBaseWidth * this.option("nMaxValue");
			nWidth = this._round(nValue, this.option("nStep")) * this._nBaseWidth / this.option("nMaxValue");
			nWidth = Math.min(nWidth, this._nBaseWidth);
		}
		this._welRatingElement.css("width", nWidth + "px");
		
		nValue = this.getValueByWidth();
		/**
			마우스가 별점 위에서 이동될 때
			
			@event move
			@param {String} sType 커스텀 이벤트명
			@param {Number} nValue 마우스이동에 따른 값 (변환되기 전 값)
			@param {Number} nValueToBeSet 적용될 값 (nStep 옵션에 따라 변환된 값)
			@example
				// 커스텀 이벤트 핸들링 예제
				oStarRating.attach("move", function(oCustomEvent) { ... });
		**/
		this.fireEvent("move", {
			nValue : nValue,
			nValueToBeSet : this.getValueToBeSet(nValue)
		});
	},
	
	_onMouseLeave : function(we) {
		this.setValue(this._nValue, false);
		/**
			마우스가 별점 위에서 벗어났을 때
			
			@event out
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oStarRating.attach("out", function(oCustomEvent) { ... });
		**/
		this.fireEvent("out");
	},
	
	_onClick : function(we) {
		this.setValue(this.getValueByWidth());
	}
}).extend(jindo.UIComponent);	/**
	@fileOverview 탭이동을 구현한 컴포넌트
	@author hooriza, modified by senxation
	@version 1.14.0
**/
/**
	jindo.TabControl 컴포넌트는 여러 패널로 나뉘어진 구조를 탭으로 네비게이팅 가능하게 합니다.
	
	@class jindo.TabControl
	@extends jindo.UIComponent
	@keyword tabcontrol, 탭컨트롤
**/
jindo.TabControl = jindo.$Class({
	/** @lends jindo.TabControl.prototype */

	_bIsActivating : false, //컴포넌트의 활성화 여부

	_nCurrentIndex : null, //현재 선택된 탭의 인덱스
	_welSelectedTab : null,
	_welSelectedPanel : null,
	
	/**
		TabControl 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el TabControl을 적용한 기준 엘리먼트.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="tc-"] 클래스명 접두어
			@param {String} [htOption.sCheckEvent="click"] 탭에 적용될 이벤트
			<ul>
			<li>"mouseover"</li>
			<li>"mousedown"</li>
			<li>"click"</li>
			</ul>
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 activate() 수행여부
		@example
			<!--
				기준 엘리먼트는 반드시 같은 수의 classPrefix+"tab", classPrefix+"panel" 쌍을 가져야하고 각 쌍은 특정 엘리먼트로 감싸져있어야한다.
				아래 예 참고.
			-->
			<div id="tab">
				<ul>
					<li class="tc-tab">첫번째</li> <!-- tab의 클래스명은 옵션의 classPrefix+"tab"으로 정해야한다. -->
					<li class="tc-tab tc-selected">두번째</li> <!-- default로 선택될 탭을 지정할 경우 tab의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. (탭이 선택되었을 때 해당 탭과 매칭되는 패널은 classPrefix+"selected"의 클래스명을 갖게 된다.) -->
					<li class="tc-tab">세번째</li>
				</ul>
				<div>
					<div class="tc-panel">SUB SUB #1</li> <!-- tab이 선택되었을때 보여지는 panel의 클래스명은 옵션의 classPrefix+"panel"으로 정해야한다. -->
					<div class="tc-panel tc-selected">SUB SUB #2</li> <!-- default로 선택될 탭을 지정할 경우 panel의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. -->
					<div class="tc-panel">SUB SUB #3</li>
				</div>
			</div>
		@example
			var oTab = new jindo.TabControl(jindo.$('tab'), { 
				sClassPrefix : "tc-" // (String) 클래스명 앞에 붙게되는 prefix 선언
				sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
				bActivateOnload : true //로드시 컴포넌트 활성화여부
			}).attach({
				beforeSelect : function(oCustomEvent) {
					//탭이 선택되기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					// 	nIndex : (Number) 선택된 탭의 인덱스
					// 	elTab : (HTMLElement) 선택된 탭
					// 	elPanel : (HTMLElement) 선택된 패널
					//}
					//oCustomEvent.stop()시 해당 탭이 선택되지 않음.
				}
				select : function(oCustomEvent) {
					//탭이 선택되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					// 	nIndex : (Number) 선택된 탭의 인덱스
					// 	elTab : (HTMLElement) 선택된 탭
					// 	elPanel : (HTMLElement) 선택된 패널
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'tc-', //Default Class Prefix
			sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._el = jindo.$(el);
		
		this._wfEventTab = jindo.$Fn(this._onEventTab, this);

		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._assignHTMLElements();
		
		//활성화
		if(this.option("bActivateOnload")) {
			this._selectTab(this._elSelectedTab);
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
		컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
	**/
	_assignHTMLElements : function() {
		var sPrefix = this.option('sClassPrefix'),
			el = this._el;
		
		this._aTab = jindo.$$('.' + sPrefix + 'tab', el);
		this._aPanel = jindo.$$('.' + sPrefix + 'panel', el);
		this._elSelectedTab = jindo.$$.getSingle('.' + sPrefix + 'tab.' + sPrefix + 'selected', el) || this.getTab(0);
		this._waTab = jindo.$A(this._aTab);
	},
	
	/**
		n번째 탭 엘리먼트를 구한다.
		
		@method getTab
		@param {Number} n 몇 번째 탭 엘리먼트인지
		@return {HTMLElement}
	**/
	getTab : function(n) {
		return this.getTabs()[n];
	},

	/**
		탭 엘리먼트 목록을 구한다.
		
		@method getTabs
		@return {Array}
	**/
	getTabs : function() {
		return this._aTab;
	},

	/**
		n번째 패널 엘리먼트를 구한다.
		
		@method getPanel
		@param {Number} n 몇 번째 패널 엘리먼트인지
		@return {HTMLElement}
	**/
	getPanel : function(n) {
		return this.getPanels()[n];
	},

	/**
		패널 엘리먼트 목록을 구한다.
		
		@method getPanels
		@return {Array}
	**/
	getPanels : function() {
		return this._aPanel;
	},

	/**
		n번째 Tab을 선택한다.
		
		@method selectTab
		@param {Number} n 몇 번째 탭인지
		@param {Boolean} bFireEvent 선택시 사용자 이벤트를 발생할 지 여부
	**/
	selectTab : function(n, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		this._selectTab(this.getTab(n), bFireEvent);
	},

	/**
		몇 번째 탭인지 구한다.
		
		@method getIndex
		@param {HTMLElement} elTab 탭 엘리먼트
		@return {Number}
	**/	
	getIndex : function(elTab) {
		return this._waTab.indexOf(elTab);
	},
	
	/**
		현재 몇번째 탭이 보여지고 있는지 구한다.
		
		@method getCurrentIndex
		@return {Number}
	**/
	getCurrentIndex : function() {
		return this._nCurrentIndex;
	},
	
	_selectTab : function(elTab, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		var sPrefix = this.option('sClassPrefix'),
			nIndex = this.getIndex(elTab),
			elPanel = this.getPanel(nIndex);
		
		if (bFireEvent) {
			/**
				탭이 선택되기 전
				
				@event beforeSelect
				@param {String} sType 커스텀 이벤트명
				@param {Number} nIndex 선택될 탭의 인덱스
				@param {HTMLElement} elTab 선택될 탭
				@param {HTMLElement} elPanel 선택될 패널
				@param {Function} stop 수행시 해당 탭이 선택되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oTabControl.attach("beforeSelect", function(oCustomEvent) { ... });
			**/
			if (!this.fireEvent("beforeSelect", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			})) {
				return;
			}
		}
		
		var welTab = jindo.$Element(elTab);
		if (this._welSelectedTab) {
			this._welSelectedTab.removeClass(sPrefix + 'selected');
		}
		this._welSelectedTab = welTab;
		welTab.addClass(sPrefix + 'selected');
		
		var welPanel = jindo.$Element(elPanel);
		if (this._welSelectedPanel) {
			this._welSelectedPanel.removeClass(sPrefix + 'selected');
		}
		this._welSelectedPanel = welPanel;
		welPanel.addClass(sPrefix + 'selected');
		
		this._nCurrentIndex = nIndex;
		
		if (bFireEvent) {
			/**
				탭이 선택된 후
				
				@event select
				@param {String} sType 커스텀 이벤트명
				@param {Number} nIndex 선택된 탭의 인덱스
				@param {HTMLElement} elTab 선택된 탭
				@param {HTMLElement} elPanel 선택된 패널
				@example
					// 커스텀 이벤트 핸들링 예제
					oTabControl.attach("select", function(oCustomEvent) { ... });
			**/
			this.fireEvent("select", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			});
		}
	},
	
	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this._el;
	},
	
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(true);
		this._wfEventTab.attach(this._el, this.option("sCheckEvent"));
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(false);
		this._wfEventTab.detach(this._el, this.option("sCheckEvent"));
	},
	
	_onEventTab : function(we) {
		if (this.fireEvent(we.type, { weEvent : we })) {
			var sPrefix = this.option('sClassPrefix'),
				el = we.element,
				elTab = jindo.$$.test(el, '.' + sPrefix + 'tab') ? el : jindo.$$.getSingle('! .' + sPrefix + 'tab', el);
				
			if (elTab) {
				this._selectTab(elTab);	
			}
		}
	}
}).extend(jindo.UIComponent);/**
	HTML5 의 FileAPI 와 Flash 를 사용해서 다중 파일 업로드를 구현하는 컴포넌트

	@author hooriza
	@version 1.14.0
	
	@class jindo.UploadQueue
	@extends jindo.UIComponent
	@uses jindo.BrowseButton
	
	@keyword upload, 플래시, flash, 업로드, HTML5, FileAPI
**/

jindo.UploadQueue = jindo.$Class({
	
	// 파일의 각 상태
	_states : {
		NONE : 'NONE',
		WAIT : 'WAIT',
		PROGRESS : 'PROGRESS',
		LOAD : 'LOAD',
		ERROR :  'ERROR'
	},
	
	// 플래시에서 발생하는 이벤트를 잡는 핸들러
	_callbackForFlash : {
		
		'buttonOver' : function() {
			this.fireEvent('buttonOver', { element : this._elCurrentBrowseButton });
		},
		
		'buttonOut' : function() {
			this.fireEvent('buttonOut', { element : this._elCurrentBrowseButton });
		},
		
		'selectFile' : function(aFiles) {

			var self = this;

			// 사파리에서 파일선택 직후 alert 띄웠을때 뻗는 문제 회피
			if (jindo.$Agent().navigator().safari) {

				var wfn = jindo.$Fn(function() {
					wfn.detach(window, 'focus');
					self._addQueue(aFiles);
				});
				wfn.attach(window, 'focus');
				window.blur();
				window.focus();

				return;

			}

			this._addQueue(aFiles);

		},
		
		'selectFileError' : function(sMessage) {
			/**
			 * 잘못 된 파일을 선택 했을 때 발생한다.
			 * 플래시 업로드에서 4기가 이상의 파일의 선택하는 등의 이유로 발생 할 수 있다.  
			 * @event selectError
			 * @param {String} sMessage 에러 메시지
			 */
			this.fireEvent('selectError', { 'sMessage' : sMessage });
		},
		
		'start' : function(oObj) {
			
		},
		
		'progress' : function(oObj) {
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			if (oFile.state !== this._states.PROGRESS) { return; }
			this.fireEvent('uploadProgress', { 'oFile' : oFile, 'sKey' : sKey });
		},
		
		'load' : function(oObj) {
			
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			var sResponseText = oObj.sResponse;
		
			this._setDoneState(sKey, oFile, 'uploadLoad', oFile.size, 1, this._states.LOAD, sResponseText);
		},
		
		'error' : function(oObj) {
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			this._setDoneState(sKey, oFile, 'uploadError', 0, 0, this._states.ERROR);
		}
		
	},
	
	// 투명한 플래시를 버튼 위에 위치해서 덮음
	_showFlashForFlash : function(welButton) {
		
		if (welButton) { // 버튼을 지정하면 덮음
			
			var oOffset = welButton.offset();
			var elFlash = this._getFlash();
			
			this._elDummy.style.left = oOffset.left + 'px'; 
			this._elDummy.style.top = oOffset.top + 'px';
			
			this._elDummy.style.width = elFlash.style.width = welButton.width() + 'px'; 
			this._elDummy.style.height = elFlash.style.height = welButton.height() + 'px'; 
			
		} else { // 버튼을 지정하지 않으면 숨김
			
			this._elDummy.style.left = this._elDummy.style.top = 0;
			this._elDummy.style.width = this._elDummy.style.height = '1px';	
			
		}
		
	},
	
	// 플래시 생성
	_createFlashForFlash : function(sUnique) {
		
		if (this._elDummy) { return; }
		
		var elDummy = this._elDummy = jindo.$('<div>');
		
		var sFlashUID = sUnique;
		var sFlashURL = this.option('sSwfPath');
		var oAgent = jindo.$Agent();
		
		elDummy.style.cssText = 'position:absolute !important; border:0 !important; padding:0 !important; margin:0 !important; overflow:hidden !important; z-index:32001 !important;';
		document.body.insertBefore(elDummy, document.body.firstChild);
		
		if(oAgent.flash().version >= 11 && oAgent.navigator().ie){
			sFlashURL += "?"+Math.floor(Math.random() * 10000);
		}
		
		var oFlashVars = {
			bMultiple : this.option('bMultiple'),
			sJSFunctionName : 'jindo.UploadQueue.__flashCallback.' + sUnique,
			nButtonOpacity : 0,
			sParamName : this.option('sParamName'),
			sURL : this.url() // "upload.php"
		};
		
		var sFlashHtml = this._getFlashHTML('UPLOADQUEUE' + sFlashUID, sFlashURL, 50, 50, {flashVars : oFlashVars, wmode : 'transparent'});
		elDummy.innerHTML = sFlashHtml;
		
		// jindo.$Fn(this._checkFailed, this).attach(elDummy, 'click');
		
		this._showFlashForFlash(false);
		
		this._getFlash = function() {
			return document['UPLOADQUEUE' + sFlashUID] || document.all['UPLOADQUEUE' + sFlashUID];
		};
		
	},

	_destroyFlashForFlash : function(sUnique) {

		this._elDummy.parentNode.removeChild(this._elDummy);
		this._elDummy = null;

	},

	// 플래시 삽입을 위한 HTML 코드 만들기
	_getFlashHTML : function(sId, sSwfPath, width, height, options) {

		var protocol = (location.protocol == "https:")?"https:":"http:";
	    // var classid = (jindo.$Agent().navigator().ie?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"':'');
	    var classid = 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';

	    options = options || {};
	    options.allowScriptAccess = options.allowScriptAccess || 'always';

	    var params = [], attrs = [], v;
	    for (var k in options) if (options.hasOwnProperty(k)) {
	    	v = options[k];
	    	if (k === 'flashVars') { v = jindo.$H(v).toQueryString(); }
	    	params.push('<param name="' + k + '" value="' + v + '" />');
	    	attrs.push(' ' + k + '="' + v + '"');
	    }

	    return [
	    	'<object tabindex="-1" id="'+sId+'" width="'+width+'" height="'+height+'" '+classid+' codebase="'+protocol+'//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0">',
		    	'<param name="movie" value="'+sSwfPath+'" />',
		    	params.join(''),
	    		'<embed tabindex="-1" name="'+sId+'" src="'+sSwfPath+'"',
	    		' type="application/x-shockwave-flash" pluginspage="'+protocol+'://www.macromedia.com/go/getflashplayer"',
	    		attrs.join(''),
	    		' width="'+width+'" height="'+height+'">',
	    		'</embed>',
	    	'</object>'
	    ].join('');

	},

	// 플래시 내부에 구현된 메서드 호출
	_sendForFlash : function(sFuncName, aArgs) {
		
		if (!this._getFlash) { return; }
		
		var oFlash = this._getFlash();
		oFlash[sFuncName].apply(oFlash, aArgs || []);
		
	},
	
	/**
	 * UploadQueue 컴포넌트를 생성한다.
	 * @constructor
	 * @param {String} sURL 업로드 될 경로
	 * @param {Object} oOptions 옵션 객체
	 * 		@param {Array} oOptions.aButton 찾아보기 버튼으로 사용 할 엘리먼트 
	 * 		@param {Array} oOptions.aDropArea 파일 드랍 영역으로 사용 할 엘리먼트 
	 * 		@param {Element} oOptions.elButton (deprecate) 찾아보기 버튼으로 사용 할 엘리먼트
	 * 		@param {Element} oOptions.elDropArea (deprecate) 파일 드랍 영역으로 사용 할 엘리먼트 
	 * 		@param {Boolean} [oOptions.bMultiple=true] 파일 선택 창에서 여러개의 파일을 선택 할 수 있도록 할지 여부 (true : 가능 / false : 불가능)
	 * 		@param {Number} [oOptions.nParallel=1] 동시에 병렬로 진행 가능한 업로드 갯수
	 *		@param {String} [oOptions.sSwfPath] File API 를 지원하지 않는 브라우저를 위한 플래시 파일 경로
	 * 		@param {String} [oOptions.sParamName="file"] 서버로 파일 데이터를 보낼 때 사용 할 이름
		 	@param {Boolean} [oOptions.bActivateOnload=true] 컴포넌트 로드시 activate 여부
	 */
	$init : function(sURL, oOptions) {
		
		var bSupportHTML5 = typeof FormData !== 'undefined';
		var sAgent = navigator.userAgent; // jindo.$Agent().navigator();

		// 데스크탑용 사파리에서는 <input type="file"> 에 multiple 이 버그있어서
		// 플래시 사용하도록 수정
		if (jindo.$Agent().os().win && /Version\/([0-9\.]+)\s+Safari\/([0-9\.]+)/.test(sAgent)) {
			bSupportHTML5 = false;
		}

		if ('bSupportHTML5' in oOptions) {
			bSupportHTML5 = !!oOptions.bSupportHTML5;
		}

		this._methodPostfix = bSupportHTML5 ? 'ForHTML5' : 'ForFlash';
		
		this.getMethod = function() {
			return bSupportHTML5 ? 'HTML5' : 'flash';
		};
		
		this.option({
			bMultiple : true,
			nParallel : 1,
			sParamName : 'file',
			bActivateOnload : true
		});
		
		this.option(oOptions || {});
		
		this.url(sURL);

		if (this.option('bActivateOnload')) {
			this.activate();
		}
		
	},

	_onActivate : function() {

		this._queue = [];
		this._uploading = 0;
		
		this._initialize();
		this._attachEvents();

	},

	_onDeactivate : function() {

		this._detachEvents();

		if (this._browseButtons) {
			var aBrowseButtons = this._browseButtons;
			for (var i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].deactivate();
			}
		}

		this._browseButtons = null;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	_getFileObj : function(sKey, oNewFile) {
		var fp = this['_getFileObj' + this._methodPostfix];
		return (this._getFileObj = fp).apply(this, arguments);
	},
	
		_getFileObjForHTML5 : function(sKey, oNewFile) {
			return oNewFile;
		},
		
		_getFileObjForFlash : function(sKey, oNewFile) {
			
			var oFile = this._flashFiles[sKey];
			if (oFile && oNewFile) {
				for (var k in oNewFile) if (oNewFile.hasOwnProperty(k)) {
					oFile[k] = oNewFile[k];	
				}
			}
			
			return oFile;
			
		},
		
	//------------------------------------------------------------------------------------------------------

	_initialize : function() {
		var fp = this['_initialize' + this._methodPostfix];
		return (this._initialize = fp).apply(this, arguments);
	},
	
		_initializeForHTML5 : function(oOptions) {
			
			this._xhr = {};

			var aButtons = this.option('aButton') || [ this.option('elButton') ];

			this._browseButtons = [];

			var oBrowseButton = null;
			for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
				this._browseButtons.push(oBrowseButton = new jindo.BrowseButton(aButtons[i]));
				oBrowseButton.getFileSelect().multiple = this.option('bMultiple');
			}
			
		},
		
		_initializeForFlash : function() {
			
			this._flashFiles = {};
			
		},

	//------------------------------------------------------------------------------------------------------

	_detachEvents : function() {
		var fp = this['_detachEvents' + this._methodPostfix];
		return (this._detachEvents = fp).apply(this, arguments);
	},

		_detachEventsForHTML5 : function() {

			var i;
			var nLen;

			var aBrowseButtons = this._browseButtons;
			for (i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].detach(this._browseButtonHandlers), this._browseButtonHandlers = null;
			}

			var aDropAreas = this._aDropAreas;
			for (i = 0, nLen = aDropAreas.length; i < nLen; i++) {
				var elDropArea = aDropAreas[i];

				this._wfOnDragEnter.detach(elDropArea, 'dragenter');
				this._wfOnDragOver.detach(elDropArea, 'dragover');
				this._wfOnDragLeave.detach(elDropArea, 'dragleave');
				this._wfOnDrop.detach(elDropArea, 'drop');

				this._aDropAreas = null;
			}

		},

		_detachEventsForFlash : function() {

			var aButtons = this._aButtons; 

			if (aButtons) {
				for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
					var welButton = jindo.$Element(aButtons[i]);
					this._wfOnMouseMove.detach(welButton, 'mousemove');
				}				
				this._aButtons = null;
				this._elCurrentBrowseButton = null;
			}

			var sUnique = this._sUnique;
			delete jindo.UploadQueue.__flashCallback[sUnique];
			
			this._destroyFlashForFlash(sUnique);

		},

	_attachEvents : function() {
		var fp = this['_attachEvents' + this._methodPostfix];
		return (this._attachEvents = fp).apply(this, arguments);
	},
	
		_attachEventsForHTML5 : function() {
			
			var self = this;
			var i, nLen;

			this._browseButtonHandlers = {
				
				'sourceChange' : function(oCustomEvent) {
					self._addQueue(this.getFileSelect().files);
					this.getFileSelect().value = '';

					var oNav = jindo.$Agent().navigator();
					if (oNav.ie && oNav.version <= 10) {
						this.getFileSelect().type = 'radio'; // IE10 에서 reset 이 되지 않는 문제 회피
						this.getFileSelect().type = 'file';
					}

				},
				
				/**
				 * 파일 찾기 버튼 안으로 마우스가 올라갔을때 발생한다.
				 * @event buttonOver
				 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
				 */
				'over' : function(oCustomEvent) {
					self.fireEvent('buttonOver', { element : this._el });
				},
				
				/**
				 * 파일 찾기 버튼 밖으로 마우스가 나갔을때 발생한다.
				 * @event buttonOut
				 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
				 */
				'out' : function() {
					self.fireEvent('buttonOut', { element : this._el });
				}
				
			};
			
			var aBrowseButtons = this._browseButtons;
			for (i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].attach(this._browseButtonHandlers);
			}
			
			var aDropAreas = this.option('aDropArea') || [ this.option('elDropArea') ];
			var bOver = false;
			
			var fpSetOver = function(oEvent, bFlag) {
				var elEl = oEvent.currentElement;
				oEvent.stopDefault();
				if (bOver !== bFlag) {
					/**
					 * 드래그 영역 안으로 마우스가 올라갔을때 발생한다.
					 * @event dragOver
					 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
					 */
					/**
					 * 드래그 영역 밖으로 마우스가 나갔을때 발생한다.
					 * @event dragOut
					 * @param {HTMLElement} element 마우스가 빠져나간 HTML 엘리먼트
					 */
					self.fireEvent(bFlag ? 'dragOver' : 'dragOut', {
						element : elEl
					});
					bOver = bFlag;	
				}
			};

			this._aDropAreas = aDropAreas;
			for (i = 0, nLen = aDropAreas.length; i < nLen; i++) {

				var elDropArea = jindo.$(aDropAreas[i]);

				this._wfOnDragEnter = jindo.$Fn(function(oEvent) {
					oEvent.stopDefault();
				}).attach(elDropArea, 'dragenter');
				
				this._wfOnDragOver = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, true);
				}).attach(elDropArea, 'dragover');
				
				this._wfOnDragLeave = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, false);
				}).attach(elDropArea, 'dragleave');

				this._wfOnDrop = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, false);
					self._addQueue(oEvent.$value().dataTransfer.files);
				}).attach(elDropArea, 'drop');
				
	    	}
			
		},
			
		_attachEventsForFlash : function() {
			
			var self = this;
			var sUnique = this._sUnique = 'UQ' + new Date().getTime() + Math.floor(Math.random() * 1000000);
			
			jindo.UploadQueue.__flashCallback[sUnique] = function(sFuncName, aArgs) {
	
				var fpFunc = self._callbackForFlash[sFuncName];
				fpFunc && fpFunc.apply(self, aArgs || []);
	
			};
			
			this._createFlashForFlash(sUnique);
			
			// var welButton = this._welButton = jindo.$Element(this.option('elButton'));

			var aButtons = this._aButtons = this.option('aButton') || [ this.option('elButton') ];

			this._wfOnMouseMove = jindo.$Fn(function(oEvent) {
				self._elCurrentBrowseButton = oEvent.currentElement;
				self._showFlashForFlash(jindo.$Element(self._elCurrentBrowseButton));
			});

			for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
				var welButton = jindo.$Element(aButtons[i]);
				this._wfOnMouseMove.attach(welButton, 'mousemove');
			}
			
		},

	//------------------------------------------------------------------------------------------------------

	_uploadFile : function() {
		var fp = this['_uploadFile' + this._methodPostfix];
		return (this._uploadFile = fp).apply(this, arguments);
	},
	
		_uploadFileForFlash : function(oProp) {
			
			var self = this;
	
			var oFile = oProp.file;
			var sKey = oProp.key;
			
			oFile.state = this._states.PROGRESS;
	
			this._uploading++;
			this._sendForFlash('upload',  [ [sKey] ]);
	
		},
		
		_uploadFileForHTML5 : function(oProp) {
			
			var self = this;
	
			var oFile = oProp.file;
			var sKey = oProp.key;
			
			oFile.state = this._states.PROGRESS;
	
			this._uploading++;
			
			var oXHR = new XMLHttpRequest(),
			oUpload = oXHR.upload;
			
			oUpload.addEventListener("progress", function (oEvent) {
				
				if (!oEvent.lengthComputable) { return; }
				if (!self._xhr[sKey]) { return; }
					
				oFile.loaded = oEvent.loaded;
				oFile.rate = oEvent.loaded && (oEvent.loaded / oFile.size);
				
				/**
				 * 파일의 업로드가 진행 중일 때 발생한다.
				 * 
				 * @event uploadProgress
				 * @param {Object} oFile 파일 정보
				 * 		@param {String} oFile.name 파일 이름
				 * 		@param {String} oFile.ext 파일 확장자
				 * 		@param {Number} oFile.size 파일 크기 (바이트)
				 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
				 * 		@param {Number} oFile.rate 업로드 된 진행률
				 * 		@param {String} oFile.state 현재 파일의 상태 (PROGRESS)
				 * @param {String} sKey 파일 고유키
				 */
				self.fireEvent('uploadProgress', { 'oFile' : oFile, 'sKey' : sKey });
				
			}, false);
			
			/**
			 * 파일의 업로드가 완료 되었을 때 발생한다.
			 * 
			 * @event uploadLoad
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (LOAD)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("load", function () {
				
				var that = this;
				var func = arguments.callee;
				
				if (oXHR.readyState !== 4) {
					setTimeout(function() { func.call(that); }, 0);
					return;
				}
				
				if (oXHR.status === 200) {
					self._setDoneState(sKey, oFile, 'uploadLoad', oFile.size, 1, self._states.LOAD, oXHR.responseText);
				} else {
					self._setDoneState(sKey, oFile, 'uploadError', 0, 0, self._states.ERROR);
				}
				
			}, false);
			
			/**
			 * 파일을 업로드 하다가 에러가 났을 때 발생한다.
			 * 
			 * @event uploadError
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (ERROR)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("error", function () {
				self._setDoneState(sKey, oFile, 'uploadError', 0, 0, self._states.ERROR);
				
			}, false);
			
			/**
			 * 파일의 업로드를 중단 했을 때 발생한다.
			 * 
			 * @event uploadAbort
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("abort", function () {
				self._setDoneState(sKey, oFile, 'uploadAbort', 0, 0, self._states.NONE);
			}, false);
			
			oXHR.open("POST", this.url());
			
			oXHR.setRequestHeader("Cache-Control", "no-cache");
			oXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			
			this._xhr[sKey] = oXHR;
	
			/**
			 * 파일의 업로드가 시작될 때 발생한다.
			 * 
			 * @event uploadStart
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (PROGRESS)
			 * @param {String} sKey 파일 고유키
			 */
			this.fireEvent('uploadStart', { 'oFile' : oFile, 'sKey' : sKey });
			
			var oFormData = new FormData();
			oFormData.append(this.option('sParamName'), oFile);
			
			oXHR.send(oFormData);
			
			return true;
			
		},
	////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	_addQueue : function(aFiles) {
		
		/**
		 * 파일 선택을 완료 했을 때 발생한다.
		 * 
		 * @event beforeSelect
		 * @param {Array} aFiles 파일 목록
		 */

		var i, nLen;
		
		for (i = 0, nLen = aFiles.length; i < nLen; i++) {
			aFiles[i].ext = (/\.([^\.]+)$/.test(aFiles[i].name) && RegExp.$1) || '';
		}
		
		if (!this.fireEvent('beforeSelect', { aFiles : aFiles })) { return false; }
		
		for (i = 0, nLen = aFiles.length; i < nLen; i++) {
			
			var oFile = aFiles[i];
			var oParam = { 'oFile' : oFile, 'sKey' : 'UQ' + new Date().getTime() + Math.round(Math.random() * 100000) };

			/**
			 * 파일이 목록에 추가되기 직전에 발생한다.
			 * 
			 * @remark 여기서 파일의 고유키를 변경하여 지정 할 수 있다.
			 * 
			 * @event beforeAdd
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 
			 * @example
			 * 	o.attach('beforeAddFile', function(oCustomEvent) {
			 * 		oCustomEvent.sKey = 'UNIQ' + new Date().getTime() + Math.round(Math.random() * 100000);
			 * 	});
			 */
			if (!this.fireEvent('beforeAdd', oParam)) { continue; }
			
			var sKey = oParam.sKey;
			
			this._queue.push({
				'key' : oParam.sKey,
				'file' : oFile
			});
			
			oFile.loaded = 0;
			oFile.rate = 0;
			oFile.state = this._states.NONE;
			
			this._flashFiles && (this._flashFiles[oParam.sKey] = oFile);
			this._sendForFlash('setUniqueKeyAt', [ i, sKey ]);
			
			/**
			 * 파일이 목록에 추가된 직후에 발생한다.
			 * 
			 * @event add
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
			 * @param {String} sKey 파일 고유키
			 */
			this.fireEvent('add', { 'oFile' : oFile, 'sKey' : sKey });
			
		}
		
		return true;
		
	},
	
	_findQueue : function(sKey) {
		
		for (var i = 0, nLen = this._queue.length; i < nLen; i++) {
			if (this._queue[i].key === sKey) { return i; }
		}
		
		return -1;
		
	},
	
	/**
	 * 파일의 전체 상태 정보
	 * @method getInfo
	 * @return {Object} 용량 정보
	 * 		@return {Object} .size 파일 사이즈 정보
	 * 			@return {Number} .size.none 아무 상태도 아닌 파일의 용량 합계
	 * 			@return {Number} .size.wait 업로드 대기 중인 파일의 용량 합계
	 * 			@return {Number} .size.progress 업로드 진행 중인 파일의 용량 합계
	 * 			@return {Number} .size.load 업로드 완료한 파일의 용량 합계
	 * 			@return {Number} .size.error 업로드 에러난 파일의 용량 합계
	 * 			@return {Number} .size.total 전체 파일의 용량 합계
	 * 		@return {Object} .count 파일 갯수 정보
	 * 			@return {Number} .count.none 아무 상태도 아닌 파일의 갯수
	 * 			@return {Number} .count.wait 업로드 대기 중인 파일의 갯수
	 * 			@return {Number} .count.progress 업로드 진행 중인 파일의 갯수
	 * 			@return {Number} .count.load 업로드 완료한 파일의 갯수
	 * 			@return {Number} .count.error 업로드 에러난 파일의 갯수
	 * 			@return {Number} .count.total 전체 파일의 갯수
	 */
	getInfo : function() {
		
		var ret = {
			size : { none : 0, wait : 0, progress : 0, load : 0, error : 0, total : 0 },
			count : { none : 0, wait : 0, progress : 0, load : 0, error : 0, total : 0 }
		};
			
		for (var i = 0, len = this._queue.length; i < len; i++) {
			
			var oFile = this._queue[i].file;
			var sState = oFile.state.toLowerCase();
			
			var nSize = oFile.size;
			
			ret.size[sState] += nSize;
			ret.count[sState]++;

			ret.size.total += nSize;
			ret.count.total++;
			
		}

		return ret;
		
	},
	
	/**
	 * 지정한 파일 또는 전체 파일을 목록에서 삭제
	 * @method remove
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 삭제 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 삭제 성공/실패 여부
	 * 
	 * @example
	 * 	o.remove("UNIQ109378183"); // 해당 고유키를 가진 파일 삭제
	 * 
	 * 	o.remove(function(oFile) { // PNG 확장자의 파일만 삭제 
	 * 		return oFile.ext == 'png';
	 * 	});
	 * 
	 * 	o.remove(); // 모든 파일 삭제
	 */
	remove : function(sKey) {
		
		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._removeFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._removeFile(i);
			}
		}

		return true;
		
	},
	
	_removeFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var oFile = oProp.file;
		var sKey = oProp.key;
		
		this._abortFile(nIndex);
		this._queue.splice(nIndex, 1);
		
		this._flashFiles && (delete this._flashFiles[sKey]);

		this._sendForFlash('remove', [[sKey]]);
		
		/**
		 * 파일이 목록에서 삭제된 직후에 발생한다.
		 * 
		 * @event remove
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태
		 * 			@param {String} oFile.state.NONE 목록에만 추가 된 상태
		 * 			@param {String} oFile.state.WAIT 업로드를 위해 기다리는 상태
		 * 			@param {String} oFile.state.PROGRESS 업로드 중인 상태
		 * 			@param {String} oFile.state.LOAD 업로드 완료 된 상태
		 * 			@param {String} oFile.state.ERROR 업로드 중 에러가 발생 한 상태
		 * @param {Object} sKey 파일 고유키
		 */
		this.fireEvent('remove', { 'oFile' : oFile, 'sKey' : sKey });
		
		return true;
		
	},
	
	/**
	 * 지정한 파일 또는 전체 파일의 업로드 중단
	 * @method abort
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 업로드 중단 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 중단 성공/실패 여부
	 */
	abort : function(sKey) {

		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._abortFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._abortFile(i);
			}
		}
		
		return true;
		
	},
	
	_abortFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var sKey = oProp.key;
		var oFile = oProp.file;
		
		if (oFile.state !== this._states.WAIT && oFile.state !== this._states.PROGRESS) { return false; }
		
		if (this._xhr && this._xhr[sKey]) {
			this._xhr[sKey].abort();
		}
		
		this._sendForFlash('abort', [[sKey]]);
		this._setDoneState(sKey, oFile, 'abort', 0, 0, this._states.NONE);
		
		return true;
		
	},
		
	/**
	 * 지정한 파일 또는 전체 파일의 초기화
	 * @method reset
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 초기화 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 초기화 성공/실패 여부
	 */
	reset : function(sKey) {

		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._resetFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._resetFile(i);
			}
		}
		
		return true;
		
	},
	
	_resetFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var sKey = oProp.key;
		var oFile = oProp.file;
		
		if (oFile.state !== this._states.LOAD && oFile.state !== this._states.ERROR) { return false; }
		
		oFile.state = this._states.NONE;
		
		/**
		 * 파일이 초기화 된 직후에 발생한다.
		 * 
		 * @event reset
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
		 * @param {Object} sKey 파일 고유키
		 */
		this.fireEvent('reset', { 'oFile' : oFile, 'sKey' : sKey });
		
		return true;
		
	},
		
	/**
	 * 지정한 파일 또는 전체 파일의 업로드
	 * @method upload
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 업로드 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 * 			@param {String} fpCallback.oFile.name 파일 이름
	 * 			@param {String} fpCallback.oFile.ext 파일 확장자
	 * 			@param {Number} fpCallback.oFile.size 파일 크기 (바이트)
	 *
	 * @return {Boolean} 항상 true
	 */
	upload : function(sKey) {
		
		var sKeyType = typeof sKey;
		var sOrgKey = sKey;
		
		switch (sKeyType) {
		case 'string':
			sKeyType = 'function';
			sKey = function(_sKey) { return sOrgKey === _sKey; };
			//break;
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				
				var oProp = this._queue[i];
				
				if (
					(sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) ||
					oProp.file.state !== this._states.NONE
				) { continue; }

				oProp.file.state = this._states.WAIT;
				
				/**
				 * 파일이 업로드를 위한 대기를 시작했을 때 발생한다.
				 * 
				 * @event wait
				 * @param {Object} oFile 파일 정보
				 * 		@param {String} oFile.name 파일 이름
				 * 		@param {String} oFile.ext 파일 확장자
				 * 		@param {Number} oFile.size 파일 크기 (바이트)
				 * 		@param {String} oFile.state 현재 파일의 상태 (WAIT)
				 * @param {String} sKey 파일 고유키
				 */
				this.fireEvent('wait', { 'oFile' : oProp.file, 'sKey' : oProp.key });
				
			}
			
			break;
		}
		
		this._startUploadFile();
		return true;
		
	},
	
	_startUploadFile : function() {
		
		var nParallel = this.option('nParallel');
		
		if (this._uploading >= nParallel) { return false; }
		
		var bFinish = true;
		
		for (var i = 0, nLen = this._queue.length; i < nLen; i++) {
			
			var oProp = this._queue[i];
			
			if (oProp.file.state === this._states.WAIT) {
				
				bFinish = false;
				
				if (this._uploading < nParallel) {
					this._uploadFile(oProp);
				}
				
			} else if (oProp.file.state === this._states.PROGRESS) {
				
				bFinish = false;
				
			}

		}
		
		return bFinish;
		
	},
	
	_setDoneState : function(sKey, oFile, sEventName, nLoaded, nRate, sState, sLoadResponseText) {
		
		if (oFile.state === sState) { return; }
		
		if (sEventName === 'uploadLoad') {

			/**
			 * 파일의 업로드가 완료되기 직전에 발생한다.
			 * 
			 * @event beforeUploadLoad
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태
			 * @param {String} sKey 파일 고유키
			 * @param {String} sResponseText 서버 응답 문자열
			 * @param {Function} stop 정상적으로 업로드 되지 않았다고 판단 될 때 호출
			 */
			if (!this.fireEvent('beforeUploadLoad', {
				'oFile' : oFile,
				'sKey' : sKey,
				'sResponseText' : sLoadResponseText
			})) {
				return this._setDoneState(sKey, oFile, 'uploadError', 0, 0, this._states.ERROR);
			}
			
		}
			
		var bProgressing = oFile.state === this._states.PROGRESS;

		oFile.loaded = nLoaded;
		oFile.rate = nRate;
		oFile.state = sState;
		
		this._xhr && (delete this._xhr[sKey]);

		this.fireEvent(sEventName, { 'oFile' : oFile, 'sKey' : sKey });
		if (bProgressing) { this._uploading--; }
		
		var bFinish = this._startUploadFile();

		/**
		 * 파일의 업로드가 끝났을 때 발생한다.
		 * 
		 * @remark 어떤 상황(정상적인 업로드, 에러, 중단 모두 포함)으로 끝나던 무조건 발생한다.
		 * 
		 * @event uploadEnd
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태
		 * @param {String} sKey 파일 고유키
		 * @param {Boolean} bFinish true 인 경우 더 이상 업로드 할 파일이 없다는 뜻이다.
		 */
		this.fireEvent('uploadEnd', {
			'oFile' : oFile,
			'sKey' : sKey,
			'bFinish' : bFinish
		});

	},

	/**
	 * 업로드 URL 을 변경한다
	 *
	 * @method url
	 * @param {String} sURL 업로드 URL
	 * @return {this}
	 */
	/**
	 * 업로드 URL 을 얻는다
	 *
	 * @method url
	 * @return {String} 업로드 URL
	 */
	url : function(sURL) {

		if (arguments.length) {
			this._url = sURL;
			return this;
		}

		return this._url;

	}
	
}).extend(jindo.UIComponent);

jindo.UploadQueue.__flashCallback = {};
/**
	엘리먼트가 화면에 보이거나 안 보이는 상황이 되었는지 확인하는 컴포넌트

	@author hooriza
	@version 1.14.0

	@class jindo.Visible
	@extends jindo.Component
	@keyword Visible, 레이어, 감시
**/
jindo.Visible = jindo.$Class({

	/**
		컴포넌트 생성자

		@constructor

		@param {String|HTMLElement} [elWrap=document] 확안할 영역 엘리먼트
		@param {Object} [oOptions] 옵션
			@param {String} [oOptions.sClassName="check_visible"] 확안할 엘리먼트가 가진 클래스명
			@param {Number} [oOptions.nExpandSize=0] 지정한 만큼 좀 더 넓은 범위의 영역을 확안 (단위 : px)
	**/
	$init : function(elWrap, htOption) {

		this._elWrap = jindo.$(elWrap) || document;
		this._nTimer = null;
		
		this.option({
			sClassName : "check_visible",
			nExpandSize : 0 // 확장 영역
		});

		this.option(htOption || {});
		this.refresh();
		
	},

	_supportGetElementsByClassName : function() {

		var oConst = this.constructor;

		if (!('__supportGetElementsByClassName' in oConst)) {

			oConst.__supportGetElementsByClassName = (function() {

				var elDummy = document.createElement('div');

				if (!elDummy.getElementsByClassName) {
					return false;
				}

				var aDummies = elDummy.getElementsByClassName('dummy');
				elDummy.innerHTML = '<span class="dummy"></span>';

				return aDummies === 1;

			})();

		}

		return oConst.__supportGetElementsByClassName;

	},

	/**
		영역 안의 확인 목록 새로고침
		@method refresh

		@remark
			본 메서드는 다음과 같은 경우 호출해야 한다.

			- 확인 대상이 영역 안에 추가 된 경우
			- 확인 대상이 영역 안에서 삭제 된 경우
			- 영역 안에 있는 임의의 엘리먼트에 확인 클래스명이 추가 된 경우

			단 getElementsByClassName 을 지원하는 브라우저의 경우 refresh 는 아무 기능도 수행하지 않는다.

		@return {this}
	*/
	refresh : function() {

		if (this._supportGetElementsByClassName()) {
			this._aTargets = this._elWrap.getElementsByClassName(this.option('sClassName'));
			this.refresh = function() {};
		} else {
			this._aTargets = jindo.$$('.' + this.option('sClassName'), this._elWrap);
		}

		return this;

	},

	/**
		영역 안 확인 목록의 노출 여부 변경 확인하기
		@method check

		@param {Number} [nDelay=-1] 일정 시간이 지난뒤에 확인하고자 할 때 사용한다

		@remark
			nDelay 인자는 scroll 이벤트나 resize 이벤트와 같이 짧은 시간에 반복적으로 발생하는
			이벤트의 핸들러 안에서 check 메서드를 호출하는 경우 생길 수 있는 부하를 줄이기 위해 사용 할 수 있다.

		@return {this}
	*/
	check : function(nDelay) {

		var self = this;

		if (typeof nDelay === 'undefined') { nDelay = -1; }

		if (this._nTimer) {
			clearTimeout(this._nTimer);
			this._nTimer = null;
		}

		if (nDelay < 0) {
			this._check();
		} else {
			this._nTimer = setTimeout(function() {
				self._check();
				self._nTimer = null;
			}, nDelay);
		}

		return this;

	},

	_check : function() {

		var _ = new Date();

		var i;

		var oArea = null;
		var elWrap = this._elWrap;

		var aTargets = this._aTargets;
		var nExpandSize = this.option('nExpandSize');

		var oCount = { 'true' : 0, 'false' : 0 };

		if (elWrap === document) {

			var wdDoc = jindo.$Document(document);
			// var oScrollPosition = wdDoc.scrollPosition();
			var oClientSize = wdDoc.clientSize();

			oArea = {
				top : 0, // oScrollPosition.top,
				left : 0, // oScrollPosition.left,
				bottom : oClientSize.height,
				right : oClientSize.width
			};

		} else {
			oArea = elWrap.getBoundingClientRect();
			oArea = { top : oArea.top, left : oArea.left, bottom : oArea.bottom, right : oArea.right };
		}

		oArea.top -= nExpandSize;
		oArea.left -= nExpandSize;
		oArea.bottom += nExpandSize;
		oArea.right += nExpandSize;

		var aFireList = [];

		for (i = aTargets.length - 1; i >= 0; i--) {

			var elTarget = aTargets[i];
			var oTargetArea = elTarget.getBoundingClientRect(); //getClientRects()[0];

			if (!this._bSupportQSA && !jindo.$Element(elTarget).hasClass(this.option('sClassName'))) {
				delete elTarget.__VISIBLE;
				aTargets.splice(i, 1);
				continue;
			}

			var bBefore = !!elTarget.__VISIBLE;
            var bAfter = !(
                oTargetArea.bottom < oArea.top || oArea.bottom < oTargetArea.top ||
                oTargetArea.right < oArea.left || oArea.right < oTargetArea.left
            );

			elTarget.__VISIBLE = bAfter;

			if (bBefore !== bAfter) {
				aFireList.push([ bAfter, elTarget ]);
				oCount[!bAfter]++;
			} else {
				oCount[bAfter]++;
			}
			
		}

		for (i = aFireList.length - 1; i >= 0; i--) {
			var oFireItem = aFireList[i];

			oCount[!oFireItem[0]]--;
			oCount[oFireItem[0]]++;

			/**
				확인 엘리먼트가 보여지게 되었을 때 발생
				@event visible

				@param {Element} elTarget 보여지게 된 엘리먼트
				@param {Function} nVisible 현재 보이는 엘리먼트 갯수
				@param {Function} nInvisible 현재 안 보이는 엘리먼트 갯수
			**/
			/**
				확인 엘리먼트가 안 보여지게 되었을 때 발생
				@event invisible

				@param {Element} elTarget 안 보여지게 된 엘리먼트
				@param {Function} nVisible 현재 보이는 엘리먼트 갯수
				@param {Function} nInvisible 현재 안 보이는 엘리먼트 갯수
			**/
			this.fireEvent(oFireItem[0] ? 'visible' : 'invisible', {
				'elTarget' : oFireItem[1],
				'nVisible' : oCount['true'],
				'nInvisible' : oCount['false']
			});
		}

		// var elCost = jindo.$('cost');
		// elCost && (elCost.innerHTML = aTargets.length + 'pcs : ' + (new Date() - _) + 'ms');

	}

}).extend(jindo.Component);
/**
	@fileOverview input[type=text] 또는 textarea와 같은 입력 컨트롤에 입력여부를 감지하는 컴포넌트
	@author senxation
	@version 1.14.0
**/
/**
	input[type=text] 또는 textarea와 같은 입력 컨트롤에 입력여부를 감지하는 컴포넌트
	jindo.WatchInput 컴포넌트는 Input Control의 입력 값 변화를 감지합니다.
	IE에서는 "keyup" 이벤트를 감지하고, 그외의 브라우저에서는 focus되었을때 이전 값에서의 변화를 비교하는 타이머가 시작되고 blur되었을때 타이머가 종료된다.
	
	@class jindo.WatchInput
	@extends jindo.UIComponent
	@uses jindo.Timer

	@deprecated oninput 이벤트를 사용하여 구현하는 것을 권장합니다.
	
	@keyword watchinput, watch, input, textarea, 왓치인풋
**/
jindo.WatchInput = jindo.$Class({

	/** @lends jindo.WatchInput.prototype */
	
	_bTimerRunning : false,
	_bFocused : false,
	_sPrevValue : "",
	

	/**
		WatchInput 컴포넌트를 생성한다.
		
		@constructor
		@param {String | HTMLElement} sInputId 적용할 입력 컨트롤의 id혹은 엘리먼트 자체
		@param {Object} [htOption] 옵션 객체
			@param {Number} [htOption.nInterval=100] 변화를 확인할 시간 간격 (IE에서는 타이머로 체크하지 않아 bUseTimerOnIE 옵션을 'true'로 설정하지 않는다면 이 옵션은 적용되지 않는다)
			@param {Boolean} [htOption.bUseTimerOnIE=false] IE에서도 타이머로 변화를 확인할지 여부. IE 에서 타이머로 체크할 경우 true, 그렇지 않다면 false로 설정한다.
			@param {String} [htOption.sKeyEvent="keyup"] IE에서 감지할 키보드이벤트명
			@param {Boolean} [htOption.bPermanent=false] focus와 blur 이벤트의 발생 여부와 상관없이 항상 타이머로 확인할지 여부
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 활성화 여부. 이 옵션을 false로 설정하였을 경우, activate 메서드를 이용해 활성화 시킬 수 있다.
		@example
			var oWatchInput = new jindo.WatchInput("input", {
				nInterval : 100, //Check할 간격 (IE제외)
				bUseTimerOnIE : false, //IE에서 키보드 이벤트를 사용해서 감지할 경우 false로 지정. 다른 브라우저처럼 타이머로 체크하고자하는 경우 true로 설정
				sKeyEvent : "keyup", //attach할 키보드 이벤트 (IE만 해당)
				bPermanent : false, //입력창의 focus/blur에 상관없이 항상 타이머가 동작할지 여부. 중단을 위해서 반드시 stop()이나 deactivate()메서드 호출 필요.(IE제외) 
				bActivateOnload : true //로드시 activate() 수행여부
			}).attach({
				start : function(oCustomEvent) {
					//감지를 시작했을 때 발생
				},
				stop : function(oCustomEvent) {
					//감지를 중단했을 때 발생
				},
				focus : function(oCustomEvent) {
					//입력 컨트롤에 focus되었을 때 발생
				},
				blur : function(oCustomEvent) {
					//입력 컨트롤에 blur(포커스 해제)되었을 때 발생
				},
				timerStart : function(oCustomEvent) {
					//IE를 제외한 브라우저에서는 한글입력시 KeyEvent이벤트가 발생하지 않으므로 timer를 이용해 감지한다
					//timer가 시작됬을 때 발생
				},
				change : function(oCustomEvent) {
					//입력 컨트롤 값이 변경 되었을 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elInput : (HTMLElement) 입력 컨트롤
					//	sText : (String) 변화된 input의 값
					//}
				},
				timerStop : function(oCustomEvent) {
					//IE를 제외한 브라우저에서는 한글입력시 KeyEvent이벤트가 발생하지 않으므로 timer를 이용해 감지한다
					//timer가 중지됬을 때 발생
				}
			});
			
	**/
	$init : function(sInputId, htOption) {
		var htDefaultOption = {
			nInterval : 100, //Check할 간격 (IE제외)
			bUseTimerOnIE : false, //IE에서 키보드 이벤트를 사용해서 감지할 경우 false로 지정. 다른 브라우저처럼 타이머로 체크하고자하는 경우 true로 설정
			sKeyEvent : "keyup", //attach할 키보드 이벤트 (IE만 해당)
			bPermanent : false, //입력창의 focus/blur에 상관없이 항상 타이머가 동작할지 여부. 중단을 위해서 반드시 stop()이나 deactivate()메서드 호출 필요.(IE제외) 
			bActivateOnload : true //로드시 activate() 수행여부
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._elInput = jindo.$(sInputId);
		this._oTimer = new jindo.Timer();
		
		this._bIE = jindo.$Agent().navigator().ie;
		this._wfFocus = jindo.$Fn(this._onFocus, this);
		this._wfBlur = jindo.$Fn(this._onBlur, this);
		this._wfKeyEvent = jindo.$Fn(this._onKeyEvent, this);
		this._wfStartTimer = jindo.$Fn(this._startTimer, this);
		this._wfStopTimer = jindo.$Fn(this._stopTimer, this);
		
		if (this.option("bActivateOnload")) {
			this.activate(true);
		}
	},
	
	/**
		WatchInput이 적용된 Input 엘리먼트를 가져온다.
		
		@method getInput
		@return {HTMLElement}
	**/
	getInput : function() {
		return this._elInput;
	},
	
	/**
		WatchInput이 적용된 Input 엘리먼트의 value를 설정한다.
		
		@method setInputValue
		@remark WatchInput이 적용된 Input 엘리먼트의 값을 키입력 외에 임의로 변경할 때에는 이 메서드를 사용하는 것을 권장한다.
		@return {this}
		@see setCompareValue
		@example
			//input 값을 변경할 경우
			oWatchInput.setInputValue("테스트");
			
			//또는 아래와 같이 사용한다.
			oWatchInput.getInput().value = "테스트";
			oWatchInput.setCompareValue("테스트"); //input의 value와 같은 값으로 설정한다.
	**/
	setInputValue : function(s) {
		this.getInput().value = s;
		this.setCompareValue(s);
		return this;
	},	
	
	/**
		현재의 input value와 비교될 이전 Input의 value를 구한다.
		
		@method getCompareValue
		@return {String} 
	**/
	getCompareValue : function() {
		return this._sPrevValue;
	},
	
	/**
		현재의 input value와 비교할 값을 설정한다.
		
		@method setCompareValue
		@remark IE의 keydown이 발생하지 않거나 FF의 timer가 동작하지 않는 상황에서 input의 value를 변경하면 예기치 않은 change이벤트가 발생하기 때문에 변경된 값과 동일하게 비교할 값을 설정하여 예외처리한다.
		@param {String} s 비교할 값
		@return {this}
		@example
			oWatchInput.getInput().value = "테스트";
			oWatchInput.setCompareValue("테스트"); //input의 value와 같은 값으로 설정한다.
	**/
	setCompareValue : function(s) {
		this._sPrevValue = s;
		return this;
	},
	
	/**
		이전 값과의 비교없이 강제로 change 이벤트를 발생시킨다.
		
		@method fireChangeEvent
		@return {this}
	**/
	fireChangeEvent : function() {
		var elInput = this.getInput(),
			sValue = elInput.value;
		this.setCompareValue(sValue);
		/**
			입력 컨트롤의 값이 변경되었을 때 발생
			
			@event change
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elInput Input Control
			@param {String} sText Input Control의 변경된 값
			@example
				// 커스텀 이벤트 핸들링 예제
				oWatchInput.attach("change", function(oCustomEvent){
					alert('변경된 값은 : ' + oCustomEvent.sText + ' 입니다');
				});
		**/
		this.fireEvent("change", {
			elInput : elInput, 
			sText : sValue
		});
		return this;
	},
	
	/**
		감지를 시작한다.
		감지의 중단은 인터벌 시간 이후에 일어난다.
		IE에서는 KeyEvent 이벤트를 감지한다.
		그외의 브라우저에서는 input에 focus되면 Timer를 사용해 주기적인 비교가 시작되고 blur시 중단된다.
		
		@method start
		@param {Boolean} bCompareOnce 초기화이후 IE의 키보드 이벤트와 그외 브라우저의 Focus이후 Timer동작과 상관없이 최초 1회 비교할지 여부
		@deprecated activate() 사용권장
	**/
	start : function(bCompareOnce) {
		return this.activate(bCompareOnce || false);
	},
	
	/**
		감지를 중단한다.
		
		@method stop
		@deprecated deactivate() 사용권장
	**/
	stop : function() {
		return this.deactivate();
	},
	
	/**
		컴포넌트를 활성화한다.
		@param {Boolean} bCompareOnce 초기화이후 IE의 키보드 이벤트와 그외 브라우저의 Focus이후 Timer동작과 상관없이 최초 1회 비교할지 여부
		@return {this}
	**/
	_onActivate : function(bCompareOnce) {
		this.setCompareValue("");
		var elInput = this.getInput();
		
		this._wfFocus.attach(elInput, "focus");
		if(this._bIE && !this.option("bUseTimerOnIE")) {
			/**
				컴포넌트가 활성화 되었을 때 (start 메서드를 실행하면 컴포넌트가 활성화된다)
				
				@event start
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oWatchInput.attach("start", function(oCustomEvent){
						alert('컴포넌트 감지 시작');
					});
			**/
			this.fireEvent("start");
			this._wfKeyEvent.attach(elInput, this.option("sKeyEvent"));	
		} else {
			if (this._isTimerRunning()) {
				return;
			}
			
			this.fireEvent("start");
			if (this.option("bPermanent")) {
				this._startTimer();
			} else {
				this._wfStartTimer.attach(elInput, "focus");
				this._wfStopTimer.attach(elInput, "blur");
			}
		}
		
		this._wfBlur.attach(elInput, "blur");
		
		if (bCompareOnce || false) {
			this.compare();
		}
	},

	_onDeactivate : function() {
		var elInput = this.getInput();
		this._wfFocus.detach(elInput, "focus");
		this._wfKeyEvent.detach(elInput, this.option("sKeyEvent"));
		this._stopTimer();
		this._wfStartTimer.detach(elInput, "focus");
		this._wfStopTimer.detach(elInput, "blur");
		this._wfBlur.detach(elInput, "blur");
		/**
			컴포넌트가 비활성화 되었을 때 (stop 메서드를 실행하면 컴포넌트가 비활성화된다)
			
			@event stop
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oWatchInput.attach("stop", function(oCustomEvent){
					alert('컴포넌트 감지 정지');
				});
		**/
		this.fireEvent("stop");
	},
	
	/**
		 값을 비교할 시간 간격을 가져온다.
		
		@method getInterval
		@return {Number} ms 단위의 시간 
	**/
	getInterval : function() {
		return this.option("nInterval");
	},
	
	/**
		 값을 비교할 시간 간격을 설정한다.
		
		@method setInterval
		@remark IE제외
		@param {Number} n 시간 간격 (ms)
		@return {this}
	**/
	setInterval : function(n) {
		this.option("nInterval", n);
		return this;
	},
	
	_isTimerRunning : function() {
		return this._bTimerRunning;
	},
	
	_startTimer : function() {
		if(this._isTimerRunning()) {
			return;
		}
		
		this._bTimerRunning = true;
		/**
			타이머가 시작되었을 때 발생
			
			@event timerStart
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oWatchInput.attach("timerStart", function(oCustomEvent) { ... });
		**/
		this.fireEvent("timerStart");
		this.compare();
		
		var self = this;
		this._oTimer.start(function(){
			self.compare();
			return true;
		}, this.getInterval());
	},
	
	_stopTimer : function() {
		if (this._isTimerRunning()) {
			this._oTimer.abort();
			this._bTimerRunning = false;
			this.compare(); //타이머를 중지하고 비교 1회수행
			/**
				타이머가 정지되었을 때 발생
				
				@event timerStop
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oWatchInput.attach("timerStop", function(oCustomEvent) { ... });
			**/
			this.fireEvent("timerStop");
		}
	},
	
	_onKeyEvent : function() {
		this.compare();
	},	
	
	_onFocus : function() {
		this._bFocused = true;
		/**
			입력 컨트롤이 포커스 되었을 때 발생
			
			@event focus
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oWatchInput.attach("focus", function(oCustomEvent) { ... });
		**/
		this.fireEvent("focus");
	},
	
	_onBlur : function() {
		this._bFocused = false;
		/**
			입력 컨트롤의 포커스가 해제되었을 때 발생
			
			@event blur
			@param {String} sType 커스텀 이벤트명
			@example
				// 커스텀 이벤트 핸들링 예제
				oWatchInput.attach("blur", function(oCustomEvent) { ... });
		**/
		this.fireEvent("blur");
	},
	
	/**
		이전의 비교 값과 현재 설정된 값을 강제 비교한다.
		
		@method compare
		@remark IE에서의 key이벤트나, 기타 브라우저의 timer 동작과 관계없이 즉시 비교를 수행한다. (즉, Text Input에 focus될 필요가 없다.) 수행후 값이 바뀐경우 change 커스텀 이벤트를 발생한다.
		@return {this}
	**/
	compare : function(){
		if (this.getInput().value != this.getCompareValue()) {
			this.fireChangeEvent();						
		}
		return this;
	}
}).extend(jindo.UIComponent);