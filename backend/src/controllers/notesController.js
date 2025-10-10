import Note from '../models/Note.js';
// TODO create wrapper function for controllers

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({createdAt: -1}); //newest first
        res.status(200).json(notes);

    } catch (error) {
        console.log("error at controller getAllNotes", error);
        res.status(500).json({message: "internal server error"});
    }
};

const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({message: `object ${req.params.id} not found`});    
        }

        res.json(note);
    } catch (error) {
        console.log("error at controller getNoteById", error);
        res.status(500).json({message: "internal server error"});
    }
};

const createNote = async (req, res) => {
    try {
        const {title, content} = req.body;
        const newNote = new Note({title, content});

        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.log("error at controller createNote", error);
        res.status(500).json({message: "internal server error"});
    }
};

const updateNote = async (req, res) => {
    try {
        const {title, content} = req.body;

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true});
        if (!updatedNote) {
            return res.status(404).json({message: `object not found`});    
        }

        res.status(201).json({message: `Successfully updated`, updatedNote});
    } catch (error) {
        console.log("error at controller updateNote", error);
        res.status(500).json({message: "internal server error"});
    }
};

const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({message: `object not found`}); 
        }
        res.status(200).json({message: `object ${req.params.id} deleted`})
    } catch (error) {
        console.log("error at controller deleteNote", error);
        res.status(500).json({message: "internal server error"});
    }
};


export {getAllNotes, createNote, updateNote, deleteNote, getNoteById};