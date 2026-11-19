const getUserInfo = (req, res) => {
    const id = req.params.id;
    const name = req.query.name;

    res.json({
        userId: id,
        userName: name
    });
}

app.get('/user/:id', getUserInfo);