const graphql = require('graphql')
const {GraphQLSchema} = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLList} = graphql

const Categories = require('../models/category')
const Countries = require('../models/country')
const Products = require('../models/product')
const Vendors = require('../models/vendor')

// Описание моделей
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
    })
})
const CountryType = new GraphQLObjectType({
    name: 'Country',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        capital: {type: GraphQLString},
    })
})
const VendorType = new GraphQLObjectType({
    name: 'Vendor',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        country_id: {type: GraphQLString},
        country: {
            type: CountryType,
            resolve(parent, args) {
                return Countries.findById(parent.country_id)
            }
        }
    })
})
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        category_id: {type: GraphQLString},
        vendor_id: {type: GraphQLString},
        category: {
            type: CategoryType,
            resolve(parent, args) {
                return Categories.findById(parent.category_id)
            }
        },
        vendor: {
            type: VendorType,
            resolve(parent, args) {
                return Vendors.findById(parent.vendor_id)
            }
        },
    })
})

// Описываем входящие запросы
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        // Модель "Категория"
        category: {
            type: CategoryType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Categories.findById(args.id)
            }
        },
        categories: {
            type: GraphQLList(CategoryType),
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
            },
            resolve(parent, args) {
                if (args.id) {
                    return [Categories.findById(args.id)]
                } else if (args.name) {
                    return Categories.find({name: args.name})
                } else {
                    return Categories.find({})
                }
            }
        },
        // Модель "Страна"
        country: {
            type: CountryType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Countries.findById(args.id)
            }
        },
        countries: {
            type: GraphQLList(CountryType),
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
                capital: {type: GraphQLString},
            },
            resolve(parent, args) {
                if (args.id) {
                    return [Countries.findById(args.id)]
                } else if (args.name) {
                    return Countries.find({name: args.name})
                } else {
                    return Countries.find({})
                }
            }
        },
        // Модель "Производитель"
        vendor: {
            type: VendorType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Vendors.findById(args.id)
            }
        },
        vendors: {
            type: GraphQLList(VendorType),
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
            },
            resolve(parent, args) {
                if (args.id) {
                    return [Vendors.findById(args.id)]
                } else if (args.name) {
                    return Vendors.find({name: args.name})
                } else {
                    return Vendors.find({})
                }
            }
        },
        // Модель "Товар"
        product: {
            type: ProductType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Products.findById(args.id)
            }
        },
        products: {
            type: GraphQLList(ProductType),
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
                categoryId: {type: GraphQLString},
            },
            resolve(parent, args) {
                if (args.id) {
                    return [Products.findById(args.id)]
                } else if (args.name) {
                    return Products.find({name: args.name})
                } else if (args.categoryId) {
                    return Products.find({categoryId: args.categoryId})
                } else {
                    return Products.find({})
                }
            }
        },
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: {type: GraphQLString},
                vendorId: {type: GraphQLString},
                categoryId: {type: GraphQLString},
            },
            resolve(parent, args) {
                const product = new Products({
                    name: args.name,
                    vendor_id: args.vendorId,
                    category_id: args.categoryId
                })
                return product.save();
            }
        },
        removeProduct: {
            type: ProductType,
            args: {
                id: {type: GraphQLString},
            },
            resolve(parent, args) {
                return Products.findByIdAndDelete(args.id);
            }
        },
        updateProduct: {
            type: ProductType,
            args: {
                id: {type: GraphQLString},
                name: {type: GraphQLString},
            },
            resolve(parent, args) {
                return Products.findByIdAndUpdate(args.id,
                    { $set: {name: args.name} },
                    {new: true}
                );
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})