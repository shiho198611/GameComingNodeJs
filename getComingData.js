const IGDB_API_KEY = YOUR_IGDB_API_KEY;

const igdb = require('igdb-api-node').default;
const client = igdb(IGDB_API_KEY), log = response => {
    console.log(response.url, JSON.stringify(response));
};

exports.getComingData = function(platform, comingDataCallback){

    var timestamp = Date.now();
    var options = {
        filters:{
            'platform-eq': platform,
            'date-gt': timestamp
        },
        order: 'date:asc',
        limit: 5
    };

    client.release_dates(options, ['human', 'game']).then(response => {
        console.log('release dates response: '+JSON.stringify(response.body));
        
        var comingRowData = response.body;
        var gameIds = [];
        for(i=0;i<response.body.length;i++){
            gameIds.push(response.body[i].game);
        }

        client.games({
            ids: gameIds
        }, ['name']).then(response => {
            console.log(response.body);
            var result = [];
            var comingNameData = response.body;
            for(i=0;i<comingNameData.length;i++){
                for(j=0;j<comingRowData.length;j++){
                    if(comingNameData[i].id == comingRowData[j].game){
                        result.push({
                            date: comingRowData[j].human,
                            name: comingNameData[i].name
                        });
                        break;
                    }
                }
            }
            comingDataCallback(result);
        });

    }).catch(error => {
        console.log('error: '+error);
        throw error;
    });
};