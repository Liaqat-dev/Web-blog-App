import {connect} from 'mongoose';

const url="mongodb://localhost:27017/blogsite" ;

connect(url)
    .then(()=> console.log('DB Connection Successful!'))
    .catch(err => console.log('DB Connection Failed! :',err.message));