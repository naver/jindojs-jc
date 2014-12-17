/**
	@fileOverview 특정 엘리먼트로부터 상대적인 레이어의 위치를 구한다. 
	@author senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);