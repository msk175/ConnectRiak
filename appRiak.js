var express = require('express'),
    http = require('http'),
    path = require('path');

/*var connection = riak.getClient({pool: {servers: ['10.96.24.105:8098']}});*/

var Riak = require('basho-riak-client');
var nodes = [
    'riak-qa.np.covapp.io'
];
var client = new Riak.Client(nodes, function (err, c) {
    // NB: at this point the client is fully initialized, and
    // 'client' and 'c' are the same object
    console.log(err);
    console.log(c);
    c.ping(function (err, rslt) {
    if (err) {
        console.log(err);
    } else {
        console.log(rslt);
        // On success, ping returns true
    }
});
});

/*client.fetchValue({ bucket: 'bulk_migration_template_idx', key: 'msk175@gmail.co'},
    function (err, rslt) {
        console.log("************************************************");
        console.log("Inside the First Fetch");
        if (err) {
            console.log(err);
        } else {
            console.log(rslt.isNotFound);
            console.log("************************************************");
            console.log(rslt.values[0]);
        }
        console.log("************************************************");
    }
);*/

/*client.storeValue({ value: "Riak" }, function (err, rslt) {
    if (err) {
        console.log(err);
    }
});

client.fetchValue({ bucket: 'contributors', key: 'bashoman@basho.com', convertToJs: true },
    function (err, rslt) {
        if (err) {
            console.log(err);
        } else {
            var riakObj = rslt.values.shift();
            var bashoman = riakObj.value;
            console.log("I found %s in 'contributors'", bashoman.emailAddress);
        }
    }
);*/



var app = express();


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());/*{secret:'your secret here', cookie:{maxAge:180000,expires: new Date(Date.now() + 180000)}})*/
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
           });
    app.use(app.router);

});

app.configure('development', function () {
    app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function (req, res) {
    res.render('index', {
        title: '::-Home-::',msg:''
    });
});

app.get('/netbanking', function (req, res) {
    res.render('netbanking', {
        title: '::-NetBanking-::'
    });
});

app.post('/storeValue', function (req, res) {
    client.storeValue({ bucket:"bulk_migration_template_idx",key:req.body.acc_number,value: req.body.customer_id+","+req.body.name }, function (err, rslt) {
        
        console.log("Inside the First Store");
        if (err) {
            console.log(err);
            res.render('index', {
        title: '::-Home-::',msg:err
    });
        }else{
            console.log(rslt);
            res.render('index', {
        title: '::-Home-::',msg:'Value stored successfully !'
    });
        }
    });
});

app.post('/fetchValue', function (req, res) {
    client.fetchValue({ bucket: 'bulk_migration_template_idx', key: req.body.acc_numbers},
        function (err, rslt) {
            if (err) {
                console.log(err);
                 res.render('index', {
                    title: '::-Home-::',msg:err
                 });
            } else {
                if(rslt.isNotFound){
                     res.render('index', {
                    title: '::-Home-::',msg:'No Results Found !'
                 });
                }else{
                    console.log(rslt.isNotFound);
                console.log(rslt.values[0].value.toString('ascii'));
                res.render('index', {
                    title: '::-Home-::',msg:rslt.values[0].value.toString('ascii')
                 });
                }
                
            }
        }
    );
});