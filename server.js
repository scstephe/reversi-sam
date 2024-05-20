/********************************/
/* Set up the static file server */
let static = require('node-static');

/* Set up the HTTP server library */
let http = require('http');

/* Assume that we are running on Heroku */
let port = process.env.PORT;
let directory = __dirname + '/public';

/* If we are not on Heroku, then we need to adjust our port and directory */
if((typeof port == 'undefined') || (port === null))
{
    port = 8080;
    directory = './public';
}

/* Set up files from the file web server to deliver files from the file system */
let file = new static.Server(directory);

let app = http.createServer( 
    function(request,response){
        request.addListener('end',
            function(){
                file.serve(request,response);
            }
        ).resume();
    }
).listen(port);

console.log('The server is running');

/********************************/
/* Set up the web socket server */

const { Server } = require("socket.io");
const io = new Server(app);

io.on('connection', (socket) => {

    /* Output a log message on the server and send it to the clietns */
    function serverLog(...messages){
        io.emit('log',['**** Message from the server:\n']);
        messages.forEach((item) => {
            io.emit('log',['****\t'+item]);
            console.log(item);
        });
    }

    serverLog('a page connected to the server: '+socket.id);

    socket.on('disconnect', () => {
        serverLog('A page disconnected from the server: '+socket.id);

    });

});


















