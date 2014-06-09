var UsersController = {
    index: function(req, res) {
        return res.view({

        });
    },

    detail: function(req, res) {
        return res.view({
            id : req.param('id')
        });
    },

    courses: function(req, res) {
        return res.view({
            id: req.param('id')
        });
    }
};

module.exports = UsersController;