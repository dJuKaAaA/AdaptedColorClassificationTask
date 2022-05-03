<?php
//collect data send as XML
$trialData = file_get_contents('php://input');
//$trialData = '0001587703477798,0640,0,0.5,false,true,124.00,117.00,114.00,';
// Strip out the header region of the line which determines filename
$header = substr($trialData,0,50);
//echo $header;
$filenameArray = str_getcsv($header, ",");
$filename = "exp_kontrol.csv";
//echo $filename;
// $pathname = "../../../SecureData/HWH8/";
$pathname = "../Podaci/";
 $fullname = $pathname . $filename;
 //echo $fullname;
//open a file handler with read and write permission
//$fh = fopen('../../../SecureData/sheepData.csv', 'a');
$fh = fopen($fullname, 'a');
//writing XML string to the new file
fwrite($fh, $trialData);
//closing the file handler
fclose($fh);
// if (1) {
//     trigger_error("Number cannot be larger than 10");
//   }

?>
