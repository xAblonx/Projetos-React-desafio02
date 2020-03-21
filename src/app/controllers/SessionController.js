import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Sequelize, { QueryTypes } from 'sequelize';
import * as Yup from 'yup';
import databaseConfig from '../../config/database';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const connection = new Sequelize(databaseConfig);
    const { email, password } = req.body;
    const user = await connection.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = :email',
      {
        replacements: { email },
        type: QueryTypes.SELECT,
        raw: true,
        plain: true
      }
    );

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (
      !(await SessionController.checkPassword(password, user.password_hash))
    ) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }

  static checkPassword(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }
}

export default new SessionController();
