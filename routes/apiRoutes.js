const db = require('../db/db.json');
const fs = require('fs');


module.exports = function(app) {

    function addToDB(notes){
        notes = JSON.stringify(notes);
        fs.writeFileSync('./db/db.json', notes, function(err) {
            if (err) {
                return console.log(err)
            }
        });
    }

    app.get('/api/notes', function (req, res) {
        res.json(db);
    });

    app.post('/api/notes', function (req, res) {
        // setting a unique id for every note entry in the db.json. if there are not notes then the id = 0. if there are notes in the 
        // db.json then go to the last item in the db.json array, get the id number and add 1.
        if (db.length == 0) {
            req.body.id = '0';
        } else {
            req.body.id = JSON.stringify(JSON.parse(db[db.length - 1].id) + 1);
        }
        console.log('The id is: ' + req.body.id);

        //req.body is going to be the note with the title, body, and the id
        //Here we are saying go to the db.json file and push the notes object into the array
        db.push(req.body);

        //here we are saying to run the function addToDB which takes the parameter of the db.json which is a bunch of object. it takes those objects and turns them into strings. and takes that string and writes and replaces it in the db.
        addToDB(db);
        console.log(db);

        //then once its done putting it into the db.json as a string bring back the response as a json.
        res.json(req.body);
    });

    app.delete('/api/notes/:id', function(req, res) {
        // here we are getting the request with the parameters of :id and converting that number into a string. ex: gets id = 1 and turns it into id = '1'
        let id = req.params.id.toString();
        console.log(id);

        //go through the db.json array and if the db if matches the id you want to delete return the response of that db index then take that index whatever number it is in the array and splice/ delete it from the db.json array. 
        for (i = 0; i < db.length; i++) {
            if (db[i].id == id) {
                console.log('ID found');
                res.send(db[i]);

                db.splice(i,1);
                break;
            }
        }
        //once you're done deleting it run the function of addToDB again so you can get the updated db.json and making it into a string then rewrites it using writeFileSync into the db.json.
        addToDB(db);
    })
}

