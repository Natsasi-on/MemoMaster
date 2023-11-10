//get homepage
exports.home = async (req, res) => {
    const locals = {
        title: "MemoMaster",
        description: "Free NodeJS Notes App.",
    }
    res.render('index', {
        locals,
        layout: '../views/layout/template'
    });
}


exports.createAccount = async (req, res) => {
    const locals = {
        title: "MemoMaster : Create Account",
        description: "Crate Account for MemoMaster member",
    }
    res.render('create-account', {
        locals,
        layout: '../views/layout/template'
    });
}

