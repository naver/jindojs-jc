/**
	@fileOverview 브라우저가 스크롤되어도 항상 레이어가 따라오도록 위치를 고정시키는 컴포넌트 
	@author hooriza, modified by senxation
	@version #__VERSION__#
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
