import path from 'path';
import { z } from 'zod';
import { createTemplate } from '@mirrorboards/codegen';

/**
 * Define the schema for input validation and TypeScript type inference.
 */
const Awesome = z.object({
  absolute: z.string(), // Absolute file path
  relative: z.string(), // Relative file path
  content: z.string(), // Content of the file
});

export type Awesome = z.infer<typeof Awesome>;

/**
 * Generate the Markdown template for the Awesome resources collection.
 */
export const template = createTemplate({
  input: z.array(Awesome), // Accepts an array of Awesome items
  template: ({ input }: { input: Awesome[] }) => {
    // Organize items by categories derived from the top-level folder names
    const categories = organizeByCategories(input);

    // Generate the Markdown content
    const markdown = `
# Awesome Resources Collection

## Table of Contents
${generateTableOfContents(categories)}

---

${generateCategorySections(categories)}
    `.trim();

    return markdown;
  },
});

/**
 * Organize Awesome items into categories based on their top-level folder names,
 * and sort categories and subcategories alphabetically.
 * @param input - Array of Awesome items
 * @returns A record where keys are category names and values are sorted arrays of items
 */
const organizeByCategories = (input: Awesome[]): Record<string, { relative: string; content: string }[]> => {
  // Group by categories
  const categories = input.reduce(
    (categories, { relative, content }) => {
      const category = extractTopLevelFolder(relative);
      if (!categories[category]) categories[category] = [];
      categories[category].push({ relative, content });
      return categories;
    },
    {} as Record<string, { relative: string; content: string }[]>,
  );

  // Sort categories and subcategories alphabetically
  const sortedCategories = Object.keys(categories)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (sorted, category) => {
        sorted[category] = categories[category].sort((a, b) =>
          extractSubcategory(a.relative).localeCompare(extractSubcategory(b.relative)),
        );
        return sorted;
      },
      {} as Record<string, { relative: string; content: string }[]>,
    );

  return sortedCategories;
};

/**
 * Generate a Markdown-formatted Table of Contents.
 * @param categories - The categorized Awesome items
 * @returns A Markdown string for the Table of Contents
 */
const generateTableOfContents = (categories: Record<string, { relative: string; content: string }[]>): string => {
  return Object.keys(categories)
    .map(
      (category) =>
        `- [${category}](#${toMarkdownAnchor(category)})\n` +
        categories[category]
          .map(({ relative }) => {
            const subcategory = extractSubcategory(relative);
            return `  - [${subcategory}](#${toMarkdownAnchor(subcategory)})`;
          })
          .join('\n'),
    )
    .join('\n');
};

/**
 * Generate Markdown sections for each category and subcategory with content.
 * @param categories - The categorized Awesome items
 * @returns A Markdown string for the sections
 */
const generateCategorySections = (categories: Record<string, { relative: string; content: string }[]>): string => {
  return Object.entries(categories)
    .map(
      ([category, items]) =>
        `## ${category}\n\n` +
        items
          .map(({ relative, content }) => `### ${extractSubcategory(relative)}\n\n${formatContent(content)}`)
          .join('\n\n') +
        `\n\n---`,
    )
    .join('\n\n');
};

/**
 * Extract the top-level folder name from a relative path.
 * @param relative - The relative file path
 * @returns The top-level folder name
 */
const extractTopLevelFolder = (relative: string): string => {
  return path.dirname(relative).split(path.sep)[0];
};

/**
 * Extract the folder name directly as the subcategory name.
 * @param relative - The relative file path
 * @returns The name of the folder containing the file
 */
const extractSubcategory = (relative: string): string => {
  const parts = path.dirname(relative).split(path.sep);
  return parts.length > 1 ? parts[1] : 'Untitled';
};

/**
 * Format content for Markdown output.
 * Ensures proper spacing and removes empty lines.
 * @param content - The raw content string
 * @returns A formatted content string
 */
const formatContent = (content: string): string => {
  return content
    .split('\n')
    .filter((line) => line.trim() !== '') // Remove empty lines
    .map((line) => line.trim()) // Trim whitespace
    .join('\n\n'); // Add blank lines for Markdown spacing
};

/**
 * Convert a title into a valid Markdown anchor link.
 * @param title - The input title
 * @returns A Markdown-compatible anchor string
 */
const toMarkdownAnchor = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]/g, ''); // Remove non-alphanumeric characters
};
