function assertNearDate (t, date1, date2, maxDistanceMillis) {
  const date1Millis = date1.getTime()
  const date2Millis = date2.getTime()
  const timeDiff = Math.abs(date1Millis - date2Millis)
  t.true(timeDiff <= maxDistanceMillis, `Time result ${timeDiff} exceeds ${maxDistanceMillis}.`)
}

module.exports = {
  assertNearDate
}