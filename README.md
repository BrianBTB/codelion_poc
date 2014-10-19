codelion_poc
============

Proof of concept for webkit exploit on vita 3.18


How to run:
run netcat on computer with -k -l -p <port>
NOTE: to run without netcat, make log.php empty

modify inc/log.php to have your netcat IP and port in the fsockopen

run main.html on vita

success means the vita browser will hang and you don't get the grey reloading screen as in davee's exploit.
Fail means grey reloading screen

vita browser gui still works but buttons do nothing (webkit thread hung)

enjoy