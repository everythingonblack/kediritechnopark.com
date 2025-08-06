// processProducts.js
export default function processProducts(data) {
  const parentMap = {};
  const childrenMap = {};

  // Pisahkan parent dan child
  data.forEach(product => {
    if (product.sub_product_of) {
      const parentId = product.sub_product_of;
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(product);
    } else {
      parentMap[product.id] = {
        ...product,
        children: []
      };
    }
  });

  // Pasang children ke parent
  Object.keys(childrenMap).forEach(parentId => {
    const parent = parentMap[parentId];
    if (parent) {
      parent.children = childrenMap[parentId];
    }
  });

  // Ambil parent saja
  return Object.values(parentMap);
}
