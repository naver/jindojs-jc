////////////////////////////////////////////////////////////////////////////////
//
//  NHN CORPORATION
//  Copyright 2008 NHN Corporation
//  All Rights Reserved.
//
//  이 문서는 NHN㈜의 지적 자산이므로 NHN㈜의 승인 없이 이 문서를 
//  다른 용도로 임의 변경하여 사용할 수 없습니다. 
//  NHN㈜는 이 문서에 수록된 정보의 완전성과 정확성을 검증하기 위해 
//  노력하였으나, 발생할 수 있는 내용상의 오류나 누락에 대해서는  
//  책임지지 않습니다. 따라서 이 문서의 사용이나 사용결과에 따른  
//  책임은 전적으로 사용자에게 있으며, NHN㈜는 이에 대해 명시적 
//  혹은 묵시적으로 어떠한 보증도하지 않습니다.
//  NHN㈜는 이 문서의 내용을 예고 없이 변경할 수 있습니다.
//
//  @ UploadQueue.as
//  @ Author: 조휘헌(chohwihun, kr14583)
//  @ First created: 12.04. 2012
//  @ Last revised: 12.04. 2012
//  @ Version: v.0.1
//
////////////////////////////////////////////////////////////////////////////////

package{
import flash.display.Sprite;
import flash.display.StageAlign;
import flash.display.StageScaleMode;
import flash.events.DataEvent;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IOErrorEvent;
import flash.events.MouseEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;
import flash.external.ExternalInterface;
import flash.net.FileReference;
import flash.net.FileReferenceList;
import UFile;
import Awaiter;
import SafeExternalInterface;

[SWF(width="100", height="100", frameRate="30")]
public class UploadQueue extends Sprite{
	//--------------------------------------------------------------------------
	//
	//    Constants
	//
	//--------------------------------------------------------------------------
	
	
	private const VERSION:String = "0.0.0";
	
	//--------------------------------------------------------------------------
	//
	//    Class mix-ins
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Class Variables
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Class Properties
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Class Methods
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Variables
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Constructor
	//
	//--------------------------------------------------------------------------
	
	public function UploadQueue(){
		if(stage){
			init();
		}else{
			addEventListener(Event.ADDED_TO_STAGE, addedToStageHandler);
		}
	}
	
	//--------------------------------------------------------------------------
	//
	//    Override Properties
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Properties
	//
	//--------------------------------------------------------------------------
	
	/**
	 * 파일 선택 창에서 여러개의 파일을 선택 할 수 있도록 할지 여부 (기본값 : true)
	 * true : 가능
	 * false : 불가능
	 */
	private var isMultiple:Boolean = true;
	/**
	 * 업로드 할 경로
	 */
	private var url:String = null;
	/**
	 * 호출할 자바스크립트 함수 이름
	 */
	private var jsFunctionName:String = "";
	/**
	 * button의 투명도 (기본값 : 0)
	 */
	private var buttonOpacity:Number = 0;
	/**
	 * 업로드할때 사용할 파라미터 이름
	 */
	private var uploadParamName:String = null;
	/**
	 * 사용자의 클릭 인터랙션을 받을 투명 버튼
	 */
	private var button:Sprite = null;
	/**
	 * FileReference 객체(isMultiple이 false 일 때) 혹은 FileReferenceList 객체를(isMultiple이 true 일 때) 참조하는 변수
	 */
	private var fileSelector:EventDispatcher = null;
	/**
	 *  Awaiter 객체를 원소로 갖는 업로드 대기열
	 */
	private var queue:Object = {};
	/**
	 *  queue에 담기기전의 후보가 담겨 있는 배열 UFile 객체가 담겨있다.
	 */
	private var candidates:Array;
	
	//--------------------------------------------------------------------------
	//
	//    Override Methods
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Methods
	//
	//--------------------------------------------------------------------------
	
	//----------------------------------
	//  of public
	//----------------------------------
	
	/**
	 *  keys에 담긴 고유 키값에 매치되는 파일을 업로드한다.
	 *  @method upload
	 *  @param keys {Array} 고유 키값 문자열을 담고 있는 배열
	 */
	public function upload(keys:Array):void{
		var i:int;
		var key:String;
		var keysLength:uint = keys.length;
		var awaiter:Awaiter;
		
		//trace("keys 길이 : " + keysLength);
		
		for(i = 0; i < keysLength; i++){
			key = String(keys[i]);
			awaiter = queue[key] as Awaiter;
			
			if(awaiter){
				//trace("업로드함 key : " + key + ", 파일명 : " + awaiter.oFile.name);
				uploadAwaiter(awaiter);
			}
		}
	}
	
	/**
	 *  index위치의 파일의 고유 키값으로 key를 지정한다. (selectFile()호출시 전달한 순서와 동일해야 함) key가 지정된 Awaiter객체만이 queue에 추가된다.
	 *  @method setUniqueKeyAt
	 *  @param index {uint} 파일의 인덱스
	 *  @param key {String} 고유 키값
	 */
	public function setUniqueKeyAt(index:uint, key:String):void{
		//trace(index + " 번째의 key를 '" + key + "' 로 지정함, 파일명 : " + (candidates[index] as UFile).name);
		queue[key] = new Awaiter(candidates[index] as UFile, key);
	}
	
	/**
	 *  keys에 담긴 파일의 고유 키값에 매치되는 Awaiter 객체를 삭제한다.
	 *  @method remove
	 *  @param keys {Array} 삭제하고자 하는 파일의 고유 키값 문자열을 담고 있는 배열
	 */
	public function remove(keys:Array):void{
		var i:int;
		var key:String;
		var keysLength:uint = keys.length;
		
		for(i = 0; i < keysLength; i++){
			key = String(keys[i]);
			
			if(queue[key]){
				//trace(key + "에 해당하는 Awaiter 객체 삭제함, 파일명 : " + (queue[key] as Awaiter).oFile.name);
				delete queue[key];
			}
		}
	}
	
	/**
	 *  keys에 담긴 파일의 고유 키값에 매치되는 파일의 업로드를 취소함
	 *  @method abort
	 *  @param keys {Array} 취소하고자 하는 파일의 고유 키값 문자열을 담고 있는 배열
	 */
	public function abort(keys:Array):void{
		var i:int;
		var key:String;
		var keysLength:uint = keys.length;
		var awaiter:Awaiter;
		
		for(i = 0; i < keysLength; i++){
			key = keys[i];
			awaiter = queue[key] as Awaiter;
			
			if(awaiter){
				//trace(key + "에 해당하는 Awaiter 객체 abort() 호출함, 파일명 : " + (queue[key] as Awaiter).oFile.name);
				awaiter.abort();
			}
		}
	}
	
	//----------------------------------
	//  of private
	//----------------------------------

	private function init():void{
		var parameters:Object = loaderInfo.parameters;
		
		stage.scaleMode = StageScaleMode.NO_SCALE;
		stage.align = StageAlign.TOP_LEFT;
		stage.addEventListener(Event.RESIZE, stageResizeHandler);
		
		ExternalInterface.addCallback("upload", upload);
		ExternalInterface.addCallback("setUniqueKeyAt", setUniqueKeyAt);
		ExternalInterface.addCallback("remove", remove);
		ExternalInterface.addCallback("abort", abort);
		
		//var s = parameters["sJSFunctionName"] + '&amp; " %';
		//SafeExternalInterface.call("console.log", [1, undefined, NaN, Infinity, 32, RegExp("abc")]);
		//ExternalInterface.call("console.log", [1, undefined, NaN, Infinity, 32, RegExp("abc")]);
		//SafeExternalInterface.call("console.log", s, [1, undefined, NaN, Infinity, 32, RegExp("abc"), s], { key : s });
		//ExternalInterface.call("console.log", s, [1, undefined, NaN, Infinity, 32, RegExp("abc"), s], { key : s });

		if(parameters["sURL"]){
			url = parameters["sURL"];
		}
		
		if(parameters["bMultiple"]){
			isMultiple = parameters["bMultiple"] == "true";
		}
		
		if(parameters["sJSFunctionName"]){
			jsFunctionName = parameters["sJSFunctionName"];
		}
		
		if(parameters["nButtonOpacity"]){
			buttonOpacity = parseFloat(parameters["nButtonOpacity"]);
			buttonOpacity = isNaN(buttonOpacity) ? 0 : buttonOpacity;
		}
		
		if(parameters["sParamName"]){
			uploadParamName = parameters["sParamName"];
		}
		
		fileSelector = isMultiple ? new FileReferenceList() : new FileReference();
		fileSelector.addEventListener("select", fileSelectHandler);
		
		drawButton();
	}
	
	/**
	 *  사용자 클릭 인터랙션을 받을 버튼을 그림. (버튼이 생성되지 않았다면 생성함)
	 *  @ignore
	 */
	private function drawButton():void{
		if(!button){
			button = new Sprite();
			button.buttonMode = true;
			button.addEventListener(MouseEvent.CLICK, buttonClickHandler);
			button.addEventListener(MouseEvent.ROLL_OVER, buttonRollOverHandler);
			button.addEventListener(MouseEvent.ROLL_OUT, buttonRollOutHandler);
			addChild(button);
		}
		
		button.graphics.clear();
		button.graphics.beginFill(0xFF0000, buttonOpacity);
		button.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
		button.graphics.endFill();
	}
	
	/**
	 *  배열의 FileReference 객체로부터 UFile 객체를 생성하여 배열에 담아 반환한다.
	 *  @ignore
	 */
	private function getUFilesFrom(files:Array):Array{
		var ea:int = files.length;
		var i:int = 0;
		var uFiles:Array = [];
		var fr:FileReference = null;
		
		for(i = 0; i < ea; i++){
			fr = files[i] as FileReference;
			uFiles.push(new UFile(fr, fr.name, (fr.type||'').replace(/\./, ""), fr.size));
		}
		return uFiles;
	}
	
	/**
	 *  Awaiter 객체에 이벤트 핸들러를 부착하고, 업로드를 시작한다.
	 *  @ignore
	 */
	private function uploadAwaiter(awaiter:Awaiter):void{
		awaiter.addEventListener(Event.OPEN, awaiterOpenHandler);
		awaiter.addEventListener(ProgressEvent.PROGRESS, awaiterProgressHandler);
		awaiter.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, awaiterUploadCompleteDataHandler);
		awaiter.addEventListener(IOErrorEvent.IO_ERROR, awaiterIOErrorHandler);
		awaiter.addEventListener(SecurityErrorEvent.SECURITY_ERROR, awaiterSecurityErrorHandler);
		awaiter.upload(url, uploadParamName);
	}
	
	//--------------------------------------------------------------------------
	//
	//    Override Event Handlers
	//
	//--------------------------------------------------------------------------
	
	//--------------------------------------------------------------------------
	//
	//    Event Handlers
	//
	//--------------------------------------------------------------------------
	
	//----------------------------------
	//  of stage
	//----------------------------------
	
	/**
	 *  스테이지가 리사이즈될 때마다 투명 버튼을 다시 그린다.
	 *  @ignore
	 */
	private function stageResizeHandler(e:Event):void{
		drawButton();
	}	
	
	//----------------------------------
	//  of this
	//----------------------------------
	
	/**
	 *  UploadQueue 인스턴스가 생성되고 스테이지에 붙으면 초기화 한다.
	 *  @ignore
	 */
	private function addedToStageHandler(e:Event):void{
		init();
	}
	
	//----------------------------------
	//  of FileReference or FileReferenceList
	//----------------------------------
	
	/**
	 *  파일을 선택하면 호출된다. 에러가 나는 경우는 4GB 이상의 파일을 선택했을 때이다.
	 *  @ignore
	 */
	private function fileSelectHandler(e:Event):void{
		var files:Array;
		var isOccurError:Boolean = false;
		
		if(isMultiple){
			files = (fileSelector as FileReferenceList).fileList; 
		}else{
			files = [fileSelector as FileReference];
		}
		
		try{
			candidates = getUFilesFrom(files);
		}catch(e:Error){
			//trace(e);
			isOccurError = true;
			SafeExternalInterface.call(jsFunctionName, "selectFileError", [e.message]);
		}finally{
			if(!isOccurError){
				SafeExternalInterface.call(jsFunctionName, "selectFile", [candidates]);
			}
		}
	}
	
	//----------------------------------
	//  of button
	//----------------------------------
	
	/**
	 *  투명 버튼이 클릭되면 호출된다.
	 *  @ignore
	 */
	private function buttonClickHandler(e:MouseEvent):void{
		if(isMultiple){
			(fileSelector as FileReferenceList).browse();
		}else{
			(fileSelector as FileReference).browse();
		}
	}
	
	/**
	 *  투명 버튼에 마우스 오버하면 호출된다.
	 *  @ignore
	 */
	private function buttonRollOverHandler(e:MouseEvent):void{
		SafeExternalInterface.call(jsFunctionName, "buttonOver", []);
	}
	
	/**
	 *  투명 버튼에 마우스 아웃하면 호출된다.
	 *  @ignore
	 */
	private function buttonRollOutHandler(e:MouseEvent):void{
		SafeExternalInterface.call(jsFunctionName, "buttonOut", []);
	}
	
	//----------------------------------
	//  of Awaiter
	//----------------------------------
	
	/**
	 *  Awiater.oFile 객체에서 업로드를 시작하고 'open'이벤트가 발생하면 호출된다.
	 *  @ignore
	 */
	private function awaiterOpenHandler(e:Event):void{
		//trace("open 핸들러 : " + (e.currentTarget as Awaiter).oFile.name);
		SafeExternalInterface.call(jsFunctionName, "start", [e.currentTarget as Awaiter]);
	}
	
	/**
	 *  Awiater.oFile 객체에서 'progress'이벤트가 발생하면 호출된다.
	 *  @ignore
	 */
	private function awaiterProgressHandler(e:ProgressEvent):void{
		SafeExternalInterface.call(jsFunctionName, "progress", [e.currentTarget as Awaiter]);
	}
	
	/**
	 *  Awiater.oFile 객체에서 'uploadCompleteData'이벤트가 발생하면 호출된다.
	 *  @ignore
	 */
	private function awaiterUploadCompleteDataHandler(e:DataEvent):void{
		var awaiter:Awaiter = e.currentTarget as Awaiter;
		var obj:Object = {
			sKey : awaiter.sKey,
			oFile : awaiter.oFile,
			sResponse : e.data
		}
		
		SafeExternalInterface.call(jsFunctionName, "load", [obj]);
	}
	
	/**
	 *  Awiater.oFile 객체에서 'ioError'이벤트가 발생하면 호출된다.
	 *  @ignore
	 */
	private function awaiterIOErrorHandler(e:IOErrorEvent):void{
		SafeExternalInterface.call(jsFunctionName, "error", [e.currentTarget as Awaiter]);
	}
	
	/**
	 *  Awiater.oFile 객체에서 'securityError'이벤트가 발생하면 호출된다.
	 *  @ignore
	 */
	private function awaiterSecurityErrorHandler(e:SecurityErrorEvent):void{
		SafeExternalInterface.call(jsFunctionName, "error", [e.currentTarget as Awaiter]);
	}
}
}