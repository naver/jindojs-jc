/**
	@fileOverview 자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리
	@author senxation
	@version #__VERSION__#
**/
/**
	자식 노드를 Ajax요청으로 실시간으로 가져오는 동적트리 컴포넌트
	
	@class jindo.DynamicTree
	@extends jindo.Tree
	
	@keyword dynamic, tree, ajax, 동적, 트리
**/
jindo.DynamicTree = jindo.$Class({
	/** @lends jindo.DynamicTree.prototype */
	
	/**
		DynamicTree 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} el 컴포넌트를 적용할 Base (기준) 엘리먼트
		@param {Object} [htOption] 옵션객체
			@param {String} [htOption.sClassPrefix="tree-"] 클래스명 접두어
			@param {String} [htOption.sUrl=""] 요청 URL
		@example
			var oDanamicTree = new jindo.DynamicTree(jindo.$('tree'), {
				sClassPrefix: 'tree-',
				sUrl : "http://ajaxui.jindodesign.com/docs/components/samples/response/DynamicTree.php"
			}).attach({
				request : function(oCustomEvent){
					//자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
					//이벤트 객체 oCustomEvent = {
					//	element : (HTMLElement) 선택된 노드, 
					//	htRequestParameter : { //(Object) Ajax 요청을 보낼 파라미터 객체
					//		sKey : (String) 선택된 노드의 유일한 key 값
					// 	}
					//}
					//oCustomEvent.stop() 수행시 Ajax 요청 보내지 않음
				},
				response : function(oCustomEvent){
					//응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
					//이벤트 객체 e = {
					//	htResponseJSON : (HashTable) Ajax 응답의 JSON 객체
					//}
					//oCustomEvent.stop() 수행시 응답에 대한 자식노드를 추가하지 않음
				}
			});
		@example
			// 응답 예제
			{
				sKey : 'tree-data-12452282036211399187', //부모 노드의 키
				htChildren : [
					{
						sLabel : 'node', //첫번째 자식 노드의 레이블   
						bHasChild : false //노드가 자식을 가지는지의 여부 
					},
					{
						sLabel : 'internal-node', 
						bHasChild : true
					}
				]
			}
	**/
	$init : function(el, htOption) {
		
		var htDefaultOption = {
			sUrl : "", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : {} //(Object) 파라미터
		};
		
		this.option(htDefaultOption);
		this.option(htOption || {});

		this._attachEvents();		
		this._initAjax();
	},
	
	_attachEvents : function() {
		var self = this;
		
		this.attach("beforeExpand", function(oCustomEvent){
			
			var el = oCustomEvent.element;
			
			var self = this;
			//받아온 데이터가 있는지확인
			if(self.getNodeData(el).hasOwnProperty("_aChildren") && self.getNodeData(el)._aChildren.length) {
				return;
			}
	
			var htRequestParameter = self.option("htRequestParameter");
			htRequestParameter.key = self._getNodeDataKey(el);
			var htParam = {
				element : el,
				htRequestParameter : htRequestParameter 
			};
			
			/**
				자식노드의 데이터를 가져오기위해 Ajax 요청을 보내기 직전에 발생
				
				@event request
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 선택된 노드
				@param {Object} htRequestParameter Ajax 요청을 보낼 파라미터 객체 
					@param {String} htRequestParameter.sKey 선택된 노드의 유일한 key 값
				@example
					// 커스텀 이벤트 핸들링 예제
					oDynamicTree.attach("request", function(oCustomEvent) {
						// stop() 수행시 Ajax 요청 보내지 않음
						oCustomEvent.stop()
					});
			**/
			if (self.fireEvent("request", htParam)) {
				//데이터를 받아옴
				self._request(htParam.htRequestParameter);
			}
			else {
				oCustomEvent.stop();				
			}
		});
	},
	
	_initAjax : function() {
		var htOption = this.option();
		var sPrefix = this.option("sClassPrefix");
        var sUrl = htOption.sUrl;
		var self = this;     
		this._oAjax = jindo.$Ajax(sUrl, {
            type: htOption.sRequestType,
            method: htOption.sRequestMethod,
            onload: function(oResponse){
                try {
					var htParam = {
						htResponseJSON : oResponse.json() 
					};
					
					/**
						응답을 받은 후 자식노드를 트리에 추가하기 전에 발생
						
						@event response
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} element 선택된 노드 프로퍼티
						@param {Object} e 이벤트 객체 
							@param {Object} e.htResponseJSON Ajax 응답의 JSON 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oDynamicTree.attach("response", function(oCustomEvent) {
								// stop() 수행시 응답에 대한 자식노드를 추가하지 않음
								oCustomEvent.stop()
							});
					**/
					if (!self.fireEvent("response", htParam)) {
						return;
					}
					
					var elNode = self.createNode(htParam.htResponseJSON["aChildren"]);
					var elTargetNode = jindo.$$.getSingle("." + htParam.htResponseJSON["sKey"], self.getRootList());
					if(self.getChildListOfNode(elTargetNode)) {
						return;
					}
					self.appendNode(elTargetNode, elNode);
					
					//자식이 있는경우 닫힌상태로 append
					jindo.$A(elNode).forEach(function(el){
						if (jindo.$$.getSingle("." + sPrefix + "has-child", el)) {
							jindo.$Element(el).addClass(sPrefix + "collapsed");	
						}
					});
                } 
                catch (e) {
                }
            }
        });
	},
	
	/**
     * @ignore
     */
    _request: function(htRequestParameter){
		this._oAjax.abort();
		this._oAjax.request(htRequestParameter);	
    },
		
	/**
		노드가 자식을 가지고 있는지 여부를 가져온다. (overriding)
		
		@method hasChild
		@param {Object} elNode
		@return {Boolean}
	**/
	hasChild : function(elNode) {
		return this._htNodeData[this._getNodeDataKey(elNode)]["bHasChild"] || (this.getChildNodes(elNode).length > 0);
	},
	
	/**
		(overriding)
		@ignore
	**/
	_makeNodeData : function(elNode) {
		var oNodeData = this.getNodeData(elNode);
		oNodeData["bHasChild"] = false;
		if (jindo.$Element(this.getPartsOfNode(elNode).elItem).hasClass(this.option('sClassPrefix') + 'has-child')) {
			oNodeData["bHasChild"] = true;				
		}	
		this.$super._makeNodeData(elNode);
	}
	
}).extend(jindo.Tree);
