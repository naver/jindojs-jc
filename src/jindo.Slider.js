/**
	@fileOverview 영역내의 값을 마우스 클릭 또는 드래그로 선택하는 슬라이더 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);