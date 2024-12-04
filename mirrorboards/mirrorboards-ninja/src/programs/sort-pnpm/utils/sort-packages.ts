interface CatalogData {
  packages: string[];
  catalog: Record<string, string>;
}
export function sortPackages(catalogData: CatalogData): CatalogData {
  const { catalog } = catalogData;

  const sortedCatalog = Object.keys(catalog)
    .sort((a, b) => {
      const nameA = a.startsWith('@') ? a.slice(1) : a;
      const nameB = b.startsWith('@') ? b.slice(1) : b;
      return nameA.localeCompare(nameB);
    })
    .reduce((sorted: Record<string, string>, key: string) => {
      sorted[key] = catalog[key];
      return sorted;
    }, {});

  return { ...catalogData, catalog: sortedCatalog };
}
