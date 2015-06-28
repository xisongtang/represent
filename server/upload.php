<?php
	//var_dump($_FILES, $_POST);
	if (count($_FILES) === 0)
		exit("error");
	$filename = md5_file($_FILES["file"]["tmp_name"]).filesize($_FILES["file"]["tmp_name"]);
	rename($_FILES["file"]["tmp_name"], "files/".$filename);
	echo json_encode("/server/files/".$filename);
?>