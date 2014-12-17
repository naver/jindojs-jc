/**
	@fileOverview Text Input의 Caret에 대한 제어를 가능하게 하는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
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
