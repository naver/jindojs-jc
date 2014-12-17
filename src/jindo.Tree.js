/**
	@fileOverview 트리구조를 표현하는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/
/**
	트리구조를 표현하는 컴포넌트
	
	@class jindo.Tree
	@extends jindo.UIComponent
	@keyword tree, 트리
**/
jindo.Tree = jindo.$Class({
	/** @lends jindo.Tree.prototype */
	
	_bIsActivating : false, //컴포넌트의 활성화 여부
	_sTemplate : null,
	_htNodeData : null,
	_el : null,
	_elSelectedNode : null,
	
	/**
		Tree 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el 적용할 트리 엘리먼트 
		@param {Object} [htOption] 옵션객체
			@param {String} [htOption.sClassPrefix="tree-"] 클래스명 접두어
			@param {String} [htOption.sEventSelect="click"] 노드 선택을 위한 이벤트명
			@param {String} [htOption.sEventExpand="dblclick"] 자식노드를 펼치거나 접을 이벤트명
			@param {Boolean} [htOption.bExpandOnSelect=true] 레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 activate() 수행여부
		@example
			tree = new jindo.Tree(jindo.$('tree'), { 
				sClassPrefix : 'tree-', //Class Prefix
				sEventSelect : "click", //노드 선택을 위한 이벤트명
				sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
				bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
				bActivateOnload : true //로드시 activate() 수행여부
			}).attach({
				click : function(oCustomEvent) { //sEventExpand 값이 "click" 일 경우
					//자식노드를 펼치거나 접기위해 sEventSelect 옵션으로 지정된 이벤트가 발생할 때
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//	weEvent : (jindo.$Event) 클릭 이벤트 객체
					//}
					//oCustomEvent.stop(); 수행시 노드를 선택하지 않음
				},
				beforeSelect : function(oCustomEvent) {
					//노드가 선택되기 전 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
				},
				select : function(oCustomEvent) {
					//노드가 선택되었을 때 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				dblclick : function(oCustomEvent) { //sEventExpand 값이 "dblclick" 일 경우
					//자식노드를 펼치거나 접기위해 sEventExpand 옵션으로 지정된 이벤트가 발생할 때
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 이벤트가 발생한 노드
					//	weEvent : (jindo.$Event) 더블클릭 이벤트 객체
					//}
					//oCustomEvent.stop(); 수행시 자식노드를 펼치거나 접지 않음
				},
				beforeExpand : function(oCustomEvent) {
					//노드가 펼쳐지기 전에 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 select 이벤트는 발생하지 않는다.
				},
				expand : function(oCustomEvent) {
					//노드가 펼쳐진 후 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				beforeCollapse : function(oCustomEvent) {
					//노드가 접혀지기 전에 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
					//oCustomEvent.stop() 수행시 뒤이어 일어나는 collapse 이벤트는 발생하지 않는다.
				},
				collapse : function(oCustomEvent) {
					//노드가 접혀진 후 발생
					//전달되는 이벤트객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드
					//}
				},
				beforeProcessData : function(oCustomEvent) {
					//노드를 생성할 때 (createNode) 발생한다.
					//sTemplate에 data를 파싱해 넣는 동작을 커스터마이징 할 수 있다.  
					//전달되는 이벤트객체 oCustomEvent = {
					//	sTemplate : (String) '<li class="{=nodeClass}{if lastNode} {=lastNodeClass}{/if}"><div{if hasChild} class="{=hasChildClass}"{/if}><button class="{=buttonClass}">+</button><span class="{=labelClass}" unselectable="on">{=text}</span></div></li>';
					//	htData : (HashTable) 처리중인 데이터 객체
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({ 
			sClassPrefix : 'tree-', //Default Class Prefix
			sEventSelect : "click", //노드 선택을 위한 이벤트명
			sEventExpand : "dblclick", //자식노드를 펼치거나 접을 이벤트명
			bExpandOnSelect : true, //레이블을 클릭하여 선택했을때도 노드를 펼칠지 여부
			bActivateOnload : true //로드시 activate() 수행여부
		});
		this.option(htOption || {});
		
		var sPrefix = this.option('sClassPrefix');
		
		//클래스명들
		this.htClassName = {
			sNode : sPrefix + "node",
			sLastNode : sPrefix + "last-node",
			sHasChild : sPrefix + "has-child",
			sButton : sPrefix + "button",
			sLabel : sPrefix + "label",
			sSelected : sPrefix + "selected",
			sCollapsed : sPrefix + "collapsed"
		};
		
		this.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}" unselectable="on">{=sText}</span></div></li>');
		this._htNodeData = {};
		
		el = jindo.$(el);
		this._setRootList(el);
		
 		this._wfSelectHandler = jindo.$Fn(this._onSelectEvent, this);
		this._wfExpandHandler = jindo.$Fn(this._onExpandEvent, this);
		
		this._makeNodeDataKeyFromHTML(); //data를 마크업으로부터 nodedata를 생성하고 데이터를 기반으로 paint
		this.paintAllNodes();
		
		var elDefaultSelectedNode = jindo.$$.getSingle('.' + this.htClassName.sNode + ' > .' + this.htClassName.sSelected, this.getRootList());
		if (elDefaultSelectedNode) {
			this._setSelectedNode(this.getNode(elDefaultSelectedNode));
		}
		
		if(this.option("bActivateOnload")) {
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		var el = this.getRootList();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(el).preventTapHighlight(true);
		this._wfSelectHandler.attach(el, this.option("sEventSelect"));
		this._wfExpandHandler.attach(el, this.option("sEventExpand"));
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		var el = this.getRootList();
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(el).preventTapHighlight(false);
		this._wfSelectHandler.detach(el, this.option("sEventSelect"));
		this._wfExpandHandler.detach(el, this.option("sEventExpand"));
	},
	
	_onSelectEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode) {
			return;
		}
		
		var elButton = jindo.$$.test(el, '.' + this.htClassName.sButton) ? el : jindo.$$.getSingle('! .' + this.htClassName.sButton, el);
		if (elButton) {
			if (this.isCollapsed(elNode)) {
				this.expandNode(elNode);
			} else {
				this.collapseNode(elNode);
			}
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem) {
				/**
					자식노드를 펼치거나 접기위해 sEventSelect 옵션으로 지정된 이벤트가 발생할 때
					(이벤트 이름은 sEventSelect 옵션명에 따름)
					
					@event click
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 선택될 노드
					@param {jindo.$Event} weEvent 클릭 이벤트 객체
					@param {Function} stop 수행시 노드를 선택하지 않음
					@example
						// 커스텀 이벤트 핸들링 예제
						oTree.attach("click", function(oCustomEvent) { ... });
				**/
				if (this.fireEvent(we.type, { element : elNode, weEvent : we })) {
					this.selectNode(elNode);
				}
			}
		} 
	},
	
	_onExpandEvent : function(we) {
		var el = we.element;
		var elNode = this.getNode(el);
		if (!elNode || !this.hasChild(elNode)) {
			return;
		}
		
		var elLabel = jindo.$$.test(el, '.' + this.htClassName.sLabel) ? el : jindo.$$.getSingle('! .' + this.htClassName.sLabel, el);
		if (elLabel) {
			var htParam = { element : elNode, weEvent : we };
			var htPart = this.getPartsOfNode(elNode);
			if (htPart.elItem && jindo.$Element(htPart.elItem).visible()) {
				if (this.isCollapsed(elNode)) {
					/**
						자식노드를 펼치거나 접기위해 sEventExpand 옵션으로 지정된 이벤트가 발생할 때
						(이벤트 이름은 sEventExpand 옵션명에 따름)
						
						@event dblclick
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} element 이벤트가 발생한 노드
						@param {jindo.$Event} weEvent 더블클릭 이벤트 객체
						@param {Function} stop 수행시 노드를 자식노드를 펼치거나 접지 않음
						@example
							// 커스텀 이벤트 핸들링 예제
							oTree.attach("dblclick", function(oCustomEvent) { ... });
					**/
					if (this.fireEvent(we.type, htParam)) {
						this.expandNode(elNode);
					}
				} else {
					if (!this._bExpandOnSelect) {
						if (this.fireEvent(we.type, htParam)) {
							this.collapseNode(elNode);
						}
					}
				}
			}
		}
	},
	
	//paint관련
	/**
		노드를 새로 그린다.
		
		@method paintNode
		@param {HTMLElement} elNode
		@param {Boolean} bPaintChild 자식노드도 새로 그릴지 여부 (Default : true)
		@return {this}
	**/
	paintNode : function(elNode, bPaintChild) {
		if (typeof bPaintChild == "undefined") {
			bPaintChild = true;
		}
		
		this._paintNode(elNode);
		
		if (bPaintChild) {
			var aNodes = this.getChildNodes(elNode);
			for (var i = 0; i < aNodes.length; i++) {
				this.paintNode(aNodes[i]);
			}
		}
		
		return this;
	},
	
	/**
		모든 노드를 새로 그린다.
		
		@method paintAllNodes
		@param {HTMLElement} [elNode] 새로 그릴 기준 노드
		@return {this}
	**/
	paintAllNodes : function(elNode) {
		this.paintNode(elNode || this.getRootNode());
		return this;
	},
	
	/**
		노드를 새로 그린다. (자식노드가 있거나 마지막 노드일경우 클래스명 처리)
		@ignore
		@param {HTMLElement} elNode
	**/
	_paintNode : function(elNode) {
		if (!elNode) {
			return;
		}
		var htPart = this.getPartsOfNode(elNode);
		var aChildNodes = this.getChildNodes(elNode);
		var htNodeData = this.getNodeData(elNode);
		var welNode = jindo.$Element(elNode); 
		var welItem = jindo.$Element(htPart.elItem);

		delete htNodeData["_aChildren"]; //자식이 없으면 _aChildren 제거
		
		//자식이 있는지 여부		
		if (this.hasChild(elNode)) {
			welItem.addClass(this.htClassName.sHasChild);
			htNodeData["bHasChild"] = true;
			htNodeData["_aChildren"] = [];
			
			var self = this;
			jindo.$A(aChildNodes).forEach(function(elNode, i){
				htNodeData["_aChildren"].push(self.getNodeData(elNode));
			});
		} else {
			htNodeData["bHasChild"] = false;
			welItem.removeClass(this.htClassName.sHasChild);
			if (htPart.elChild) {
				htPart.elChild.parentNode.removeChild(htPart.elChild);	
			}
		}
		
		//마지막 노드인지
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
		if (htNodeData["bLastNode"]) {
			welNode.addClass(this.htClassName.sLastNode);
		} else {
			welNode.removeClass(this.htClassName.sLastNode);
		}
		elNode.parentNode.style.zoom = 1; //ie 렌더링 버그 수정!!
	},
	
	/**
		노드에 적용될 템플릿을 가져온다.
		
		@method getNodeTemplate
		@return {String}
		@example
			oTree.getNodeTemplate();
			기본 값 -> '<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>'
			
			//템플릿에 process될 값들의 Hash Table
			var htProcess = {
				sNodeClass : 노드의 클래스명
				bLastNode : 노드가 마지막인지 여부 
				sLastNodeClass : 마지막 노드의  클래스명
				bHasChild : 노드가 자식을 가지는 지 여부
				sHasChildClass : 자식을 가지는 경우의 클래스명
				sCollapsedClass : 접혀진 노드의 클래스명
				sButtonClass : 접기/펼치기 버튼의 클래스명
				sLabelClass : 레이블의 클래스명
				sText : 노드의 이름 (텍스트)
			};
	**/
	getNodeTemplate : function() {
		return this._sTemplate;
	},
	/**
		노드 생성시 노드에 적용될 템플릿을 설정한다.
		
		@method setNodeTemplate
		@param {String} s
		@return {this}
		@example
			//자식노드가 모두 접혀진 채 생성하는 예제
			oTree.setNodeTemplate('<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if} {=sCollapsedClass}"><div{if bHasChild} class="{=sHasChildClass}"{/if}><button class="{=sButtonClass}">+</button><span class="{=sLabelClass}">{=sText}</span></div></li>');
	**/
	setNodeTemplate : function(s) {
		this._sTemplate = s;
		return this;
	},
	
	//List 관련
	/**
		노드의 트리리스트(ul 엘리먼트)를 가져온다.
		
		@method getChildListOfNode
		@param {HTMLElement} elNode
		@return {HTMLElement} ul 엘리먼트
	**/
	getChildListOfNode : function(elNode) {
		return jindo.$$.getSingle("ul", elNode);
	},
	
	/**
		트리컴포넌트그 최상위 루트 트리리스트(ul 엘리먼트)를 가져온다.
		
		@method getRootList
		@return {HTMLElement}
	**/
	getRootList : function() {
		return this._el;
	},
	
	_setRootList : function(el) {
		this._el = el;
	},
	
	//Node 관련
	/**
		특정 엘리먼트가 속해있는 노드를 구한다.
		
		@method getNode
		@param {HTMLElement} el 노드 자체, 노드의 버튼, 레이블 같이 노드의 li태그 자식 엘리먼트로부터 노드를 구할 수 있다.  
		@return {HTMLElement} 노드 (LI Element)
	**/
	getNode : function(el) {
		var elNode = jindo.$$.test(el, '.' + this.htClassName.sNode) ? el : jindo.$$.getSingle('! .' + this.htClassName.sNode, el);
		return elNode && jindo.$Element(elNode).isChildOf(this.getRootList()) ? elNode : null;
	},
	
	/**
		노드를 구성하는 요소를 구한다.
		
		@method getPartsOfNode
		@param {HTMLElement} elNode
		@return {Object}
		@example
			리턴하는 HashTable = { 
				elItem : (HTMLElement), 
				elChild : (HTMLElement) 
			}
	**/
	getPartsOfNode : function(elNode) {
		var aParts = jindo.$$('> *', elNode);
		return { elItem : aParts[0], elChild : aParts[1] };
	},
	
	/**
		노드의 타입을 구한다.
		
		@method getNodeType
		@param {HTMLElement} elNode
		@return {String} <ul><li>"root"</li><li>"internal"</li><li>"leaf"</li></ul>
	**/	
	getNodeType : function(elNode) {
		if (elNode === this.getRootNode()) {
			return "root";
		} else if (this.getChildNodes(elNode).length > 0) {
			return "internal";
		} else {
			return "leaf";
		}
	},
	
	/**
		루트노드를 구한다.
		
		@method getRootNode
		@return {HTMLElement}
	**/
	getRootNode : function() {
		if (this._elRootNode) {
			return this._elRootNode;
		}
		this._elRootNode = jindo.$$.getSingle('.' + this.htClassName.sNode, this.getRootList());
		return this._elRootNode;
	},
	
	/**
		모든 노드를 가져온다.
		
		@method getAllNodes
		@return {Array}
	**/
	getAllNodes : function() {
		return jindo.$$('.' + this.htClassName.sNode, this.getRootList());
	},
	
	/**
		자식 노드들을 가져온다.
		
		@method getChildNodes
		@param {HTMLElement} elNode 노드
		@return {Array} 자식 노드들의 배열
	**/
	getChildNodes : function(elNode) {
		var elChildList = this.getChildListOfNode(elNode);
		return elChildList ? jindo.$$('> .' + this.htClassName.sNode, elChildList) : [];
	},
	
	/**
		노드가 자식을 가지고 있는지 여부를 가져온다.
		
		@method hasChild
		@param {HTMLElement} elNode 노드
		@return {Boolean}
	**/
	hasChild : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		return htPart.elChild && htPart.elChild.getElementsByTagName('li')[0] ? true : false;
	},
	
	/**
		부모 노드를 가져온다.
		
		@method getParentNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 부모 노드
	**/
	getParentNode : function(elNode) {
		var elRootNode = this.getRootNode();
		if (elNode === elRootNode) {
			return null;
		}
		return this.getNode(elNode.parentNode);
	},
	
	/**
		이전 노드를 가져온다.
		
		@method getPreviousNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 이전 노드
	**/
	getPreviousNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('!~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
		다음 노드를 가져온다.
		
		@method getNextNode
		@param {HTMLElement} elNode 노드
		@return {HTMLElement} 다음 노드
	**/
	getNextNode : function(elNode) {
		var elReturn = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode);
		return elReturn ? this.getNode(elReturn) : null;
	},
	
	/**
		선택된 엘리먼트를 가져온다.
		
		@method getSelectedNode
		@return {HTMLElement}
	**/
	getSelectedNode : function() {
		return this._elSelectedNode;
	},
	
	_setSelectedNode : function(el) {
		this._elSelectedNode = el;
	},
	
	/**
		노드가 접혀있는지 여부를 구함
		
		@method isCollapsed
		@param {HTMLElement} elNode
		@return {Boolean} 노드가 접혀있는지 여부
	**/
	isCollapsed : function(elNode) {
		return jindo.$Element(elNode).hasClass(this.htClassName.sCollapsed);
	},
	
	/**
		노드의 depth를 구한다.
		
		@method getNodeDepth
		@param {HTMLElement} elNode
		@return {Number} 노드의 depth 
	**/
	getNodeDepth : function(elNode) {
		var nDepth = -1;
		
		for (; elNode; elNode = elNode.parentNode) {
			if (elNode == this.getRootList()) {
				break;
			}
			if (jindo.$$.test(elNode, '.' + this.htClassName.sNode)) {
				nDepth++;
			}
		}
		
		return nDepth;
	},
	
	/**
		노드에 Data를 설정한다.
		
		@method setNodeData
		@param {HTMLElement} elNode
		@return {this}
		@example
			oTree.setNodeData(elNode, {
				nType : 1,
				nDepth : 3
			});
			
			oTree.getNodeData(elNode);
			-->  
			{
				bLabel : (String) 노드의 레이블 텍스트명,
				_aChildren : (Array) 자식노드데이터의 배열
				nType : 1,
				nDepth : 3,
			}
	**/
	setNodeData : function(elNode, htNodeData) {
		var sKey = this._getNodeDataKey(elNode);
		delete htNodeData["_aChildren"]; //고정 정보는 설정할 수 없도록 
		delete htNodeData["sLabel"]; //label은 setNodeLabel 메서드로 설정가능
		for (var vProp in htNodeData) {
			this._htNodeData[sKey][vProp] = htNodeData[vProp];	
		}
		return this;
	},
	
	/**
		노드의 label에 해당하는 엘리먼트를 가져온다.
		
		@method getNodeLabelElement
		@param {HTMLElement} elNode
		@return {HTMLElement} 클래스명 "label"을 가지는 엘리먼트
	**/
	getNodeLabelElement : function(elNode) {
		return jindo.$$.getSingle("." + this.htClassName.sLabel, elNode);
	},
	
	/**
		노드의 label을 가져온다.
		
		@method getNodeLabel
		@param {HTMLElement} elNode
		@return {String} label의 innerHTML
	**/
	getNodeLabel : function(elNode) {
		return jindo.$Element(this.getNodeLabelElement(elNode)).html();
	},
	
	/**
		노드의 label을 변경한다.
		
		@method setNodeLabel
		@param {HTMLElement} elNode
		@param {String} sLabel label의 innerHTML
		@return {this}
	**/
	setNodeLabel : function(elNode, sLabel) {
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey]["sLabel"] = sLabel;
		jindo.$Element(this.getNodeLabelElement(elNode)).html(sLabel);
		return this;	
	},
	
	/**
		모든 노드에 키를 생성하여 설정한다.
		@ignore
	**/
	_makeNodeDataKeyFromHTML : function() {
		var aNodes = this.getAllNodes();
		
		//루프
		for (var i = 0; i < aNodes.length; i++) {
			var elNode = aNodes[i];
			this._makeNodeDataKey(elNode);
			this._makeNodeData(elNode);
		}
	},
	
	/**
		노드의 data를 가져오기위한 키를 생성하여 설정한다.
		@ignore
		@param {HTMLElement} elNode
	**/
	_makeNodeDataKey : function(elNode) {
		var welNode = jindo.$Element(elNode);
		var sNodeDataKey = this._getNodeDataKey(elNode);
		if (sNodeDataKey) {
			return false;
		}
		
		var sPrefix = this.option('sClassPrefix');
		var sUnique = ('data-' + new Date().getTime() + parseInt(Math.random() * 10000000, 10)).toString(); //ie8 버그수정. toString 이 없으면 나중에 sUnique 값이 바뀜
		var sUniqueClass = sPrefix + sUnique;
		welNode.addClass(sUniqueClass);
		
		var sKey = this._getNodeDataKey(elNode);
		this._htNodeData[sKey] = {}; //Data Object 초기화
		
		return sKey;		
	},
	
	/**
		노드의 기본 data를 설정한다.
		@param {HTMLElement} elNode
	**/
	_makeNodeData : function(elNode) {
		var htNodeData = this.getNodeData(elNode);
		htNodeData["element"] = elNode;
		htNodeData["sLabel"] = jindo.$Element(this.getNodeLabelElement(elNode)).text();
		htNodeData["bLastNode"] = jindo.$$.getSingle('~ .' + this.htClassName.sNode, elNode) ? false : true;
	},
	
	/**
		노드의 data를 가져오기위한 키를 구한다.
		@ignore
		@param {HTMLElement} elNode
	**/
	_getNodeDataKey : function(elNode) {
		var sClassName = elNode.className;
		var sPrefix = this.option('sClassPrefix');
		
		var rKey = new RegExp('('+ sPrefix + 'data-[0-9]+)');
		if (rKey.test(sClassName)) {
			return RegExp.$1;
		}
		
		return null;
	},
	
	/**
		노드에 설정된 data를 구한다.
		
		@method getNodeData
		@param {HTMLElement} elNode 생략될 경우 전체 데이터셋을 리턴한다.
		@return {Object} 노드의 data
		@example 
			// 노드 data의 기본 구조
			{ 
				sLabel : (String) 노드명, 
				_aChildren : (Array) 자식노드 배열 
			}
	**/
	getNodeData : function(elNode) {
		return (elNode) ? this._htNodeData[this._getNodeDataKey(elNode)] : this._htNodeData;
	},
	
	/**
		노드의 데이터를 제거한다.
		부모의 children에서도 제거한다.
		@param {HTMLElement} elNode
	**/
	_clearNodeData : function(elNode) {
		//todo
		var elParentNode = this.getParentNode(elNode);
		var htNodeData = this.getNodeData(elNode);
		var sKey = this._getNodeDataKey(elNode);
		
		if (elParentNode) {
			var htParentNodeData = this.getNodeData(elParentNode);
			if(htParentNodeData) {
				var nIndex = jindo.$A(htParentNodeData["_aChildren"]).indexOf(htNodeData);
				if(nIndex > -1){
    				htParentNodeData["_aChildren"].splice(nIndex, 1);	
				}
			}
		}

		//자식의 모든 노드 데이터도 재귀로 제거한다.
		var self = this;
		if (this.hasChild(elNode)) {
			jindo.$A(this.getChildNodes(elNode)).forEach(function(elNode){
				self._clearNodeData(elNode);
			});
		}

		delete this._htNodeData[sKey];
	},
	
	/**
		노드를 펼친다.
		
		@method expandNode
		@param {HTMLElement} elNode 펼칠 노드
		@param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
		@return {this}
	**/
	expandNode : function(elNode, bChildAll) {
		/**
			노드가 펼쳐지기 전
			
			@event beforeExpand
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 펼쳐질 노드
			@param {Function} stop 수행시 노드를 자식노드를 펼치지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeExpand", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeExpand', { element : elNode })) {
			return;
		}
		
		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];

		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}
		
		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));
		}

		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).removeClass(this.htClassName.sCollapsed);
			/**
				노드가 펼쳐진 후
				
				@event expand
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 펼쳐진 노드
				@example
					// 커스텀 이벤트 핸들링 예제
					oTree.attach("expand", function(oCustomEvent) { ... });
			**/
			this.fireEvent('expand', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
		노드를 접는다.
		
		@method collapseNode
		@param {HTMLElement} elNode 접을 노드
		@param {Boolean} bChildAll 노드의 자식도 모두 펼칠지 여부
		@return {this}
	**/
	collapseNode : function(elNode, bChildAll) {
		/**
			노드가 접혀지기 전
			
			@event beforeCollapse
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 접혀질 노드
			@param {Function} stop 수행시 노드를 자식노드를 접지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeCollapse", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeCollapse', { element : elNode })) {
			return;
		}
		
		var htPart = this.getPartsOfNode(elNode);
		var aChildren = [];
		
		if (jindo.$$.test(htPart.elItem, '.' + this.htClassName.sHasChild)) {
			aChildren.push(elNode);
		}
		
		if (bChildAll) {
			aChildren = aChildren.concat(jindo.$$('.' + this.htClassName.sHasChild, elNode));
		}
		
		for (var i = 0, elChild; (elChild = aChildren[i]); i++) {
			var elChildNode = this.getNode(elChild);
			jindo.$Element(elChildNode).addClass(this.htClassName.sCollapsed);
			/**
				노드가 접혀진 후
				
				@event collapse
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 접혀진 노드
				@example
					// 커스텀 이벤트 핸들링 예제
					oTree.attach("collapse", function(oCustomEvent) { ... });
			**/
			this.fireEvent('collapse', { element : elChildNode });
		}
		
		return this;
	},
	
	/**
		노드를 선택한다.
		
		@method selectNode
		@param {HTMLElement} elNode 선택할 노드
		@return {Boolean} 선택여부
	**/
	selectNode : function(elNode) {
		var htPart = this.getPartsOfNode(elNode);
		var elSelectedNode = this.getSelectedNode();
		
		var elItem = htPart.elItem;
		
		/**
			노드가 선택되기 전
			
			@event beforeSelect
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 선택될 노드
			@param {Function} stop 수행시 노드를 선택하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("beforeSelect", function(oCustomEvent) { ... });
		**/
		if (!this.fireEvent('beforeSelect', { element : elNode })) {
			return false;
		}
		
		if (elSelectedNode != elNode) {
			this.deselectNode();
			jindo.$Element(elItem).addClass(this.htClassName.sSelected);
			
			this._setSelectedNode(elNode);
		} 
		
		/**
			노드가 선택되었을 때
			
			@event select
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} element 선택된 노드
			@example
				// 커스텀 이벤트 핸들링 예제
				oTree.attach("select", function(oCustomEvent) { ... });
		**/
		this.fireEvent('select', { element : elNode });
		if (this.option("bExpandOnSelect") && elSelectedNode != elNode && this.isCollapsed(elNode)) {
			var self = this;
			this._bExpandOnSelect = true;
			setTimeout(function(){
				self._bExpandOnSelect = false;
			}, 500);
			this.expandNode(elNode);
		} 
		return true;
	},
	
	/**
		선택된 노드를 선택해제한다.
		
		@method deselectNode
		@return {this}
	**/
	deselectNode : function() {
		var elSelectedNode = this.getSelectedNode();
		if (elSelectedNode) {
			jindo.$Element(this.getPartsOfNode(elSelectedNode).elItem).removeClass(this.htClassName.sSelected);
		}
		this._setSelectedNode(null);
		return this;
	},
	
	_createChild : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (!elChild) {
			elChild = jindo.$('<ul>');
			elNode.appendChild(elChild);
		}

		try {
			return elChild;
		} finally {
			elChild = null;
		}
	},
	
	/**
		노드를 삭제한다.
		
		@method removeNode
		@param {HTMLElement} elNode 삭제할 노드
		@return {this}
	**/
	removeNode : function(elNode) {
		//루트노드틑 삭제할 수 없음
		if (!elNode || elNode === this.getRootNode()) {
			this.clearNode(elNode);
			return this;
		}

		var htNodeData = this.getNodeData(elNode);
		var elPreviousNode = htNodeData.bLastNode ? this.getPreviousNode(elNode) : null;
		
		var bLastNode = elNode.parentNode.childNodes.length == 1; 
		
		var elParentNode = this.getParentNode(elNode);
		this._clearNodeData(elNode);
		elNode.parentNode.removeChild(elNode);
		
		this.selectNode(elParentNode);
		
		// 형제중에서 마지막 노드가 삭제되는 경우 앞의 노드가 마지막 노드가 되어야 하므로 paint
		this._paintNode(elPreviousNode);
		
		if (bLastNode) {
			var htParentNodeData = this.getNodeData(elParentNode);
			htParentNodeData.bHasChild = false;
		}
		
		// 부모노드 paint
		this._paintNode(elParentNode);
		return this;
	},
	
	/**
		자식 노드를 모두 삭제한다.
		
		@method clearNode
		@param {HTMLElement} elNode 삭제할 노드들의 부모노드
		@return {Boolean} 삭제여부
	**/
	clearNode : function(elNode) {
		var elChild = this.getChildListOfNode(elNode);
		if (elChild) {
			var aChildLi = elChild.getElementsByTagName('li');
			for (var i = 0, elChildLi; (elChildLi = aChildLi[i]); i++) {
				this._clearNodeData(elChildLi);
			}
			
			elChild.parentNode.removeChild(elChild);
			
			var htNodeData = this.getNodeData(elNode);
			htNodeData.bHasChild = false;
			
			this._paintNode(elNode);
			return true;
		} 
		return false;
	},
	
	/**
		루트를 제외한 모든 노드를 제거한다.
		
		@method clearTree
		@return {this} 
	**/
	clearTree : function() {
		this.clearNode(this.getRootNode());
		return this;
	},
	
	_moveNodes : function(elTargetNode, aNodes, fCallback) {
		for (var i = 0, elNode; (elNode = aNodes[i]); i++) {
			fCallback(elNode);
		}
	},
	
	/**
		특정 노드에 새 자식노드를 삽입한다.
		
		@method appendNode
		@param {HTMLElement} elTargetNode 삽입할 노드의 부모가 될 노드
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	appendNode : function(elTargetNode, aNodes) {
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [aNodes]);
		}
		
		var self = this;
		var elChild = this._createChild(elTargetNode);
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			var elParentNode = null;
			elParentNode = self.getParentNode(elNode);
			
			elChild.appendChild(elNode);
			
			//원래의 부모와 그 부모의 자식
			if (elParentNode) {
				self.paintNode(elParentNode, false);
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		//타겟
		this.paintNode(elTargetNode, false);
		
		//타겟의 자식 (자기 자신과 자신의 형제)
		jindo.$A(this.getChildNodes(elTargetNode)).forEach(function(elChildNode){
			self.paintNode(elChildNode, false);	
		});
		
		return this;
	},
	
	/**
		특정 노드 앞 새 노드를 삽입한다.
		
		@method insertNodeBefore
		@param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	insertNodeBefore : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}

		var self = this;
		var elChildList = elTargetNode.parentNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			
			elChildList.insertBefore(elNode, elTargetNode);
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	/**
		특정 노드 다음에 새 노드를 삽입힌다.
		
		@method insertNodeAfter
		@param {HTMLElement} elTargetNode 기준 노드 (루트노드가 될 수 없다)
		@param {Array} aNodes 삽입할 노드의 배열
		@return {this}
	**/
	insertNodeAfter : function(elTargetNode, aNodes) {
		if(elTargetNode == this.getRootNode()) {
			return;
		}
		
		if (!(aNodes instanceof Array)) {
			return arguments.callee.call(this, elTargetNode, [ aNodes ]);
		}
		
		var self = this;
		var elChildList = elTargetNode.parentNode;
		var elNextNode = elTargetNode;
		this._moveNodes(elTargetNode, aNodes, function(elNode) {
			
			var elParentNode = null;
			elParentNode = self.getNode(elChildList);
			 
			elChildList.insertBefore(elNode, elNextNode.nextSibling); 
			elNextNode = elNode;
			
			//그 부모의 자식
			if (elParentNode) {
				jindo.$A(self.getChildNodes(elParentNode)).forEach(function(elChildNode){
					self.paintNode(elChildNode, false);	
				});
			}
		});
		
		return this;
	},
	
	_getCode : function(aData) {
		if (aData instanceof Array) {
			var aCodes = [];
			var sTemplate = this.getNodeTemplate();
		
			for (var i = 0; i < aData.length; i++) {
				var htData = aData[i];
				var htParam = { sTemplate : sTemplate, htData : htData };
				/**
					노드를 생성할 때 (createNode) 발생
					
					@event beforeProcessData
					@param {String} sType 커스텀 이벤트명
					@param {String} sTemplate 노드의 템플릿문자열
					@param {Object} htData 처리중인 데이터 객체
					@example
						// 커스텀 이벤트 핸들링 예제
						oTree.attach("beforeProcessData", function(oCustomEvent) {
						
							// sNodeClass : 노드 클래스명
							// bLastNode : 마지막 노드인지 여부
							// sLastNodeClass : 마지막 노드임을 나타내는 클래스명
							// bHasChild : 자식 노드가 있는지 여부
							// sHasChildClass : 자식 노드가 있음을 나타내는 클래스명
							// sCollapsedClass : 접혀있는 노드임을 나타내는 클래스명
							// sButtonClass : 버튼을 나타내는 클래스명
							// sLabelClass : 라벨을 나타내는 클래스명
							// sText : 노드의 텍스트
							// htData : 노드 데이터
							
							oCustomEvent.sTemplate = [
								'<li class="{=sNodeClass}{if bLastNode} {=sLastNodeClass}{/if}">',
									'<div{if bHasChild} class="{=sHasChildClass}"{/if}>',
										'<button class="{=sButtonClass}">+</button>',
										'<span class="{=sLabelClass} drag-span" unselectable="on">{=sText}({=htData.sLabel})</span>',
									'</div>',
								'</li>'
							].join('');
						
						});
				**/
				this.fireEvent('beforeProcessData', htParam);
				
				var htProcess = {
					sNodeClass : this.htClassName.sNode,
					bLastNode : (i == aData.length - 1) ? true : false, 
					sLastNodeClass : this.htClassName.sLastNode,
					bHasChild : (typeof htData._aChildren != "undefined" && htData._aChildren.length > 0) ? true : false,
					sHasChildClass : this.htClassName.sHasChild,
					sCollapsedClass : this.htClassName.sCollapsed,
					sButtonClass : this.htClassName.sButton,
					sLabelClass : this.htClassName.sLabel,
					sText : htData.sLabel,
					htData : htData
				};
				
				var sCode = jindo.$Template(htParam.sTemplate).process(htProcess);
				sCode = this._getChildCode(htData._aChildren, sCode);
				aCodes.push(sCode);
			}
			return aCodes.join('\n');
		}
	},

	_getChildCode : function(elChild, sCode) {
		var sChild = elChild ? this._getCode(elChild) : '';
		if (sChild) {
			var bChanged = false;
			sCode = sCode.replace(/(<ul(\s[^>]*)*>)(<\/ul>)/i, function(_, sBegin, __, sClose) {
				bChanged = true;
				return sBegin + sChild + sClose;
			});
			if (!bChanged) {
				sCode = sCode.replace(/<\/li>/i, function(_) { return '\n<ul>' + sChild + '</ul>\n' + _; });
			}
		}
		return sCode;
	},	
	
	_setData : function(elChildListOfParentNode, aDatas) {
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elChildListOfParentNode);
		
		for (var i = 0, nLen = aNodes.length; i < nLen; i++) {
			var elNode = aNodes[i];
			var htNodeData = aDatas[i];
			
			var sKey = this._makeNodeDataKey(elNode);
			
			htNodeData.bLastNode = (i === nLen - 1); 
			
			this._htNodeData[sKey] = htNodeData;
			
			var bHasChild = htNodeData.bHasChild = (typeof htNodeData._aChildren != "undefined" && htNodeData._aChildren.length) || htNodeData.bHasChild ? true : false;
			if (bHasChild) {
				this._setData(this.getChildListOfNode(elNode), htNodeData._aChildren);
			}
		}
	},
	
	/**
		노드를 생성한다.
		
		@method createNode
		@param {Array} aDatas 생성할 노드의 정보
		@return {Array} 생성된 노드들의 배열
		@remark 노드를 생성하기 위해 하나의 노드는 sLabel 스트링이 반드시 필요하고, 자식 노드는 _aChildren 배열로 선언한다.
		@example 
			//기본적인 데이터만을 포함하여 노드를 생성하는 예제
			var aNewNodes = tree.createNode([
				{
					sLabel : '포유류',
					_aChildren : [
						{ sLabel : '고래' },
						{ sLabel : '토끼' },
						{ sLabel : '다람쥐' },
						{
							sLabel : '맹수',
							_aChildren : [
								{ sLabel : '호랑이' },
								{ sLabel : '표범' },
								{ sLabel : '사자' },
								{ sLabel : '재규어' }
							]
						}
					
					]
				},
				
				{ sLabel : '조류' }
			]);
		@example
			//노드별로 원하는 형태의 데이터를 설정하여 생성하는 예제
			var aNodes = tree.createNode([
				{
					sLabel : '포유류',
					nType : 1,
					nValue : 15
				},
				{
					sLabel : '조류',
					nType : 2,
					nValue : 20
				}
			]);
	**/
	createNode : function(aDatas) {
		var elDummy = jindo.$('<ul>');
		elDummy.innerHTML = this._getCode(aDatas);
		var aNodes = jindo.$$("> ." + this.htClassName.sNode, elDummy);
		this._setData(elDummy, aDatas);
		
		return aNodes;
	},
	
	/**
		노드를 생성할 때 적용된 노드의 원시 데이터를 가져온다.
		
		@method getNodeRawData
		@deprecated getNodeData() 사용권장
		@return {Object}
	**/
	getNodeRawData : function(elNode) {
		return this.getNodeData(elNode);
	},
	/**
		노드가 연속으로 선택된 횟수를 가져온다.
		
		@method getSelectCount
		@return {Number}
		@deprecated
	**/
	getSelectCount : function() {
		return this;
	}
	
}).extend(jindo.UIComponent);
