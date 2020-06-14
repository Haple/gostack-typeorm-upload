import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category: category_title,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Invalid balance');
    }

    const categoriesRepository = getRepository(Category);

    const existentCategory = await categoriesRepository.findOne({
      where: { title: category_title },
    });

    let category_id = existentCategory?.id;

    if (!existentCategory) {
      const newCategory = categoriesRepository.create({
        title: category_title,
      });

      const { id: newCategoryId } = await categoriesRepository.save(
        newCategory,
      );

      category_id = newCategoryId;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
