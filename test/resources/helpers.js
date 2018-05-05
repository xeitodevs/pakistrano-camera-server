function assertNearDate (t, date1, date2, maxDistanceMillis) {
  const date1Millis = date1.getTime()
  const date2Millis = date2.getTime()
  const timeDiff = Math.abs(date1Millis - date2Millis)
  t.true(timeDiff <= maxDistanceMillis, `Time result ${timeDiff} exceeds ${maxDistanceMillis}.`)
}

function assertUuid (t, uuid) {
  const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  t.truthy(uuid.match(v4))
}

module.exports = {
  assertNearDate,
  assertUuid
}