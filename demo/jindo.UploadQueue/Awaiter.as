package{
import flash.events.DataEvent;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IOErrorEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;

/**
 *  대기열에 들어 가는 객체라 하여, Awaiter 즉, 대기자라고 명명함
 *  Javascript 쪽으로 전달하는 객체이며, Javascript로 Awaiter 객체 전달시 일반적인 object로 변환딤.
 *  public 속성과 get 속성들만 참조 가능하고, 메서드는 참조할 수 없다.
 */
internal class Awaiter extends EventDispatcher{
	public var oFile:UFile = null;
	public var sKey:String = null;
	
	public function Awaiter(uFile:UFile, key:String){
		oFile = uFile;
		sKey = key;
	}
	
	public function abort():void{
		removeOFileEventListeners();
		oFile.abort();
	}
	
	public function upload(url:String, uploadParamName:String):void{
		oFile.addEventListener(Event.OPEN, oFileOpenHandler);
		oFile.addEventListener(ProgressEvent.PROGRESS, oFileProgressHandler);
		//oFile.addEventListener(Event.COMPLETE, oFileCompleteHandler);
		oFile.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, oFileUploadCompleteDataHandler);
		oFile.addEventListener(IOErrorEvent.IO_ERROR, oFileIOErrorHandler);
		oFile.addEventListener(SecurityErrorEvent.SECURITY_ERROR, oFileSecurityErrorHandler);
		oFile.upload(url, uploadParamName);
	}
	
	private function removeOFileEventListeners():void{
		oFile.removeEventListener(Event.OPEN, oFileOpenHandler);
		oFile.removeEventListener(ProgressEvent.PROGRESS, oFileProgressHandler);
		//oFile.removeEventListener(Event.COMPLETE, oFileCompleteHandler);
		oFile.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, oFileUploadCompleteDataHandler);
		oFile.removeEventListener(IOErrorEvent.IO_ERROR, oFileIOErrorHandler);
		oFile.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, oFileSecurityErrorHandler);
	}
	
	private function oFileOpenHandler(e:Event):void{
		dispatchEvent(e);
	}
	
	private function oFileProgressHandler(e:ProgressEvent):void{
		dispatchEvent(e);
	}
	
	/*private function oFileCompleteHandler(e:Event):void{
		//dispatchEvent(e);
	}*/
	
	private function oFileUploadCompleteDataHandler(e:DataEvent):void{
		removeOFileEventListeners();
		dispatchEvent(e);
	}
	
	private function oFileIOErrorHandler(e:IOErrorEvent):void{
		removeOFileEventListeners();
		dispatchEvent(e);
	}
	
	private function oFileSecurityErrorHandler(e:SecurityErrorEvent):void{
		removeOFileEventListeners();
		dispatchEvent(e);
	}
}
}