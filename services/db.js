const sqlite = require('sqlite3');
const path = require('path');
const db = new sqlite.Database(path.resolve('./data/kkentei.db'));

function all(sql, callback) {
    return db.all(sql, callback);
}

module.exports = {
    all
}
