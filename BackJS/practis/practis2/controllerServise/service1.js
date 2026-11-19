const productService = {
    getById: async (id) => {
        return {id: id, name: "iphone", price: 999};
    }
};

const getProductController = async (req, res) => {
    try{
        const id = req.params.id;
        const product = await productService.getById(id);
        res.json({success: true, data: product });
    } catch (error) {
        next(error);
    }
};