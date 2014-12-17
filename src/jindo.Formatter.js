/**
	@fileOverview Text Input의 값을 특정한 형식으로 변환하는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);