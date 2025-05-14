const bcrypt = require('bcrypt');

module.exports = async function checkPassword(plainPassword, storedHash) {
    try {
        return await bcrypt.compare(plainPassword, storedHash);
    } catch (error) {
        return false;
    }
}