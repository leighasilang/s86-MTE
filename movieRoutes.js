const express = require("express");
const router = express.Router();

const Movie = require("./models/Movie");
const { auth, adminOnly } = require("./middleware/auth");

// ADD MOVIE - Admin
router.post("/addMovie", auth, adminOnly, async (req, res) => {
    try {
        const { title, director, year, description, genre } = req.body;

        const newMovie = new Movie({
            title,
            director,
            year,
            description,
            genre
        });

        await newMovie.save();

        res.status(201).json(newMovie);

    } catch (error) {
        res.status(500).json({
            message: "Failed to add movie",
            error: error.message
        });
    }
});


// GET ALL MOVIES
router.get("/getMovies", auth, async (req, res) => {
    try {
        const movies = await Movie.find()
            .populate("comments.userId", "email");

        res.status(200).json({
            movies: movies
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve movies",
            error: error.message
        });
    }
});


// GET MOVIE BY ID
router.get("/getMovie/:id", auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate("comments.userId", "email");

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movie);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve movie",
            error: error.message
        });
    }
});


// UPDATE MOVIE - Admin
router.patch("/updateMovie/:id", auth, adminOnly, async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie updated successfully",
            updatedMovie: updatedMovie
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update movie",
            error: error.message
        });
    }
});


// DELETE MOVIE - Admin
router.delete("/deleteMovie/:id", auth, adminOnly, async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

        if (!deletedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete movie",
            error: error.message
        });
    }
});


// ADD COMMENT
router.patch("/addComment/:id", auth, async (req, res) => {
    try {
        const { comment } = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        userId: req.user.id,
                        comment: comment
                    }
                }
            },
            { new: true }
        ).populate("comments.userId", "email");

        if (!updatedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "comment added successfully",
            updatedMovie: updatedMovie
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
});


// GET MOVIE COMMENTS
router.get("/getComments/:id", auth, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
            .populate("comments.userId", "email");

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            comments: movie.comments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve comments",
            error: error.message
        });
    }
});


module.exports = router;
