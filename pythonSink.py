# receive data from python wrapper through udp and unpacked it into three floats

import socket
import sys
import struct

# Create a TCP/IP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Bind the socket to the port
server_address = ('192.168.1.38', 8888)
print >>sys.stderr, 'starting up on %s port %s' % server_address
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR,1)
sock.bind(server_address)

while True:
    print >>sys.stderr, '\nwaiting to receive message'
    data, address = sock.recvfrom(1024)
    
    print >>sys.stderr, 'received %s bytes from %s' % (len(data), address)
    fb,lr,tm = struct.unpack_from('f',data,0), struct.unpack_from('f',data,4), struct.unpack_from('f',data,8)
    # fb = struct.unpack_from('f',data,0)
    print >>sys.stderr, fb, lr, tm
    
    # if data:
        # sent = sock.sendto(data, address)
        # print >>sys.stderr, 'sent %s bytes back to %s' % (sent, address)

