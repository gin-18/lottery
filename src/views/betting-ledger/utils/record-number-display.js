export function getGroupDisplaySections(item, group) {
  if (item.selectionMode !== 'dantuo') {
    return [{ key: 'numbers', numbers: group.numbers }]
  }

  return [
    { key: 'banker', numbers: group.bankerNumbers },
    { key: 'drag', numbers: group.dragNumbers },
  ]
}
