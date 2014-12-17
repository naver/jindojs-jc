<?php

    $data = file_get_contents($_FILES['johndoe']['tmp_name']);
    
    file_put_contents(
        "upload/".rawurlencode($_FILES['johndoe']['name']),
        $data
    );
    
    echo $_FILES['johndoe']['size'];
    
?>