import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(chalk.green(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                                                           # выводит номер версии
            --help:                                                              # печатает этот текст
            --import <path> <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME> <SALT>:  # импортирует данные из TSV
            --generate <n> <path> <url>                                          # генерирует произвольное количество (n) тестовых данных
        `));
  }
}
