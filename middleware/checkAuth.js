exports.isLoggedIn = function (req, res, next) {
    const locals = {
        title: "MemoMaster : Your notes",
        description: "Your notes",
    }
    if (req.user) {
        next();
    } else {
        // return res.status(401).send('Access Denied');
        return res.status(401).render('create-account', {
            locals,
            layout: '../views/layout/template'
        });
    }
}