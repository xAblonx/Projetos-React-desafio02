import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string(),
      cidade: Yup.string().required(),
      estado: Yup.string().required(),
      cep: Yup.string()
        .length(9)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipientExists = await Recipient.findOne({
      where: {
        nome: req.body.nome,
        rua: req.body.rua,
        numero: req.body.numero,
        complemento: req.body.complemento,
        cidade: req.body.cidade,
        estado: req.body.estado,
        cep: req.body.cep
      }
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists' });
    }

    const {
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    } = await Recipient.create(req.body);

    return res.json({
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      rua: Yup.string(),
      numero: Yup.string(),
      complemento: Yup.string(),
      cidade: Yup.string(),
      estado: Yup.string(),
      cep: Yup.string()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    const {
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    } = await recipient.update(req.body);

    return res.json({
      id,
      nome,
      rua,
      numero,
      complemento,
      cidade,
      estado,
      cep
    });
  }
}

export default new RecipientController();
