const sayHello = (req, res) => {
    const request = req;
    res.json({
        success: true,
        message: "es sovorum em back"
    });
};

app.get('/greet', sayHello);