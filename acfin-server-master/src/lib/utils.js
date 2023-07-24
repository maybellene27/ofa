/* eslint-disable max-params */
/* eslint-disable no-extra-parens */
/* eslint-disable security/detect-object-injection */
const { ObjectId } = require('mongoose').Types

const utils = {
    getNestedValue: (obj, key) => key.split(".").reduce((acc, curr) => acc[`${curr}`], obj),
    getUserId: (userRole, user, userIDObj) => {
        const key = userIDObj[`${userRole}`] || userIDObj.default
        return {
            key,
            value: utils.getNestedValue(user, key)
        }
    },
    formatQuery: (query) => {
        // eslint-disable-next-line no-shadow
        const runQuery = (query) => {
            const newQuery = {
            }
            Object.keys(query).forEach((props) => {
                if (Array.isArray(query[`${props}`])) {
                    newQuery[`${props}`] = []
                    query[`${props}`].forEach((q) => {
                        if(typeof q === 'string') {
                            if(ObjectId.isValid(q)) {
                                // eslint-disable-next-line new-cap
                                newQuery[`${props}`].push(ObjectId(q))
                            }
                            else {
                                newQuery[`${props}`].push(q)
                            }
                        }
                        else {
                            newQuery[`${props}`].push(runQuery(q))
                        }
                    })
                }
                else if (ObjectId.isValid(query[`${props}`])) {
                    // eslint-disable-next-line new-cap
                    newQuery[`${props}`] = ObjectId(query[`${props}`])
                }
                else if(typeof query[`${props}`] === 'object') {
                    newQuery[props] = runQuery(query[`${props}`])
                }
                else {
                    newQuery[`${props}`] = query[`${props}`]
                }
            })
            return newQuery
        }

        return runQuery(query)
    },
    setValueInFieldOfNestedObject: (obj, [
        first,
        ...rest 
    ], value) => ({
        ...obj,
        [`${first}`]: rest.length
            ? utils.setValueInFieldOfNestedObject(obj[`${first}`], rest, value)
            : value
    }),
    setValueInArrayInNestedObject: (obj, [
        first,
        ...rest 
    ], value, index, fieldName) => ({
        ...obj,
        [`${first}`]: rest.length
            ? utils.setValueInArrayInNestedObject(obj[`${first}`], rest, value, index, fieldName)
            : obj[`${first}`].map((object, i) => {
                if(i === index) {
                    object[`${fieldName}`] = value
                    return object
                }
                return object
            })
    }),

    /* use a shallow copy of array in "path" */
    getValueInArrayInNestedObject: (obj, path, fieldInArray, index) => {
        if(!path.length) {
            return obj[`${index}`][`${fieldInArray}`]
        }
        return utils.getValueInArrayInNestedObject(obj[`${path.shift()}`], path, fieldInArray, index)
    },

    /* use a shallow copy of array in "path" */
    getValueInFieldfOfNestedObject: (obj, path) => {
        if(!path.length) {
            return obj
        }
        return utils.getValueInFieldfOfNestedObject(obj[`${path.shift()}`], path)
    }
}

module.exports = utils