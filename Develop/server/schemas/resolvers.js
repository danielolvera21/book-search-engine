const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        // //get all users
        // users: async () => {
        //     return User.find()
        //         .select('-__v -password')
        //         .populate('savedBooks')
        //         .populate('bookCount')
        // },
        //get single user
        // user: async (parent, { username }) => {
        //     return User.findOne({ username })
        //         .select('-__v -password')
        //         .populate('savedBooks')
        //         .populate('bookCount')
        // }
    },

    Mutation: {
        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Incorrect Username and/or Password")
            }

            const pw = await user.isCorrectPassword(password);

            if (!pw) {
                throw new AuthenticationError("Incorrect Username and/or Password")
            }

            const token = signToken(user);
            return { token, user };
        },

        //addUser
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        //saveBook
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const book = await Book.create({ ...args, title: context.book.title })
            }
        }

        //removeBook
    }
}