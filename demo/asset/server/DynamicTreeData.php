<?php

sleep(rand(0.2,1.5));

echo $_GET["_callback"]."(
{
	sKey : '".$_GET["key"]."',
	sLabel : 'parent-node',
	aChildren : [
		{
			sLabel:'node', 
			bHasChild:false
		},
		{
			sLabel:'internal-node', 
			bHasChild:true
		}
	]
}
)";


?>