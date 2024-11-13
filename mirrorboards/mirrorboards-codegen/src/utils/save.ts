import path from 'path';
import fs from 'fs/promises';
import prettier, { BuiltInParserName, LiteralUnion } from 'prettier';

export const save = async (config: {
  dest: string;
  content: string;
  prettier?: boolean;
  parser?: LiteralUnion<BuiltInParserName>;
}) => {
  await fs.mkdir(path.dirname(path.join(config.dest)), { recursive: true });

  await fs.writeFile(
    path.join(config.dest),
    config.prettier ?? true
      ? await prettier.format(config.content, {
          parser: config.parser ?? 'typescript',
          printWidth: 120,
        })
      : config.content,
  );
};
