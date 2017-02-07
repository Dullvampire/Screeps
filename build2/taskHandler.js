module.exports = {
    createTask: function (action, condition, endAction) {
        return {action: action, condition: condition, endAction: endAction};
    }
}
