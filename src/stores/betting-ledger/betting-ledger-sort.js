export function sortRecords(records) {
  return [...records].sort(compareRecords)
}

function compareRecords(first, second) {
  const issueCompareResult = compareIssueDesc(first, second)
  if (issueCompareResult !== 0) return issueCompareResult
  return compareByCreatedAtDesc(first, second)
}

function compareIssueDesc(first, second) {
  return second.issue.localeCompare(first.issue)
}

function compareByCreatedAtDesc(first, second) {
  return second.createdAt.localeCompare(first.createdAt)
}
