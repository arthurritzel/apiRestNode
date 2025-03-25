import Product from "../models/productModel.js";

export const showProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne(req.params);
    res.ok(res.hateos_item(product));
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query._page) || 1;
    const size = parseInt(req.query._size) || 10;
    const sort = req.query._sort || 'name'; 
    const order = req.query._order === 'desc' ? -1 : 1; 

    const offset = (page - 1) * size;

    const products = await Product.find({})
      .skip(offset)
      .limit(size)
      .sort({ [sort]: order }); 

    const totalData = await Product.countDocuments();
    const totalPages = Math.ceil(totalData / size);

    res.ok(res.hateos_list("products", products, totalPages));
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    await new Product(req.body).save();
    res.created({ message: "Product created successfully" });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(req.params, req.body, { new: true });
    
    res.ok(res.hateos_item(product));
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params._id);
    res.no_content();
  } catch (err) {
    next(err);
  }
};