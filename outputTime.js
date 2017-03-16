// output time

var i = 0;
while(1){
	if(i++ %10000 == 0){
		console.log('date now',Date.now());
	}
	if (i > 10000)
		i -= 10000;
}

