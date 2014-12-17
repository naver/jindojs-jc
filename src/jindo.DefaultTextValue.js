/**
	@fileOverview Text Input에 입력 값이 없을 경우 "입력해주세요"와 같이 기본 안내 문구를 등록한다
	@author senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);	