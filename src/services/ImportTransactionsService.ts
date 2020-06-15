import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

async function loadCSV(filePath: string): Promise<any[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] | PromiseLike<any[]> = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(uploadConfig.directory, fileName);
    const lines = await loadCSV(csvFilePath);

    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];

    for await (const line of lines) {
      const transaction = await createTransaction.execute({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
