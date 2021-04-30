const graphql = require('graphql')
var { GraphQLSchema } = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList} = graphql

const Addresses = require('../models/address')
const Categories = require('../models/category')
const Countries = require('../models/country')
const Customers = require('../models/customer')
const Orders = require('../models/order')
const Items = require('../models/item')
const Products = require('../models/product')
const Vendors = require('../models/vendor')

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        id: {type: GraphQLString},
        city: {type: GraphQLString},
        street: {type: GraphQLString},
        house: {type: GraphQLString},
    })
})
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
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        address: {
            type: AddressType,
            resolve(parent, args) {
                return Addresses.findById(parent.address_id)
            }
        }
    })
})
const VendorType = new GraphQLObjectType({
    name: 'Vendor',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        logo: {type: GraphQLString},
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
const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: {type: GraphQLString},
        order: {
            type: OrderType,
            resolve(parent, args) {
                return Orders.findById(parent.order_id)
            }
        },
        product: {
            type: ProductType,
            resolve(parent, args) {
                return Products.findById(parent.product_id)
            }
        },
    })
})
const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: {type: GraphQLString},
        number: {type: GraphQLString},
        customer: {
            type: CustomerType,
            resolve(parent, args) {
                return Customers.findById(parent.customer_id)
            }
        },
        items: {
            type: GraphQLList(ItemType),
            resolve(parent, args) {
                return [Items.findById('6088a0e1c0c1e44bb7cd0d67')]
            }
        }
    })
})


const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        order: {
            type: OrderType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Orders.findById(args.id)
            }
        },
        orders: {
            type: GraphQLList(OrderType),
            resolve(parent, args) {
                return Orders.find({})
            }
        },
        items: {
            type: GraphQLList(ItemType),
            resolve(parent, args) {
                return Items.find({})
            }
        },
        item: {
            type: ItemType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Items.findById(args.id)
            }
        },
    }
})
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCountry: {
            type: CountryType,
            args: {
                name: {type: GraphQLString},
                capital: {type: GraphQLString}
            },
            resolve(parent, args) {
                const country = new Countries({
                    name: args.name,
                    capital: args.capital
                })
                return country.save()
            }
        },
        removeCountry: {
            type: CountryType,
            args: {
                id: {type: GraphQLID},
            },
            resolve(parent, args) {
                return Countries.findByIdAndRemove(args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})