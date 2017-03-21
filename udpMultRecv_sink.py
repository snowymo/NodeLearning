# udp client receive data through multicast in python

import socket
import struct
import sys

multicast_group = '239.0.2.4'
server_address = ('0.0.0.0', 9591)

# Create the socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR,1)

# Bind to the server address
sock.bind(server_address)

# Tell the operating system to add the socket to the multicast group
# on all interfaces.
group = socket.inet_aton(multicast_group)
mreq = struct.pack('4sL', group, socket.INADDR_ANY)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

# Receive/respond loop
while True:
    print >>sys.stderr, '\nwaiting to receive message'
    data, address = sock.recvfrom(65507)
    
    print >>sys.stderr, 'received %s bytes from %s' % (len(data), address)
    st = data.decode('utf8')
    print >>sys.stderr, st
    floats = struct.unpack_from('f', st, 0)
    print >>sys.stderr, floats

    print >>sys.stderr, 'sending acknowledgement to', address
    sock.sendto('ack', address)