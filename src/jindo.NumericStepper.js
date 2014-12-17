/**
	@fileOverview Text Input의 숫자 값을 증감 버튼을 클릭(Click)이나 마우스 휠(Wheel) 동작으로 증감 시킬 수 있는 컴포넌트
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);	