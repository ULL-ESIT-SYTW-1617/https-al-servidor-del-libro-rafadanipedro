const dropbosee = require('../authentication/dropbosee')

class User extends dropbosee.Schema {
  constructor(params) {
    let user = {
      email: params.email,
      password: params.password
    }

    super(user, 'User')
  }
}

User.findById = (id) => {
  return dropbosee.findByIdRaw('User', id)
}

User.find = (params) => {
  return dropbosee.findRaw('User', params)
}

User.findOne = (params) => {
  return dropbosee.findOneRaw('User', params)
}

User.findOneUpdate = (params, mod) => {
  return dropbosee.findOneUpdateRaw('User', User, params, mod)
}

module.exports = User
