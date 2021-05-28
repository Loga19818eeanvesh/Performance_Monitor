const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

class Database {

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://TweetAppUser:TweetAppPassword@tweetappcluster.xhtqi.mongodb.net/PerfMonitorDB?retryWrites=true&w=majority")
        .then( ()=>{
          console.log("successfully connected to database");
        })
        .catch( (err)=> {
           console.log("Error in connecting to database" + err);
        })
    }

}

module.exports = new Database();