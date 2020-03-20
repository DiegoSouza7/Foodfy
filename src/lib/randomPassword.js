module.exports = {
    randomPassword() {
        return Math.random().toString(36).slice(-10)
    }
}