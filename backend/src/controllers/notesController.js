import Note from '../models/Note.js';
import createCustomApiError from '../errors/custom-error.js';
import asyncWrapper from '../middleware/async.js';

const getAllNotes = asyncWrapper(async (req, res ) => {
    
    const notes = await Note.find().sort({createdAt: -1}); //newest first
    res.status(200).json(notes);
    
});

const getNoteById = asyncWrapper(async (req, res, next) => {
    
    const note = await Note.findById(req.params.id);

    if (!note) {
        return next(createCustomApiError(`object ${req.params.id} not found`, 404));    
    }

    res.json(note);
    
});

const createNote = asyncWrapper(async (req, res) => {
    
    const {title, content} = req.body;
    const newNote = new Note({title, content});

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
    
});

const updateNote = asyncWrapper(async (req, res, next) => {
    
    const {title, content} = req.body;

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true});
    if (!updatedNote) {
        return next(createCustomApiError(`object ${req.params.id} not found`, 404));
    }

    res.status(201).json({message: `Successfully updated`, updatedNote});
    
});

const deleteNote = asyncWrapper(async (req, res, next) => {
    
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
        return next(createCustomApiError(`object ${req.params.id} not found`, 404));
    }
    res.status(200).json({message: `object ${req.params.id} deleted`});
    
});


export {getAllNotes, createNote, updateNote, deleteNote, getNoteById};