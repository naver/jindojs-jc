/**
	@fileOverview Ajax History  
	@author AjaxUI-1 <TarauS> modified by senxation
	@version #__VERSION__#
**/

/**
    한 페이지내에서 모든 기능을 구현하는 서비스에서 브라우저 히스토리 기능을 사용 할 수 있도록 하는 컴포넌트
    
    @class jindo.AjaxHistory
    @extends jindo.Component
    
    @keyword ajax, history, 히스토리, hash, 해쉬, 해시, pushState
**/
jindo.AjaxHistory = jindo.$Class({
	/** @lends jindo.AjaxHistory.prototype */
	
	/**
		이벤트 핸들러 저장 객체
		@type {HashTable}
	**/
	_htEventHandler : {},
	/**
		히스토리 데이터 저장 객체
		@type {HashTable}
	**/
	_htHistoryData : {},
	/**
		에이전트 정보 저장 객체
		@type {Object}
	**/
	_oAgent : null,
	/**
		IE 7이하에서 사용할 아이프레임 객체
		@type {WrappingElement}
	**/
	_welIFrame : null,
	/**
		setInterval()의 리턴 값
		@type {Number}
	**/
	_nIntervalId : 0,
	/**
		로케이션 변경 체크 방법
		@type {String}
	**/
	_sCheckType : "",
	/**
		컴포넌트 인스턴스의 고유 아이디 값
		@type {String}
	**/
	_sComponentId : "",

	/**
		스태틱 메서드
		@private
	**/
	$static : {
		/**
			IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위한 함수<br/>
			Hidden IFrame의 history.html이 로딩될 때마다 이 함수를 호출 함
			
			@method checkIFrameChange
			@static
			@private
			@param oLocation
		**/
		checkIFrameChange : function(oLocation){
			var htQueryString = jindo.$S(oLocation.search.substring(1)).parseString();
			this._aInstances[0]._checkLocationChange(encodeURIComponent(htQueryString.hash));
			/*
			for(var i=0; i<aInstanceList.length; i++){
				if(htQueryString.componentId == aInstanceList[i].getComponentId()){
				alert("iframe callback : "+htQueryString.hash);
					aInstanceList[i]._checkLocationChange(encodeURIComponent(htQueryString.hash));
					break;
				}
			}
			*/
		}
	},
	
	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션 객체
			@param {Number} [htOption.nCheckInterval=100] IE 7 이하나 onhashchange 이벤트를 지원하지 않는 브라우저에서 location.hash의 변경을 체크할 주기.<br/>특별히 문제가 없을 경우, 변경을 할 필요 없음
			@param {String} [htOption.sIFrameUrl="history.html"] IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위해 로딩하는 웹문서의 위치
		@example
			var oAjaxHistoryInstance = new jindo.AjaxHistory({
				// IE7 이하의 브라우저에서 로케이션 변경을 체크하기 위해 로딩하는 웹문서의 위치
				"sIFrameUrl" : "history.html",
				// attach() 함수를 사용하지 않고, 초기화 시에 이벤트 핸들러를 연결하기 위해 사용
				"htCustomEventHandler" : {
					"load" : function(){
						alert("load event");
					},
					"change" : function(oChangeEvent){
						alert("change event");
					}
				},
				// setInterval()을 이용하여 로케이션 변경을 체크 시, 체크 주기
				"nCheckInterval" : 100
			});
		
			oAjaxHistoryInstance.initialize(); //초기화
			oAjaxHistoryInstance.addHistory({
				"sPageType" : "layer",
				"aParameter" : [
					"1", "2", "3"
				]
			});
	**/
	$init : function(htOption){
		this._oAgent = jindo.$Agent().navigator();
		this._sComponentId = "AjaxHistory"+(new Date()).getTime();
		this.option({
			sIFrameUrl : "history.html",
			nCheckInterval : 100
		});
		this.option(htOption || {});
		
		(this.constructor._aInstances = this.constructor._aInstances || []).push(this);
	},

	/**
		컴포넌트 초기화 후에, 로케이션 변경 체크 및 초기 이벤트 발생을 위한 초기화 함수
		
		@method initialize
		@return {this} 컴포넌트 인스턴스 자신
	**/
	initialize : function(){
		var sHash = this._getLocationHash();
		
		// onHashChange 이벤트를 지원하는 경우
		if((this._oAgent.ie && (document.documentMode||this._oAgent.version) >= 8 && jindo.$Document().renderingMode() == "Standards") || (this._oAgent.firefox && this._oAgent.version >= 3.6) || (this._oAgent.chrome && this._oAgent.version > 3) || (this._oAgent.safari && this._oAgent.version >= 5) || (this._oAgent.opera && this._oAgent.version >= 10.6)){
			this._htEventHandler["hashchange"] = jindo.$Fn(this._checkLocationChange, this).attach(window, "hashchange");
			this._sCheckType = "hashchangeevent";
		// IE 7 이하인 경우
		}else if(this._oAgent.ie){
			this._welIFrame = jindo.$Element("<IFRAME>");
			this._welIFrame.hide();
			this._welIFrame.appendTo(document.body);
			this._sCheckType = "iframe";
			
		// setInterval() 함수를 이용하여 체크해야 하는 경우
		}else{
			this._nIntervalId = setInterval(jindo.$Fn(this._checkLocationChange, this).bind(), this.option("nCheckInterval"));
			this._sCheckType = "setinterval";
		}

		if(sHash&&sHash!="%7B%7D"){
			
			if(this._sCheckType == "iframe"){
				this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
			}else{
				this._htHistoryData = this._getDecodedData(sHash);
				/**
					사용자가 앞으로/뒤로가기 버튼을 눌러 이동을 하거나 히스토리 데이터가 포함된 URL을 이용하여 접근시 발생
					
					@event change
					@param {String} sType 커스텀 이벤트명
					@param {Object} htHistoryData 커스텀 이벤트객체 프로퍼티2
					@example
						oAjaxHistory.attach("change", function(oCustomEvent){
							// htHistoryData의 데이터를 바탕으로 화면의 UI를 재구성
							if(oChangeEvent.sPageType == "main_page"){
								showPage(oChangeEvent.sLayer, oChangeEvent.nPage);
							}else{
								showPageAnother(oChangeEvent.sLayer, oChangeEvent.nPage);
							}
						});
				**/
				this.fireEvent("change", {
					htHistoryData : this._htHistoryData
				});
			}
		}else{
			
			var that = this;
			if(this._oAgent.ie&&(document.documentMode||this._oAgent.version) < 8){
				var ifr = this._welIFrame.$value();
			    ifr.onreadystatechange = function(){
			        if (ifr.readyState == "complete"){
			        	/**
			        	 * 페이지 로딩시 발생되는데, URL에 히스토리 데이터를 포함하고 있을 경우엔 load 이벤트 대신 change 이벤트가 발생
			        	 *
			        	 * @event load
			        	 * @param {String} sType 커스텀 이벤트명
			        	 * @example
			        	 * 	oAjaxHistory.attach("load", function(oCustomEvent) {
			        	 * 		//히스토리 데이터를 포함하지 않은 URL로 페이지가 로딩되었을 경우, 초기 UI 구성에 대한 작업을 수행
			        	 * 	});
			        	 */
						that.fireEvent("load");
						ifr.onreadystatechange = function(){};
			        }
			    };

				ifr.src = this.option("sIFrameUrl");
			}else{
				setTimeout(function(){
					that.fireEvent("load");	
				},0);	
			}
		}
		
		return this;
	},

	/**
		컴포넌트의 고유 아이디를 리턴
		
		@method getComponentId
		@return {String} 컴포넌트 고유 아이디
	**/
	getComponentId : function(){
		return this._sComponentId;
	},

	/**
		encode여부를 확인한다.
        @method _isEncoded
        @private
		@return {Boolean} 인코딩 여부
	**/
	_isEncoded : function(str){
		return decodeURIComponent(str) !== str;
	},
	
	/**
		현재 설정되어 있는 Hash String을 리턴
        @method _getLocationHash
        @private
		@return {String} 현재 설정된 Hash String
	**/
	_getLocationHash : function(){
		var hash = location.hash.substring(1);
		return this._isEncoded(hash) ? (hash||"%7B%7D") : encodeURIComponent(hash);
	},

	/**
		location.hash 설정 함수
		@method _setLocationHash
		@private
		@param {String} sHash location.hash를 sHash로 변경
	**/
	_setLocationHash : function(sHash){
		location.hash = sHash=="%7B%7D"?"":sHash;
	},

	/**
		htHistoryData를 브라우저의 히스토리에 추가
		
		@method addHistory
		@param {Object} htHistoryData 추가할 히스토리 데이터 객체
		@return {Boolean} 히스토리 추가 결과
	**/
	addHistory : function(htHistoryData){
		if(htHistoryData && typeof(htHistoryData) == "object" && jindo.$H(htHistoryData).length() > 0){
			this._htHistoryData = jindo.$Json(jindo.$Json(htHistoryData).toString()).toObject(); //deep copy
			var sHash = this._getEncodedData(htHistoryData);

			// 현재 설정된 데이터와 추가하려는 데이터가 같지 않을 경우에만 히스토리에 추가
			if(this._getLocationHash() != sHash){
				this._setLocationHash(sHash);
				if(this._sCheckType == "iframe"){
					this._welIFrame.$value().src = this.option("sIFrameUrl") + "?hash=" + sHash;
				}
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	},

	/**
		히스토리 변경을 체크하여 change 이벤트를 발생시키는 함수
		
        @method _checkLocationChange
        @private
		@param {String} [sHash] 로케이션 변경 체크 시, 사용할 히스토리 데이터 문자열
	**/
	_checkLocationChange : function(sHash){
		sHash = sHash=="undefined" ? "%7B%7D": sHash;
//		console.log(sHash)
		sHash = (sHash && typeof(sHash) == "string") ? sHash : this._getLocationHash();
		var htCurrentHistoryData = this._getDecodedData(sHash);
//		console.log(htCurrentHistoryData);
		
		if(!this._compareData(this._htHistoryData, htCurrentHistoryData)){
			this._htHistoryData = htCurrentHistoryData;
			if(this._sCheckType == "iframe"){
				this._setLocationHash(sHash);
			}
//			console.log(this._htHistoryData);
			// change 이벤트 발생
			this.fireEvent("change", {
				htHistoryData : this._htHistoryData
			});
		}
	},

	/**
		htHistoryData 객체를 Json 문자열로 변환 후, 인코딩하여 리턴

        @method _getEncodedData
        @private
		@param {Object} htHistoryData 히스토리 데이터 객체
		@return {String} Json 문자열로 변환 후, 인코딩한 문자열
		@remark JSON.stringify() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
		@remark 위의 함수를 지원하지 않을 경우, jindo.$Json().toString() 함수 사용
	**/
	_getEncodedData : function(htHistoryData){
		if(htHistoryData){
			// JSON.stringify() 함수를 지원하는 경우
			if(typeof(JSON) == "object" && typeof(JSON.stringify) == "function"){
				return encodeURIComponent(JSON.stringify(htHistoryData));
			}else{
				return encodeURIComponent(jindo.$Json(htHistoryData).toString());
			}
		}else{
			return "";
		}
	},
	
	/**
		인코딩된 히스토리 데이터를 HashTable 객체로 변환 후, 리턴

        @method _getDecodedData
        @private
		@param {String} sEncodedHash 인코딩된 히스토리 데이터
		@return {Object} 디코딩 후, HashTable로 변환한 객체
		@remark JSON.parse() 함수를 브라우저에서 지원할 경우, 해당 함수 사용
		@remark 위의 함수를 지원하지 않을 경우, jindo.$Json().toObject() 함수 사용
	**/
	_getDecodedData : function(sEncodedHash){
		try {
			if(sEncodedHash){
				var sHashString = decodeURIComponent(sEncodedHash);
				// JSON.parse() 함수를 지원하는 경우
				if(typeof(JSON) == "object" && typeof(JSON.parse) == "function"){
					return JSON.parse(sHashString);
				}else{
					return jindo.$Json(sHashString).toObject();
				}
			}
		} catch (e) {}
		return {};
	},

	/**
		두 데이터 객체를 비교하여 결과를 리턴

        @method _compareData
        @private
		@param {Object} htBase 비교 기준 객체
		@param {Object} htComparison 비교 객체
		@param {Boolean} 비교 결과
		@remark 하위 데이터가 Object나 Array일 경우, 재귀적으로 비교
	**/
	_compareData : function(htBase, htComparison){
		
		if (!htBase || !htComparison) { return false; }
			
		var wBase = htBase instanceof Array ? jindo.$A(htBase) : jindo.$H(htBase);
		var wComparison = htComparison instanceof Array ? jindo.$A(htComparison) : jindo.$H(htComparison);
		
		if (wBase.length() != wComparison.length()) { return false; }
		
		var bRet = true;
		var fpCallee = arguments.callee;
		
		wBase.forEach(function(v, k) {
			
			if(typeof(v) == "object"){
				if(!fpCallee(v, htComparison[k])){
					bRet = false;
					return;
				}
			}else{
				if(v != htComparison[k]){
					bRet = false;
					return;
				}
			}
			
		});
		
		return bRet;

	},

	/**
		컴포넌트 소멸자
		
		@method destroy
	**/
	destroy : function(){
		// 설정된 로케이션 체크 방법을 해제
		if(this._sCheckType == "hashchangeevent"){
			this._htEventHandler["hashchange"].detach(window, "hashchange");
		}else if(this._sCheckType == "iframe"){
			this._welIFrame.leave();
		}else{
			clearInterval(this._nIntervalId);
		}
		// 프로퍼티 초기화
		this._htEventHandler = null;
		this._htHistoryData = null;
		this._oAgent = null;
		this._welIFrame = null;
		this._nIntervalId = null;
		this._sCheckType = null;
		this._sComponentId = null;

		var aInstances = this.constructor._aInstances || [];
		var nIndex = jindo.$A(aInstances).indexOf(this);
		
		if (nIndex > -1) { aInstances.splice(nIndex, 1); }
	}
}).extend(jindo.Component);