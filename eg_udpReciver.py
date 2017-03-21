# learning udp receiver in python

import socket
    
UDP_IP = "192.168.1.38"
UDP_PORT = 9591
   
sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR,1)
sock.bind((UDP_IP, UDP_PORT))
    
while True:
	data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
	print "received message:", data
