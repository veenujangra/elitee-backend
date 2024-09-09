const db = require('_helpers/db');
const Product = db.Product;

module.exports = {
    getAll,
    create,
    getById,
    update,
    delete: _delete,
    getAllActive,
    getByName,
};


async function getAll() {
    console.log('products getAll calling:');
    return await Product.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Product.findById(id);
}

async function create(userParam) {
    if (await Product.findOne({ name: userParam.name.toUpperCase() })) {
        throw 'Name "' + userParam.name + '" is already taken';
    }
    const product = new Product(userParam);

    await product.save();
}

async function update(id, userParam) {
    const product = await Product.findById(id);
    if (!product) throw 'Product not found';
    if (userParam.name) {
        if (product.name !== userParam.name && await Product.findOne({ name: userParam.name.toUpperCase() })) {
            throw 'Name "' + userParam.name + '" is already taken';
        }
    }

    // copy userParam properties to product
    Object.assign(product, userParam);
    await product.save();
}

async function _delete(id) {
    await Product.findByIdAndRemove(id);
}

async function getAllActive() {
    console.log('products getAllActive calling:');
    return await Product.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getByName(name) {
    console.log('products getByName calling:');
    const exists = await Product.findOne({ name }).select('-_id name');
    console.log(exists);
    if (exists) {
        return 'true';
    } else {
        return 'false';
    }
}
