/**
	@fileOverview 메뉴의 펼침/닫힘을 이용한 네비게이션을 구현한 아코디언 컴포넌트
	@author senxation
	@version #__VERSION__#
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
}).extend(jindo.UIComponent);