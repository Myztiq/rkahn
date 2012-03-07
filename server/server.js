var defaultPort = 83;
if(process.argv.length > 1 && process.argv[2].length){
	require('./app').app.listen(process.argv[2]);
	console.log("Started on port: "+process.argv[2]);
}else{
	require('./app').app.listen(defaultPort);
	console.log("Started on port: "+defaultPort);
}
