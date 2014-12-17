/**
	@fileOverview 레이어를 보여주고 숨겨주거나 특정 애니메이션 효과를 적용하는 컴포넌트
	@author senxation
	@version #__VERSION__#
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
