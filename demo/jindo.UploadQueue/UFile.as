package{
import flash.events.DataEvent;
import flash.events.Event;
import flash.events.EventDispatcher;
import flash.events.IOErrorEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;
import flash.net.FileReference;
import flash.net.URLRequest;
import flash.net.URLRequestMethod;

/**
 *  Uploadqueue File 줄여서 UFile
 */
public class UFile extends EventDispatcher{
	private var fileReference:FileReference;
	
	public var name:String = null;
	public var ext:String = null;
	public var size:uint = 0;
	public var loaded:uint = 0;
	public var rate:Number = 0;
	
	public function UFile(fileReference:FileReference, name:String,
							ext:String, size:int, loaded:int = 0,
							rate:Number = 0){
		this.fileReference = fileReference;
		this.name = name;
		this.ext = ext;
		this.size = size;
		this.loaded = loaded;
		this.rate = rate;
	}
	
	public function abort():void{
		removeEventListeners();
		fileReference.cancel();
	}
	
	public function upload(url:String, uploadParamName:String):void{
		var req:URLRequest = new URLRequest(url);
		req.method = URLRequestMethod.POST;
		fileReference.addEventListener(Event.OPEN, openHandler);
		fileReference.addEventListener(ProgressEvent.PROGRESS, progressHandler);
		//fileReference.addEventListener(Event.COMPLETE, completeHandler);
		fileReference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteDataHandler);
		fileReference.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
		fileReference.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
		fileReference.upload(req, uploadParamName);
	}
	
	private function removeEventListeners():void{
		fileReference.removeEventListener(Event.OPEN, openHandler);
		fileReference.removeEventListener(ProgressEvent.PROGRESS, progressHandler);
		//fileReference.removeEventListener(Event.COMPLETE, completeHandler);
		fileReference.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, uploadCompleteDataHandler);
		fileReference.removeEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
		fileReference.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
	}
	
	private function openHandler(e:Event):void{
		dispatchEvent(e);
	}
	
	private function progressHandler(e:ProgressEvent):void{
		loaded = e.bytesLoaded;
		rate = loaded / e.bytesTotal;
		dispatchEvent(e);
	}
	
	/*private function completeHandler(e:Event):void{
		//dispatchEvent(e);
	}*/
	
	private function uploadCompleteDataHandler(e:DataEvent):void{
		dispatchEvent(e);
	}
	
	private function ioErrorHandler(e:IOErrorEvent):void{
		removeEventListeners();
		dispatchEvent(e);
	}
	
	private function securityErrorHandler(e:SecurityErrorEvent):void{
		removeEventListeners();
		dispatchEvent(e);
	}
}
}