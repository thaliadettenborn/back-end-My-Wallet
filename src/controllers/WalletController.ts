import WalletRepository from '../models/wallet'
import WalletValidation from '../schemas/wallet'

const getAll = async (req, res) => {
  try {
    const records = await WalletRepository.getAllByUser(req.userId)
    const total = `R$ ${WalletRepository.calcTotal(records).toFixed(2)}`
    res.status(200).send({ records, total })
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

const createEntry = async (req, res) => {
  try {
    if (!req.body.description || !req.body.amount || !req.body.kind) {
      return res.sendStatus(400)
    }

    const { error } = WalletValidation.entry(req.body)
    if (error) return res.status(422).send({ message: error.details[0].message })

    const entry = await WalletRepository.newRecord(req.userId, req.body)
    res.status(201).send(entry)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

const createOutgoing = async (req, res) => {
  try {
    if (!req.body.description || !req.body.amount || !req.body.kind) {
      return res.sendStatus(400)
    }

    const { error } = WalletValidation.outgoing(req.body)
    if (error) return res.status(422).send({ message: error.details[0].message })

    req.body.amount = `-${req.body.amount}`

    const entry = await WalletRepository.newRecord(req.userId, req.body)
    res.status(201).send(entry)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

const deleteRecord = async (req, res) => {
  try {
    const { idRecord } = req.params

    await WalletRepository.deleteById(req.userId, idRecord)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
}

export default {
  getAll,
  createEntry,
  createOutgoing,
  deleteRecord
}