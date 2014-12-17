<?php

	$host = "http://".getenv("HTTP_HOST").":".getenv("SERVER_PORT").dirname(getenv("REQUEST_URI"));

	//기본 리다이렉트
	$url = $_REQUEST["callback"] .'?callback_func='. $_REQUEST["callback_func"];
	
	if (is_uploaded_file($_FILES['Filedata']['tmp_name'])) { //성공시 사이즈와 url 전송
		$tmp_name = $_FILES['Filedata']['tmp_name'];
		$name = $_FILES['Filedata']['name'];
		$new_path = "upload/".$name;
	 	@move_uploaded_file($tmp_name, $new_path);
		$url .= "&size=". $_FILES['Filedata']['size'];
		$url .= "&url=".rawurlencode($host."/upload/".rawurlencode($name));
	} else { //실패시 errstr=error 전송
		$url .= '&errstr=error';
	}
	
	header('Location: '. $url);
	
?>