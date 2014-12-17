<?php

sleep(rand(0.2,1.5));

echo $_GET["_callback"]."(
{
	key : '".$_GET["key"]."',
	label : 'parent-node',
	children : [
		{
			label:'node', 
			hasChild:false
		},
		{
			label:'internal-node', 
			hasChild:true
		}
	]
}
)";


?>