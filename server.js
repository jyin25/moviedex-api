require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const data = require('./data.json');


const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet());
app.use(cors());

function validateToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        res.status(401).json({error: 'Unauthorized request'})
    }

    next();
}


app.use(validateToken)

function handleSearch(req, res) {
    const {genre, country, avg_vote} = req.query;
    let result = data;

    if(genre) {
        result = result.filter(movies => movies.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country) {
        result = result.filter(movies => movies.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote) {
        result = result.filter(movies => parseInt(movies.avg_vote) >= parseInt(avg_vote))
    }

    res.send(result);
}

app.get('/movie', handleSearch)



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('server listening at port 8000')
})