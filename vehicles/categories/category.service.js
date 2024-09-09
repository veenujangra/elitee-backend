const db = require('_helpers/db');
const Category = db.Category;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
};

async function getAll() {
    console.log('vehicles category getAll calling: ');    
    return await Category.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Category.findById(id);
}

async function create(policyParam) {
    const category = new Category(policyParam);
    await category.save();
}

async function update(id, userParam) {
    const category = await Category.findById(id);
    if (!category) throw 'Category not found';
    // copy userParam properties to category
    Object.assign(category, userParam);
    await category.save();
}

async function _delete(id) {
    console.log('del calling: ');
    await Category.findByIdAndRemove(id);
}

async function getAllActive() {
    return await Category.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}