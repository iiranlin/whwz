export function listToTree(list = [], parentKey = "parentId", idKey = "id", childrenKey = "children") {
  const map = new Map();
  const roots = [];

  for (const node of list) {
    map.set(node[idKey], { ...node, [childrenKey]: [] });
  }
  for (const node of list) {
    const mappedNode = map.get(node[idKey]);
    const parentId = node[parentKey];

    if (parentId === null || !map.has(parentId)) {
      roots.push(mappedNode);
    } else {
      const parent = map.get(parentId);
      parent[childrenKey].push(mappedNode);
    }
    
  }
  return roots;
}