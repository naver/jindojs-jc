/**
	@fileOverview 별점 입력 컴포넌트
	@author senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);	