export function mergeResources(id, oldList, newList) {
  const mergedList = [...oldList];

  for (const newResource of newList) {
    const index = mergedList.findIndex(
      (oldResource) => oldResource[id] === newResource[id]
    );

    if (index !== -1) {
      // If resource with the same id exists in oldList, replace it with the new resource
      mergedList[index] = newResource;
    } else {
      // If resource with the same id doesn't exist in oldList, add it to the merged list
      mergedList.push(newResource);
    }
  }

  return mergedList;
}
