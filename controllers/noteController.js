const Note = require("../models/notesModel");
const mongoose = require("mongoose");

exports.maninPageNote = async (req, res) => {
    const locals = {
        title: "MemoMaster : Your notes",
        description: "Your notes",
    }
    res.render('main-note', {
        locals,
        userName: req.user.firstName,
        layout: '../views/layout/template-login'
    });
}
// get for new note
exports.createNote = async (req, res) => {
    const locals = {
        title: "MemoMaster : Create your note",
        description: "Create your note",
    }
    res.render('create-newnote', {
        locals,
        layout: '../views/layout/template-login'
    });
}

//post for new note
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body);
        res.redirect("/notes");
    } catch (error) {
        console.log(error);
    }
};

// show all notes
exports.allNotes = async (req, res) => {
    //limit number of posts per page
    let perPage = 6;
    let page = req.query.page || 1; // if no query tell it to show page 1

    const locals = {
        title: "MemoMaster : Your notes",
        description: "Your notes",
    }

    try {

        //call Note model and 
        const notes = await Note.aggregate([
            //-1 show the latest first
            { $sort: { updatedAt: -1 } },
            //show only notes that that user created
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    //limit title to show only 30 charaters
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Note.countDocuments({ user: new mongoose.Types.ObjectId(req.user.id) });
        res.render('all-notes', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: '../views/layout/template-login',
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
    }
}


exports.createNote = async (req, res) => {
    const locals = {
        title: "MemoMaster : Create your note",
        description: "Create your note",
    }
    res.render('create-newnote', {
        locals,
        layout: '../views/layout/template-login'
    });
}

exports.editNote = async (req, res) => {
    const locals = {
        title: "MemoMaster : Edit Your notes",
        description: "Edit Your notes",
    }
    const note = await Note.findById({ _id: req.params.id })
        .where({ user: req.user.id })
        .lean();

    if (note) {
        res.render("edit-note", {
            noteID: req.params.id,
            note,
            locals,
            layout: '../views/layout/template-login'
        });
    } else {
        res.send("Something went wrong.");
    }
}
// post edit note
exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });
        res.redirect("/notes");
    } catch (error) {
        console.log(error);
    }
};

// delete
exports.deleteNote = async (req, res) => {
    try {
        await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
        res.redirect("/notes");
    } catch (error) {
        console.log(error);
    }
};



// search``
exports.searchNote = async (req, res) => {
    const locals = {
        title: "MemoMaster : Search Your notes",
        description: "Search Your notes",
    }

    try {
        res.render('search', {
            locals,
            searchResults: "",
            layout: '../views/layout/template-login',
        });
    } catch (error) { }
}

//post search
exports.searchNoteSubmit = async (req, res) => {
    const locals = {
        title: "MemoMaster : Search Your notes",
        description: "Search Your notes",
    }

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
            ],
        }).where({ user: req.user.id });

        res.render('search', {
            searchResults,
            locals,
            layout: '../views/layout/template-login',
        });
    } catch (error) {
        console.log(error);
    }
}