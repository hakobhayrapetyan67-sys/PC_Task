const registerUser = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    res.json({
        success: true,
        email: email,
        message: "grancvec"
    });
};

app.post('/register', registerUser);
