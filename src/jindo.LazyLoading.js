/**
	@fileOverview js파일을 동적으로 로드하는 컴포넌트
	@author senxation
	@version #__VERSION__#
**/

/**
	jindo.LazyLoading 컴포넌트는 js파일을 동적으로 로드합니다.
	
	@class jindo.LazyLoading
	@static
	
	@keyword lazy, loading, 지연, 로딩, 성능, defer
**/
jindo.LazyLoading = {
	_waLoading : jindo.$A([]),
	_waLoaded : jindo.$A([]),
	_whtScript : jindo.$H({}),
	_whtCallback : jindo.$H({})
};

/**
	js파일을 동적으로 로드한다.
	
	@method load
	@static
	@param {String} sUrl 로드할 js파일의 경로
	@param {Function} fCallback js파일 로드 완료후 실행할 콜백함수
	@param {String} [sCharset="utf-8"] 문자셋
	@remark
		이미 로드된 파일은 다시 로드하지 않지만, 콜백함수(fCallback)는 이미 로드되어 있더라도 수행된다.
		경로가 정확하다면 항상 로드가 성공한다고 가정하고 로드중인 파일은 다시 로드할 수 없다. (ie는 로드의 실패여부를 판단할 수 없다.)
	@return {Boolean} 현재 로드중인 js파일을 로드하는경우에만 false를 리턴한다. (로드중인 파일은 다시 로드하지 않지만, 콜백은 바인딩된다.)   
**/
/**
	js파일을 동적으로 로드한다.
	
	@method load
	@static
	@param {String} aUrl 로드할 js파일의 경로 목록
	@param {Function} fCallback js파일 로드 완료후 실행할 콜백함수
	@param {String} [sCharset="utf-8"] 문자셋
	@remark
		이미 로드된 파일은 다시 로드하지 않지만, 콜백함수(fCallback)는 이미 로드되어 있더라도 수행된다.
		경로가 정확하다면 항상 로드가 성공한다고 가정하고 로드중인 파일은 다시 로드할 수 없다. (ie는 로드의 실패여부를 판단할 수 없다.)
	@return {Boolean} 요청한 js파일목록 중에 하나라도 이미 로드중인 파일인 경우 false를 리턴한다. (로드중인 파일은 다시 로드하지 않지만, 콜백은 바인딩된다.)   
**/
jindo.LazyLoading.load = function(sUrl, fCallback, sCharset) {

	if (typeof fCallback != "function") {
		fCallback = function(){};
	}

	if (sUrl instanceof Array) {

		var fLoad = arguments.callee;
		var bRet = true;

		var nLen = sUrl.length;
		var nRemained = nLen;

		for (var i = 0; i < nLen; i++) {
			bRet &= this.load(sUrl[i], function() {
				nRemained--;
				if (nRemained === 0) { fCallback(); }
			}, sCharset);
		}

		return bRet;

	}

	this._queueCallback(sUrl, fCallback);
	if (this._checkIsLoading(sUrl)) {
		return false;
	}
	
	if (this._checkAlreadyLoaded(sUrl)) {
		this._doCallback(sUrl);
		return true;
	}
	
	this._waLoading.push(sUrl);
	
	var self = this;
	var elHead = document.getElementsByTagName("head")[0]; 
	var elScript = document.createElement("script");
	elScript.type = "text/javascript";
	elScript.charset = sCharset || "utf-8";
	elScript.src = sUrl;
	this._whtScript.add(sUrl, elScript);
	
	if ('onload' in elScript) {
		elScript.onload = function() {
			self._waLoaded.push(sUrl);
			self._waLoading = self._waLoading.refuse(sUrl);
			self._doCallback(sUrl);
		};
	} else {
		elScript.onreadystatechange = function() {
		    if(this.readyState == "complete" || this.readyState == "loaded") {
				self._waLoaded.push(sUrl);
				self._waLoading = self._waLoading.refuse(sUrl);
				self._doCallback(sUrl);
				this.onreadystatechange = null;
		    }
		};		
	}

	elHead.appendChild(elScript);
	return true;
};

jindo.LazyLoading._queueCallback = function(sUrl, fCallback) {
	var aCallback = this._whtCallback.$(sUrl);
	if (aCallback) {
		aCallback.push(fCallback);
	} else {
		this._whtCallback.$(sUrl, [fCallback]);
	}
};

jindo.LazyLoading._doCallback = function(sUrl) {
	var aCallback = this._whtCallback.$(sUrl).concat();
	for (var i = 0; i < aCallback.length; i++) {
		this._whtCallback.$(sUrl).splice(i, 1);
		aCallback[i]();
	}
};

/**
	로드중인 파일을 로드 중단한다. script 태그도 제거된다.
	
	@method abort
	@static
	@param {String} sUrl 로드중인 js파일의 경로
	@return {Boolean} 성공적으로 중단한경우 true, 로딩중이 아니면 false를 리턴한다.
**/
jindo.LazyLoading.abort = function(sUrl) {
	if (this._checkIsLoading(sUrl)) {
		var elScript = this.getScriptElement(sUrl);
		this._waLoading = this._waLoading.refuse(sUrl);
		
		if ('onload' in elScript) {
			elScript.onload = null;
		} else {
			elScript.onreadystatechange = null;	
		}		
		jindo.$Element(elScript).leave();
		this._whtScript.remove(sUrl);
		this._whtCallback.remove(sUrl);
		return true;
	} else {
		return false;
	}
};

jindo.LazyLoading._checkAlreadyLoaded = function(sUrl) {
	return this._waLoaded.has(sUrl);
};

jindo.LazyLoading._checkIsLoading = function(sUrl) {
	return this._waLoading.has(sUrl);
};

/**
	로드된 js파일 URL의 배열을 가져온다.
	
	@method getLoaded
	@static
	@return {Array} URL의 배열
**/
jindo.LazyLoading.getLoaded = function() {
	return this._waLoaded.$value();
};

/**
	로드중인 js파일 URL의 배열을 가져온다.
	
	@method getLoading
	@static
	@return {Array} URL의 배열
**/
jindo.LazyLoading.getLoading = function() {
	return this._waLoading.$value();
};

/**
	로드를 위해 생성된 script 엘리먼트를 가져온다.
	
	@method getScriptElement
	@static
	@param {String} sUrl js파일의 경로
	@return {HTMLElement} `<script>`
**/
jindo.LazyLoading.getScriptElement = function(sUrl) {
	return this._whtScript.$(sUrl) || null;
};