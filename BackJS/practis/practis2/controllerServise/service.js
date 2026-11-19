const authService = {
    register: (data) => {
        return {id: 1, email: data.email, role: 'student'};
    }
};

const courseService = {
    getById: (id) => {
        return {id: id, title: "node.js", price: 49.99};
    }
}

const registerUserController = (req, res) => {
    const newUser = authService.register(req.body);

    res.status(201).json({
        success: true,
        data: newUser
    });
};

const getCourseController = (req, res) => {
    const courseId = req.params.id;

    const course = courseService.getById(courseId);
    res.json({
        success:true,
        data: course
    });
}