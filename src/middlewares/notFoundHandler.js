export const notFoundHandler = (req,res) => {
    res.status(404).json({message: "Route not found 404"})
}

// Not found router