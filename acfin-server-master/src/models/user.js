/* eslint-disable no-undefined */
/* eslint-disable eqeqeq */
/* eslint-disable require-await */
// Rule is needed to be disabled for Mongoose
/* eslint-disable no-invalid-this */
// Rule is needed to be disabled for the ObjectId to be parsed correctly
/* eslint-disable new-cap */
const { Schema, connection } = require('mongoose')
const { ObjectId } = require('mongoose').Types
const { schemaFactory, modelFactory } = require('mongodb-plugin')
const { isEmail } = require('validator')
const { userType, brands } = require('./lib/meta')
const { userRoleEquivalent } = require('./lib/userFilterValue')
const {
    padDates = true,
    padTimes = true
} = require('../config/meta')
const aggregationHelper = require('../lib/aggregationHelpers')({
    padDates,
    padTimes
})

const transporter = require('../services/emailTransport')
const { appData } = require('../config')
const autopopulate = require('mongoose-autopopulate')
const { capitalize } = require('./lib/meta')

const personalInfoObj = {
    multipleBranch: {
        type: [ 'ObjectId' ],
        ref: 'Branch'
    },
    singleBranch: {
        type: 'ObjectId',
        ref: 'Branch'
    },
    brand: {
        type: [ String ],
        enum: brands
    },
    bank: {
        type: 'ObjectId',
        ref: 'FinancingPartner'
    },
    superUserBank: {
        type: [ 'ObjectId' ],
        ref: 'FinancingPartner'
    },
    firstName: {
        type: "String",
        required: [
            true,
            'First name is required.'
        ]
    },
    middleName: {
        type: "String"
    },
    lastName: {
        type: "String",
        required: [
            true,
            'Last name is required.'
        ]
    },
    suffix: {
        type: "String"
    },
    mobile: {
        type: "String"
    },
    telephone: {
        type: "String"
    },
    email: {
        type: "String",
        required: [
            true,
            'E-mail address is required.'
        ],
        validate: [
            isEmail,
            `E-mail should be a valid e-mail address.`
        ],
        index: {
            unique: true,
            collation: {
                locale: 'en',
                strength: 2
            }
        },
        immutable: (doc) => doc.userType === 'Guest'
    },
    userRole: {
        type: [ String ],
        required: [
            true,
            'User role is required.'
        ]
    },
    userType: {
        type: "String",
        required: [
            true,
            'User type is required.'
        ]
    },
    createdBy: {
        type: "ObjectId",
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: "ObjectId",
        ref: 'User',
        default: null
    },
    reason: {
        type: String
    }

}
const schema = new Schema(personalInfoObj, {
    timestamps: {
        createdAt: 'dateCreated',
        updatedAt: 'dateUpdated'
    }
})
schema.pre('save', async function (next) {
    if (this._status === 'inactive') {
        await transporter().sendEmailTemplate({
            userObject: this,
            from: appData.email,
            to: this.email,
            filename: 'user_deactivate',
            subject: 'AC Motors Online Financing - Deactivate Account'
        })
    }
    if (this.userRole == 'customer') {
        this.bank = undefined
        this.multipleBranch = undefined
        this.singleBranch = undefined
    }
    else if (this.userRole == 'bankApprover' || this.userRole == 'finance' || this.userRole == 'salesManager') {
        this.singleBranch = undefined
    }
    else if (this.userRole == 'superUser') {
        this.singleBranch = undefined
        this.bank = undefined
    }
    else {
        this.multipleBranch = undefined
    }
    if (this.isNew) {
        if (this.userRole == 'customer' || this.userRole == 'bankApprover' || this.userRole == 'finance') {
            this.userType = userType.external
        }
        else {
            this.userType = userType.internal
        }
    }
    if (this.firstName) {
        this.firstName = capitalize(this.firstName)
    }
    if (this.middleName) {
        this.middleName = capitalize(this.middleName)
    }
    if (this.lastName) {
        this.lastName = capitalize(this.lastName)
    }
    next()
})
schema.pre('findOneAndUpdate', async function (next) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    const { _id, firstName, lastName, middleName } = docToUpdate
    const { _status } = this.getUpdate()
    if (_status === 'deleted') {
        const name = [
            firstName,
            middleName,
            lastName
        ]
        const fullName = name.filter((n) => n).join(' ')
        const query = {
            $and: [
                {
                    _status: 'active'
                },
                {
                    $or: [
                        {
                            user: ObjectId(_id)
                        },
                        {
                            'vehiclePurchased.salesExecutive': ObjectId(_id)
                        }
                    ]
                }
            ]
        }
        const userProposalCount = await connection.models.Application.countDocuments(query)
        if (userProposalCount) {
            throw new Error(`Cannot delete user named ${fullName}, as it is currently being used.`)
        }
    }
    next()
})
schema.post('findOneAndUpdate', async (object) => {
    if (object._status === 'deleted') {
        await transporter().sendEmailTemplate({
            userObject: object,
            from: appData.email,
            to: object.email,
            filename: 'user_deletion',
            subject: 'AC Motors Online Financing - Deletion of Account'
        })
    }
})
schema.statics.dataView = {
    table: async (session) => {
        let match = {
            $match: {
            }
        }
        const { Application, User } = connection.models
        const filteredApplications = await Application.find({
            'vehiclePurchased.salesExecutive': session.user
        })
        const mapfilteredApplications = filteredApplications.map((x) => x.user)
        // eslint-disable-next-line eqeqeq
        if (session.userRole == 'salesExecutive') {
            const filteredUsers = await User.find({
                createdBy: session.user
            })
            const mapFilteredUsers = filteredUsers.map((x) => x._id)
            mapfilteredApplications.push(session.user)
            const finalListOfUser = [
                ...mapFilteredUsers,
                ...mapfilteredApplications 
            ]
            match = {
                $match: {
                    $expr: {
                        $in: [
                            "$_id",
                            finalListOfUser
                        ]
                    }
                }
            }
        }
        else if (session.userRole == 'salesManager') {
            match = {
                $match: {
                    userRole: {
                        $nin: [ 'superUser' ]
                    }
                }
            }
        }
        else if (session.userRole == 'superUser') {
            const currentUser = await User.findById(session.user)
            match = {
                $match: {
                    $or: [
                        {
                            multipleBranch: {
                                $elemMatch: {
                                    $in: currentUser.multipleBranch
                                }
                            }
                        },
                        {
                            $expr: {
                                $in: [
                                    '$singleBranch',
                                    currentUser.multipleBranch
                                ]
                            }
                        }
                    ]
                }
            }
        }
        const arr = [
            ...aggregationHelper.to12HourString({
                fieldName: 'dateCreated'
            }),
            ...aggregationHelper.to12HourString({
                fieldName: 'dateUpdated'
            }),
            {
                $match: {
                    _status: {
                        $ne: 'deleted'
                    }
                }
            },
            match,
            userRoleEquivalent,
            {
                $addFields: {
                    userRole: [ '$userRole' ]
                }
            },
            {
                $project: {
                    name: {
                        $concat: [
                            '$firstName',
                            ' ',
                            '$lastName'
                        ]
                    },
                    email: 1,
                    userType: 1,
                    userRole: 1,
                    status: '$_status',
                    dateUpdated: 1,
                    dateCreated: 1
                }
            }
        ]
        return arr
    },
    default: async (session) => {
        let match = {
            $match: {
            }
        }
        const { Application, User } = connection.models
        const filteredApplications = await Application.find({
            'vehiclePurchased.salesExecutive': session.user
        })
        const mapfilteredApplications = filteredApplications.map((x) => x.user)
        // eslint-disable-next-line eqeqeq
        if (session.userRole == 'salesExecutive') {
            const filteredUsers = await User.find({
                createdBy: session.user
            })
            const mapFilteredUsers = filteredUsers.map((x) => x._id)
            mapfilteredApplications.push(session.user)
            const finalListOfUser = [
                ...mapFilteredUsers,
                ...mapfilteredApplications 
            ]
            match = {
                $match: {
                    $expr: {
                        $in: [
                            "$_id",
                            finalListOfUser
                        ]
                    }
                }
            }
        }
        const array = [
            ...aggregationHelper.to12HourString({
                fieldName: 'dateCreated'
            }),
            ...aggregationHelper.to12HourString({
                fieldName: 'dateUpdated'
            }),
            {
                $match: {
                    _status: {
                        $ne: 'deleted'
                    }
                }
            },
            match,
            {
                $lookup: {
                    from: 'users',
                    localField: 'updatedBy',
                    foreignField: '_id',
                    as: 'updatedBy'
                }
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    updatedBy: {
                        $concat: [
                            '$updatedBy.firstName',
                            ' ',
                            '$updatedBy.lastName'
                        ]
                    }
                }
            },
            {
                $addFields: {
                    name: {
                        $concat: [
                            '$firstName',
                            ' ',
                            '$lastName'
                        ]
                    }
                }
            },
            {
                $unwind: {
                    path: '$userRole',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    status: '$_status'
                }
            }
        ]
        return array
    }
}
schema.statics.search = {
    default: function (search) {
        const searchAttributes = [
            'firstName',
            'lastName',
            'email',
            'userRole',
            'name'
        ]
        const searchFields = searchAttributes.map((attr) => ({
            [attr]: {
                $regex: search,
                $options: 'i'
            }
        }))
        return [].concat([
            {
                $match: {
                    $or: searchFields
                }
            }

        ])
    },
    table: function (search) {
        const searchAttributes = [
            'firstName',
            'lastName',
            'email',
            'userRole',
            'name',
            'dateCreated',
            'status'
        ]
        const searchFields = searchAttributes.map((attr) => ({
            [attr]: {
                $regex: search,
                $options: 'i'
            }
        }))
        return [].concat([
            {
                $match: {
                    $or: searchFields
                }
            }
        ])
    }
}
schema.plugin(autopopulate)
const modifiedSchema = schemaFactory(schema)
modifiedSchema.index(
    {
        firstName: 1,
        middleName: 1,
        lastName: 1,
        email: 1
    },
    {
        unique: true,
        collation: {
            locale: 'en',
            strength: 2
        },
        partialFilterExpression: {
            userRole: {
                $ne: [ 'guest' ]
            }
        }
    }
)
const model = modelFactory({
    schema: modifiedSchema,
    modelName: 'User'
})

module.exports = model