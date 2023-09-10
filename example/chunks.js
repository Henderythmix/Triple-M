const { MMM } = require("../lib/index");

module.exports = function() {
    MMM.CreateMacro("test", () => {
        return {"output": "Test"};
    })
}